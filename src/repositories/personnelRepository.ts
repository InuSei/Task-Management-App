import type { Personnel } from '@/domain/personnel';
import type { Repository } from './repository';

export interface PersonnelRepository extends Repository<Personnel> {}
