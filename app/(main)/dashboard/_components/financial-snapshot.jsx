import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowDownLeft, ArrowUpRight, Landmark, Target, TrendingUp, WalletCards } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
});

const isCurrentMonth = (date) => {
  const transactionDate = new Date(date);
  const now = new Date();

  return (
    transactionDate.getMonth() === now.getMonth() &&
    transactionDate.getFullYear() === now.getFullYear()
  );
};

const FinancialSnapshot = ({
  transactions = [],
  defaultAccount,
  budget,
  currentExpenses = 0,
}) => {
  const monthlyTransactions = transactions.filter((transaction) =>
    isCurrentMonth(transaction.date)
  );

  const monthlyIncome = monthlyTransactions
    .filter((transaction) => transaction.type?.toUpperCase() === "INCOME")
    .reduce((sum, transaction) => sum + (parseFloat(transaction.amount) || 0), 0);

  const monthlyExpenses = monthlyTransactions
    .filter((transaction) => transaction.type?.toUpperCase() === "EXPENSE")
    .reduce((sum, transaction) => sum + (parseFloat(transaction.amount) || 0), 0);

  const netFlow = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? Math.max(0, (netFlow / monthlyIncome) * 100) : 0;
  const budgetAmount = budget?.amount || 0;
  const budgetRemaining = budgetAmount ? Math.max(budgetAmount - currentExpenses, 0) : 0;
  const budgetUsed = budgetAmount ? Math.min((currentExpenses / budgetAmount) * 100, 100) : 0;

  const categoryTotals = monthlyTransactions
    .filter((transaction) => transaction.type?.toUpperCase() === "EXPENSE")
    .reduce((totals, transaction) => {
      const category = transaction.category || "uncategorized";
      totals[category] = (totals[category] || 0) + (parseFloat(transaction.amount) || 0);
      return totals;
    }, {});

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <Card className="overflow-hidden rounded-lg border-white/75 bg-white/85 shadow-sm backdrop-blur-xl">
      <CardHeader className="border-b border-slate-200/80 bg-white/70">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Financial Snapshot
            </CardTitle>
            <CardDescription>
              This month across your accounts
            </CardDescription>
          </div>
          <div className="rounded-md border border-sky-200 bg-sky-50/90 px-3 py-2 text-sm shadow-sm">
            <p className="text-muted-foreground">Default account</p>
            <p className="font-semibold">{defaultAccount?.name || "Not set"}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="metric-card border-emerald-200 bg-emerald-50">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              Monthly Income
            </div>
            <p className="text-2xl font-bold text-green-600">
              {currencyFormatter.format(monthlyIncome)}
            </p>
          </div>

          <div className="metric-card border-rose-200 bg-rose-50">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowDownLeft className="h-4 w-4 text-red-600" />
              Monthly Expenses
            </div>
            <p className="text-2xl font-bold text-red-600">
              {currencyFormatter.format(monthlyExpenses)}
            </p>
          </div>

          <div className="metric-card border-indigo-200 bg-indigo-50">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Landmark className="h-4 w-4 text-blue-600" />
              Net Flow
            </div>
            <p className={`text-2xl font-bold ${netFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
              {currencyFormatter.format(netFlow)}
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="metric-card border-amber-200 bg-amber-50">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Target className="h-4 w-4 text-blue-600" />
                Budget Remaining
              </div>
              <span className="text-sm text-muted-foreground">
                {budgetAmount ? `${budgetUsed.toFixed(1)}% used` : "No budget"}
              </span>
            </div>
            <Progress value={budgetUsed} />
            <p className="mt-3 text-sm text-muted-foreground">
              {budgetAmount
                ? `${currencyFormatter.format(budgetRemaining)} available this month`
                : "Set a budget to track remaining spend."}
            </p>
          </div>

          <div className="metric-card border-violet-200 bg-violet-50">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <WalletCards className="h-4 w-4 text-blue-600" />
                Spending Focus
              </div>
              <span className="text-sm text-muted-foreground">
                {savingsRate.toFixed(1)}% saved
              </span>
            </div>
            <p className="text-2xl font-bold capitalize">
              {topCategory ? topCategory[0].replaceAll("-", " ") : "No expenses"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {topCategory
                ? `${currencyFormatter.format(topCategory[1])} spent in your top category this month`
                : "No spending recorded for the current month."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSnapshot;
