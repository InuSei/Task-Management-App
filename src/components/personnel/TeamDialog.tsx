'use client';

import { useId } from 'react';
import { departmentsOf, type Personnel, type PersonnelInput, type PersonnelPatch } from '@/domain/personnel';
import type { DepartmentColors } from '@/domain/roleColor';
import { PanelHeader } from '@/components/ui/PanelHeader';
import { SlideOver } from '@/components/ui/SlideOver';
import { PersonnelForm } from './PersonnelForm';
import { PersonnelRow } from './PersonnelRow';
import { RoleColorPicker } from './RoleColorPicker';

interface TeamDialogProps {
  open: boolean;
  people: readonly Personnel[];
  colors: DepartmentColors;
  onColorsChange: (colors: DepartmentColors) => void;
  onClose: () => void;
  onAdd: (input: PersonnelInput) => void;
  onUpdate: (id: string, patch: PersonnelPatch) => void;
  onRemove: (id: string) => void;
}

export function TeamDialog({ open, people, colors, onColorsChange, onClose, onAdd, onUpdate, onRemove }: TeamDialogProps) {
  const listId = useId();

  return (
    <SlideOver open={open} label="Manage team" onClose={onClose}>
      {(close) => (
        <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
          <PanelHeader title="Team" onClose={close} />
          <datalist id={listId}>
            {departmentsOf(people).map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
          <PersonnelForm departmentListId={listId} onAdd={onAdd} />
          {people.length === 0 ? (
            <p className="text-sm text-muted">No team members yet. Add someone above.</p>
          ) : (
            <ul className="divide-y divide-line">
              {people.map((person) => (
                <PersonnelRow
                  key={person.id}
                  person={person}
                  departmentListId={listId}
                  onUpdate={(patch) => onUpdate(person.id, patch)}
                  onRemove={() => onRemove(person.id)}
                />
              ))}
            </ul>
          )}
          <RoleColorPicker departments={departmentsOf(people)} colors={colors} onChange={onColorsChange} />
        </div>
      )}
    </SlideOver>
  );
}
