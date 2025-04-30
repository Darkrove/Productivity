import * as React from 'react';
import Link from 'next/link';

import { footerLinks, siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

import { Icons } from '@/components/shared/icons';
import { ModeSwitcher } from './mode-switcher';
import { NewsletterForm } from '@/components/forms/newsletter-form';
import MaxWidthWrapper from '../shared/max-width-wrapper';

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
    return (
        <footer className={cn('border-t border-dashed', className)}>
            <MaxWidthWrapper large={true} className="border-dashed min-[1400px]:border-x">
                <div className="container px-3 m-auto grid max-w-6xl grid-cols-2 gap-6 py-14 md:grid-cols-5">
                    {footerLinks.map(section => (
                        <div key={section.title}>
                            <span className="text-sm font-medium text-foreground">
                                {section.title}
                            </span>
                            <ul className="mt-4 list-inside space-y-3">
                                {section.items?.map(link => (
                                    <li key={link.title}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary"
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div className="col-span-full flex flex-col items-end sm:col-span-1 md:col-span-2">
                        <NewsletterForm />
                    </div>
                </div>
            </MaxWidthWrapper>
            <div className="border-t w-full border-dashed"></div>
            <MaxWidthWrapper large={true} className="border-dashed min-[1400px]:border-x">
                <div className="py-4">
                    <div className="container sm:px-10 px-3 m-auto flex max-w-6xl items-center justify-between">
                        {/* <span className="text-muted-foreground text-sm">
            Copyright &copy; 2024. All rights reserved.
          </span> */}
                        <p className="text-left text-sm text-muted-foreground">
                            Built by{' '}
                            <Link
                                href={siteConfig.links.twitter}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium underline underline-offset-4"
                            >
                                Sajjad
                            </Link>
                            . Hosted on{' '}
                            <Link
                                href="https://vercel.com"
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium underline underline-offset-4"
                            >
                                Vercel
                            </Link>
                            . Illustrations by{' '}
                            <Link
                                href="https://popsy.co"
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium underline underline-offset-4"
                            >
                                Popsy
                            </Link>
                        </p>

                        <div className="flex items-center gap-3">
                            <Link
                                href={siteConfig.links.github}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium underline underline-offset-4"
                            >
                                <Icons.gitHub className="size-5" />
                            </Link>
                            <ModeSwitcher />
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
        </footer>
    );
}
