import { useCallback, useEffect, useRef, useState } from 'react';

// Shared in-memory cache so switching between admin pages is instant.
// Each page shows the last data it had straight away and refreshes quietly in the background.
const cache = new Map();

export const clearResourceCache = () => cache.clear();

/**
 * @param {string} key      cache key, e.g. 'products'
 * @param {Function} loader async () => data
 * @returns {{ data, setData, loading, refreshing, error, reload }}
 *   loading    true only when there is nothing to show yet
 *   refreshing true while a background refresh runs
 *   setData    update the list in place after a save, without refetching
 */
const useCachedResource = (key, loader) => {
    const [data, setDataState] = useState(() => (cache.has(key) ? cache.get(key) : null));
    const [loading, setLoading] = useState(!cache.has(key));
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const loaderRef = useRef(loader);
    loaderRef.current = loader;

    const setData = useCallback((updater) => {
        setDataState((current) => {
            const next = typeof updater === 'function' ? updater(current) : updater;
            cache.set(key, next);
            return next;
        });
    }, [key]);

    const reload = useCallback(async () => {
        setRefreshing(true);
        try {
            const fresh = await loaderRef.current();
            cache.set(key, fresh);
            setDataState(fresh);
            setError('');
        } catch (err) {
            if (err.status !== 401) setError(err.message || 'Could not load data.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [key]);

    useEffect(() => { reload(); }, [reload]);

    return { data, setData, loading, refreshing, error, reload };
};

export default useCachedResource;
