import {
  CalendarDays,
  MapPin,
  UserRound,
  Tag,
  Building2,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const priorityStyles = {
  High: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  Medium: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Low: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  Urgent: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

function RequestCard({
  requestId,
  id,
  title,
  location,
  priority,
  technician,
  assignedTechnician,
  status,
  createdDate,
  category,
  requester,
  onClick,
}) {
  const displayId = requestId ?? id;
  const displayTechnician = assignedTechnician ?? technician;
  const priorityClassName =
    priorityStyles[priority] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  return (
    <article
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {displayId}
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
        {category && (
          <span className="inline-flex items-center gap-1.5">
            <Tag
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500"
              strokeWidth={1.8}
            />
            {category}
          </span>
        )}

        {requester && (
          <span className="inline-flex items-center gap-1.5">
            <Building2
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500"
              strokeWidth={1.8}
            />
            {requester}
          </span>
        )}
        {location && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500"
              strokeWidth={1.8}
            />
            {location}
          </span>
        )}
        {displayTechnician && (
          <span className="inline-flex items-center gap-1.5">
            <UserRound
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500"
              strokeWidth={1.8}
            />
            {displayTechnician}
          </span>
        )}
        {createdDate && (
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500"
              strokeWidth={1.8}
            />
            {createdDate}
          </span>
        )}
      </div>

      {priority && (
        <div className="mt-4 border-t border-slate-100 pt-3 transition-colors duration-200 dark:border-slate-800">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${priorityClassName}`}
          >
            {priority} priority
          </span>
        </div>
      )}
    </article>
  );
}

export default RequestCard;