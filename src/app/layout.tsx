'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import MiniDrawer from "@/components/Drawer";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showLayout = !['/auth/signin', '/auth/register', '/auth/recovery'].includes(pathname);
  return (
    <html lang="en">
      <SessionProvider>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {showLayout ? <MiniDrawer>{children}</MiniDrawer>: children}
        </body>
      </SessionProvider>
    </html>
  );
}
