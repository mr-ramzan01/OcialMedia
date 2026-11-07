import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Infinite-scroll friendly pagination.
 *
 * `fetchPage(page)` must resolve with `{ items, total }`.
 * Re-runs from page 1 whenever `fetchPage` changes (wrap it in useCallback).
 * Safe under React StrictMode (the duplicate mount effect is ignored while a
 * request is in flight) and de-duplicates items by `_id`.
 */
export function usePaginatedList(fetchPage) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const nextPageRef = useRef(1);
  const inFlightRef = useRef(false);
  const fetchRef = useRef(fetchPage);

  const load = useCallback(async (page) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      const { items: newItems = [], total: newTotal = 0 } =
        await fetchRef.current(page);
      setItems((prev) => {
        if (page === 1) return newItems;
        const seen = new Set(prev.map((el) => el._id));
        return [...prev, ...newItems.filter((el) => !seen.has(el._id))];
      });
      setTotal(newTotal);
      nextPageRef.current = page + 1;
    } catch (error) {
      console.log(error, "error");
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRef.current = fetchPage;
    nextPageRef.current = 1;
    setIsLoading(true);
    load(1);
  }, [fetchPage, load]);

  const next = useCallback(() => load(nextPageRef.current), [load]);
  const reload = useCallback(() => {
    nextPageRef.current = 1;
    return load(1);
  }, [load]);

  return {
    items,
    total,
    isLoading,
    hasMore: items.length < total,
    next,
    reload,
    setItems,
  };
}
