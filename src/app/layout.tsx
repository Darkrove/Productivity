import type React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import AuthProvider from '@/components/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Productivity App',
    description: 'A modern productivity app for todo lists, notes, and calendar events',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn('overflow-hidden min-h-screen bg-background font-sans antialiased', inter.className)}
            >
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
