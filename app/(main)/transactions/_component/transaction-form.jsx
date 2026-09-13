"use client"
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import CreateAccountDrawer from '@/components/ui/create-account-drawer';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { createTransaction } from '../../../../actions/transaction';
import useFetch from '../../../../hooks/use-fetch';
import { transactionSchema } from '../../../lib/schema';
import ReceiptScanner from './receipt-scanner';




const AddTransactionForm = ({ accounts, categories, editMode = false, initialData=null,}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId =searchParams.get("edit");
  const accountOptions = accounts ?? [];
  const categoryOptions = categories ?? [];
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: 
    editMode && initialData ?{
        type: initialData.type,
        amount: initialData.amount.toString(),
        description: initialData.description,
        date: format(new Date(initialData.date), "yyyy-MM-dd"),
        accountId: initialData.accountId,
        category: initialData.category,
        isRecurring: initialData.isRecurring,
        ...(initialData.isRecurring && {
            recurringInterval: initialData.recurringInterval,
        })
    }
    :
    {
      type: "EXPENSE",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      accountId: "",
      category: "",
      isRecurring: false,
      recurringInterval: undefined,
    },
  });
  const [
    transactionResult,
    transactionLoading,
    transactionError,
    transactionFn,
  ] = useFetch(editMode ? "updateTransaction" :createTransaction);

  const type = useWatch({ control, name: 'type' });
    const isRecurring = useWatch({ control, name: 'isRecurring' });
    const date = useWatch({ control, name: 'date' });
    const accountId = useWatch({ control, name: 'accountId' });
    const category = useWatch({ control, name: 'category' });
    const recurringInterval = useWatch({ control, name: 'recurringInterval' });

    const onSubmit = async(data) => {
        const formData = {
            ...data,
            amount: parseFloat(data.amount), 
            // Ensure recurring interval is undefined if not recurring to avoid Prisma enum errors
            recurringInterval: data.isRecurring ? data.recurringInterval : undefined,
        };
        if(editId){
            transactionFn(editId, formData);
            
        }else{
            transactionFn(formData);
        }
        
    };
     useEffect(() => {
        if( transactionResult ?.success && !transactionLoading){
            toast.success( editMode ?
                "Transaction updated successfully" :
                "Transaction created successfully"
                
            );
            reset();
            router.push(`/account/${transactionResult.data.accountId}`);

        }
    }, [transactionResult, transactionLoading, router, reset,editMode]);

    useEffect(() => {
        if (transactionError) {
            toast.error(transactionError.message || "Failed to create transaction");
        }
    }, [transactionError]);


    const handleScanComplete = (scannedData) => {
        console.log(scannedData);
        if(scannedData){
            setValue("amount", scannedData.amount.toString());
            setValue("date", format(new Date(scannedData.date), "yyyy-MM-dd"));

            if(scannedData.description){
                setValue("description", scannedData.description);
            }
            if(scannedData.category){
                setValue("category", scannedData.category);
            }
        }


    }
   
  return (
      <form className='max-w-full space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {/* AI Recipt Scanner will go here */}
          <ReceiptScanner onScanComplete={handleScanComplete} 
          />







          <div className='space-y-2'>
              {/* Transaction Type (Income or Expense) */}
              <label className="text-sm font-medium">Type</label>
                <Select onValueChange={(value) => setValue("type", value)} value={type}>
                  < SelectTrigger className="w-full border-slate-200 bg-white/80 shadow-sm">
                        <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                </Select>
              {errors.type && <p className='text-sm text-red-500'>{errors.type.message}</p>}
          </div>
          <div className='grid gap-6 md:grid-cols-2'>
              <div className='space-y-2'>
                  <label className="text-sm font-medium">Amount</label>
                  <Input type="number" step="0.01" {...register("amount")} placeholder='0.00' className="bg-white/80 shadow-sm" />
                  {errors.amount && <p className='text-sm text-red-500'>{errors.amount.message}</p>}
              </div>


              <div className='space-y-2'>
                  <label className="text-sm font-medium">Account</label>
                  <Select onValueChange={(value) => setValue("accountId", value)} value={accountId}>
                      <SelectTrigger className="w-full border-slate-200 bg-white/80 shadow-sm">
                          <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Map through accounts and render SelectItem for each */}
                        {accountOptions.map((account) => (
                            <SelectItem key={account.id} value={account.id} label={account.name}>
                                {account.name} (₹{account.balance})
                            </SelectItem>
                        ))}
                        <CreateAccountDrawer>
                            <Button variant="ghost" size="sm" className='w-full text-center'>
                                + Create Account
                            </Button>
                        </CreateAccountDrawer>
                    </SelectContent>
                    </Select>
                    {errors.accountId && <p className='text-sm text-red-500'>{errors.accountId.message}</p>}
                </div>
        </div>
        <div className='space-y-2'>
            <label className="text-sm font-medium">Category</label>
            <Select onValueChange={(value) => setValue("category", value)} value={category}>
                <SelectTrigger className="w-full border-slate-200 bg-white/80 shadow-sm">
                    <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                    {/* Map through categories and render SelectItem for each */}
                    {categoryOptions.filter((c) => c.type === type).map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors.category && <p className='text-sm text-red-500'>{errors.category.message}</p>}
        </div>
        
        <div className='space-y-2'>
            <label className="text-sm font-medium">Date</label>
            <Popover>
                <PopoverTrigger render={
                    <Button variant="outline" className='w-full justify-start bg-white/80 text-left shadow-sm'>
                        {date ? format(new Date(date), "PPP") : "Select date"}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                } />
                <PopoverContent className='w-auto p-0'>
                    <Calendar
                        mode="single"
                        selected={new Date(date)}
                        onSelect={(date) => {
                            if (date) {
                                setValue("date", format(date, "yyyy-MM-dd"));
                            }
                        }}
                        disabled={(date) => date > new Date() || date < new Date("2022-01-01")} 
                        // Disable future dates and dates before 2022
                        autoFocus
                    />
                    </PopoverContent>
            </Popover>
                {errors.date && <p className='text-sm text-red-500'>{errors.date.message}</p>}
                </div>
                    <div className='space-y-2'>
                        <label className="text-sm font-medium">Description</label>
                        <Input type="text" {...register("description")} placeholder='Description' className="bg-white/80 shadow-sm" />
                        {errors.description && <p className='text-sm text-red-500'>{errors.description.message}</p>}
                    </div>



                    <div className='flex items-center justify-between rounded-lg border border-slate-200 bg-white/80 p-3 shadow-sm'>
                        <div>
                        <label htmlFor="recurring" className="text-sm font-medium">Recurring Transaction</label>
                        <p className="text-xs text-muted-foreground">Repeat this transaction automatically.</p>
                        </div>
                        <Switch id="recurring" onCheckedChange={(checked) => setValue("isRecurring", checked)} checked={isRecurring} />
                    </div>
                    {isRecurring && (
                        <div className='space-y-2'>
                            <label className="text-sm font-medium">Select Interval</label>
                            
                            <Select onValueChange={(value) => setValue("recurringInterval", value)} value={recurringInterval || ""}>
                                <SelectTrigger className="w-full border-slate-200 bg-white/80 shadow-sm">
                                    <SelectValue placeholder="Select recurring interval" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DAILY">Daily</SelectItem>
                                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                                    <SelectItem value="YEARLY">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                    {errors.recurringInterval && <p className='text-sm text-red-500'>{errors.recurringInterval.message}</p>}
                </div>
            )}
            
            <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
                <Button variant="outline" type="button" onClick={() => reset()} disabled={transactionLoading} className="bg-white/80">
                    Cancel
                </Button>
                <Button type="submit" disabled={transactionLoading} className="bg-slate-950 text-white hover:bg-emerald-700">
                    {transactionLoading ? (
                        <>
                        <Loader2 className="mr-2 animate-spin"/>
                        <span className="ml-2">Saving...</span>
                        </>

                    ):editMode? (
                    "Update Transaction"):(
                    "Create Transaction")
                }
                </Button>
            </div>
        </form>
  );
}
export default AddTransactionForm;
