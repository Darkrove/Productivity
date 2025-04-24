'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function InvitePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [workspaceName, setWorkspaceName] = useState('');

    const token = searchParams.get('token');

    useEffect(() => {
        const acceptInvitation = async () => {
            if (!token) {
                setError('Invalid invitation link');
                setIsLoading(false);
                return;
            }

            if (status === 'loading') return;

            if (status === 'unauthenticated') {
                // Redirect to login page with return URL
                router.push(`/login?returnUrl=/invite?token=${token}`);
                return;
            }

            try {
                const response = await fetch('/api/invitations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Failed to accept invitation');
                    setIsLoading(false);
                    return;
                }

                setWorkspaceName(data.workspace.name);
                setSuccess(true);
                toast({
                    title: 'Invitation accepted',
                    description: `You have successfully joined ${data.workspace.name}`,
                });
            } catch (error) {
                setError('Something went wrong. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        if (token && status !== 'loading') {
            acceptInvitation();
        }
    }, [token, status, router, toast]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Processing Invitation</CardTitle>
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
                            <CheckSquare className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle>Invitation Accepted</CardTitle>
                        <CardDescription>
                            You have successfully joined{' '}
                            <span className="font-medium">{workspaceName}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button asChild>
                            <Link href={`/dashboard`}>Go to Dashboard</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return null;
}
