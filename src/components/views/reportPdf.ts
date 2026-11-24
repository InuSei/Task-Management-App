import { jsPDF } from 'jspdf';
import { autoTable, type RowInput } from 'jspdf-autotable';
import { REPORT_SECTIONS, sectionOf, type WeeklyReport } from '@/domain/report';
import { subtaskCount, type Task } from '@/domain/task';
import { dueDateKey, formatDateKey, isOverdue } from '@/domain/taskGroups';

const SECTION_LABELS = Object.fromEntries(REPORT_SECTIONS.map((s) => [s.id, s.label]));
const DANGER: [number, number, number] = [176, 64, 56];

function taskRow(task: Task, label: string, today: string): RowInput {
  const due = dueDateKey(task.dueDate);
  const overdue = isOverdue(task, today);
  const blocker = task.status !== 'done' ? (task.blocker?.trim() ?? '') : '';
  const count = subtaskCount(task);
  // Helvetica has no checkbox glyphs, so sub-tasks use [x] / [ ].
  const subtasks = (task.subtasks ?? []).map((s) => `\n   ${s.done ? '[x]' : '[ ]'} ${s.title}`).join('');
  return [
    label,
    `${task.title}${count ? ` (${count})` : ''}${subtasks}`,
    { content: due ? `${overdue ? 'Overdue ' : ''}${formatDateKey(due)}` : '', styles: overdue ? { textColor: DANGER } : {} },
    { content: blocker, styles: { textColor: DANGER } },
  ];
}

const heading = (text: string, fill: number, size: number): RowInput => [
  { content: text, colSpan: 4, styles: { fontStyle: 'bold', fillColor: fill, fontSize: size } },
];

/** Builds the weekly report as a text PDF (selectable, small) and downloads it. */
// shortcut: built-in Helvetica only covers Latin text; embed a Unicode font if titles use other scripts or emoji.
export function downloadReportPdf(report: WeeklyReport, week: string, today: string): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const { counts } = report;

  doc.setFontSize(18).setFont('helvetica', 'bold').text(`Weekly report - ${week}`, 40, 50);
  doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(90);
  doc.text(`Generated ${formatDateKey(today, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 40, 68);
  doc.setTextColor(20).text(
    `Progress ${report.progress}%   Done ${counts.done}   In progress ${counts.inProgress}   ` +
      `Not started ${counts.todo}   Blocked ${counts.blocked}   Overdue ${counts.overdue}`,
    40,
    88,
  );

  const body: RowInput[] = [];
  for (const dept of report.departments) {
    body.push(heading(`${dept.department} - ${dept.progress}% done`, 225, 11));
    for (const { person, sections, progress } of dept.people) {
      body.push(heading(`${person.name} - ${progress}%`, 245, 10));
      const rows = REPORT_SECTIONS.flatMap(({ id }) => sections[id].map((t) => taskRow(t, SECTION_LABELS[id] ?? id, today)));
      body.push(...(rows.length ? rows : [[{ content: 'No tasks this week', colSpan: 4, styles: { textColor: 120 } }]]));
    }
  }
  if (report.unassigned.length > 0) {
    body.push(heading(`Unassigned (${report.unassigned.length})`, 225, 11));
    for (const t of report.unassigned) {
      body.push(taskRow(t, SECTION_LABELS[sectionOf(t)] ?? '', today));
    }
  }

  autoTable(doc, {
    startY: 104,
    head: [['Status', 'Task', 'Due', 'Blocker']],
    body,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4, valign: 'top', lineColor: 220, textColor: 20 },
    headStyles: { fillColor: 60, textColor: 255 },
    columnStyles: { 0: { cellWidth: 70 }, 2: { cellWidth: 75 }, 3: { cellWidth: 170 } },
    margin: { left: 40, right: 40 },
  });

  doc.save(`report-${week.replace(/[^\w-]+/g, '-')}.pdf`);
}
