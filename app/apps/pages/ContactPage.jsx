import React from 'react';
import Helmet from 'react-helmet';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import SiteLayout from '@/components/SiteLayout';
import SocialLinks from '@/components/SocialLinks';
import { CHAMBER_IMAGE, useSettings } from '@/lib/siteData';

const ContactPage = () => {
    const { settings, loading } = useSettings();

    const rows = [
        { icon: Phone, label: 'Contact number', value: settings?.phone, href: `tel:${(settings?.phone || '').replace(/\s/g, '')}` },
        { icon: Mail, label: 'Email', value: settings?.email, href: `mailto:${settings?.email || ''}` },
        { icon: MapPin, label: 'Office location', value: settings?.address },
        { icon: Clock, label: 'Office hours', value: settings?.office_hours },
    ];

    return (
        <SiteLayout>
            <Helmet>
                <title>Contact the Chamber | Dhage & Associates</title>
                <meta
                    name="description"
                    content="Contact number, email and office address of the chamber. Consultations by appointment, Monday to Saturday."
                />
            </Helmet>

            <section className="mx-auto grid max-w-[80rem] gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
                <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-accent">Contact</p>
                    <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                        Speak with the chamber
                    </h1>
                    <div className="rule-accent mt-6 w-40" />

                    <dl className="mt-10 divide-y divide-border border-y border-border">
                        {rows.map(({ icon: Icon, label, value, href }) => (
                            <div key={label} className="flex gap-4 py-5">
                                <Icon className="mt-1 h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} />
                                <div>
                                    <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</dt>
                                    <dd className="mt-1 text-lg">
                                        {loading ? (
                                            <span className="block h-6 w-48 animate-pulse bg-muted" />
                                        ) : href && value ? (
                                            <a href={href} className="hover:text-accent">
                                                {value}
                                            </a>
                                        ) : (
                                            value || '—'
                                        )}
                                    </dd>
                                </div>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-10">
                        <SocialLinks heading="Social media" />
                    </div>
                </div>
                <img src={CHAMBER_IMAGE} alt="Chamber interior" className="h-full min-h-[24rem] w-full object-cover" />
            </section>
        </SiteLayout>
    );
};

export default ContactPage;
