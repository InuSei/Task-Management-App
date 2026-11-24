'use client';

import { useState, type FormEvent } from 'react';
import { Trash2 } from 'lucide-react';
import type { Personnel } from '@/domain/personnel';
import {
  isValidTitle, PRIORITY_LABELS, STATUS_LABELS, TASK_PRIORITIES, TASK_STATUSES, TITLE_MAX_LENGTH,
  type Task, type TaskPatch,
} from '@/domain/task';
import { dueDateKey } from '@/domain/taskGroups';
import { Field, inputClass } from '@/components/ui/Field';
import { PanelHeader } from '@/components/ui/PanelHeader';
import { Select } from '@/components/ui/Select';
import { AssigneeSelect } from '@/components/personnel/AssigneeSelect';
import { WeekSelect } from '@/components/personnel/WeekSelect';
import { BlockerField } from './BlockerField';
import { CollaboratorPicker } from './CollaboratorPicker';
import { SubtaskList } from './SubtaskList';

interface TaskEditFormProps {
  task: Task;
  people: readonly Personnel[];
  weeks: readonly string[];
  onUpdate: (patch: TaskPatch) => void;
  onDelete: () => void;
  onClose: () => void;
}

/** Text fields save on blur; selects and the date save on change. */
export function TaskEditForm({ task, people, weeks, onUpdate, onDelete, onClose }: TaskEditFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const tooLong = title.trim().length > TITLE_MAX_LENGTH;

  function commitTitle() {
    if (!isValidTitle(title)) return setTitle(task.title); // invalid edit: revert to saved title
    if (title.trim() !== task.title) onUpdate({ title });
  }

  function commitDescription() {
    if (description !== (task.description ?? '')) onUpdate({ description });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onClose(); // closing blurs the active field, which saves it
  }

  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"?`)) onDelete();
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4 overflow-y-auto p-5">
      <PanelHeader title="Task details" onClose={onClose} />
      <Field label={tooLong ? `Title (${title.trim().length}/${TITLE_MAX_LENGTH})` : 'Title'}>
        <textarea
          rows={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault(); // titles are single-line; Enter saves instead
            e.currentTarget.blur();
          }}
          aria-invalid={tooLong}
          className={`${inputClass} resize-none break-words ${tooLong ? 'border-danger' : ''}`}
        />
      </Field>
      <Field label="Description">
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={commitDescription}
          className={`${inputClass} resize-y`}
        />
      </Field>
      <SubtaskList subtasks={task.subtasks} onChange={(subtasks) => onUpdate({ subtasks })} />
      <BlockerField blocker={task.blocker} onSave={(blocker) => onUpdate({ blocker })} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Status">
          <Select value={task.status} options={TASK_STATUSES} labels={STATUS_LABELS} onChange={(status) => onUpdate({ status })} />
        </Field>
        <Field label="Priority">
          <Select value={task.priority} options={TASK_PRIORITIES} labels={PRIORITY_LABELS} onChange={(priority) => onUpdate({ priority })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Assignee">
          <AssigneeSelect people={people} value={task.assigneeId} onChange={(assigneeId) => onUpdate({ assigneeId })} />
        </Field>
        <Field label="Week">
          <WeekSelect weeks={weeks} value={task.weekLabel ?? ''} onChange={(weekLabel) => onUpdate({ weekLabel })} />
        </Field>
      </div>
      <CollaboratorPicker
        people={people}
        assigneeId={task.assigneeId}
        value={task.collaboratorIds}
        onChange={(collaboratorIds) => onUpdate({ collaboratorIds })}
      />
      <Field label="Deadline">
        <input
          type="date"
          value={dueDateKey(task.dueDate) ?? ''}
          onChange={(e) => onUpdate({ dueDate: e.target.value || null })}
          className={inputClass}
        />
      </Field>
      <footer className="mt-auto flex justify-between">
        <button type="button" onClick={handleDelete} className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-danger hover:bg-danger/10">
          <Trash2 className="size-4" aria-hidden /> Delete
        </button>
        <button type="submit" className="rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-on-accent hover:bg-accent-hover">
          Save
        </button>
      </footer>
    </form>
  );
}
