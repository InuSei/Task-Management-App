import { requestJson } from './apiClient';
import type { Repository } from './repository';

/** Shared storage through the app's own /api routes (MongoDB on the server). */
export class ApiRepository<T extends { id: string }> implements Repository<T> {
  constructor(
    private readonly baseUrl: string,
    private readonly isItem: (value: unknown) => value is T,
  ) {}

  async list(): Promise<T[]> {
    const data = await requestJson(this.baseUrl);
    if (!Array.isArray(data) || !data.every(this.isItem)) throw new Error(`Unexpected data from ${this.baseUrl}`);
    return data;
  }

  async create(item: T): Promise<void> {
    await requestJson(this.baseUrl, 'POST', item);
  }

  async update(item: T): Promise<void> {
    await requestJson(this.itemUrl(item.id), 'PUT', item);
  }

  async remove(id: string): Promise<void> {
    await requestJson(this.itemUrl(id), 'DELETE');
  }

  private itemUrl(id: string): string {
    return `${this.baseUrl}/${encodeURIComponent(id)}`;
  }
}
