'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare } from 'lucide-react';
import { resetPassword } from '@/actions/auth-actions';

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useParams<{ token: string }>();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        formData.set('token', params.token);

        try {
            const result = await resetPassword(formData);

            if (result.error) {
                toast({
                    variant: 'destructive',
                    title: 'Reset failed',
                    description: result.error,
                });
                setIsLoading(false);
                return;
            }

            toast({
                title: 'Password updated',
                description: result.success,
            });
            router.push('/login');
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description: 'Please try again later',
            });
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
                    <h1 className="text-2xl font-semibold tracking-tight">Choose a new password</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter a new password for your account.
                    </p>
                </div>

                <div className="grid gap-6">
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password">New password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoCapitalize="none"
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Updating password...' : 'Update password'}
                            </Button>
                        </div>
                    </form>
                    <div className="text-center text-sm">
                        <Link
                            href="/login"
                            className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
