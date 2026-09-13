"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from "@/components/ui/progress";
import useFetch from '@/hooks/use-fetch';
import { Check, Pencil, PiggyBank, X } from 'lucide-react';
import React, { useEffect } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';
import { UpdateBudget } from '../../../../actions/budget';

const formatCurrency = (value) =>
    Number(value || 0).toLocaleString('en-US', { style: 'currency', currency: 'INR' });

const BudgetProgress = ({ initialBudget, currentExpenses, accountName = "Default Account" }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [newBudget, setNewBudget] = React.useState(initialBudget?.amount?.toString() || "");

    const percentUsed = initialBudget && initialBudget.amount > 0 ? (currentExpenses / initialBudget.amount) * 100 : 0;
    const safePercentUsed = Math.min(percentUsed, 100);
    const remainingAmount = initialBudget ? Math.max(initialBudget.amount - currentExpenses, 0) : 0;
    const chartData = initialBudget
        ? [
            { name: 'Spent', value: Math.min(currentExpenses, initialBudget.amount), color: '#f97316' },
            { name: 'Remaining', value: remainingAmount, color: '#10b981' },
        ].filter((item) => item.value > 0)
        : [];

    const [
        ,
        isLoading,
        error,
        updateBudgetfn,
    ] = useFetch(UpdateBudget);
    

    const handleCancel = () => {
        setNewBudget(initialBudget?.amount?.toString() || "");
        setIsEditing(false);
    }

    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget);

        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid budget amount");
            return;
        }

        const response = await updateBudgetfn(amount);
        if (response?.success) {
            setIsEditing(false);
            toast.success("Budget updated successfully");
        }
    }

    useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
    }, [error]);

  return (

    <Card className="overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-sm">
        <CardHeader className="grid gap-5 pb-4 lg:grid-cols-[1fr_260px] lg:items-center">
             <div className='flex-1 space-y-4'>
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-3 text-amber-700">
                    <PiggyBank className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle className="text-xl">Monthly Budget</CardTitle>
                    <CardDescription>{accountName}</CardDescription>
                </div>
            </div>
            <div className="flex items-center gap-2">
            {isEditing ? (
                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        type="number"
                        value={newBudget}
                        onChange={(e) => setNewBudget(e.target.value)}
                        className="w-36 bg-white"
                        placeholder="Enter new budget"
                        autoFocus
                        disabled={isLoading}
                        
                    />
                    <Button variant="ghost" size="icon" onClick={handleUpdateBudget}>

                        <Check className="h-4 w-4 text-green-500"/>
                        </Button>

                    <Button variant="ghost" size="icon" onClick={handleCancel}
                    disabled={isLoading}
                    >
                        <X className="h-4 w-4 text-red-500"/>
                        </Button>
                </div>
            ) : (
                <div className="flex flex-wrap items-center gap-3">
                    <CardDescription className="rounded-md border border-amber-200 bg-white/80 px-3 py-2">
                        {initialBudget ? `${formatCurrency(currentExpenses)} of ${formatCurrency(initialBudget.amount)} spent` : "No budget set"}
                    </CardDescription>
                    <Button variant="outline" size="icon" className="border-amber-200 bg-white text-amber-700 hover:bg-amber-100" onClick={() => setIsEditing(true)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>
               
            )} </div>
            </div>
            
            {initialBudget && (
                <div className="mx-auto w-full max-w-[260px] rounded-xl border border-amber-200 bg-white/80 p-4 shadow-sm lg:mx-0">
                    <div className="relative mx-auto h-[170px] w-[170px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={54}
                                    outerRadius={78}
                                    paddingAngle={3}
                                    stroke="#ffffff"
                                    strokeWidth={4}
                                >
                                    {chartData.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name) => [formatCurrency(value), name]}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "1px solid #fde68a",
                                        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-bold text-slate-900">{safePercentUsed.toFixed(0)}%</span>
                            <span className="text-xs text-muted-foreground">used</span>
                        </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-md bg-orange-50 px-2 py-1 text-orange-700">
                            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-orange-500" />
                            Spent
                        </div>
                        <div className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">
                            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                            Left
                        </div>
                    </div>
                </div>
            )}
        </CardHeader>
        <CardContent className="border-t border-amber-100 bg-white/50 pt-4">
            {initialBudget && (
                <div className="space-y-2">
                    <Progress value={safePercentUsed} />
                    <p className="text-xs text-muted-foreground text-right">{percentUsed.toFixed(1)}% used</p>
                </div>
            )}
        </CardContent>
        </Card>
  )
}

export default BudgetProgress
