import type { Repository } from './repository';

/** A JSON array of validated items under one localStorage key. */
export class LocalStorageRepository<T extends { id: string }> implements Repository<T> {
  constructor(
    private readonly key: string,
    private readonly isItem: (value: unknown) => value is T,
  ) {}

  async list(): Promise<T[]> {
    return this.read();
  }

  async create(item: T): Promise<void> {
    this.write([...this.read(), item]);
  }

  async update(item: T): Promise<void> {
    const items = this.read();
    if (!items.some((i) => i.id === item.id)) throw new Error(`Item ${item.id} not found in "${this.key}"`);
    this.write(items.map((i) => (i.id === item.id ? item : i)));
  }

  async remove(id: string): Promise<void> {
    this.write(this.read().filter((i) => i.id !== id));
  }

  private read(): T[] {
    const raw = localStorage.getItem(this.key);
    if (raw === null) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every(this.isItem)) return parsed;
    } catch {
      // fall through to recovery below
    }
    // Back up the bad blob so the next write doesn't silently destroy recoverable data.
    console.warn(`[LocalStorageRepository] Corrupted data in "${this.key}"; starting empty.`);
    localStorage.setItem(`${this.key}:corrupt-backup`, raw);
    localStorage.removeItem(this.key);
    return [];
  }

  private write(items: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
  }
}
