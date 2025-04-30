import { SidebarNavItem, SiteConfig } from '@/types';
import { env } from 'process';

const site_url: string = env.NEXT_PUBLIC_APP_URL ?? '';

export const siteConfig: SiteConfig = {
    name: 'Productivity',
    description:
        'Manage tasks, take notes, schedule events, and collaborate with your team - all in one place.',
    url: site_url,
    ogImage: `${site_url}/_static/og.jpg`,
    links: {
        twitter: 'https://x.com/sajjads72619701',
        github: 'https://github.com/darkrove',
    },
    mailSupport: 'samaraalishaikh212@gmail.com',
};

export const footerLinks: SidebarNavItem[] = [
    {
        title: 'Company',
        items: [
            { title: 'About', href: '#' },
            { title: 'Enterprise', href: '#' },
            { title: 'Terms', href: '/terms' },
            { title: 'Privacy', href: '/privacy' },
        ],
    },
    {
        title: 'Product',
        items: [
            { title: 'Security', href: '#' },
            { title: 'Customization', href: '#' },
            { title: 'Customers', href: '#' },
            { title: 'Changelog', href: '#' },
        ],
    },
    {
        title: 'Docs',
        items: [
            { title: 'Introduction', href: '#' },
            { title: 'Installation', href: '#' },
            { title: 'Components', href: '#' },
            { title: 'Code Blocks', href: '#' },
        ],
    },
];
