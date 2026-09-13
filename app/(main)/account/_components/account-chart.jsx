"use client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RechartsDevtools } from '@recharts/devtools';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';






const DATA_RANGES = {
  "7d": {"label": "Last 7 Days", value: 7},
  "30d": {"label": "Last 30 Days", value: 30},
  "90d": {"label": "Last 90 Days", value: 90},
  "180d": {"label": "Last 180 Days", value: 180},
  "365d": {"label": "Last Year", value: 365},
  "All": {"label": "All Time", value: null},
};
const AccountChart = ({ transactions }) => {
  const [dataRange, setDataRange] = useState("30d");

  const filteredData = useMemo(() => {
    const range = DATA_RANGES[dataRange].value;

    const now = new Date();
    const startDate = range !== null ? startOfDay(subDays(now, range)) : startOfDay(new Date(0));

    // filter transactions based on selected date range
    const filtered = transactions.filter(
        (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), 'yyyy-MM-dd');

      if(!acc[date]){
        acc[date] = { date, Income: 0, Expense: 0 };
      }

      if(transaction.type === "INCOME"){
        acc[date].Income += parseFloat(transaction.amount);
      } else {
        acc[date].Expense += parseFloat(transaction.amount);
      }
      return acc;
    }, {});

    // convert grouped data to array format for recharts
    return Object.values(grouped).sort((a,b) => 
      new Date(a.date) - new Date(b.date));
  },[transactions, dataRange]);

  const totals =useMemo(() => {
    return filteredData.reduce((acc, day) => ({
      Income: acc.Income + day.Income,
      Expense: acc.Expense + day.Expense,
    }), { Income: 0, Expense: 0 });
  }, [filteredData]);






  return (
      <Card className="overflow-hidden rounded-lg border-white/75 bg-white/85 shadow-sm backdrop-blur-xl">
    <CardHeader className="flex flex-col gap-3 border-b border-slate-200/80 bg-white/70 sm:flex-row sm:items-center sm:justify-between">
      <CardTitle>Transaction Overview</CardTitle>
      <Select value={dataRange} onValueChange={(value) => setDataRange(value)} >
        <SelectTrigger className="w-[160px] border-blue-200 bg-blue-50/80">
          <SelectValue placeholder="select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(DATA_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      
    </CardHeader>
    <CardContent className="p-5">
      <div className="mb-6 grid gap-3 text-sm md:grid-cols-3">
        <div className="metric-card border-emerald-200 bg-emerald-50">
          <p className="text-muted-foreground">Total Income:</p>
          <p className="text-green-600 font-bold text-lg">
            {totals.Income.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
          </p>
        </div>
        <div className="metric-card border-red-200 bg-red-50">
          <p className="text-muted-foreground">Total Expense:</p>
          <p className="text-red-600 font-bold text-lg">
            {totals.Expense.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
          </p>

        </div>
        <div className="metric-card border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground">Net Total:</p>
            <p className={`font-bold text-lg ${totals.Income - totals.Expense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(totals.Income - totals.Expense).toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
            </p>
          </div>
        </div>
      </div>
     <div className="mt-4 h-[350px] w-full overflow-x-auto overflow-y-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-inner">
       <div style={{ minWidth: `${Math.max(800, filteredData.length * 80)}px` }} className="w-full h-full">
         <ResponsiveContainer width="100%" height="100%">
         <BarChart
        data={filteredData.map((item) => ({
             name: new Date(item.date).toLocaleDateString(),
            Income: item.Income,
            Expense: item.Expense,
         }))}
          margin={{
           top: 25,
            right: 0,
             left: 0,
            bottom: 5,
          }}
         >
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="name" />
          <YAxis width={60} />
        <Tooltip />         <Legend />
         <Bar dataKey="Income" fill="#10b981" background={{ fill: '#f1f5f9' }} />
         <Bar dataKey="Expense" fill="#ef4444" />
         <RechartsDevtools />
       </BarChart>
     </ResponsiveContainer>
       </div>
     </div> 
    </CardContent>
  </Card>
  );
 
};
export default AccountChart;
