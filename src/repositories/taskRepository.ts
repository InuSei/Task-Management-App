import type { Task } from '@/domain/task';
import type { Repository } from './repository';

export interface TaskRepository extends Repository<Task> {}
