"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma"; //

const serializeTransaction = (obj) => {
    const serialized = { ...obj };
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber ? obj.balance.toNumber() : obj.balance;
    }
    if (obj.amount) {
        serialized.amount = obj.amount.toNumber ? obj.amount.toNumber() : obj.amount;
    }
    if (obj.date) {
        serialized.date = obj.date.toISOString ? obj.date.toISOString() : obj.date;
    }
    if (obj.createdAt) {
        serialized.createdAt = obj.createdAt.toISOString ? obj.createdAt.toISOString() : obj.createdAt;
    }
    if (obj.updatedAt) {
        serialized.updatedAt = obj.updatedAt.toISOString ? obj.updatedAt.toISOString() : obj.updatedAt;
    }
    return serialized;
};

export async function createAccount(data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        
        if (!user) throw new Error("User not found");

        // 1. PREVENT DUPLICATES: Check if an account with this name already exists for this user
        const existingAccount = await db.account.findFirst({
            where: { 
                userId: user.id, 
                name: data.name 
            },
        });

        if (existingAccount) {
            throw new Error(`An account named "${data.name}" already exists.`);
        }

        const balanceFloat = parseFloat(data.balance);
        if (isNaN(balanceFloat)) throw new Error("Invalid balance amount");

        // Logic for default accounts
        const allAccounts = await db.account.findMany({
            where: { userId: user.id },
        });
        const shouldBeDefault = allAccounts.length === 0 ? true : data.isDefault;

        if (shouldBeDefault) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false },
            });
        }

        // 2. CREATE ACCOUNT
        const account = await db.account.create({
            data: {
                name: data.name,
                type: data.type.toUpperCase(), // Match Prisma Enum
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault,
            },
        });

        revalidatePath("/dashboard");
        return { success: true, data: serializeTransaction(account) };

    } catch (error) {
        // If the database unique constraint fails, handle it here
        if (error.code === 'P2002') {
            throw new Error("Account name must be unique.");
        }
        throw new Error(error.message || "Failed to create account");
    }
}
// Additional helper to fetch user accounts, can be used in the dashboard page
export async function getuserAccounts() {
    
    const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");
        
    const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!user) 
            throw new Error("User not found");
    
     const accounts = await db.account.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { transactions: true },
            },
        },
    });
    const serializedAccounts = accounts.map(serializeTransaction);
    return serializedAccounts;


}

export async function getDashboardTransactions(accountId) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const transactions = await db.transaction.findMany({
        where: {
            userId: user.id,
            ...(accountId ? { accountId } : {}),
        },
        orderBy: { date: "desc" },
    });

    return transactions.map(serializeTransaction);
}
