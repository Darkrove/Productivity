import type React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { WorkspaceNav } from '@/components/workspace-nav';

interface WorkspaceLayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const workspaceId = Number.parseInt(id);

    // Check if user is a member of the workspace
    const memberCheck = await query(
        `SELECT * FROM workspace_members 
     WHERE workspace_id = $1 AND user_id = $2`,
        [workspaceId, session.user.id]
    );

    if (memberCheck.length === 0) {
        redirect('/dashboard');
    }

    return (
        <div className="flex flex-col">
            {/* <WorkspaceNav workspaceId={workspaceId} /> */}
            {children}
        </div>
    );
}
