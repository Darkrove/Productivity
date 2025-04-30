import type React from 'react';
import { cn } from '@/lib/utils';
import { WorkspaceMenu } from '@/components/workspace-menu';
import { Member } from '../create-task-dialog';

interface DashboardHeaderProps {
    heading: string;
    text?: string;
    children?: React.ReactNode;
    workspaceId?: number;
    workspaceName?: string;
    isOwner?: boolean;
    userId?: number;
    members?: Member[];
}

export function DashboardHeader({
    heading,
    text,
    children,
    workspaceId,
    workspaceName,
    isOwner,
    userId,
    members
}: DashboardHeaderProps) {
    return (
        <div className="flex items-center w-full justify-between">
            <div className="grid gap-1 w-full">
                <div className="flex w-full items-center justify-between">
                    <h1 className={cn('font-heading text-3xl font-bold tracking-tight')}>
                        {heading}
                    </h1>
                    {workspaceId && workspaceName && isOwner !== undefined && userId && (
                        <WorkspaceMenu
                            workspaceId={workspaceId}
                            workspaceName={workspaceName}
                            isOwner={isOwner}
                            userId={userId} 
                            members={members || []}                        />
                    )}
                </div>
                {text && <p className="text-muted-foreground">{text}</p>}
            </div>
            {children}
        </div>
    );
}
