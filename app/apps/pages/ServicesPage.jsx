import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import SiteLayout from '@/components/SiteLayout';
import SocialLinks from '@/components/SocialLinks';
import { useAuth } from '@/contexts/AuthContext';
import { useCollection } from '@/lib/siteData';

const ServicesPage = () => {
    const { items, loading, error } = useCollection('services');
    const { isAuthed } = useAuth();

    return (
        <SiteLayout>
            <Helmet>
                <title>Practice Areas & Promotions | Dhage & Associates</title>
                <meta
                    name="description"
                    content="Practice areas and current promotions: criminal litigation, civil and property disputes, family matters, consumer and cheque bounce cases, drafting and legal opinions."
                />
            </Helmet>

            <section className="mx-auto max-w-[72rem] px-5 py-16 md:py-24">
                <p className="text-xs uppercase tracking-[0.28em] text-accent">Promotions & Services</p>
                <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                    What this chamber takes on
                </h1>
                <div className="rule-accent mt-6 w-40" />

                {isAuthed ? (
                    <Link to="/admin" className="mt-6 inline-block text-sm font-semibold text-accent underline">
                        Edit services in admin
                    </Link>
                ) : null}

                {error ? <p className="mt-10 text-destructive">Could not load services. Please refresh.</p> : null}

                <div className="mt-12 space-y-2">
                    {loading
                        ? [0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse bg-muted" />)
                        : items.map((service, index) => (
                              <article
                                  key={service.id}
                                  className="grid gap-4 border-t border-border py-8 md:grid-cols-[6rem_1fr_1fr]"
                              >
                                  <span className="font-display text-2xl text-accent">
                                      {String(index + 1).padStart(2, '0')}
                                  </span>
                                  <h2 className="font-display text-2xl font-semibold">{service.title}</h2>
                                  <div>
                                      <p className="leading-relaxed text-muted-foreground">{service.description}</p>
                                      {service.highlights ? (
                                          <ul className="mt-4 space-y-1 text-sm">
                                              {service.highlights
                                                  .split('\n')
                                                  .filter(Boolean)
                                                  .map((line) => (
                                                      <li key={line} className="border-l-2 border-accent/60 pl-3">
                                                          {line}
                                                      </li>
                                                  ))}
                                          </ul>
                                      ) : null}
                                  </div>
                              </article>
                          ))}
                    {!loading && !items.length ? (
                        <p className="text-muted-foreground">No services published yet.</p>
                    ) : null}
                </div>

                <div className="mt-16">
                    <SocialLinks heading="Social media" />
                </div>
            </section>
        </SiteLayout>
    );
};

export default ServicesPage;
