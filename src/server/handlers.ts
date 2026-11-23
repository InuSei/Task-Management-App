import { isPersonnel, isValidName, type Personnel } from '@/domain/personnel';
import { isTask, isValidTitle, type Task } from '@/domain/task';
import { collectionHandlers } from './collectionHandlers';

export const taskHandlers = collectionHandlers('tasks', (v): v is Task => isTask(v) && isValidTitle(v.title));
export const personnelHandlers = collectionHandlers(
  'personnel',
  (v): v is Personnel => isPersonnel(v) && isValidName(v.name),
);
