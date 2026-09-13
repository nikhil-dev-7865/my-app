import { getDashboardTransactions, getuserAccounts } from "@/actions/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import CreateAccountDrawer from '@/components/ui/create-account-drawer';
import { CalendarDays, Plus, Sparkles } from 'lucide-react';
import { getCurrentBudget } from "../../../actions/budget";
import AccountCard from "./_components/account-card";
import BudgetProgress from "./_components/budget-progress";
import DashboardOverview from "./_components/dashboard-overview";
import FinancialSnapshot from "./_components/financial-snapshot";

export default async function DashboardPage() {
  const accounts = await getuserAccounts();
  const defaultAccount = accounts.find((account) => account.isDefault);
  const transactions = await getDashboardTransactions();
  const defaultAccountTransactions = defaultAccount
    ? await getDashboardTransactions(defaultAccount.id)
    : [];

  let budgetData = null;
  if (defaultAccount) {
    try {
      const data = await getCurrentBudget(defaultAccount.id);
      // Convert to plain object to ensure serialization for client component
      budgetData = {
        budget: data.budget ? JSON.parse(JSON.stringify(data.budget)) : null,
        currentExpenses: data.currentExpenses,
      };
    } catch (error) {

      console.error('Error fetching budget:', error);
    }
  }


  return (
    <div className='page-shell space-y-8'>
      <section className="page-hero">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50/80 px-3 py-1 text-sm text-blue-700">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Dashboard
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Your financial command center</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Monitor budgets, account activity, and spending patterns from one clean workspace.
              </p>
            </div>
          </div>
          <div className="rounded-md border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-emerald-700" />
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Budget Progress */}
      {defaultAccount &&( <BudgetProgress
      initialBudget={budgetData?.budget}
      currentExpenses={budgetData?.currentExpenses || 0}
      accountName={defaultAccount.name}
      />
    )}

      <FinancialSnapshot
        transactions={transactions}
        defaultAccount={defaultAccount}
        budget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
      />

      {/* Overview */}
      <DashboardOverview
        accounts={accounts}
        transactions={transactions}
        recentTransactions={defaultAccountTransactions}
      />


      {/* Accounts Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Accounts</h2>
          <p className="text-sm text-muted-foreground">Switch defaults, review balances, or add a new account.</p>
        </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CreateAccountDrawer>
            <Card className="h-full min-h-[190px] cursor-pointer rounded-lg border-dashed border-blue-300 bg-blue-50/80 transition-all hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg">
              <CardContent className="flex h-full flex-col items-center justify-center text-blue-700">
                <div className="mb-3 rounded-full bg-blue-100 p-3">
                  <Plus className='h-7 w-7' />
                </div>
                <p className='text-sm font-semibold'>Add new account</p>
              </CardContent>
            </Card>
        </CreateAccountDrawer>

        {accounts.length > 0 && accounts?.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
      </section>
    </div>
  );
}
