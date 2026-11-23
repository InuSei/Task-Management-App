import { LocalStoragePersonnelRepository } from './localPersonnelRepo';
import { LocalStorageTaskRepository } from './localTaskRepo';
import type { PersonnelRepository } from './personnelRepository';
import type { TaskRepository } from './taskRepository';

// The single swap point for persistence (spec §5): change these lines to switch backends.
export const taskRepository: TaskRepository = new LocalStorageTaskRepository();
export const personnelRepository: PersonnelRepository = new LocalStoragePersonnelRepository();
