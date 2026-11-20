import { isTask, type Task } from '@/domain/task';
import type { TaskRepository } from './taskRepository';

const STORAGE_KEY = 'ptm:tasks';

export class LocalStorageTaskRepository implements TaskRepository {
  constructor(private readonly key: string = STORAGE_KEY) {}

  async list(): Promise<Task[]> {
    return this.read();
  }

  async create(task: Task): Promise<void> {
    this.write([...this.read(), task]);
  }

  async update(task: Task): Promise<void> {
    const tasks = this.read();
    if (!tasks.some((t) => t.id === task.id)) throw new Error(`Task ${task.id} not found`);
    this.write(tasks.map((t) => (t.id === task.id ? task : t)));
  }

  async remove(id: string): Promise<void> {
    this.write(this.read().filter((t) => t.id !== id));
  }

  private read(): Task[] {
    const raw = localStorage.getItem(this.key);
    if (raw === null) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every(isTask)) return parsed;
    } catch {
      // fall through to recovery below
    }
    // Back up the bad blob so the next write doesn't silently destroy recoverable data.
    console.warn(`[LocalStorageTaskRepository] Corrupted data in "${this.key}"; starting empty.`);
    localStorage.setItem(`${this.key}:corrupt-backup`, raw);
    localStorage.removeItem(this.key);
    return [];
  }

  private write(tasks: Task[]): void {
    localStorage.setItem(this.key, JSON.stringify(tasks));
  }
}
