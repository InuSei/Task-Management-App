import { ROLE_COLORS, roleColorOf, setRoleColor, type DepartmentColors } from '@/domain/roleColor';
import { RoleBadge } from './RoleBadge';

interface RoleColorPickerProps {
  departments: readonly string[];
  colors: DepartmentColors;
  onChange: (colors: DepartmentColors) => void;
}

/** One swatch row per department; the choice is shared with everyone. */
export function RoleColorPicker({ departments, colors, onChange }: RoleColorPickerProps) {
  if (departments.length === 0) return null;

  return (
    <section className="space-y-2 border-t border-line pt-4">
      <h3 className="text-sm text-muted">Department colors</h3>
      <ul className="space-y-2">
        {departments.map((department) => {
          const current = roleColorOf(department, colors);
          return (
            <li key={department} className="flex flex-wrap items-center justify-between gap-2">
              <RoleBadge department={department} colors={colors} />
              <div role="group" aria-label={`Color for ${department}`} className="flex gap-1.5">
                {ROLE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    data-role-color={color}
                    aria-label={color}
                    title={color}
                    aria-pressed={current === color}
                    onClick={() => onChange(setRoleColor(colors, department, color))}
                    className="size-5 rounded-full bg-role ring-offset-2 ring-offset-surface aria-pressed:ring-2 aria-pressed:ring-fg"
                  />
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
