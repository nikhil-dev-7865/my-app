import { Button } from '@/components/ui/button';
import { checkUser } from '@/lib/checkUser';
import { Show, SignInButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { LayoutDashboard, LucidePenBox } from 'lucide-react';
import Link from 'next/link';

const Header = async () => {
  await checkUser();
  const { userId } = auth();
  const logoSrc = "/logo.png?v=20260509";

  return (
    <div className="header-gradient-bg fixed top-0 left-0 z-50 w-full border-b border-white/70 shadow-sm backdrop-blur-xl">
      <nav className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <Link href={userId ? "/dashboard" : "/"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Logo"
              className="h-12 md:h-16 w-auto object-contain"
            />
          </Link>
          <h1 className="hidden whitespace-nowrap bg-gradient-to-r from-slate-900 to-emerald-700 bg-clip-text text-sm font-extrabold text-transparent md:text-lg sm:block">
            Personal Finance Tracker
          </h1>
        </div>

        {/* Auth & Navigation */}
        <Show when="signed-out">
          <SignInButton 
            forceRedirectUrl="/dashboard" 
            className="h-9 rounded-md bg-slate-950 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-700 md:text-sm"
          >
            Log In
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <div className="flex items-center gap-1 md:gap-2 md:space-x-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-emerald-700">
              <Button variant="outline" size="sm" className="border-emerald-200 bg-emerald-50/70 p-2 text-emerald-800 hover:bg-emerald-100 md:px-3">
                <LayoutDashboard size={16} className="md:w-5 md:h-5" />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
          
            <Link href="/transactions/create" className="flex items-center gap-2 text-slate-600 hover:text-blue-700">
              <Button variant="outline" size="sm" className="border-blue-200 bg-blue-50/70 p-2 text-blue-800 hover:bg-blue-100 md:px-3">
                <LucidePenBox size={16} className="md:w-5 md:h-5" />
                <span className="hidden md:inline">Add</span>
                <span className="hidden lg:inline">Transactions</span>
              </Button>
            </Link>
            <UserButton appearance={{
              elements: {
                userButtonAvatarBox: 'w-10 h-10',
                userButtonAvatarImage: 'rounded-full',
                userButtonTrigger: 'p-0',
              }
            }} />
          </div>
        </Show>
      </nav>
    </div>
  )
}

export default Header
