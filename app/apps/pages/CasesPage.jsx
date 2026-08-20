import React from 'react';
import Helmet from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SiteLayout from '@/components/SiteLayout';
import { CASE_SECTIONS, useCollection } from '@/lib/siteData';

export const CasesPage = () => {
    const { items, loading, error } = useCollection('cases', '-updated');

    return (
        <SiteLayout>
            <Helmet>
                <title>Case Updates | Dhage & Associates</title>
                <meta
                    name="description"
                    content="Detailed case updates covering facts, arguments, Supreme Court authorities, cross examination questions, orders and conclusions."
                />
            </Helmet>

            <section className="mx-auto max-w-[72rem] px-5 py-16 md:py-24">
                <p className="text-xs uppercase tracking-[0.28em] text-accent">Case Updates</p>
                <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                    Matters, as they progress
                </h1>
                <div className="rule-accent mt-6 w-40" />

                {error ? <p className="mt-10 text-destructive">Could not load cases. Please refresh.</p> : null}

                <div className="mt-12 space-y-4">
                    {loading
                        ? [0, 1].map((i) => <div key={i} className="h-32 animate-pulse bg-muted" />)
                        : items.map((item) => (
                              <Link
                                  key={item.id}
                                  to={`/cases/${item.id}`}
                                  className="group block border border-border bg-card p-6 transition-colors hover:border-accent"
                              >
                                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                      <span className="text-accent">{item.status || 'ongoing'}</span>
                                      {item.case_number ? <span>{item.case_number}</span> : null}
                                      {item.court ? <span>{item.court}</span> : null}
                                  </div>
                                  <h2 className="mt-3 font-display text-2xl font-semibold group-hover:text-accent">
                                      {item.title}
                                  </h2>
                                  <p className="mt-3 line-clamp-3 text-muted-foreground">{item.introduction}</p>
                                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                                      Full case note <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                                  </span>
                              </Link>
                          ))}
                    {!loading && !items.length ? (
                        <p className="text-muted-foreground">No case updates published yet.</p>
                    ) : null}
                </div>
            </section>
        </SiteLayout>
    );
};

export const CaseDetailPage = () => {
    const { id } = useParams();
    const { items, loading } = useCollection('cases', '-updated');
    const item = items.find((c) => c.id === id);

    return (
        <SiteLayout>
            <Helmet>
                <title>{item ? `${item.title} | Case Note` : 'Case Note | Dhage & Associates'}</title>
                <meta
                    name="description"
                    content="Detailed case note including introduction, facts, arguments, legal discretion, Supreme Court position, cross examination questions, order and conclusion."
                />
            </Helmet>

            <article className="mx-auto max-w-[56rem] px-5 py-16 md:py-24">
                <Link to="/cases" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent">
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> All case updates
                </Link>

                {loading ? (
                    <div className="mt-10 space-y-4">
                        <div className="h-12 w-2/3 animate-pulse bg-muted" />
                        <div className="h-40 animate-pulse bg-muted" />
                    </div>
                ) : !item ? (
                    <p className="mt-10 text-muted-foreground">This case note is no longer available.</p>
                ) : (
                    <>
                        <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            <span className="text-accent">{item.status || 'ongoing'}</span>
                            {item.case_number ? <span>{item.case_number}</span> : null}
                            {item.court ? <span>{item.court}</span> : null}
                            {item.hearing_date ? <span>{item.hearing_date}</span> : null}
                        </div>
                        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">{item.title}</h1>
                        <div className="rule-accent mt-6 w-40" />

                        <div className="mt-12 space-y-10">
                            {CASE_SECTIONS.filter((s) => item[s.key]).map((section) => (
                                <section key={section.key}>
                                    <h2 className="font-display text-xl font-semibold text-accent">{section.label}</h2>
                                    <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/90">
                                        {item[section.key]}
                                    </p>
                                </section>
                            ))}
                        </div>
                    </>
                )}
            </article>
        </SiteLayout>
    );
};

export default CasesPage;
