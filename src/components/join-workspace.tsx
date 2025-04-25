// src/app/join/[token]/JoinPageClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function JoinWorkspace({ token }: { token: string }) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [workspaceName, setWorkspaceName] = useState('');

    useEffect(() => {
        const acceptInvitation = async () => {
            if (!token) {
                setError('Invalid invitation link');
                setIsLoading(false);
                return;
            }

            if (status === 'loading') return;

            if (status === 'unauthenticated') {
                router.push(`/login?returnUrl=/join/${token}`);
                return;
            }

            try {
                const response = await fetch('/api/join', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Failed to join workspace');
                    setIsLoading(false);
                    return;
                }

                setWorkspaceName(data.workspace.name);
                setSuccess(true);

                setTimeout(() => {
                    router.push(`/dashboard/workspace/${data.workspace.id}`);
                }, 2000);
            } catch (error) {
                setError('Something went wrong. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        if (token && status !== 'loading') {
            acceptInvitation();
        }
    }, [token, status, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Joining Workspace</CardTitle>
                        <CardDescription>
                            Please wait while we process your invitation...
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center py-6">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <CardTitle>Invitation Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button asChild>
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle>Workspace Joined!</CardTitle>
                        <CardDescription>
                            You have successfully joined{' '}
                            <span className="font-medium">{workspaceName}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Redirecting you to the workspace...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
}
