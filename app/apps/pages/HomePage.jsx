import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SiteLayout from '@/components/SiteLayout';
import SocialLinks from '@/components/SocialLinks';
import { CHAMBER_IMAGE, FALLBACK_PORTRAIT, useCollection, useSettings } from '@/lib/siteData';

const HomePage = () => {
    const { settings, loading } = useSettings();
    const { items: cases } = useCollection('cases', '-updated');

    const photo = settings?.photo_url || FALLBACK_PORTRAIT;

    return (
        <SiteLayout>
            <Helmet>
                <title>{settings?.firm_name || 'Dhage & Associates'} | Advocate & Litigation Chamber</title>
                <meta
                    name="description"
                    content="Litigation chamber handling criminal, civil, family and consumer matters with meticulous preparation and clear client communication."
                />
            </Helmet>

            <section className="relative min-h-[100dvh] border-b border-border">
                <div className="mx-auto grid max-w-[80rem] items-center gap-12 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
                    <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-accent">
                            {settings?.credentials || 'Advocate'}
                        </p>
                        <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                            {loading ? (
                                <span className="block h-16 w-3/4 animate-pulse bg-muted" />
                            ) : (
                                settings?.lawyer_name || 'Adv. Amrut Dhage'
                            )}
                        </h1>
                        <div className="rule-accent mt-6 w-40" />
                        <p className="mt-6 max-w-[34rem] text-lg text-muted-foreground">
                            {settings?.tagline || 'Considered counsel. Documented outcomes.'}
                        </p>
                        <p className="mt-4 max-w-[36rem] leading-relaxed text-muted-foreground">{settings?.about}</p>
                        <div className="mt-9 flex flex-wrap gap-3">
                            <Link
                                to="/contact"
                                className="inline-flex min-h-[44px] items-center gap-2 bg-primary px-6 font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
                            >
                                Book a consultation <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                            </Link>
                            <Link
                                to="/cases"
                                className="inline-flex min-h-[44px] items-center border border-primary px-6 font-semibold transition-colors hover:bg-secondary"
                            >
                                Read case updates
                            </Link>
                        </div>
                        <div className="mt-12">
                            <SocialLinks />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-4 -top-4 hidden h-full w-full border border-accent/40 md:block" />
                        <img
                            src={photo}
                            alt={settings?.lawyer_name || 'Advocate portrait'}
                            className="relative aspect-[3/4] w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[80rem] px-5 py-20">
                <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                    <img src={CHAMBER_IMAGE} alt="Chamber desk with case files" className="aspect-[4/3] w-full object-cover" />
                    <div>
                        <h2 className="font-display text-3xl font-semibold">Recent matters from the chamber</h2>
                        <div className="mt-6 divide-y divide-border border-t border-border">
                            {cases.slice(0, 4).map((item) => (
                                <Reveal key={item.id} y={16}>
                                    <Link to={`/cases/${item.id}`} className="group flex items-baseline gap-4 py-4">
                                        <span className="font-display text-lg group-hover:text-accent">{item.title}</span>
                                        <span className="ml-auto shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
                                            {item.status || 'ongoing'}
                                        </span>
                                    </Link>
                                </Reveal>
                            ))}
                            {!cases.length ? (
                                <p className="py-6 text-muted-foreground">Case updates will be published here shortly.</p>
                            ) : null}
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
};

export default HomePage;
