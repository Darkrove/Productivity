import type React from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getWorkspaces } from '@/actions/workspace-actions';

type Workspace = {
    id: number;
    name: string;
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const result = await getWorkspaces(Number.parseInt(session.user.id));
    const workspaces = (result.workspaces as Workspace[]) ?? [];

    return (
        <div className="flex h-screen flex-col">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar workspaces={workspaces} />
                <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
