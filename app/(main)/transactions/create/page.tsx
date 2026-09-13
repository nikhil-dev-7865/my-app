import { getUserAccounts } from '@/actions/accounts';
import AddTransactionForm from '../_component/transaction-form';
import React from 'react';
import { defaultCategories } from '@/data/categories';
import { getTransaction } from '@/actions/transaction';
import { ReceiptText, Sparkles } from 'lucide-react';

type AddTransactionPageProps = {
  searchParams?: Promise<{
    editId?: string;
  }>;
};

export const AddTransactionPage = async ({ searchParams }: AddTransactionPageProps) => {
  const accounts = await getUserAccounts();
  const params = await searchParams;

  const editId = params?.editId;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }
  return (
    <div className='page-shell max-w-4xl space-y-6'>
      <section className='page-hero'>
        <div className='mb-4 inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50/80 px-3 py-1 text-sm text-blue-700'>
          <ReceiptText className='h-4 w-4 text-blue-600' />
          Transactions
        </div>
        <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight md:text-5xl'>
              {editId ? 'Edit transaction' : 'Add transaction'}
            </h1>
            <p className='mt-2 max-w-xl text-sm text-slate-600'>
              Capture spending, income, recurring payments, and receipt scans from one focused form.
            </p>
          </div>
          <div className='rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 text-sm text-emerald-800'>
            <div className='flex items-center gap-2'>
              <Sparkles className='h-4 w-4 text-emerald-700' />
              AI receipt scan ready
            </div>
          </div>
        </div>
      </section>
      <section className='finance-section p-5 md:p-7'>
        <AddTransactionForm 
          accounts={accounts}
          categories ={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </section>
    </div>
  )
}

export default AddTransactionPage
