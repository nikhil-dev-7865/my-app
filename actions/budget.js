"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "../lib/prisma";

export async function getCurrentBudget(accountId) {
    try {
        const {userId} = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user= await db.user.findUnique({
            where: {clerkUserId: userId},
        });

        if (!user) throw new Error("User not found");

        const budget= await db.budget.findUnique({
            where: {userId: user.id},
        });

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
        endOfMonth.setHours(23, 59, 59, 999);
        const expenses =await db.transaction.aggregate({
            where: {
                userId: user.id,
                type: "EXPENSE",
                date: {
                    gte: startofMonth,
                    lte: endOfMonth,
                },
                accountId: accountId,
            },
            _sum: {
                amount: true,
            },
        });
        return{
            budget: budget ? {...budget, amount: budget.amount?.toNumber ? budget.amount.toNumber() : budget.amount} : null,
            currentExpenses: expenses._sum.amount?.toNumber ? expenses._sum.amount.toNumber() : (expenses._sum.amount || 0),
        }

    } catch (error) {
        console.error("Error fetching budget:", error);
        throw error;
    };
}
export async function UpdateBudget(amount) {
    try {
        const {userId} = await auth();
        if (!userId) throw new Error("Unauthorized");
    
        const user = await db.user.findUnique({
            where: {clerkUserId: userId},
        });
        if (!user) throw new Error("User not found");

        const budget = await db.budget.upsert({
            where: {userId: user.id},
            update: {amount: amount},
            create: {userId: user.id, amount: amount},
        });
        revalidatePath("/dashboard");
        return{
            success: true,
            data: {...budget, amount: budget.amount?.toNumber ? budget.amount.toNumber() : budget.amount},   
        };
    } catch (error) {
        console.error("Error updating budget:", error);
        return{success: false, error: error.message};
    
    }
}