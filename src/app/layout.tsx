import type React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';

import { cn, constructMetadata } from "@/lib/utils";
import { ThemeProvider } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/components/auth-provider';
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ['latin'] });

export const metadata = constructMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
  });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    inter.className
                )}
            >
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                        enableColorScheme
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
