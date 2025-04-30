'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    MoreVertical,
    Users,
    Pencil,
    Trash2,
    PlusCircle,
    StickyNote,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useToast } from '@/hooks/use-toast';
import { InviteMemberDialog } from '@/components/invite-member-dialog';
import { EditWorkspaceDialog } from '@/components/edit-workspace-dialog';
import { CreateTaskDialog, Member } from '@/components/create-task-dialog';
import {CreateNoteDialog} from '@/components/create-note-dialog';

interface WorkspaceMenuProps {
    workspaceId: number;
    workspaceName: string;
    isOwner: boolean;
    userId: number;
    members: Member[];
}

export function WorkspaceMenu({
    workspaceId,
    workspaceName,
    isOwner,
    userId,
    members,
}: WorkspaceMenuProps) {
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

    const { toast } = useToast();
    const router = useRouter();

    const handleDeleteWorkspace = async () => {
        try {
            const response = await fetch(`/api/workspaces/${workspaceId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete workspace');
            }

            toast({
                title: 'Success',
                description: 'Workspace deleted successfully',
            });

            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to delete workspace',
            });
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Workspace options</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsInviteDialogOpen(true)}>
                        <Users className="mr-2 h-4 w-4" />
                        Invite Members
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsTaskDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Task
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsNoteDialogOpen(true)}>
                        <StickyNote className="mr-2 h-4 w-4" />
                        Create Note
                    </DropdownMenuItem>
                    {isOwner && (
                        <>
                            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Workspace
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsDeleteAlertOpen(true)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Workspace
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <InviteMemberDialog
                open={isInviteDialogOpen}
                onOpenChange={setIsInviteDialogOpen}
                workspaceId={workspaceId}
                workspaceName={workspaceName}
                userId={userId}
            />

            {isOwner && (
                <EditWorkspaceDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    workspaceId={workspaceId}
                    workspaceName={workspaceName}
                />
            )}

            <CreateTaskDialog
                workspaceId={workspaceId}
                members={members}
                userId={userId}
                open={isTaskDialogOpen}
                onOpenChange={setIsTaskDialogOpen}
            />

            <CreateNoteDialog
                workspaceId={workspaceId}
                userId={userId}
                open={isNoteDialogOpen}
                onOpenChange={setIsNoteDialogOpen}
            />
            
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the workspace "{workspaceName}" and
                            all its tasks, notes, and events. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteWorkspace}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
