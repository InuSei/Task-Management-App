// Kept free of runtime imports so `npm run check` can execute it directly with Node.
// Colour values live in globals.css ([data-role-color=…]) so they follow the page theme.
export type RoleColor = 'clay' | 'slate' | 'sage' | 'ochre' | 'plum' | 'teal' | 'rose' | 'stone';

export const ROLE_COLORS: readonly RoleColor[] = ['clay', 'slate', 'sage', 'ochre', 'plum', 'teal', 'rose', 'stone'];

export interface DepartmentColor {
  department: string;
  color: RoleColor;
}

/** Stored as a list, not an object keyed by name: department names are free text and may contain "." or "$". */
export interface DepartmentColors {
  colors: DepartmentColor[];
}

export const DEFAULT_DEPARTMENT_COLORS: DepartmentColors = { colors: [] };
export const DEPARTMENT_COLORS_STORAGE_KEY = 'ptm:department-colors';

// "IT" and "it " are the same department.
const keyOf = (department: string) => department.trim().toLowerCase();

function hash(text: string): number {
  let h = 0;
  for (const char of text) h = (h * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
  return h;
}

/** The picked colour, or a stable default derived from the name so every device shows the same one. */
export function roleColorOf(department: string, settings: DepartmentColors): RoleColor {
  const key = keyOf(department);
  const picked = settings.colors.find((c) => keyOf(c.department) === key)?.color;
  return picked ?? ROLE_COLORS[hash(key) % ROLE_COLORS.length] ?? 'stone';
}

export function setRoleColor(settings: DepartmentColors, department: string, color: RoleColor): DepartmentColors {
  const key = keyOf(department);
  return {
    colors: [...settings.colors.filter((c) => keyOf(c.department) !== key), { department: department.trim(), color }],
  };
}

export function isDepartmentColors(value: unknown): value is DepartmentColors {
  if (typeof value !== 'object' || value === null) return false;
  const { colors } = value as Record<string, unknown>;
  return (
    Array.isArray(colors) &&
    colors.every((c: unknown) => {
      if (typeof c !== 'object' || c === null) return false;
      const entry = c as Record<string, unknown>;
      return typeof entry.department === 'string' && (ROLE_COLORS as readonly unknown[]).includes(entry.color);
    })
  );
}
