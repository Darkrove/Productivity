import { redirect } from 'next/navigation';

import { getFilteredSidebarLinks } from '@/config/dashboard';
import { getCurrentUser } from '@/lib/session';
import { SearchCommand } from '@/components/dashboard/search-command';
import { DashboardSidebar, MobileSheetSidebar } from '@/components/layout/dashboard-sidebar';
import { UserAccountNav } from '@/components/layout/user-account-nav';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import { ModeSwitcher } from '@/components/layout/mode-switcher';
import { getWorkspaces } from '@/actions/workspace-actions';

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

type Workspace = {
    id: number;
    name: string;
};

export default async function Dashboard({ children }: ProtectedLayoutProps) {
    const user = await getCurrentUser();

    if (!user) redirect('/login');

    const result = await getWorkspaces(Number.parseInt(user.id));
    const workspaces = (result.workspaces as Workspace[]) ?? [];
    const filteredLinks = getFilteredSidebarLinks(workspaces, Number.parseInt(user?.id));

    return (
        <div className="relative flex min-h-screen w-full">
            <DashboardSidebar links={filteredLinks} />

            <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-50 flex h-14 bg-background px-4 lg:h-[60px] xl:px-8">
                    <MaxWidthWrapper className="flex max-w-7xl items-center gap-x-3 px-0">
                        <MobileSheetSidebar links={filteredLinks} />

                        <div className="w-full flex-1">
                            <SearchCommand links={filteredLinks} />
                        </div>

                        <ModeSwitcher />
                        <UserAccountNav />
                    </MaxWidthWrapper>
                </header>

                <main className="flex-1 p-4 xl:px-8">
                    <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0 lg:gap-6">
                        {children}
                    </MaxWidthWrapper>
                </main>
            </div>
        </div>
    );
}
