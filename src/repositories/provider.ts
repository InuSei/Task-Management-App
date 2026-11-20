import { LocalStorageTaskRepository } from './localTaskRepo';
import type { TaskRepository } from './taskRepository';

// The single swap point for persistence (spec §5): change this line to switch backends.
export const taskRepository: TaskRepository = new LocalStorageTaskRepository();
