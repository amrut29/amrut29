import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useCollection } from '@/lib/siteData';

const SocialLinks = ({ heading = 'Follow the chamber' }) => {
    const { items, loading } = useCollection('social_links');

    if (loading) {
        return (
            <div className="flex gap-3">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-12 w-36 animate-pulse bg-muted" />
                ))}
            </div>
        );
    }

    if (!items.length) return null;

    return (
        <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{heading}</p>
            <div className="mt-4 flex flex-wrap gap-3">
                {items.map((link) => (
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-2 border border-border bg-card px-4 text-sm transition-colors hover:border-accent hover:text-accent"
                    >
                        {link.platform}
                        {link.handle ? <span className="text-muted-foreground">{link.handle}</span> : null}
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                    </a>
                ))}
            </div>
        </div>
    );
};

export default SocialLinks;
