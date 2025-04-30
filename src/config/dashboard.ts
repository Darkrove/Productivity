import { NavItem, SidebarNavItem } from "@/types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      { href: "/dashboard/data", icon: "database", title: "Data", disabled: true}, 
    ],
  },
  {
    title: "WORKSPACES",
    items: [
      { href: "/dashboard/workspaces", icon: "folder", title: "All Workspaces" },
      { href: "/dashboard/workspaces/create", icon: "add", title: "Create Workspace" },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      { href: "/", icon: "home", title: "Homepage" },
      {
        href: "#",
        icon: "messages",
        title: "Support",
        disabled: true,
      },
    ],
  },
];

// Function to get filtered sidebar links based on user's workspaces
export const getFilteredSidebarLinks = (
  workspaces: any[] = [],
  userId?: number
): SidebarNavItem[] => {
  const yourWorkspaces = workspaces.filter(ws => Number(ws.owner_id) === Number(userId));
  const sharedWorkspaces = workspaces.filter(ws => Number(ws.owner_id) !== Number(userId));

  const mapWorkspaces = (items: any[]) =>
    items.map(workspace => ({
      href: `/dashboard/workspace/${workspace.id}`,
      icon: 'folder' as const,
      title: workspace.name,
      items: [
        { href: `/dashboard/workspace/${workspace.id}`, title: 'Tasks' },
        { href: `/dashboard/workspace/${workspace.id}/notes`, title: 'Notes' },
        { href: `/dashboard/workspace/${workspace.id}/team`, title: 'Team' },
      ],
    }));

  return [
    {
      title: 'YOUR WORKSPACES',
      items: mapWorkspaces(yourWorkspaces),
    },
    {
      title: 'SHARED WORKSPACES',
      items: mapWorkspaces(sharedWorkspaces),
    },
    {
      title: 'MENU',
      items: [
        { href: '/dashboard', icon: 'dashboard' as const, title: 'Dashboard' },
        { href: '/dashboard/settings', icon: 'settings' as const, title: 'Settings' },
        { href: '/', icon: 'home' as const, title: 'Homepage' },
        { href: '#', icon: 'messages' as const, title: 'Support', disabled: true },
      ],
    },
  ];
};