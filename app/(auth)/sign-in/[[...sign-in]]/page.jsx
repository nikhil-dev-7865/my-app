"use client"

import { SignIn } from '@clerk/nextjs'
import React from 'react'

const appearance = {
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none border-0 bg-transparent",
    card: "w-full shadow-none border-0 bg-transparent",
    headerTitle: "text-slate-950 text-2xl font-bold",
    headerSubtitle: "text-slate-500",
    socialButtonsBlockButton:
      "border-slate-200 bg-white hover:bg-slate-50 transition-all hover:-translate-y-0.5",
    formButtonPrimary:
      "bg-slate-950 hover:bg-emerald-700 text-white shadow-sm transition-all hover:-translate-y-0.5",
    formFieldInput:
      "border-slate-200 bg-white focus:border-emerald-400 focus:ring-emerald-200",
    footerActionLink: "text-emerald-700 hover:text-emerald-800 font-semibold",
  },
};

const Page = () => {
  return <SignIn appearance={appearance} />
}

export default Page
