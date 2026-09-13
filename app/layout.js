import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";




const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Personal finance tracking app",
  description: "Track your expenses and manage your budget",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>

          {/*Header*/}
          <Header></Header>
          <main className="app-main">
            {children}
          </main>
          <Toaster richColors />
          {/*Footer*/}
          <footer className="border-t border-slate-200 bg-white/70 p-4 text-center text-sm text-slate-500 backdrop-blur">
            <div className="container mx-auto">
              &copy; {new Date().getFullYear()} Personal Finance Tracker. All rights reserved.
            </div>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
