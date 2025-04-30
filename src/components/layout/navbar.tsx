'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { marketingConfig } from '@/config/marketing';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { useScroll } from '@/hooks/use-scroll';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/shared/icons';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';

interface NavBarProps {
    scroll?: boolean;
    large?: boolean;
}

export function NavBar({ scroll = false }: NavBarProps) {
    const scrolled = useScroll(50);
    const { data: session, status } = useSession();
    const links = marketingConfig.mainNav;
    const selectedLayout = useSelectedLayoutSegment();

    return (
        <header
            className={`border-b border-dashed sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all ${
                scroll ? (scrolled ? 'border-b' : 'bg-transparent') : 'border-b'
            }`}
        >
            <MaxWidthWrapper large={true} className="flex h-full mx-auto w-full items-center justify-between py-4 border-dashed min-[1400px]:border-x">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-1.5">
                        <Icons.logo className="size-6" />
                        <span className="font-satoshi text-xl font-bold">{siteConfig.name}</span>
                    </Link>

                    {links && links.length > 0 ? (
                        <nav className="hidden gap-6 md:flex">
                            {links.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.disabled ? '#' : item.href}
                                    prefetch={true}
                                    className={cn(
                                        'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                                        item.href.startsWith(`/${selectedLayout}`)
                                            ? 'text-foreground'
                                            : 'text-foreground/60',
                                        item.disabled && 'cursor-not-allowed opacity-80'
                                    )}
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                    ) : null}
                </div>

                <div className="flex items-center space-x-3">
                    {session ? (
                        <Link href="/dashboard" className="hidden md:block">
                            <Button className="gap-2 px-4" variant="default" size="sm" rounded="xl">
                                <span>Dashboard</span>
                            </Button>
                        </Link>
                    ) : status === 'unauthenticated' ? (
                        <Link href="/login" className="hidden md:flex">
                            <Button className="gap-2 px-4" variant="default" size="sm" rounded="xl">
                                <span>Sign In</span>
                                <Icons.arrowRight className="size-4" />
                            </Button>
                        </Link>
                    ) : (
                        <Skeleton className="hidden h-9 w-24 rounded-xl lg:flex" />
                    )}
                </div>
            </MaxWidthWrapper>
        </header>
    );
}
