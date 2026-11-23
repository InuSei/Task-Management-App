import { roleColorOf, type DepartmentColors } from '@/domain/roleColor';

/** Department label in its department colour (data-role-color scopes the CSS variable). */
export function RoleBadge({ department, colors }: { department: string; colors: DepartmentColors }) {
  return (
    <span
      data-role-color={roleColorOf(department, colors)}
      title={department}
      className="max-w-full truncate rounded-full bg-role/12 px-2 py-0.5 text-xs font-medium text-role"
    >
      {department}
    </span>
  );
}
