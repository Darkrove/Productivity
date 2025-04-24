'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Plus, X } from 'lucide-react';
import { CreateWorkspaceDialog } from './create-workspace-dialog';
import { useSession } from 'next-auth/react';

interface SidebarProps {
    workspaces: {
        id: number;
        name: string;
    }[];
    className?: string;
}

export function Sidebar({ workspaces, className }: SidebarProps) {
    const pathname = usePathname();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { data: session } = useSession();

    return (
        <>
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild className="md:hidden">
                    <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                    <div className="flex h-16 items-center border-b px-4">
                        <h2 className="text-lg font-semibold">Productivity</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto"
                            onClick={() => setIsMobileOpen(false)}
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>
                    <ScrollArea className="h-[calc(100vh-4rem)]">
                        <div className="px-4 py-2">
                            <div className="flex items-center justify-between py-2">
                                <h3 className="text-sm font-medium">Workspaces</h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsCreateDialogOpen(true)}
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="sr-only">Create Workspace</span>
                                </Button>
                            </div>
                            <div className="space-y-1">
                                {workspaces?.map(workspace => (
                                    <Link
                                        key={workspace.id}
                                        href={`/dashboard/workspace/${workspace.id}`}
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                'w-full justify-start',
                                                pathname ===
                                                    `/dashboard/workspace/${workspace.id}` &&
                                                    'bg-accent text-accent-foreground'
                                            )}
                                        >
                                            {workspace.name}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="px-4 py-2">
                            <h3 className="mb-2 text-sm font-medium">Navigation</h3>
                            <div className="space-y-1">
                                <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            'w-full justify-start',
                                            pathname === '/dashboard' &&
                                                'bg-accent text-accent-foreground'
                                        )}
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link
                                    href="/dashboard/tasks"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            'w-full justify-start',
                                            pathname === '/dashboard/tasks' &&
                                                'bg-accent text-accent-foreground'
                                        )}
                                    >
                                        All Tasks
                                    </Button>
                                </Link>
                                <Link
                                    href="/dashboard/notes"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            'w-full justify-start',
                                            pathname === '/dashboard/notes' &&
                                                'bg-accent text-accent-foreground'
                                        )}
                                    >
                                        All Notes
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            <div className={cn('hidden border-r bg-background md:block', className)}>
                <div className="flex h-16 items-center border-b px-4">
                    <h2 className="text-lg font-semibold">Productivity</h2>
                </div>
                <ScrollArea className="h-[calc(100vh-4rem)]">
                    <div className="px-4 py-2">
                        <div className="flex items-center justify-between py-2">
                            <h3 className="text-sm font-medium">Workspaces</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCreateDialogOpen(true)}
                            >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Create Workspace</span>
                            </Button>
                        </div>
                        <div className="space-y-1">
                            {workspaces?.map(workspace => (
                                <Link
                                    key={workspace.id}
                                    href={`/dashboard/workspace/${workspace.id}`}
                                >
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            'w-full justify-start',
                                            pathname === `/dashboard/workspace/${workspace.id}` &&
                                                'bg-accent text-accent-foreground'
                                        )}
                                    >
                                        {workspace.name}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="px-4 py-2">
                        <h3 className="mb-2 text-sm font-medium">Navigation</h3>
                        <div className="space-y-1">
                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-start',
                                        pathname === '/dashboard' &&
                                            'bg-accent text-accent-foreground'
                                    )}
                                >
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/dashboard/tasks">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-start',
                                        pathname === '/dashboard/tasks' &&
                                            'bg-accent text-accent-foreground'
                                    )}
                                >
                                    All Tasks
                                </Button>
                            </Link>
                            <Link href="/dashboard/notes">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-start',
                                        pathname === '/dashboard/notes' &&
                                            'bg-accent text-accent-foreground'
                                    )}
                                >
                                    All Notes
                                </Button>
                            </Link>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            <CreateWorkspaceDialog 
                open={isCreateDialogOpen} 
                onOpenChange={setIsCreateDialogOpen} 
                userId={Number.parseInt(session?.user?.id || '0')}
            />
        </>
    );
}
