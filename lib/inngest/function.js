// src/inngest/functions.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SendEmail } from "../../actions/send-email";
import EmailTemplate from "../../emails/template";
import { db } from "../prisma";
import { inngest } from "./client";

export const CheckBudgetAlert = inngest.createFunction(
  { 
    id: "check-budget-alert", 
    name: "Check Budget Alert",
    retries: 5,
    triggers: [{ cron: "0 */5 * * *" }],
  },
  async ({ step }) => {
    const budgets = await step.run("fetch-budget", async () => {
        return await db.budget.findMany({
            include: {
                user: {
                    include: {
                        accounts: {
                            where: {
                                isDefault: true,
                            },
                        }
                    }
                }
            },
        });
    });

    for (const budget of budgets) {
        const defaultAccount = budget.user?.accounts?.[0];
        if (!defaultAccount) continue; // Skip if no default account

        await step.run(`check-budget-${budget.id}`, async () => {
            const startDate = new Date();
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);

            const currentDate = new Date();
            const startofMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(), 
                1
            );

            const endOfMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                0
            );

            const expenses = await db.transaction.aggregate({
                where: {
                    userId: budget.userId,
                    accountId: defaultAccount.id,
                    type: "EXPENSE",
                    date: {
                        gte: startDate,
                    },
                },
                _sum: {
                    amount: true,
                },
            });

            const totalExpenses = expenses._sum.amount?.toNumber ? expenses._sum.amount.toNumber() : (expenses._sum.amount || 0);
            const budgetAmount = budget.amount?.toNumber ? budget.amount.toNumber() : (budget.amount || 0);
            const percentUsed = (totalExpenses / budgetAmount) * 100; 
            // console.log(percentUsed);
            
            if (percentUsed >= 80 && (!budget.lastAlertedAt || isNewMonth(budget.lastAlertedAt, new Date()))) {
                // send Email
                await SendEmail({
                    to: budget.user.email,
                    subject: `Budget Alert: ${defaultAccount.name} account has used ${percentUsed.toFixed(1)}% of the budget`,
                    react: EmailTemplate({
                        userName: budget.user.name,
                        type: "budget-alert",
                        data: {
                            percentUsed,
                            budgetAmount: budgetAmount.toFixed(2),
                            totalExpenses: totalExpenses.toFixed(2),
                            accountName: defaultAccount.name,
                        }
                    })
                });
                // update lastAlertedAt in budget
                await db.budget.update({
                    where: { id: budget.id },
                    data: { lastAlertedAt: new Date() },
                });
            }
        });
    }
  }
);

function isNewMonth(lastAlertdate, currentDate) {
    return (
        lastAlertdate.getFullYear() !== currentDate.getFullYear() ||
        lastAlertdate.getMonth() !== currentDate.getMonth()
    );
}
export const triggerRecurringTransactions = inngest.createFunction({
    id: "trigger-recurring-transactions",
    name: "Trigger Recurring Transactions",
    triggers: [{ cron: "0 0 * * *" }],
},
    async ({ step }) => {
        const transactions = await step.run("fetch-recurring-transactions", async () => {
            return await db.transaction.findMany({
                where: {
                    isRecurring: true,
                    status: "COMPLETED",
                    OR: [
                        { lastProcessed: null },
                        { nextRecurrenceDate: { lte: new Date() } },
                    ]
                }
            });
        });

        if (transactions.length > 0) {
            const events = transactions.map((transaction) => ({
                name: "transaction.recurring.process",
                data: { transactionId: transaction.id, userId: transaction.userId }
            }));

            await inngest.send(events);
        }
        return { triggered: transactions.length };
    }
);
export const processRecurringTransaction = inngest.createFunction(
    {
        id: "process-recurring-transaction",
        throttle:{
            limit:10,
            period :"1m",
            key: "event.data.userId",
        },
        triggers: [{ event: "transaction.recurring.process" }],
    },
        async ({ event ,step}) =>{
            if(!event?.data?.transactionId || !event?.data?.userId){
                console.error("Missing",event)
                return{error:"Missing data"}
            }

            await step.run("process-transaction", async () => {
                const transaction = await db.transaction.findUnique({
                    where: { 
                        id: event.data.transactionId,
                        userId: event.data.userId,
                    },
                    include:{
                        account: true,
                    }
                });
                if (!transaction || !isTransactionDue(transaction)) return;

                await db.$transaction(async (tx) => {
                    
                    await tx.transaction.create({
                        data:{
                            type:transaction.type,
                            amount:transaction.amount,
                            description: `${transaction.description} (recurring)`,
                            date: new Date(),
                            category: transaction.category,
                            userId: transaction.userId,
                            accountId: transaction.accountId,
                            isRecurring: false,
                            
                        },
                        
                    });
                    const amount = transaction.amount.toNumber ? transaction.amount.toNumber() : transaction.amount;
                    const balanceChange = transaction.type === "EXPENSE" ? -amount : amount;

                    await tx.account.update({
                        where: { id: transaction.accountId },
                        data: { balance: { increment: balanceChange } },
                    });

                    await tx.transaction.update({
                        where: { id: transaction.id },
                        data: { 
                            lastProcessed: new Date(), 
                        nextRecurrenceDate: calculateNextRepeatingDate(new Date(), transaction.recurringInterval),
                        },
                    });
                });


            });

        }
    );
