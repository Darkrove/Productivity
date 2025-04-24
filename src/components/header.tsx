'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut, useSession } from 'next-auth/react';
import { Bell, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MobileSidebar } from '@/components/mobile-sidebar';
import { CreateTaskDialog } from '@/components/create-task-dialog';
import { useEffect, useState } from 'react';
import { ModeSwitcher } from '@/components/mode-switcher';

export function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [workspaceId, setWorkspaceId] = useState<number | null>(null);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        // Extract workspace ID from pathname if it exists
        const match = pathname.match(/\/dashboard\/workspace\/(\d+)/);
        if (match && match[1]) {
            const id = Number.parseInt(match[1]);
            setWorkspaceId(id);

            // Fetch workspace members for the task dialog
            const fetchMembers = async () => {
                try {
                    const response = await fetch(`/api/workspaces/${id}`);
                    const data = await response.json();
                    if (data.members) {
                        setMembers(data.members);
                    }
                } catch (error) {
                    console.error('Error fetching workspace members:', error);
                }
            };

            fetchMembers();
        } else {
            setWorkspaceId(null);
        }
    }, [pathname]);

    const initials = session?.user?.name
        ? session.user.name
              .split(' ')
              .map(n => n[0])
              .join('')
        : 'U';

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                    <MobileSidebar />
                </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <span className="text-xl font-bold">Productivity</span>
                </Link>
            </div>

            <div className="ml-auto flex items-center gap-2">
                {/* {workspaceId && (
                    <CreateTaskDialog
                        workspaceId={workspaceId}
                        members={members}
                        userId={Number.parseInt(session?.user?.id || '0')}
                    />
                )} */}
                <ModeSwitcher />

                <Button variant="outline" size="icon">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Avatar>
                                <AvatarImage
                                    src={session?.user?.image || ''}
                                    alt={session?.user?.name || 'User'}
                                />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
