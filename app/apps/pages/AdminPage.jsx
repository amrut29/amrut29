import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { Download, LogOut, Plus, Trash2 } from 'lucide-react';
import SiteLayout from '@/components/SiteLayout';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { CASE_SECTIONS, exportWorkbook, useCollection, useSettings } from '@/lib/siteData';

const SETTINGS_FIELDS = [
    ['firm_name', 'Firm name'],
    ['lawyer_name', 'Lawyer name'],
    ['credentials', 'Credentials'],
    ['tagline', 'Tagline'],
    ['photo_url', 'Photo URL'],
    ['phone', 'Contact number'],
    ['email', 'Email'],
    ['office_hours', 'Office hours'],
    ['about', 'About (long text)'],
    ['address', 'Office location / address'],
];

const inputClass = 'h-11 w-full border border-input bg-card px-3 outline-none focus:border-accent';
const areaClass = 'w-full border border-input bg-card p-3 outline-none focus:border-accent';

const Field = ({ label, value, onChange, textarea, rows = 4 }) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</label>
        {textarea ? (
            <textarea rows={rows} className={areaClass} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        ) : (
            <input className={inputClass} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        )}
    </div>
);

const AdminPage = () => {
    const { logout, user } = useAuth();
    const { settings, reload: reloadSettings } = useSettings();
    const services = useCollection('services');
    const socials = useCollection('social_links');
    const cases = useCollection('cases', '-updated');
    const [tab, setTab] = useState('site');
    const [draft, setDraft] = useState({});
    const [status, setStatus] = useState('');

    const value = (record, key) => (draft[record.id]?.[key] !== undefined ? draft[record.id][key] : record[key]);
    const setValue = (record, key, val) =>
        setDraft((prev) => ({ ...prev, [record.id]: { ...prev[record.id], [key]: val } }));

    const save = async (collection, record, reload) => {
        setStatus('');

        try {
            await pb.collection(collection).update(record.id, draft[record.id] || {});
            setDraft((prev) => ({ ...prev, [record.id]: undefined }));
            await reload();
            setStatus('Saved.');
        } catch (err) {
            setStatus(err?.message || 'Save failed.');
        }
    };

    const create = async (collection, data, reload) => {
        setStatus('');

        try {
            await pb.collection(collection).create(data);
            await reload();
            setStatus('Created.');
        } catch (err) {
            setStatus(err?.message || 'Create failed.');
        }
    };

    const remove = async (collection, id, reload) => {
        setStatus('');

        try {
            await pb.collection(collection).delete(id);
            await reload();
            setStatus('Deleted.');
        } catch (err) {
            setStatus(err?.message || 'Delete failed.');
        }
    };

    const tabs = [
        ['site', 'Site & contact'],
        ['services', 'Services'],
        ['social', 'Social media'],
        ['cases', 'Case updates'],
    ];

    return (
        <SiteLayout>
            <Helmet>
                <title>Admin Dashboard | Dhage & Associates</title>
                <meta name="description" content="Administrator dashboard for editing site content, services, social links and case updates." />
            </Helmet>

            <section className="mx-auto max-w-[72rem] px-5 py-12">
                <div className="flex flex-wrap items-center gap-4">
                    <h1 className="font-display text-3xl font-semibold">Admin</h1>
                    <span className="text-sm text-muted-foreground">{user?.email}</span>
                    <div className="ml-auto flex gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                exportWorkbook({
                                    settings,
                                    services: services.items,
                                    socials: socials.items,
                                    cases: cases.items,
                                })
                            }
                            className="inline-flex min-h-[44px] items-center gap-2 border border-primary px-4 text-sm font-semibold hover:bg-secondary"
                        >
                            <Download className="h-4 w-4" strokeWidth={1.75} /> Export to Excel
                        </button>
                        <button
                            type="button"
                            onClick={logout}
                            className="inline-flex min-h-[44px] items-center gap-2 px-3 text-sm text-muted-foreground hover:text-accent"
                        >
                            <LogOut className="h-4 w-4" strokeWidth={1.75} /> Sign out
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-2 border-b border-border">
                    {tabs.map(([key, label]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setTab(key)}
                            className={`min-h-[44px] px-4 text-sm font-semibold ${
                                tab === key ? 'border-b-2 border-accent text-accent' : 'text-muted-foreground'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {status ? <p className="mt-4 text-sm text-accent">{status}</p> : null}

                {tab === 'site' ? (
                    !settings ? (
                        <p className="mt-8 text-muted-foreground">Loading settings…</p>
                    ) : (
                        <div className="mt-8 grid gap-5 md:grid-cols-2">
                            {SETTINGS_FIELDS.map(([key, label]) => (
                                <Field
                                    key={key}
                                    label={label}
                                    value={value(settings, key)}
                                    textarea={key === 'about' || key === 'address'}
                                    onChange={(v) => setValue(settings, key, v)}
                                />
                            ))}
                            <div className="md:col-span-2">
                                <button
                                    type="button"
                                    onClick={() => save('site_settings', settings, reloadSettings)}
                                    className="min-h-[44px] bg-primary px-6 font-semibold text-primary-foreground"
                                >
                                    Save site content
                                </button>
                            </div>
                        </div>
                    )
                ) : null}

                {tab === 'services' ? (
                    <div className="mt-8 space-y-8">
                        <button
                            type="button"
                            onClick={() => create('services', { title: 'New service', sort_order: services.items.length + 1 }, services.reload)}
                            className="inline-flex min-h-[44px] items-center gap-2 border border-primary px-4 text-sm font-semibold"
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.75} /> Add service
                        </button>
                        {services.items.map((item) => (
                            <div key={item.id} className="space-y-4 border border-border bg-card p-5">
                                <Field label="Title" value={value(item, 'title')} onChange={(v) => setValue(item, 'title', v)} />
                                <Field
                                    label="Description"
                                    textarea
                                    value={value(item, 'description')}
                                    onChange={(v) => setValue(item, 'description', v)}
                                />
                                <Field
                                    label="Highlights (one per line)"
                                    textarea
                                    rows={3}
                                    value={value(item, 'highlights')}
                                    onChange={(v) => setValue(item, 'highlights', v)}
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => save('services', item, services.reload)}
                                        className="min-h-[44px] bg-primary px-5 font-semibold text-primary-foreground"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => remove('services', item.id, services.reload)}
                                        className="inline-flex min-h-[44px] items-center gap-2 px-3 text-sm text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" strokeWidth={1.75} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}

                {tab === 'social' ? (
                    <div className="mt-8 space-y-6">
                        <button
                            type="button"
                            onClick={() =>
                                create(
                                    'social_links',
                                    { platform: 'New platform', url: 'https://example.com', sort_order: socials.items.length + 1 },
                                    socials.reload,
                                )
                            }
                            className="inline-flex min-h-[44px] items-center gap-2 border border-primary px-4 text-sm font-semibold"
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.75} /> Add social account
                        </button>
                        {socials.items.map((item) => (
                            <div key={item.id} className="grid gap-4 border border-border bg-card p-5 md:grid-cols-3">
                                <Field label="Platform" value={value(item, 'platform')} onChange={(v) => setValue(item, 'platform', v)} />
                                <Field label="Handle" value={value(item, 'handle')} onChange={(v) => setValue(item, 'handle', v)} />
                                <Field label="URL" value={value(item, 'url')} onChange={(v) => setValue(item, 'url', v)} />
                                <div className="flex gap-3 md:col-span-3">
                                    <button
                                        type="button"
                                        onClick={() => save('social_links', item, socials.reload)}
                                        className="min-h-[44px] bg-primary px-5 font-semibold text-primary-foreground"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => remove('social_links', item.id, socials.reload)}
                                        className="inline-flex min-h-[44px] items-center gap-2 px-3 text-sm text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" strokeWidth={1.75} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}

                {tab === 'cases' ? (
                    <div className="mt-8 space-y-8">
                        <button
                            type="button"
                            onClick={() => create('cases', { title: 'New case', status: 'ongoing' }, cases.reload)}
                            className="inline-flex min-h-[44px] items-center gap-2 border border-primary px-4 text-sm font-semibold"
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.75} /> Add case
                        </button>
                        {cases.items.map((item) => (
                            <div key={item.id} className="space-y-4 border border-border bg-card p-5">
                                <Field label="Title" value={value(item, 'title')} onChange={(v) => setValue(item, 'title', v)} />
                                <div className="grid gap-4 md:grid-cols-4">
                                    <Field label="Court" value={value(item, 'court')} onChange={(v) => setValue(item, 'court', v)} />
                                    <Field
                                        label="Case number"
                                        value={value(item, 'case_number')}
                                        onChange={(v) => setValue(item, 'case_number', v)}
                                    />
                                    <Field
                                        label="Status (ongoing / judgment reserved / decided / appeal)"
                                        value={value(item, 'status')}
                                        onChange={(v) => setValue(item, 'status', v)}
                                    />
                                    <Field
                                        label="Hearing date"
                                        value={value(item, 'hearing_date')}
                                        onChange={(v) => setValue(item, 'hearing_date', v)}
                                    />
                                </div>
                                {CASE_SECTIONS.map((section) => (
                                    <Field
                                        key={section.key}
                                        label={section.label}
                                        textarea
                                        rows={5}
                                        value={value(item, section.key)}
                                        onChange={(v) => setValue(item, section.key, v)}
                                    />
                                ))}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => save('cases', item, cases.reload)}
                                        className="min-h-[44px] bg-primary px-5 font-semibold text-primary-foreground"
                                    >
                                        Save case
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => remove('cases', item.id, cases.reload)}
                                        className="inline-flex min-h-[44px] items-center gap-2 px-3 text-sm text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" strokeWidth={1.75} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </section>
        </SiteLayout>
    );
};

export default AdminPage;
