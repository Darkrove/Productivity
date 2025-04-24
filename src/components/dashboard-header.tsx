import type React from 'react';
import { cn } from '@/lib/utils';
import { WorkspaceMenu } from '@/components/workspace-menu';

interface DashboardHeaderProps {
    heading: string;
    text?: string;
    children?: React.ReactNode;
    workspaceId?: number;
    workspaceName?: string;
    isOwner?: boolean;
    userId?: number;
}

export function DashboardHeader({
    heading,
    text,
    children,
    workspaceId,
    workspaceName,
    isOwner,
    userId,
}: DashboardHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="grid gap-1">
                <div className="flex items-center gap-2">
                    <h1 className={cn('font-heading text-3xl font-bold tracking-tight')}>
                        {heading}
                    </h1>
                    {workspaceId && workspaceName && isOwner !== undefined && userId && (
                        <WorkspaceMenu
                            workspaceId={workspaceId}
                            workspaceName={workspaceName}
                            isOwner={isOwner}
                            userId={userId}
                        />
                    )}
                </div>
                {text && <p className="text-muted-foreground">{text}</p>}
            </div>
            {children}
        </div>
    );
}
