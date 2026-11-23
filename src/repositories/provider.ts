import { isPersonnel } from '@/domain/personnel';
import { isTask } from '@/domain/task';
import { ApiRepository } from './apiRepo';
import { LocalStoragePersonnelRepository } from './localPersonnelRepo';
import { LocalStorageTaskRepository } from './localTaskRepo';
import type { PersonnelRepository } from './personnelRepository';
import type { TaskRepository } from './taskRepository';
import { apiWeekRepository, localWeekRepository, type WeekRepository } from './weekRepository';

// The single swap point for persistence (spec §5). Default: shared MongoDB through /api.
// NEXT_PUBLIC_STORAGE=local keeps everything in this browser only (no database needed).
const browserOnly = process.env.NEXT_PUBLIC_STORAGE === 'local';

export const taskRepository: TaskRepository = browserOnly
  ? new LocalStorageTaskRepository()
  : new ApiRepository('/api/tasks', isTask);

export const personnelRepository: PersonnelRepository = browserOnly
  ? new LocalStoragePersonnelRepository()
  : new ApiRepository('/api/personnel', isPersonnel);

export const weekRepository: WeekRepository = browserOnly ? localWeekRepository : apiWeekRepository;
