"use client"

import { updateDefaultAccount } from "@/actions/accounts"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import useFetch from "@/hooks/use-fetch"
import { ArrowUpRight, BadgeCheck, Wallet } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from "next/navigation"

const AccountCard = ({ account }) => {
  const { name, type, balance, id, isDefault, updatedAt } = account;
  const router = useRouter();

  const [
    ,
    isUpdatingDefault,
    error,
    updateDefaultAccountFn,
  ] = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (e) => {
    // Prevent the switch toggle from triggering the card's onClick
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    if(isDefault){
      toast.warning("atleast one account must be default")
      return;
    }
    const response = await updateDefaultAccountFn(id);
    if(response?.success){
      toast.success("Default account updated successfully")
      router.refresh();
    }
  };

  useEffect(() => {
    if(error){
      toast.error(error.message||"Failed to update default account")
    }
  },[error])
  

  return (
    <Card 
      className={`group relative min-h-[190px] cursor-pointer overflow-hidden rounded-lg transition-all hover:-translate-y-1 hover:shadow-xl ${
        isDefault
          ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50"
          : "border-white/75 bg-white/85 backdrop-blur-xl"
      }`}
      onClick={() => router.push(`/account/${id}`)}
    >
        <div className={`absolute inset-x-0 top-0 h-1 ${isDefault ? "bg-emerald-500" : "bg-slate-300"}`} />
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 pt-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className={`rounded-lg p-2 ${isDefault ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
              <Wallet className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className='truncate text-base font-semibold'>{name}</CardTitle>
              <p className='mt-1 text-xs uppercase tracking-wide text-muted-foreground'>{type}</p>
            </div>
          </div>
          <div 
            onClick={(e) => {
              e.stopPropagation(); // Stop click from reaching the Card
            }}
          >
            <Switch 
              checked={isDefault} 
              onCheckedChange={handleDefaultChange} 
              disabled={isUpdatingDefault}/>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="text-2xl font-bold">
            {parseFloat(balance).toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
          </div>
          {isDefault && (
            <div className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
              <BadgeCheck className="h-3.5 w-3.5" />
              Default
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t bg-white/50 pt-3">
          <div className="flex items-center text-sm text-muted-foreground" suppressHydrationWarning>
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Updated {new Date(updatedAt).toLocaleString('en-US')}
          </div>
        </CardFooter>
    </Card>
  )
}

export default AccountCard;

