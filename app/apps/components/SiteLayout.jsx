import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Phone, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/lib/siteData';

const NAV = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Practice & Promotions' },
    { to: '/cases', label: 'Case Updates' },
    { to: '/contact', label: 'Contact' },
];

const SiteLayout = ({ children }) => {
    const { settings } = useSettings();
    const { isAuthed } = useAuth();
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const firm = settings?.firm_name || 'Dhage & Associates';
    const phone = settings?.phone || '';

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
                <div className="mx-auto flex max-w-[80rem] items-center gap-6 px-5 py-4">
                    <Link to="/" className="font-display text-lg font-semibold tracking-tight">
                        {firm}
                    </Link>
                    <nav className="ml-auto hidden items-center gap-7 text-sm md:flex">
                        {NAV.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `transition-colors hover:text-accent ${isActive ? 'text-accent' : 'text-muted-foreground'}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        <Link
                            to={isAuthed ? '/admin' : '/login'}
                            className="text-muted-foreground transition-colors hover:text-accent"
                        >
                            {isAuthed ? 'Admin' : 'Admin login'}
                        </Link>
                        {phone ? (
                            <a
                                href={`tel:${phone.replace(/\s/g, '')}`}
                                className="inline-flex min-h-[44px] items-center gap-2 bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
                            >
                                <Phone className="h-4 w-4" strokeWidth={1.75} /> Call chamber
                            </a>
                        ) : null}
                    </nav>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Toggle menu"
                        className="ml-auto inline-flex h-11 w-11 items-center justify-center border border-border md:hidden"
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
                {open ? (
                    <nav className="border-t border-border bg-background px-5 py-3 md:hidden">
                        {[...NAV, { to: isAuthed ? '/admin' : '/login', label: isAuthed ? 'Admin' : 'Admin login' }].map(
                            (item) => (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    onClick={() => setOpen(false)}
                                    className={`block py-3 text-sm ${location.pathname === item.to ? 'text-accent' : ''}`}
                                >
                                    {item.label}
                                </Link>
                            ),
                        )}
                        {phone ? (
                            <a
                                href={`tel:${phone.replace(/\s/g, '')}`}
                                className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center bg-primary px-4 font-semibold text-primary-foreground"
                            >
                                Call {phone}
                            </a>
                        ) : null}
                    </nav>
                ) : null}
            </header>

            <main>{children}</main>

            <footer className="mt-24 border-t border-border bg-secondary/60">
                <div className="mx-auto grid max-w-[80rem] gap-8 px-5 py-12 text-sm text-muted-foreground md:grid-cols-3">
                    <div>
                        <p className="font-display text-base font-semibold text-foreground">{firm}</p>
                        <p className="mt-2">{settings?.credentials}</p>
                    </div>
                    <div>
                        <p className="text-foreground">Chamber</p>
                        <p className="mt-2 whitespace-pre-line">{settings?.address}</p>
                    </div>
                    <div>
                        <p className="text-foreground">Reach</p>
                        <p className="mt-2">{settings?.phone}</p>
                        <p>{settings?.email}</p>
                        <p className="mt-4">© {new Date().getFullYear()} {firm}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SiteLayout;
