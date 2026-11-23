import { isTask, type Task } from '@/domain/task';
import { LocalStorageRepository } from './localStorageRepo';
import type { TaskRepository } from './taskRepository';

export class LocalStorageTaskRepository extends LocalStorageRepository<Task> implements TaskRepository {
  constructor(key = 'ptm:tasks') {
    super(key, isTask);
  }
}
