'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { isValidName, NAME_MAX_LENGTH, type Personnel, type PersonnelPatch } from '@/domain/personnel';
import { inputClass } from '@/components/ui/Field';

interface PersonnelRowProps {
  person: Personnel;
  departmentListId: string;
  onUpdate: (patch: PersonnelPatch) => void;
  onRemove: () => void;
}

/** Inline edit; fields save on blur, like the task drawer. */
export function PersonnelRow({ person, departmentListId, onUpdate, onRemove }: PersonnelRowProps) {
  const [name, setName] = useState(person.name);
  const [department, setDepartment] = useState(person.department);

  function commitName() {
    if (!isValidName(name)) return setName(person.name); // invalid edit: revert to saved name
    if (name.trim() !== person.name) onUpdate({ name });
  }

  function commitDepartment() {
    if (department.trim() !== person.department) onUpdate({ department });
  }

  function handleRemove() {
    if (window.confirm(`Remove ${person.name}? Their tasks will become unassigned.`)) onRemove();
  }

  return (
    <li className="flex items-center gap-2 py-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={commitName}
        aria-label={`Name of ${person.name}`}
        maxLength={NAME_MAX_LENGTH}
        className={`${inputClass} min-w-0 flex-1`}
      />
      <input
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        onBlur={commitDepartment}
        aria-label={`Department of ${person.name}`}
        placeholder="Department"
        list={departmentListId}
        className={`${inputClass} min-w-0 flex-1`}
      />
      <button
        type="button"
        onClick={handleRemove}
        aria-label={`Remove ${person.name}`}
        className="rounded p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </li>
  );
}
