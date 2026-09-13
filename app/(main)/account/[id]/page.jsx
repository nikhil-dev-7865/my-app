import { getAccountWithTransactions } from '@/actions/accounts';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import TransactionTable from '../_components/transaction-table';
import { BarLoader } from 'react-spinners';
import AccountChart from '../_components/account-chart';
import { WalletCards } from 'lucide-react';


const AccountPage = async ({params}) => {
    const { id } = await params;
    const accountData = await getAccountWithTransactions(id);

    if(!accountData){
        notFound();
    }
    const{transactions, ...account} = accountData;
    return (
      <div className='page-shell space-y-8'>
        <div className='page-hero'>
        <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
        <div>
            <div className='mb-4 inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50/80 px-3 py-1 text-sm text-blue-700'>
              <WalletCards className='h-4 w-4 text-blue-600' />
              Account Detail
            </div>
            <h1 className='text-3xl sm:text-6xl font-bold capitalize'>    
              {account.name}
              
            </h1>
            
            <p className='text-slate-600 text-lg mt-2'>
              {account.type.charAt(0)+account.type.slice(1).toLowerCase()} Account
            </p>

        </div>


        <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 text-right shadow-sm">
          <div className="text-2xl sm:text-2xl font-bold">
            {parseFloat(account.balance).toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</div>
            <p className="text-slate-600">
              {account._count.transactions} Transactions
            </p>
          
        </div>
         </div>
         </div>




         
        {/*chart section*/}
        <Suspense fallback={<BarLoader className='mt-4' width ={"100%"} color ="#3b82f6"/>}>
        <AccountChart transactions={transactions} /></Suspense>







        {/*transactions Table*/}
        <Suspense fallback={<BarLoader className='mt-4' width ={"100%"} color ="#3b82f6" loading/>}>
          <TransactionTable transactions={transactions} />
        </Suspense>
        
      </div>
    );
};

export default AccountPage;
