import { isPersonnel, type Personnel } from '@/domain/personnel';
import { LocalStorageRepository } from './localStorageRepo';
import type { PersonnelRepository } from './personnelRepository';

export class LocalStoragePersonnelRepository
  extends LocalStorageRepository<Personnel>
  implements PersonnelRepository
{
  constructor(key = 'ptm:personnel') {
    super(key, isPersonnel);
  }
}
