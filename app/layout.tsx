import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

import {ClerkProvider} from '@clerk/nextjs'
import SideBar from "@/components/SideBar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Online Docs",
  description: "A new way to store your Docs, Integerate with you freinds and havee acces to new AI tools.",
  icons:'/icon.svg'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider >
      <html lang="en">
        <body>
          <Header/>
          <div className="flex min-h-screen">
            <SideBar />
            <div className="flex-1 p-4 bg-gray-100 overflow-y-auto scroollbar-hide">
              {children}
            </div>
          </div>
          <Toaster position="top-center"/>
        </body>
      </html>
    </ClerkProvider>
  );
}
