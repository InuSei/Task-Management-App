import { isWeekContext, type WeekContext } from '@/domain/week';
import { requestJson } from './apiClient';
import { loadWeeks, saveWeeks } from './preferencesStore';

/** The week list is shared data: tasks reference its labels. */
export interface WeekRepository {
  load(): Promise<WeekContext>;
  save(weeks: WeekContext): Promise<void>;
}

export const localWeekRepository: WeekRepository = {
  load: async () => loadWeeks(),
  save: async (weeks) => saveWeeks(weeks),
};

export const apiWeekRepository: WeekRepository = {
  async load() {
    const data = await requestJson('/api/weeks');
    if (!isWeekContext(data)) throw new Error('Unexpected data from /api/weeks');
    return data;
  },
  async save(weeks) {
    await requestJson('/api/weeks', 'PUT', weeks);
  },
};
