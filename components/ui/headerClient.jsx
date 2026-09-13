"use client";

import { Button } from '@/components/ui/button';
import { Show, SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import { LayoutDashboard, LucidePenBox } from 'lucide-react';
import Link from 'next/link';

const HeaderClient = () => {
   const { userId } = useAuth();
  const logoSrc = "/logo.png?v=20260509";
  return (
    <div className="header-gradient-bg fixed top-0 left-0 z-50 w-full border-b border-white/70 shadow-sm backdrop-blur-xl">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={userId ? "/dashboard" : "/"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>
          <h1 className="bg-gradient-to-r from-slate-900 to-emerald-700 bg-clip-text text-lg font-extrabold text-transparent">Personal Finance Tracker</h1>
        </div>

        <Show when="signed-out">
          <SignInButton
            forceRedirectUrl="/dashboard"
            className="h-9 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            Log In
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <div className="flex items-center gap-2 space-x-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-emerald-700">
              <Button variant="outline" className="border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href="/transactions/create" className="flex items-center gap-2 text-slate-600 hover:text-blue-700">
              <Button variant="outline" className="border-blue-200 bg-blue-50/70 text-blue-800 hover:bg-blue-100">
                <LucidePenBox size={18} />
                <span className="hidden md:inline">Add Transactions</span>
              </Button>
            </Link>

            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-10 h-10',
                  userButtonAvatarImage: 'rounded-full',
                  userButtonTrigger: 'p-0',
                },
              }}
            />
          </div>
        </Show>
      </nav>
    </div>
  );
};

export default HeaderClient;
