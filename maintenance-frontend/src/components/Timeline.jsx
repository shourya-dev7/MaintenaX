import {
  BadgeCheck,
  CircleCheck,
  ClipboardPlus,
  UserCheck,
  UserRoundPlus,
  Wrench,
} from "lucide-react";

const eventIcons = {
  "Request created": ClipboardPlus,
  "Technician assigned": UserRoundPlus,
  "Technician accepted": UserCheck,
  "Work started": Wrench,
  "Work completed": CircleCheck,
  "Supervisor verified": BadgeCheck,
};

function Timeline({ events = [] }) {
  return (
    <ol aria-label="Maintenance request timeline" className="space-y-0">
      {events.map((event, index) => {
        const {
          type,
          timestamp,
          technicianName,
          message,
          status,
        } = event;

        const titleMap = {
          assignment_created: "Technician Assigned",
          assignment_changed: "Assignment Changed",
          technician_dropped: "Technician Unavailable",
          part_unavailable: "Part Unavailable",
          sla_warning: "SLA Warning",
          job_completed: "Work Completed",
        };

        const title = titleMap[type] ?? type;
        const responsiblePerson = technicianName;
        const description = message;

        const Icon = eventIcons[title] ?? CircleCheck;
        const isLast = index === events.length - 1;

        return (
          <li key={`${title}-${timestamp}-${index}`} className="relative flex gap-4">
            <div className="flex w-9 shrink-0 flex-col items-center">
              <span className="z-10 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
              </span>
              {!isLast && <span className="w-px flex-1 bg-slate-200" />}
            </div>

            <div className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  {title}
                </h3>
                <time className="text-xs text-slate-500">{timestamp}</time>
              </div>
              {responsiblePerson && (
                <p className="mt-1 text-xs font-medium text-slate-600">
                  {responsiblePerson}
                </p>
              )}
              {description && (
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default Timeline;