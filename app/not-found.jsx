import { Button } from "@/components/ui/button";
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const NotFound = () => {
  return (
    <div className='empty-state-card'>
      <div className='gif-badge mb-7'>
        <Image
          src='/Connection Error.gif'
          alt='Page not found'
          width={260}
          height={220}
          className='h-auto w-[220px] rounded-lg object-contain sm:w-[260px]'
          priority
        />
      </div>

        <h2 className='gradient-title mb-1 text-5xl font-bold leading-none sm:text-6xl'>Oops</h2>
        <p className='mb-3 text-2xl font-semibold'>Page not found</p>
        <p className='max-w-md text-sm leading-6 text-muted-foreground'>
          The page you are looking for does not exist. Check the URL or head back to your dashboard.
        </p>

        <Link href='/dashboard' className='mt-4 inline-block'>
          <Button className="bg-slate-950 px-4 text-white hover:bg-emerald-700">
            Return home
          </Button>
        </Link>
      </div>
    );
}

export default NotFound;
