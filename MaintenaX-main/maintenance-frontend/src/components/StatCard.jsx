import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

const trendStyles = {
  positive: {
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    Icon: ArrowUpRight,
    label: "increased",
  },
  negative: {
    className: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    Icon: ArrowDownRight,
    label: "decreased",
  },
  neutral: {
    className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    Icon: Minus,
    label: "unchanged",
  },
};

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendType = "neutral",
}) {
  const trendStyle = trendStyles[trendType] ?? trendStyles.neutral;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </h2>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </p>
        </div>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
          </div>
        )}
      </div>

      {(description || trend) && (
        <div className="mt-4 flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${trendStyle.className}`}
              aria-label={`${trend} ${trendStyle.label}`}
            >
              <trendStyle.Icon aria-hidden="true" className="h-3.5 w-3.5" />
              {trend}
            </span>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
      )}
    </article>
  );
}

export default StatCard;