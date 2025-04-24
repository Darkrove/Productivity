'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    CalendarDays,
    CheckSquare,
    Home,
    MoreHorizontal,
    Plus,
    StickyNote,
    Users,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    inviteMember,
} from '@/actions/auth-actions';
import { useToast } from '@/hooks/use-toast';

interface Workspace {
    id: number;
    name: string;
}

export function MobileSidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const response = await fetch('/api/workspaces');
                const data = await response.json();
                setWorkspaces(data);
            } catch (error) {
                console.error('Error fetching workspaces:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session) {
            fetchWorkspaces();
        }
    }, [session]);

    const handleEditWorkspace = (workspace: Workspace) => {
        setSelectedWorkspace(workspace);
        setEditOpen(true);
    };

    const handleDeleteWorkspace = (workspace: Workspace) => {
        setSelectedWorkspace(workspace);
        setDeleteOpen(true);
    };

    const handleInviteMember = (workspace: Workspace) => {
        setSelectedWorkspace(workspace);
        setInviteOpen(true);
    };

    const getWorkspaceLinks = (workspaceId: number) => {
        return [
            {
                href: `/dashboard/workspace/${workspaceId}`,
                label: 'Tasks',
                icon: <CheckSquare className="h-4 w-4" />,
            },
            {
                href: `/dashboard/workspace/${workspaceId}/notes`,
                label: 'Notes',
                icon: <StickyNote className="h-4 w-4" />,
            },
            {
                href: `/dashboard/workspace/${workspaceId}/calendar`,
                label: 'Calendar',
                icon: <CalendarDays className="h-4 w-4" />,
            },
            {
                href: `/dashboard/workspace/${workspaceId}/team`,
                label: 'Team',
                icon: <Users className="h-4 w-4" />,
            },
        ];
    };

    const isWorkspaceActive = (workspaceId: number) => {
        return pathname.includes(`/dashboard/workspace/${workspaceId}`);
    };

    const isSubLinkActive = (href: string) => {
        return pathname === href;
    };

    return (
        <div className="flex h-full flex-col bg-background">
            <div className="flex h-14 items-center justify-between border-b px-4">
                <span className="text-lg font-bold">Workspaces</span>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="h-8 gap-1">
                            <Plus className="h-4 w-4" />
                            <span>New</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form
                            action={async formData => {
                                formData.append('userId', session?.user?.id || '');
                                await createWorkspace(formData);
                                setCreateOpen(false);
                            }}
                        >
                            <DialogHeader>
                                <DialogTitle>Create New Workspace</DialogTitle>
                                <DialogDescription>
                                    Create a new workspace to organize your tasks and notes.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Workspace Name</Label>
                                    <Input id="name" name="name" placeholder="My Workspace" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Create Workspace</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <ScrollArea className="flex-1 px-2 py-2">
                <div className="space-y-2 px-2">
                    {isLoading ? (
                        <div className="text-sm text-muted-foreground">Loading workspaces...</div>
                    ) : workspaces.length > 0 ? (
                        workspaces.map(workspace => (
                            <div key={workspace.id} className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={`/dashboard/workspace/${workspace.id}`}
                                        className={cn(
                                            'flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                                            isWorkspaceActive(workspace.id)
                                                ? 'bg-accent text-accent-foreground'
                                                : 'text-muted-foreground'
                                        )}
                                    >
                                        {workspace.name}
                                    </Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">More options</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => handleInviteMember(workspace)}
                                            >
                                                Invite Member
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleEditWorkspace(workspace)}
                                            >
                                                Edit Name
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleDeleteWorkspace(workspace)}
                                                className="text-destructive"
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                {isWorkspaceActive(workspace.id) && (
                                    <div className="ml-4 space-y-1">
                                        {getWorkspaceLinks(workspace.id).map(link => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={cn(
                                                    'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                                                    isSubLinkActive(link.href)
                                                        ? 'bg-accent/50 text-accent-foreground'
                                                        : 'text-muted-foreground'
                                                )}
                                            >
                                                {link.icon}
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            No workspaces found. Create one to get started.
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="mt-auto p-4 border-t">
                <nav className="grid gap-1">
                    <Link
                        href="/dashboard"
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                            pathname === '/dashboard'
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground'
                        )}
                    >
                        <Home className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/tasks"
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                            pathname === '/dashboard/tasks'
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground'
                        )}
                    >
                        <CheckSquare className="h-4 w-4" />
                        All Tasks
                    </Link>
                    <Link
                        href="/dashboard/notes"
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                            pathname === '/dashboard/notes'
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground'
                        )}
                    >
                        <StickyNote className="h-4 w-4" />
                        All Notes
                    </Link>
                    <Link
                        href="/dashboard/calendar"
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                            pathname === '/dashboard/calendar'
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground'
                        )}
                    >
                        <CalendarDays className="h-4 w-4" />
                        Calendar
                    </Link>
                </nav>
            </div>

            {/* Edit Workspace Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <form
                        action={async formData => {
                            formData.append('workspaceId', selectedWorkspace?.id.toString() || '');
                            formData.append('userId', session?.user?.id || '');
                            const result = await updateWorkspace(formData);
                            if (result.error) {
                                toast({
                                    variant: 'destructive',
                                    title: 'Error',
                                    description: result.error,
                                });
                            } else {
                                toast({
                                    title: 'Success',
                                    description: result.success,
                                });
                                setEditOpen(false);
                            }
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>Edit Workspace</DialogTitle>
                            <DialogDescription>
                                Update the name of your workspace.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Workspace Name</Label>
                                <Input
                                    id="edit-name"
                                    name="name"
                                    defaultValue={selectedWorkspace?.name}
                                    placeholder="My Workspace"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Workspace Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <form
                        action={async formData => {
                            formData.append('workspaceId', selectedWorkspace?.id.toString() || '');
                            formData.append('userId', session?.user?.id || '');
                            const result = await deleteWorkspace(formData);
                            if (result?.error) {
                                toast({
                                    variant: 'destructive',
                                    title: 'Error',
                                    description: result.error,
                                });
                            } else {
                                toast({
                                    title: 'Success',
                                    description: 'Workspace deleted successfully',
                                });
                                setDeleteOpen(false);
                            }
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>Delete Workspace</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this workspace? This action cannot
                                be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-sm font-medium">
                                Workspace:{' '}
                                <span className="font-bold">{selectedWorkspace?.name}</span>
                            </p>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDeleteOpen(false)}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button variant="destructive" type="submit">
                                Delete
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Invite Member Dialog */}
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogContent>
                    <form
                        action={async formData => {
                            formData.append('workspaceId', selectedWorkspace?.id.toString() || '');
                            formData.append('userId', session?.user?.id || '');
                            const result = await inviteMember(formData);
                            if (result.error) {
                                toast({
                                    variant: 'destructive',
                                    title: 'Error',
                                    description: result.error,
                                });
                            } else {
                                toast({
                                    title: 'Success',
                                    description: result.success,
                                });
                                setInviteOpen(false);
                            }
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>Invite Member</DialogTitle>
                            <DialogDescription>
                                Invite a new member to join your workspace:{' '}
                                {selectedWorkspace?.name}
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
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Send Invitation</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
