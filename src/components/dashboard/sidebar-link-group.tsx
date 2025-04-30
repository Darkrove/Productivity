// components/dashboard/sidebar-link-group.tsx
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { NavItem, SidebarNavItem } from '@/types';
import { Icons } from '@/components/shared/icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarLinkGroupProps {
  title: string;
  items: NavItem[];
  expanded: boolean;
}

export function SidebarLinkGroup({ title, items, expanded }: SidebarLinkGroupProps) {
  const path = usePathname();

  return (
    <section className="flex flex-col gap-0.5">
      {expanded ? (
        <p className="text-xs text-muted-foreground">{title}</p>
      ) : (
        <div className="h-4" />
      )}

      {items.map(item => {
        const Icon = Icons[item.icon || 'arrowRight'];
        const hasChildren = item.items && item.items.length > 0;

        if (!expanded) {
          return (
            <TooltipWrapper key={item.title} title={item.title} href={item.href} Icon={Icon} disabled={item.disabled} />
          );
        }

        return (
          <Fragment key={item.title}>
            {hasChildren ? (
              <Collapsible defaultOpen={path.startsWith(item.href || '')} className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted',
                      'text-muted-foreground hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="size-5" />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-7">
                  {item.items?.map(sub => (
                    <Link
                      key={sub.title}
                      href={sub.href}
                      className={cn(
                        'block rounded-md px-2 py-1.5 text-sm hover:bg-muted',
                        path === sub.href
                          ? 'bg-muted text-accent-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {sub.title}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted',
                  path === item.href
                    ? 'bg-muted'
                    : 'text-muted-foreground hover:text-accent-foreground',
                  item.disabled && 'cursor-not-allowed opacity-80 hover:bg-transparent'
                )}
              >
                <Icon className="size-5" />
                {item.title}
                {item.badge && (
                  <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )}
          </Fragment>
        );
      })}
    </section>
  );
}

function TooltipWrapper({ title, href, Icon, disabled }: { title: string; href?: string; Icon: any; disabled?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={disabled ? '#' : href ?? '#'}
          className={cn(
            'flex items-center justify-center rounded-md py-2 text-sm font-medium hover:bg-muted',
            disabled && 'cursor-not-allowed opacity-80 hover:bg-transparent'
          )}
        >
          <Icon className="size-5" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{title}</TooltipContent>
    </Tooltip>
  );
}
