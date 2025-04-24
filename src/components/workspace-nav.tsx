'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText, CheckSquare, Calendar, Users } from 'lucide-react';

interface WorkspaceNavProps {
    workspaceId: number;
}

export function WorkspaceNav({ workspaceId }: WorkspaceNavProps) {
    const pathname = usePathname();
    const basePath = `/dashboard/workspace/${workspaceId}`;

    const navItems = [
        {
            title: 'Tasks',
            href: basePath,
            icon: CheckSquare,
            exact: true,
        },
        {
            title: 'Notes',
            href: `${basePath}/notes`,
            icon: FileText,
        },
        {
            title: 'Calendar',
            href: `${basePath}/calendar`,
            icon: Calendar,
        },
        {
            title: 'Team',
            href: `${basePath}/team`,
            icon: Users,
        },
    ];

    return (
        <div className="mb-6 flex items-center space-x-1 overflow-auto pb-2">
            {navItems.map(item => {
                const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant={isActive ? 'default' : 'outline'}
                            size="sm"
                            className={cn('flex items-center gap-1')}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Button>
                    </Link>
                );
            })}
        </div>
    );
}
