'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { isValidName, NAME_MAX_LENGTH, type PersonnelInput } from '@/domain/personnel';
import { inputClass } from '@/components/ui/Field';

interface PersonnelFormProps {
  departmentListId: string;
  onAdd: (input: PersonnelInput) => void;
}

export function PersonnelForm({ departmentListId, onAdd }: PersonnelFormProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidName(name)) return;
    onAdd({ name, department });
    setName('');
    setDepartment('');
    nameRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <input
        ref={nameRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        aria-label="Name"
        maxLength={NAME_MAX_LENGTH}
        className={`${inputClass} min-w-32 flex-1`}
      />
      <input
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        placeholder="Department"
        aria-label="Department"
        list={departmentListId}
        className={`${inputClass} min-w-32 flex-1`}
      />
      <button
        type="submit"
        disabled={!isValidName(name)}
        className="flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-on-accent hover:bg-accent-hover disabled:opacity-50"
      >
        <Plus className="size-4" aria-hidden /> Add
      </button>
    </form>
  );
}
