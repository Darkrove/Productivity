import { Metadata } from 'next';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { siteConfig } from '@/config/site';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function constructMetadata({
    title = siteConfig.name,
    description = siteConfig.description,
    image = siteConfig.ogImage,
    icons = '/favicon.ico',
    noIndex = false,
}: {
    title?: string;
    description?: string;
    image?: string;
    icons?: string;
    noIndex?: boolean;
} = {}): Metadata {
    return {
        title,
        description,
        keywords: [
            'Next.js',
            'React',
            'Prisma',
            'Neon',
            'Auth.js',
            'shadcn ui',
            'Resend',
            'React Email',
            'Stripe',
        ],
        authors: [
            {
                name: 'mickasmt',
            },
        ],
        creator: 'mickasmt',
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: siteConfig.url,
            title,
            description,
            siteName: title,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@miickasmt',
        },
        icons,
        metadataBase: new URL(siteConfig.url),
        manifest: `${siteConfig.url}/site.webmanifest`,
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}

export function formatDate(input: string | number): string {
    const date = new Date(input);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export function nFormatter(num: number, digits?: number) {
    if (!num) return '0';
    const lookup = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'K' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
            return num >= item.value;
        });
    return item ? (num / item.value).toFixed(digits || 1).replace(rx, '$1') + item.symbol : '0';
}
