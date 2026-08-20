import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import SiteLayout from '@/components/SiteLayout';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setBusy(true);
        setError('');

        try {
            await login(email, password);
            navigate('/admin');
        } catch (err) {
            setError(err?.message || 'Sign in failed. Check your credentials.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <SiteLayout>
            <Helmet>
                <title>Admin Login | Dhage & Associates</title>
                <meta name="description" content="Secure sign-in for the chamber administrator to edit website content and case updates." />
            </Helmet>

            <section className="mx-auto max-w-[26rem] px-5 py-20">
                <h1 className="font-display text-3xl font-semibold">Admin sign in</h1>
                <div className="rule-accent mt-4 w-28" />
                <form onSubmit={onSubmit} className="mt-8 space-y-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-11 border border-input bg-card px-3 outline-none focus:border-accent"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 border border-input bg-card px-3 outline-none focus:border-accent"
                        />
                    </div>
                    {error ? <p className="text-sm text-destructive">{error}</p> : null}
                    <button
                        type="submit"
                        disabled={busy}
                        className="min-h-[44px] w-full bg-primary font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
                    >
                        {busy ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            </section>
        </SiteLayout>
    );
};

export default LoginPage;
