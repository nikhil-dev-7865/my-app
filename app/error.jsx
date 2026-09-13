"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="empty-state-card">
      <div className="gif-badge mb-7">
        <Image
          src="/Connection Error.gif"
          alt="Something went wrong"
          width={260}
          height={220}
          className="h-auto w-[220px] rounded-lg object-contain sm:w-[260px]"
          priority
        />
      </div>

      <h2 className="gradient-title mb-1 text-4xl font-bold leading-tight sm:text-5xl">
        Something went wrong
      </h2>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">
        The app hit a temporary issue while loading this view. Try again and it should reconnect cleanly.
      </p>

      <Button
        type="button"
        onClick={reset}
        className="mt-5 bg-slate-950 px-4 text-white hover:bg-emerald-700"
      >
        Try again
      </Button>
    </div>
  );
}
