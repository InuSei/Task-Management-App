import { UserPlus } from 'lucide-react';

export function NoTeamPrompt({ onManageTeam }: { onManageTeam: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-line p-4 text-sm">
      <p className="text-muted">No team members yet. Add people to start allocating tasks.</p>
      <button
        type="button"
        onClick={onManageTeam}
        className="flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 font-medium text-on-accent hover:bg-accent-hover"
      >
        <UserPlus className="size-4" aria-hidden /> Add team members
      </button>
    </div>
  );
}
