import { requestJson } from './apiClient';

/** One shared settings document (e.g. the week list, department colours). */
export interface SettingRepository<T> {
  load(): Promise<T>;
  save(value: T): Promise<void>;
}

export const localSetting = <T>(load: () => T, save: (value: T) => void): SettingRepository<T> => ({
  load: async () => load(),
  save: async (value) => save(value),
});

export const apiSetting = <T>(url: string, isValid: (value: unknown) => value is T): SettingRepository<T> => ({
  async load() {
    const data = await requestJson(url);
    if (!isValid(data)) throw new Error(`Unexpected data from ${url}`);
    return data;
  },
  async save(value) {
    await requestJson(url, 'PUT', value);
  },
});
