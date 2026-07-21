'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare } from 'lucide-react';
import { requestPasswordReset } from '@/actions/auth-actions';

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        try {
            const result = await requestPasswordReset(formData);

            if (result.error) {
                toast({
                    variant: 'destructive',
                    title: 'Request failed',
                    description: result.error,
                });
                setIsLoading(false);
                return;
            }

            toast({
                title: 'Check your inbox',
                description: result.success,
            });

            const form = event.currentTarget as HTMLFormElement | null;
            form?.reset();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description: 'Please try again later',
            });
            console.error('Error requesting password reset:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="flex items-center space-x-2">
                        <CheckSquare className="h-6 w-6" />
                        <span className="text-2xl font-bold">Productivity</span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Forgot your password?</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email and we&apos;ll send you a link to reset it.
                    </p>
                </div>

                <div className="grid gap-6">
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Sending link...' : 'Send reset link'}
                            </Button>
                        </div>
                    </form>
                    <div className="text-center text-sm">
                        Remembered your password?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
