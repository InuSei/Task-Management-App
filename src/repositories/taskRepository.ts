import type { Task } from '@/domain/task';

/** Persistence contract. UI and hooks depend only on this, never on a storage backend. */
export interface TaskRepository {
  list(): Promise<Task[]>;
  create(task: Task): Promise<void>;
  update(task: Task): Promise<void>;
  remove(id: string): Promise<void>;
}
