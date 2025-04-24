'use client';

import type React from 'react';

import { useState, type Dispatch, type SetStateAction } from 'react';
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
import { inviteMember } from '@/actions/workspace-actions';
import { useToast } from '@/hooks/use-toast';

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

    // Use controlled or uncontrolled state based on props
    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = onOpenChange || setInternalOpen;

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        formData.append('workspaceId', workspaceId.toString());
        formData.append('userId', userId.toString());

        try {
            const result = await inviteMember(formData);

            if (result.error) {
                toast({
                    variant: 'destructive',
                    title: 'Failed to send invitation',
                    description: result.error,
                });
                setIsLoading(false);
                return;
            }

            toast({
                title: 'Invitation sent',
                description: `Invitation to ${workspaceName} has been sent successfully`,
            });

            setIsOpen(false);
            setIsLoading(false);

            // Reset the form
            event.currentTarget.reset();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description: 'Please try again later',
            });
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                        <DialogDescription>
                            Invite a new member to join {workspaceName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="colleague@example.com"
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Invitation'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
