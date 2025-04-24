'use client';

import type React from 'react';

import { useState, type Dispatch, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface EditWorkspaceDialogProps {
    workspaceId: number;
    workspaceName: string;
    open?: boolean;
    onOpenChange?: Dispatch<SetStateAction<boolean>>;
}

export function EditWorkspaceDialog({
    workspaceId,
    workspaceName,
    open,
    onOpenChange,
}: EditWorkspaceDialogProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [internalOpen, setInternalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Use controlled or uncontrolled state based on props
    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = onOpenChange || setInternalOpen;

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;

        try {
            const response = await fetch(`/api/workspaces/${workspaceId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update workspace');
            }

            toast({
                title: 'Success',
                description: 'Workspace updated successfully',
            });

            setIsOpen(false);
            setIsLoading(false);

            // Refresh the page to show the updated workspace
            router.refresh();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update workspace',
            });
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Workspace</DialogTitle>
                        <DialogDescription>Update your workspace details.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Workspace Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={workspaceName}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
