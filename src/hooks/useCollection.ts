'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Repository } from '@/repositories/repository';

/** Repository-backed list with optimistic updates; on a failed write, state is reloaded from the repository. */
export function useCollection<T extends { id: string }>(repo: Repository<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    setItems(await repo.list());
    setLoaded(true);
  }, [repo]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const run = useCallback(
    (optimistic: (prev: T[]) => T[], persist: () => Promise<void>) => {
      setItems(optimistic);
      persist().catch((error: unknown) => {
        console.error('[useCollection] Failed to save change; reloading.', error);
        void refresh();
      });
    },
    [refresh],
  );

  const create = useCallback((item: T) => run((prev) => [...prev, item], () => repo.create(item)), [run, repo]);

  const update = useCallback(
    (item: T) => run((prev) => prev.map((i) => (i.id === item.id ? item : i)), () => repo.update(item)),
    [run, repo],
  );

  const remove = useCallback(
    (id: string) => run((prev) => prev.filter((i) => i.id !== id), () => repo.remove(id)),
    [run, repo],
  );

  return { items, loaded, create, update, remove };
}
