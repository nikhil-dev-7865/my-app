import { z } from 'zod';

export const accountSchema = z.object({
    name: z.string().min(1, "Account name is required"),
    // Changed "checking" to "current" to match your UI radio buttons
    type: z.enum(["current", "savings"], {
        message: "Invalid account type"
    }),
    balance: z.string().min(1, "Initial balance is required"),
    isDefault: z.boolean().default(false),
});

export const transactionSchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.string().min(1, "Amount is required"),
    description: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    accountId: z.string().min(1, "Account is required"),
    category: z.string().min(1, "Category is required"),
    isRecurring: z.boolean().default(false),
    recurringInterval: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional(),
}).superRefine((data, ctx) => {
    if (data.isRecurring && !data.recurringInterval) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Recurring interval is required when transaction is recurring",
            path: ["recurringInterval"],
        });
    }
});
