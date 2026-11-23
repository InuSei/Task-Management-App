// Kept free of runtime imports so `npm run check` can execute it directly with Node.
export interface Personnel {
  id: string;
  name: string;
  department: string;
  createdAt: string;
}

export interface PersonnelInput {
  name: string;
  department: string;
}

export type PersonnelPatch = Partial<PersonnelInput>;

export const NAME_MAX_LENGTH = 80;

export function isValidName(name: string): boolean {
  const length = name.trim().length;
  return length > 0 && length <= NAME_MAX_LENGTH;
}

function assertValidName(name: string): void {
  if (!isValidName(name)) throw new Error(`Name must be 1–${NAME_MAX_LENGTH} characters`);
}

export function createPersonnel(input: PersonnelInput, now = new Date()): Personnel {
  assertValidName(input.name);
  return {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    department: input.department.trim(),
    createdAt: now.toISOString(),
  };
}

export function applyPersonnelPatch(person: Personnel, patch: PersonnelPatch): Personnel {
  if (patch.name !== undefined) assertValidName(patch.name);
  return {
    ...person,
    ...(patch.name !== undefined && { name: patch.name.trim() }),
    ...(patch.department !== undefined && { department: patch.department.trim() }),
  };
}

/** Distinct, sorted department names, used as free-text suggestions. */
export function departmentsOf(people: readonly Personnel[]): string[] {
  return [...new Set(people.map((p) => p.department).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function isPersonnel(value: unknown): value is Personnel {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.department === 'string' &&
    typeof v.createdAt === 'string'
  );
}
