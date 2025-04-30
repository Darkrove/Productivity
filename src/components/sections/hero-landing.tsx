import Link from 'next/link';

import { env } from '@/../env.mjs';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { siteConfig } from '@/config/site';
import { cn, nFormatter } from '@/lib/utils';
import MaxWidthWrapper from '../shared/max-width-wrapper';

export default async function HeroLanding() {
    const { stargazers_count: stars } = await fetch(
        'https://api.github.com/repos/darkrove/productivity',
        {
            ...(env.GITHUB_OAUTH_TOKEN && {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }),
            // data will revalidate every hour
            next: { revalidate: 3600 },
        }
    )
        .then(res => res.json())
        .catch(e => console.log(e));

    return (
        <MaxWidthWrapper large={true} className="border-dashed min-[1400px]:border-x">
        <section className="w-full space-y-6 py-12 sm:py-20 lg:py-20">
            <div className="flex max-w-5xl m-auto flex-col items-center gap-5 text-center">
                <Link
                    href="https://twitter.com/miickasmt/status/1810465801649938857"
                    className={cn(
                        buttonVariants({ variant: 'outline', size: 'sm', rounded: 'full' }),
                        'px-4'
                    )}
                    target="_blank"
                >
                    <span className="mr-3">🎉</span>
                    <span className="hidden md:flex">Introducing</span> Collaborative Notes Taking App <Icons.twitter className="ml-2 size-3.5" />
                </Link>

                <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
                    Organize Your Life with Our{' '}
                    <span className="text-gradient_indigo-purple font-extrabold">Productivity</span>{' '}
                    App
                </h1>

                <p
                    className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
                    style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
                >
                    Manage tasks, take notes, schedule events, and collaborate with your team - all
                    in one place.
                </p>

                <div
                    className="flex justify-center space-x-2 md:space-x-4"
                    style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
                >
                    <Link
                        href="/pricing"
                        prefetch={true}
                        className={cn(buttonVariants({ size: 'lg', rounded: 'full' }), 'gap-2')}
                    >
                        <span>Go Pricing</span>
                        <Icons.arrowRight className="size-4" />
                    </Link>
                    <Link
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                            buttonVariants({
                                variant: 'outline',
                                size: 'lg',
                                rounded: 'full',
                            }),
                            'px-5'
                        )}
                    >
                        <Icons.gitHub className="mr-2 size-4" />
                        <p>
                            <span className="hidden sm:inline-block">Star on</span> GitHub{' '}
                            <span className="font-semibold">{nFormatter(stars)}</span>
                        </p>
                    </Link>
                </div>
            </div>
        </section>
        </MaxWidthWrapper>
        //     <section className="space-y-6">
        //   <div className="relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-background p-8 sm:p-20">
        //     <div className="flex min-h-screen flex-col max-w-md">
        //         <main className="flex-1">
        //             <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        //                 <div className="container px-4 md:px-6">
        //                     <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
        //                         <div className="flex flex-col justify-center space-y-4">
        //                             <div className="space-y-2">
        //                                 <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
        //                                     Organize Your Life with Our Productivity App
        //                                 </h1>
        //                                 <p className="max-w-[600px] text-muted-foreground md:text-xl">
        //                                     Manage tasks, take notes, schedule events, and collaborate
        //                                     with your team - all in one place.
        //                                 </p>
        //                             </div>
        //                             <div className="flex flex-col gap-2 min-[400px]:flex-row">
        //                                 <Link href="/register">
        //                                     <Button size="lg">Get Started</Button>
        //                                 </Link>
        //                                 <Link href="#features">
        //                                     <Button size="lg" variant="outline">
        //                                         Learn More
        //                                     </Button>
        //                                 </Link>
        //                             </div>
        //                         </div>
        //                         <div className="flex items-center justify-center">
        //                             <div className="relative w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
        //                                 <img
        //                                     src="/placeholder.svg?height=550&width=450"
        //                                     alt="App Screenshot"
        //                                     className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center"
        //                                 />
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </section>
        //             <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        //                 <div className="container px-4 md:px-6">
        //                     <div className="flex flex-col items-center justify-center space-y-4 text-center">
        //                         <div className="space-y-2">
        //                             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
        //                                 Features
        //                             </h2>
        //                             <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
        //                                 Everything you need to stay organized and productive
        //                             </p>
        //                         </div>
        //                     </div>
        //                     <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
        //                         <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
        //                             <div className="rounded-full bg-primary/10 p-4">
        //                                 <Icons.logo className="h-6 w-6 text-primary" />
        //                             </div>
        //                             <h3 className="text-xl font-bold">Task Management</h3>
        //                             <p className="text-center text-muted-foreground">
        //                                 Create, organize, and track your tasks with ease.
        //                             </p>
        //                         </div>
        //                         <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
        //                             <div className="rounded-full bg-primary/10 p-4">
        //                                 <Icons.logo className="h-6 w-6 text-primary" />
        //                             </div>
        //                             <h3 className="text-xl font-bold">Note Taking</h3>
        //                             <p className="text-center text-muted-foreground">
        //                                 Capture your ideas and information in organized notes.
        //                             </p>
        //                         </div>
        //                         <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
        //                             <div className="rounded-full bg-primary/10 p-4">
        //                                 <Icons.logo className="h-6 w-6 text-primary" />
        //                             </div>
        //                             <h3 className="text-xl font-bold">Calendar Events</h3>
        //                             <p className="text-center text-muted-foreground">
        //                                 Schedule and manage your events and appointments.
        //                             </p>
        //                         </div>
        //                         <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
        //                             <div className="rounded-full bg-primary/10 p-4">
        //                                 <Icons.logo className="h-6 w-6 text-primary" />
        //                             </div>
        //                             <h3 className="text-xl font-bold">Collaboration</h3>
        //                             <p className="text-center text-muted-foreground">
        //                                 Work together with your team on shared workspaces.
        //                             </p>
        //                         </div>
        //                         <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
        //                             <div className="rounded-full bg-primary/10 p-4">
        //                                 <Icons.logo className="h-6 w-6 text-primary" />
        //                             </div>
        //                             <h3 className="text-xl font-bold">Progress Tracking</h3>
        //                             <p className="text-center text-muted-foreground">
        //                                 Monitor your productivity and task completion.
        //                             </p>
        //                         </div>
        //                         <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
        //                             <div className="rounded-full bg-primary/10 p-4">
        //                                 <Icons.logo className="h-6 w-6 text-primary" />
        //                             </div>
        //                             <h3 className="text-xl font-bold">Customization</h3>
        //                             <p className="text-center text-muted-foreground">
        //                                 Personalize your workspace to fit your unique workflow and
        //                                 preferences.
        //                             </p>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </section>
        //             <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
        //                 <div className="container px-4 md:px-6">
        //                     <div className="flex flex-col items-center justify-center space-y-4 text-center">
        //                         <div className="space-y-2">
        //                             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
        //                                 Simple, Transparent Pricing
        //                             </h2>
        //                             <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
        //                                 Choose the plan that's right for you
        //                             </p>
        //                         </div>
        //                     </div>
        //                     <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
        //                         <div className="flex flex-col rounded-lg border p-6">
        //                             <div className="space-y-2">
        //                                 <h3 className="text-2xl font-bold">Free</h3>
        //                                 <p className="text-muted-foreground">
        //                                     Basic features for personal use
        //                                 </p>
        //                             </div>
        //                             <div className="mt-4 flex items-baseline text-3xl font-bold">
        //                                 $0
        //                                 <span className="ml-1 text-sm font-normal text-muted-foreground">
        //                                     /month
        //                                 </span>
        //                             </div>
        //                             <ul className="mt-6 space-y-2 text-sm">
        //                                 <li className="flex items-center">
        //                                     <Icons.logo className="mr-2 h-4 w-4 text-primary" />
        //                                     Up to 5 tasks
        //                                 </li>
        //                                 <li className="flex items-center">
        //                                     <Icons.logo className="mr-2 h-4 w-4 text-primary" />
        //                                     Up to 3 notes
        //                                 </li>
        //                                 <li className="flex items-center">
        //                                     <Icons.logo className="mr-2 h-4 w-4 text-primary" />1
        //                                     workspace
        //                                 </li>
        //                             </ul>
        //                             <div className="mt-auto pt-6">
        //                                 <Link href="/register">
        //                                     <Button className="w-full">Get Started</Button>
        //                                 </Link>
        //                             </div>
        //                         </div>
        //                         <div className="flex flex-col rounded-lg border border-primary p-6 shadow-lg">
        //                             <div className="space-y-2">
        //                                 <h3 className="text-2xl font-bold">Pro</h3>
        //                                 <p className="text-muted-foreground">
        //                                     Advanced features for professionals
        //                                 </p>
        //                             </div>
        //                             <div className="mt-4 flex items-baseline text-3xl font-bold">
        //                                 $9.99
        //                                 <span className="ml-1 text-sm font-normal text-muted-foreground">
        //                                     /month
        //                                 </span>
        //                             </div>
        //                             <ul className="mt-6 space-y-2 text-sm">
        //                                 <li className="flex items-center">
        //                                     <Icons.logo className="mr-2 h-4 w-4 text-primary" />
        //                                     Unlimited tasks
        //                                 </li>
        //                                 <li className="flex items-center">
        //                                     <Icons.logo className="mr-2 h-4 w-4 text-primary" />
        //                                     Unlimited notes
        //                                 </li>
        //                                 <li className="flex items-center">
        //                                     <Icons.logo className="mr-2 h-4 w-4 text-primary" />
        //                                     Up to 5 workspaces
        //                                 </li>
        //                                 <li className="flex items-center">
        //                                     <Icons.logo className="mr-2 h-4 w-4 text-primary" />
        //                                     Collaboration with up to 5 members
        //                                 </li>
        //                             </ul>
        //                             <div className="mt-auto pt-6">
        //                                 <Link href="/register">
        //                                     <Button className="w-full">Get Started</Button>
        //                                 </Link>
        //                             </div>
        //                         </div>
        //                         <div className="flex flex-col rounded-lg border p-6">
        //                             <div className="space-y-2">
        //                                 <h3 className="text-2xl font-bold">Team</h3>
        //                                 <p className="text-muted-foreground">
        //                                     Premium features for teams
        //                                 </p>
        //                             </div>
        //                             <div className="mt-4 flex items-baseline text-3xl font-bold">
        //                                 $19.99
        //                                 <span className="ml-1 text-sm font-normal text-muted-foreground">
        //                                     /month
        //                                 </span>
        //                             </div>
        //                             <ul className="mt-6 space-y-2 text-sm">
        //                                 <li className="flex items-center">
        //                                     <Icons.logo className="mr-2 h-4 w-4 text-primary" />
        //                                     Unlimited tasks
        //                                 </li>
        //                                 <li className="flex items-center">
        //                                     <Icons.logo className="mr-2 h-4 w-4 text-primary" />
        //                                     Unlimited notes
        //                                 </li>
        //                                 <li className="flex items-center">
        //                                     <Icons.logo className="mr-2 h-4 w-4 text-primary" />
        //                                     Unlimited workspaces
        //                                 </li>
        //                                 <li className="flex items-center">
        //                                     <Icons.logo className="mr-2 h-4 w-4 text-primary" />
        //                                     Unlimited team members
        //                                 </li>
        //                                 <li className="flex items-center">
        //                                     <Icons.logo className="mr-2 h-4 w-4 text-primary" />
        //                                     Advanced analytics
        //                                 </li>
        //                             </ul>
        //                             <div className="mt-auto pt-6">
        //                                 <Link href="/register">
        //                                     <Button className="w-full">Get Started</Button>
        //                                 </Link>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </section>
        //         </main>
        //         <footer className="border-t py-6 md:py-8">
        //             <div className="container flex flex-col items-center justify-center gap-4 px-4 md:flex-row md:gap-8 md:px-6">
        //                 <div className="flex items-center gap-2 font-semibold">
        //                     <Icons.logo className="h-6 w-6" />
        //                     <span className="text-xl font-bold">Productivity</span>
        //                 </div>
        //                 <nav className="flex gap-4 sm:gap-6">
        //                     <Link
        //                         href="#"
        //                         className="text-sm font-medium hover:underline underline-offset-4"
        //                     >
        //                         Terms
        //                     </Link>
        //                     <Link
        //                         href="#"
        //                         className="text-sm font-medium hover:underline underline-offset-4"
        //                     >
        //                         Privacy
        //                     </Link>
        //                     <Link
        //                         href="#"
        //                         className="text-sm font-medium hover:underline underline-offset-4"
        //                     >
        //                         Contact
        //                     </Link>
        //                 </nav>
        //                 <div className="md:ml-auto flex items-center">
        //                     <p className="text-sm text-muted-foreground">
        //                         © 2023 Productivity App. All rights reserved.
        //                     </p>
        //                 </div>
        //             </div>
        //         </footer>
        //     </div>
        //     </div>
        //     </section>
    );
}
