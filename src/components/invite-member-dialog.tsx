'use client';

import type React from 'react';
import { useState, useRef, type Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Loader2 } from 'lucide-react';

interface InviteMemberDialogProps {
    workspaceId: number;
    userId: number;
    workspaceName: string;
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: Dispatch<SetStateAction<boolean>>;
}

export function InviteMemberDialog({
    workspaceId,
    userId,
    workspaceName,
    children,
    open,
    onOpenChange,
}: InviteMemberDialogProps) {
    const { toast } = useToast();
    const [internalOpen, setInternalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState('');
    const linkInputRef = useRef<HTMLInputElement>(null);

    // Use controlled or uncontrolled state based on props
    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = onOpenChange || setInternalOpen;

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setInviteLink('');

        try {
            const response = await fetch(`/api/workspaces/${workspaceId}/invitations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast({
                    variant: 'destructive',
                    title: 'Failed to generate invitation link',
                    description: data.error || 'Please try again later',
                });
                setIsLoading(false);
                return;
            }

            setInviteLink(data.inviteLink);
            toast({
                title: 'Invitation link generated',
                description: 'Share this link with your team member',
            });
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

    const copyToClipboard = () => {
        if (!navigator.clipboard) {
            toast({
                title: 'Clipboard not supported',
                description: 'Your browser does not support clipboard functionality.',
                variant: 'destructive',
            });
            return;
        }

        if (linkInputRef.current) {
            navigator.clipboard
                .writeText(linkInputRef.current.value)
                .then(() => {
                    setCopied(true);
                    toast({
                        title: 'Copied to clipboard',
                        description: 'The invitation link has been copied to your clipboard',
                    });

                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(err => {
                    toast({
                        title: 'Failed to copy',
                        description: err.message || 'Could not copy to clipboard',
                        variant: 'destructive',
                    });
                });
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setInviteLink('');
        setEmail('');
        setCopied(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                        Generate an invitation link for a new team member.
                    </DialogDescription>
                </DialogHeader>

                {!inviteLink ? (
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="colleague@example.com"
                                    disabled={isLoading}
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    We'll generate a unique invitation link for this email address.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Invitation Link'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="inviteLink">Invitation Link</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="inviteLink"
                                    ref={linkInputRef}
                                    value={inviteLink}
                                    readOnly
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    onClick={copyToClipboard}
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">Copy</span>
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This link will expire in 7 days. Share it with your team member to
                                give them access to {workspaceName}.
                            </p>
                        </div>
                        <div className="mt-2">
                            <Button
                                type="button"
                                className="w-full"
                                onClick={() => setInviteLink('')}
                            >
                                Generate Another Link
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
