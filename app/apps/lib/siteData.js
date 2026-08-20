import { useCallback, useEffect, useState } from 'react';
import pb from '@/lib/pocketbaseClient';

export const CASE_SECTIONS = [
    { key: 'introduction', label: 'Introduction' },
    { key: 'facts', label: 'Facts' },
    { key: 'arguments', label: 'Arguments' },
    { key: 'legal_discretion', label: 'Legal discretion' },
    { key: 'supreme_court', label: 'Supreme Court situation' },
    { key: 'cross_examination', label: 'Cross examination questions' },
    { key: 'order_judgment', label: 'Order and judgments' },
    { key: 'conclusion', label: 'Conclusion' },
];

export const FALLBACK_PORTRAIT = 'https://images.hostinger.com/242c4f51-90ad-43c9-a612-3364eca239ac.png';
export const CHAMBER_IMAGE = 'https://images.hostinger.com/68816d4d-9bd5-4c4b-9e36-8de4d78fbf89.png';

export function useSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const reload = useCallback(() => {
        setLoading(true);

        return pb
            .collection('site_settings')
            .getFirstListItem('key = "main"', { requestKey: 'settings' })
            .then((rec) => setSettings(rec))
            .catch(() => setSettings(null))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    return { settings, loading, reload };
}

export function useCollection(name, sort = 'sort_order') {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const reload = useCallback(() => {
        setLoading(true);

        return pb
            .collection(name)
            .getFullList({ sort, requestKey: `list-${name}` })
            .then((res) => {
                setItems(res);
                setError(null);
            })
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, [name, sort]);

    useEffect(() => {
        reload();
    }, [reload]);

    return { items, loading, error, reload };
}

function escapeCell(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function table(title, rows, columns) {
    const head = columns.map((c) => `<th>${escapeCell(c)}</th>`).join('');
    const body = rows
        .map((row) => `<tr>${columns.map((c) => `<td>${escapeCell(row[c])}</td>`).join('')}</tr>`)
        .join('');

    return `<h3>${escapeCell(title)}</h3><table border="1"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table><br/>`;
}

export function exportWorkbook({ settings, services, socials, cases }) {
    const sheets = [
        table('Site settings', settings ? [settings] : [], [
            'firm_name',
            'lawyer_name',
            'credentials',
            'tagline',
            'about',
            'phone',
            'email',
            'address',
            'office_hours',
        ]),
        table('Services', services, ['title', 'description', 'highlights', 'sort_order']),
        table('Social links', socials, ['platform', 'handle', 'url', 'sort_order']),
        table('Cases', cases, [
            'title',
            'court',
            'case_number',
            'status',
            'hearing_date',
            ...CASE_SECTIONS.map((s) => s.key),
            'updated',
        ]),
    ].join('');

    const html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8" /></head><body>${sheets}</body></html>`;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `website-data-${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}
