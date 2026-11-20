'use client';

import { useCallback } from 'react';
import { applyPersonnelPatch, createPersonnel, type PersonnelInput, type PersonnelPatch } from '@/domain/personnel';
import type { PersonnelRepository } from '@/repositories/personnelRepository';
import { personnelRepository } from '@/repositories/provider';
import { useCollection } from './useCollection';

export function usePersonnel(repo: PersonnelRepository = personnelRepository) {
  const { items: people, loaded, create, update, remove } = useCollection(repo);

  const addPerson = useCallback((input: PersonnelInput) => create(createPersonnel(input)), [create]);

  const updatePerson = useCallback(
    (id: string, patch: PersonnelPatch) => {
      const current = people.find((p) => p.id === id);
      if (current) update(applyPersonnelPatch(current, patch));
    },
    [people, update],
  );

  return { people, loaded, addPerson, updatePerson, removePerson: remove };
}