function isTransactionDue(transaction) {
    if(!transaction.lastProcessed) return true;

    const today = new Date();
    const nextDue = new Date(transaction.nextRecurrenceDate);

    return nextDue<= today;

};
function calculateNextRepeatingDate(startDate, interval) {
    const date = new Date(startDate);

    switch (interval) {
        case "DAILY":
            date.setDate(date.getDate() + 1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + 1);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1);
            break;
    }
    return date;
}
export const generateMonthlyReport = inngest.createFunction( 
    {
        id: "generate-monthly-report",
        name: "Generate Monthly Report",
        triggers: [{ cron: "0 0 1 * *" }],
    },
    async ({ step }) => {
        const users = await step.run("fetch-users", async () => {
            return await db.user.findMany({
                include: { accounts: true },
            });
        });

        for (const user of users) {
            await step.run(`generate-report-${user.id}`, async () => {
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                
                const stats = await getMonthlyStats(user.id, lastMonth);
                const monthName = lastMonth.toLocaleString("default", { month: "long" });
                
                const insight =await generatFinancialInsight(stats,monthName);
                 await SendEmail({
                    to: user.email,
                    subject: `your Monthly Report for ${monthName}`,
                    react: EmailTemplate({
                        userName: user.name,
                        type: "monthly-summary",
                        data: {
                            stats,
                            insight,
                            monthName: monthName,
                        }
                    })
                });
            
            });

        }
        return{processed: users.length}
    }
);
async function generatFinancialInsight(stats, month) {
    const fallbackAdvice = getFallbackFinancialAdvice(stats, month);
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        return fallbackAdvice;
    }

    const genAI = new GoogleGenerativeAI(
        apiKey
    );
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const totalIncome = Number(stats.totalIncome || 0);
    const totalExpenses = Number(stats.totalExpenses || 0);
    const netIncome = totalIncome - totalExpenses;

    const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.
    Use Indian Rupees, not dollars.

    Financial Data for ${month}:
    - Total Income: ₹${totalIncome}
    - Total Expenses: ₹${totalExpenses}
    - Net Income: ₹${netIncome}
    - Expense Categories: ${Object.entries(stats.expensesByCategory || {})
      .map(([category, amount]) => `${category}: ₹${amount}`)
      .join(", ") || "No expense categories"}
    - Income Categories: ${Object.entries(stats.incomeByCategory || {})
      .map(([category, amount]) => `${category}: ₹${amount}`)
      .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;
    try{
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        const advice = JSON.parse(cleanedText);
        return Array.isArray(advice) && advice.length > 0 ? advice : fallbackAdvice;

    }catch(error){
        console.error("Error generating financial insight:", error);
        return fallbackAdvice;
    }
}

function getFallbackFinancialAdvice(stats, month) {
    const totalIncome = Number(stats.totalIncome || 0);
    const totalExpenses = Number(stats.totalExpenses || 0);
    const netIncome = totalIncome - totalExpenses;
    const topExpense = Object.entries(stats.expensesByCategory || {})
        .sort(([, a], [, b]) => Number(b || 0) - Number(a || 0))[0];

    if (!stats.transactionCount) {
        return [
            `No transactions were recorded in ${month}. Add income and expenses regularly so your next report can give sharper advice.`,
            "Start with the biggest recurring payments first, then track smaller day-to-day spends.",
            "Set a simple monthly budget and compare your actual spending against it each week.",
        ];
    }

    return [
        netIncome >= 0
            ? `You ended ${month} with a positive cash flow of ₹${netIncome.toFixed(2)}. Keep protecting that gap before adding new spending.`
            : `You spent ₹${Math.abs(netIncome).toFixed(2)} more than your income in ${month}. Review your largest categories first.`,
        topExpense
            ? `${topExpense[0]} was your biggest expense category at ₹${Number(topExpense[1]).toFixed(2)}. Try setting a weekly cap for it next month.`
            : "Your spending is not concentrated in one category yet, so keep categorizing transactions for clearer patterns.",
        totalIncome > 0
            ? `Your expense-to-income ratio was ${((totalExpenses / totalIncome) * 100).toFixed(1)}%. Aim to push it a little lower next month.`
            : "Add income entries too, so the report can calculate savings rate and cash flow accurately.",
    ];
}
    
const getMonthlyStats = async (userId,month)=>{
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);


    const transactions = await db.transaction.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
    });
    return transactions.reduce(
        (stats,t) => {
            const amount = t.amount.toNumber ? t.amount.toNumber() : t.amount;
            if(t.type === "EXPENSE"){
                stats.totalExpenses += amount;
                stats.expensesByCategory[t.category] = (stats.expensesByCategory[t.category] || 0) + amount;
            }else{
                stats.totalIncome += amount;
                stats.incomeByCategory[t.category] = (stats.incomeByCategory[t.category] || 0) + amount;
            }
            return stats;

        },{
            totalExpenses: 0,
            totalIncome: 0,
            expensesByCategory: {},
            incomeByCategory: {},
            transactionCount: transactions.length,
        }
    );
}
    
