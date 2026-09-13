"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

const DashboardOverview = ({ accounts = [], transactions = [], recentTransactions = transactions }) => {
  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + (parseFloat(account.balance) || 0), 0);
  const isIncome = (transaction) => transaction.type?.toUpperCase() === "INCOME";
  const isExpense = (transaction) => transaction.type?.toUpperCase() === "EXPENSE";

  // Calculate income and expenses from transactions
  const income = transactions
    .filter(isIncome)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const expenses = transactions
    .filter(isExpense)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  // Get recent transactions
  const latestTransactions = recentTransactions.slice(0, 5);

  return (
    <div className="space-y-4 mb-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="metric-card border-slate-200 bg-slate-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBalance.toLocaleString("en-US", { style: "currency", currency: "INR" })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across {accounts.length} account(s)</p>
          </CardContent>
        </Card>

        <Card className="metric-card border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4 text-red-500" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {expenses.toLocaleString("en-US", { style: "currency", currency: "INR" })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{transactions.filter(isExpense).length} transaction(s)</p>
          </CardContent>
        </Card>

        <Card className="metric-card border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {income.toLocaleString("en-US", { style: "currency", currency: "INR" })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{transactions.filter(isIncome).length} transaction(s)</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="overflow-hidden rounded-lg border-white/75 bg-white/85 shadow-sm backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
          <CardDescription>
            {latestTransactions.length > 0
              ? `Your latest ${Math.min(5, latestTransactions.length)} transactions from the default account`
              : "No transactions from the default account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {latestTransactions.length > 0 ? (
            <div className="space-y-2">
              {latestTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-white/85 px-3 py-2 shadow-sm">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{transaction.description || "Transaction"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isIncome(transaction) ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isIncome(transaction) ? "+" : "-"}
                    {parseFloat(transaction.amount).toLocaleString("en-US", { style: "currency", currency: "INR" })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              There is no transaction for the default account.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
