'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { NavItem, SidebarNavItem } from '@/types';
import { Menu, PanelLeftClose, PanelRightClose } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Icons } from '@/components/shared/icons';
import { SidebarLinkGroup } from '../dashboard/sidebar-link-group';
import { CreateWorkspaceDialog } from '../create-workspace-dialog';

interface DashboardSidebarProps {
  links: SidebarNavItem[];
}

export function DashboardSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();

  // NOTE: Use this if you want save in local storage -- Credits: Hosna Qasmei
  //
  // const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     const saved = window.localStorage.getItem("sidebarExpanded");
  //     return saved !== null ? JSON.parse(saved) : true;
  //   }
  //   return true;
  // });

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     window.localStorage.setItem(
  //       "sidebarExpanded",
  //       JSON.stringify(isSidebarExpanded),
  //     );
  //   }
  // }, [isSidebarExpanded]);

  const { isTablet } = useMediaQuery();
  const { data: session } = useSession();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isTablet);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    setIsSidebarExpanded(!isTablet);
  }, [isTablet]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 h-full">
        <ScrollArea className="h-full overflow-y-auto border-r">
          <aside
            className={cn(
              isSidebarExpanded ? 'w-[220px] xl:w-[260px]' : 'w-[68px]',
              'hidden h-screen md:block'
            )}
          >
            <div className="flex h-full max-h-screen flex-1 flex-col gap-2">
              <div className="flex h-14 items-center p-4 lg:h-[60px]">
                {isSidebarExpanded ? (
                  <Link href="/dashboard" className="flex items-center space-x-1.5">
                    <Icons.logo className="size-6" />
                    <span className="font-satoshi text-xl font-bold">{siteConfig.name}</span>
                  </Link>
                ) : null}

                <Button
                  variant="ghost"
                  size="icon"
                  className={cn('size-10 lg:size-8', isSidebarExpanded && 'ml-auto')}
                  onClick={toggleSidebar}
                >
                  {isSidebarExpanded ? (
                    <PanelLeftClose className="stroke-muted-foreground" />
                  ) : (
                    <PanelRightClose className="stroke-muted-foreground" />
                  )}
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>

              {isSidebarExpanded ? (
                <div className="flex items-center justify-between px-4 py-2 text-sm font-medium text-muted-foreground">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <span className="text-sm font-semibold">Create Workspaces</span>
                    <Icons.add className="size-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between px-4 py-2 text-sm font-medium text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => setIsCreateDialogOpen(true)}
                      >
                        <Icons.add className="size-5" />
                        <span className="sr-only">Create Workspace</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Create Workspace</TooltipContent>
                  </Tooltip>
                </div>
              )}
              <nav className="flex flex-1 flex-col gap-8 px-4 pt-4">
                {links.map(section => (
                  <SidebarLinkGroup
                    key={section.title}
                    title={section.title}
                    items={section.items}
                    expanded={isSidebarExpanded}
                  />
                ))}
              </nav>
            </div>
          </aside>
        </ScrollArea>
      </div>
      <CreateWorkspaceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        userId={Number.parseInt(session?.user?.id || '0')}
      />
    </TooltipProvider>
  );
}

export function MobileSheetSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { isSm, isMobile } = useMediaQuery();

  if (isSm || isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="size-9 shrink-0 md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="flex h-screen flex-col">
              <nav className="flex flex-1 flex-col gap-y-8 p-6 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                  <Icons.logo className="size-6" />
                  <span className="font-satoshi text-lg font-bold">{siteConfig.name}</span>
                </Link>
                <div className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium text-muted-foreground">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <span className="text-sm font-semibold">Create Workspaces</span>
                    <Icons.add className="size-5" />
                  </Button>
                </div>
                {links.map(section => (
                  <SidebarLinkGroup
                    key={section.title}
                    title={section.title}
                    items={section.items}
                    expanded={true}
                  />
                ))}
              </nav>
            </div>
          </ScrollArea>
          <CreateWorkspaceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        userId={Number.parseInt(session?.user?.id || '0')}
      />
        </SheetContent>      
      </Sheet>
    );
  }

  return <div className="flex size-9 animate-pulse rounded-lg bg-muted md:hidden" />;
}
