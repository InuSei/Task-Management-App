/** Persistence contract. UI and hooks depend only on repository interfaces, never on a storage backend. */
export interface Repository<T> {
  list(): Promise<T[]>;
  create(item: T): Promise<void>;
  update(item: T): Promise<void>;
  remove(id: string): Promise<void>;
}
