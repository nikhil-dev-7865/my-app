import { BadgeCheck, ChartNoAxesCombined, ShieldCheck, WalletCards } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const authlayout = ({children}) => {
  return (
    <div className="auth-shell">
      <section className="auth-visual">
        <div className="mb-10 inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50/80 px-3 py-1 text-sm text-blue-700">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          Secure finance workspace
        </div>
        <div className="grid items-center gap-8 xl:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <h1 className="max-w-xl text-4xl font-bold leading-tight">
            Keep every account, budget, and transaction in one confident view.
          </h1>
          <p className="max-w-lg text-sm leading-6 text-slate-600">
            Sign in to review spending, monitor your default account, and keep your monthly budget moving in the right direction.
          </p>
        </div>
        <div className="auth-gif-frame">
          <Image
            src="/Business Analysis.gif"
            alt="Animated finance analysis"
            width={280}
            height={220}
            className="h-auto w-full rounded-lg object-contain"
            priority
          />
        </div>
        </div>

        <div className="mt-10 grid gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/80 p-4">
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <WalletCards className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Multi-account tracking</p>
              <p className="text-sm text-slate-600">Switch default accounts and inspect balances quickly.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50/80 p-4">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <ChartNoAxesCombined className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Visual money insights</p>
              <p className="text-sm text-slate-600">See income, expenses, net flow, and budget health.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50/80 p-4">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Clean daily workflow</p>
              <p className="text-sm text-slate-600">Record transactions and keep spending habits visible.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-center">
        <div className="auth-card">
          {children}
        </div>
      </section>
    </div>
  )
};

export default authlayout;
