import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex h-16 items-center border-b px-4 md:px-6">
                <div className="flex items-center gap-2 font-semibold">
                    <CheckSquare className="h-6 w-6" />
                    <span className="text-xl font-bold">Productivity</span>
                </div>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link
                        href="#features"
                        className="text-sm font-medium hover:underline underline-offset-4"
                    >
                        Features
                    </Link>
                    <Link
                        href="#pricing"
                        className="text-sm font-medium hover:underline underline-offset-4"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="#about"
                        className="text-sm font-medium hover:underline underline-offset-4"
                    >
                        About
                    </Link>
                </nav>
                <div className="ml-auto flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm">
                            Login
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button size="sm">Sign Up</Button>
                    </Link>
                </div>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        Organize Your Life with Our Productivity App
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Manage tasks, take notes, schedule events, and collaborate
                                        with your team - all in one place.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link href="/register">
                                        <Button size="lg">Get Started</Button>
                                    </Link>
                                    <Link href="#features">
                                        <Button size="lg" variant="outline">
                                            Learn More
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="relative w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
                                    <img
                                        src="/placeholder.svg?height=550&width=450"
                                        alt="App Screenshot"
                                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                    Features
                                </h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Everything you need to stay organized and productive
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                                <div className="rounded-full bg-primary/10 p-4">
                                    <CheckSquare className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Task Management</h3>
                                <p className="text-center text-muted-foreground">
                                    Create, organize, and track your tasks with ease.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                                <div className="rounded-full bg-primary/10 p-4">
                                    <CheckSquare className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Note Taking</h3>
                                <p className="text-center text-muted-foreground">
                                    Capture your ideas and information in organized notes.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                                <div className="rounded-full bg-primary/10 p-4">
                                    <CheckSquare className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Calendar Events</h3>
                                <p className="text-center text-muted-foreground">
                                    Schedule and manage your events and appointments.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                                <div className="rounded-full bg-primary/10 p-4">
                                    <CheckSquare className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Collaboration</h3>
                                <p className="text-center text-muted-foreground">
                                    Work together with your team on shared workspaces.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                                <div className="rounded-full bg-primary/10 p-4">
                                    <CheckSquare className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Progress Tracking</h3>
                                <p className="text-center text-muted-foreground">
                                    Monitor your productivity and task completion.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                                <div className="rounded-full bg-primary/10 p-4">
                                    <CheckSquare className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Customization</h3>
                                <p className="text-center text-muted-foreground">
                                    Personalize your workspace to fit your unique workflow and
                                    preferences.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                    Simple, Transparent Pricing
                                </h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Choose the plan that's right for you
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
                            <div className="flex flex-col rounded-lg border p-6">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">Free</h3>
                                    <p className="text-muted-foreground">
                                        Basic features for personal use
                                    </p>
                                </div>
                                <div className="mt-4 flex items-baseline text-3xl font-bold">
                                    $0
                                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                                        /month
                                    </span>
                                </div>
                                <ul className="mt-6 space-y-2 text-sm">
                                    <li className="flex items-center">
                                        <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                                        Up to 5 tasks
                                    </li>
                                    <li className="flex items-center">
                                        <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                                        Up to 3 notes
                                    </li>
                                    <li className="flex items-center">
                                        <CheckSquare className="mr-2 h-4 w-4 text-primary" />1
                                        workspace
                                    </li>
                                </ul>
                                <div className="mt-auto pt-6">
                                    <Link href="/register">
                                        <Button className="w-full">Get Started</Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex flex-col rounded-lg border border-primary p-6 shadow-lg">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">Pro</h3>
                                    <p className="text-muted-foreground">
                                        Advanced features for professionals
                                    </p>
                                </div>
                                <div className="mt-4 flex items-baseline text-3xl font-bold">
                                    $9.99
                                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                                        /month
                                    </span>
                                </div>
                                <ul className="mt-6 space-y-2 text-sm">
                                    <li className="flex items-center">
                                        <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                                        Unlimited tasks
                                    </li>
                                    <li className="flex items-center">
                                        <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                                        Unlimited notes
                                    </li>
                                    <li className="flex items-center">
                                        <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                                        Up to 5 workspaces
                                    </li>
                                    <li className="flex items-center">
                                        <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                                        Collaboration with up to 5 members
                                    </li>
                                </ul>
                                <div className="mt-auto pt-6">
                                    <Link href="/register">
                                        <Button className="w-full">Get Started</Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex flex-col rounded-lg border p-6">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">Team</h3>
                                    <p className="text-muted-foreground">
                                        Premium features for teams
                                    </p>
                                </div>
                                <div className="mt-4 flex items-baseline text-3xl font-bold">
                                    $19.99
                                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                                        /month
                                    </span>
                                </div>
                                <ul className="mt-6 space-y-2 text-sm">
                                    <li className="flex items-center">
                                        <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                                        Unlimited tasks
                                    </li>
                                    <li className="flex items-center">
                                        <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                                        Unlimited notes
                                    </li>
                                    <li className="flex items-center">
                                        <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                                        Unlimited workspaces
                                    </li>
                                    <li className="flex items-center">
                                        <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                                        Unlimited team members
                                    </li>
                                    <li className="flex items-center">
                                        <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                                        Advanced analytics
                                    </li>
                                </ul>
                                <div className="mt-auto pt-6">
                                    <Link href="/register">
                                        <Button className="w-full">Get Started</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="border-t py-6 md:py-8">
                <div className="container flex flex-col items-center justify-center gap-4 px-4 md:flex-row md:gap-8 md:px-6">
                    <div className="flex items-center gap-2 font-semibold">
                        <CheckSquare className="h-6 w-6" />
                        <span className="text-xl font-bold">Productivity</span>
                    </div>
                    <nav className="flex gap-4 sm:gap-6">
                        <Link
                            href="#"
                            className="text-sm font-medium hover:underline underline-offset-4"
                        >
                            Terms
                        </Link>
                        <Link
                            href="#"
                            className="text-sm font-medium hover:underline underline-offset-4"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="#"
                            className="text-sm font-medium hover:underline underline-offset-4"
                        >
                            Contact
                        </Link>
                    </nav>
                    <div className="md:ml-auto flex items-center">
                        <p className="text-sm text-muted-foreground">
                            © 2023 Productivity App. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
