import LoginForm from '@/components/login-form';

interface LoginPageProps {
    searchParams: Promise<{ returnUrl: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const returnUrl = (await searchParams).returnUrl || '/dashboard';
    return <LoginForm returnUrl={returnUrl} />;
}
