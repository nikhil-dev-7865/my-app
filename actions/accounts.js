"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";




const serializeTransaction = (obj) => {
    const serialized = { ...obj };
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber ? obj.balance.toNumber() : obj.balance;
    }
    if (obj.amount) {
        serialized.amount = obj.amount.toNumber ? obj.amount.toNumber() : obj.amount;
    }
    return serialized;
};

export async function getUserAccounts() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });
    
    if (!user) throw new Error("User not found");

    const accounts = await db.account.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { transactions: true },
            },
        },
    });

    return accounts.map(serializeTransaction);
}

export async function updateDefaultAccount(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        
        if (!user) throw new Error("User not found");

        const existingAccount = await db.account.findFirst({
            where: { id: accountId, userId: user.id }
        });
        
        if (!existingAccount) throw new Error("Account not found");

        await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false },
            });

        const account = await db.account.update({
            where: { id: accountId },
            data: {
                isDefault: true,
            },
        
        });

        revalidatePath("/dashboard");
        return { success: true, data: serializeTransaction(account) };


    } catch (error) {
        return { success: false, error: error.message || "Failed to update default account" };
    }
}
export async function getAccountWithTransactions(accountId) {
    const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        
        if (!user) throw new Error("User not found");

    const account = await db.account.findFirst({
        where: { id: accountId, userId: user.id },
        include: {
            transactions: {
                orderBy: { createdAt: "desc" },
            },
            _count: {
                select: { transactions: true },
            },
        },
    });
    if (!account) throw new Error("Account not found");
    return{
        ...serializeTransaction(account),
        transactions: account.transactions.map(serializeTransaction),

    }
}
export async function BulkDelete(transactionIds){
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        
        if (!user) throw new Error("User not found");

        const transactions = await db.transaction.findMany({
            where: { id: { in: transactionIds }, userId: user.id },
        });

        const accountbalanceschanges = transactions.reduce((acc, transaction) => {
            
            // To reverse the transaction: add back expenses, subtract income
            const change = transaction.type === "EXPENSE" ? transaction.amount : -transaction.amount;
            return { ...acc, [transaction.accountId]: (acc[transaction.accountId] || 0) + change };
        }, {});
        await db.$transaction(async (tx) => {
            await tx.transaction.deleteMany({
                where: { id: { in: transactionIds }, userId: user.id },
            });

            for (const [accountId, balanceChange] of Object.entries(accountbalanceschanges)) {
                await tx.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            increment: balanceChange,
                        },
                    },
                });
            }
        }); 
        revalidatePath("/dashboard");
        revalidatePath('/account/[id]');
        return { success: true };
             
    } catch (error) {
        return { success: false, error: error.message || "Failed to delete transactions" };
    }
}