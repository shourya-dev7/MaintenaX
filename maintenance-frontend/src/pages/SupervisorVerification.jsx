import { useLayoutEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  MapPin,
  RotateCcw,
  ShieldCheck,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import Timeline from "../components/Timeline";

const THEME_STORAGE_KEY = "maintenax-theme";

const workflowEvents = [
  {
    title: "Technician assigned",
    timestamp: "Stage 1",
    responsiblePerson: "Maintenance team",
  },
  {
    title: "Work started",
    timestamp: "Stage 2",
    responsiblePerson: "Assigned technician",
  },
  {
    title: "Work completed",
    timestamp: "Stage 3",
    responsiblePerson: "Assigned technician",
  },
  {
    title: "Supervisor verified",
    timestamp: "Stage 4",
    responsiblePerson: "Supervisor",
  },
  {
    title: "Supervisor verified",
    timestamp: "Stage 5",
    responsiblePerson: "Request closed",
    description: "Request marked as completed.",
  },
];

const priorityStyles = {
  Low: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  Medium: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  High: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  Critical: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

function SupervisorVerification({
  records,
  onRecordStatusChange,
  onNavigate,
  onBack,
  onLogout,
  userName,
}) {
  const [selectedRequestId, setSelectedRequestId] = useState("REQ-1024");
  const [message, setMessage] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const selectedRecord = records.find(
    (record) => record.requestId === selectedRequestId,
  );
  const pendingRecords = records.filter(
    (record) => record.status === "Pending Verification",
  );
  const verifiedFromQueue = records.filter(
    (record) => record.status === "Completed",
  ).length;
  const reworkFromQueue = records.filter(
    (record) => record.status === "Needs Rework",
  ).length;
  const pendingCount = pendingRecords.length;

  const statistics = useMemo(
    () => [
      {
        title: "Pending Verification",
        value: pendingCount,
        icon: ClipboardCheck,
        description: "awaiting your review",
      },
      {
        title: "Verified Today",
        value: 5 + verifiedFromQueue,
        icon: CheckCircle2,
        description: "work approved",
      },
      {
        title: "Needs Rework",
        value: 1 + reworkFromQueue,
        icon: RotateCcw,
        description: "returned to technicians",
      },
      {
        title: "Total Completed",
        value: 8 + verifiedFromQueue,
        icon: BadgeCheck,
        description: "maintenance requests",
      },
    ],
    [pendingCount, reworkFromQueue, verifiedFromQueue],
  );

  function toggleTheme() {
    const nextTheme = !isDarkMode;
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      nextTheme ? "dark" : "light",
    );
    setIsDarkMode(nextTheme);
  }

  function updateRecordStatus(requestId, status) {
    onRecordStatusChange(requestId, status);
    setSelectedRequestId(requestId);
    setMessage(
      status === "Completed"
        ? "Work verified successfully."
        : "Work sent back for rework.",
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 [&_*]:transition-colors [&_*]:duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed inset-y-0 left-0 z-20">
        <Sidebar
          activePage="supervisor-verification"
          onNavigate={onNavigate}
          onLogout={onLogout}
          userName={userName}
        />
      </div>

      <div className="ml-64 min-h-screen max-sm:ml-16">
        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onLogout={onLogout}
          userName={userName}
          pageTitle="Supervisor Verification"
          pageSubtitle="Review completed maintenance work before final approval"
        />

        <main className="mx-auto max-w-[1600px] space-y-8 p-8 max-lg:p-6 max-sm:p-4">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Supervisor Verification
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review completed maintenance work before final approval
            </p>
          </div>

          <section aria-label="Verification summary">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statistics.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
          </section>

          {message && (
            <p
              role="status"
              className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                message === "Work verified successfully."
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
                  : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300"
              }`}
            >
              {message}
            </p>
          )}

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
            <section aria-labelledby="pending-verification-heading">
              <div className="mb-4">
                <h2
                  id="pending-verification-heading"
                  className="text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  Pending Verification
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Select a completed task to review the technician&apos;s work.
                </p>
              </div>

              <div className="space-y-4">
                {records.map((record) => {
                  const isPending =
                    record.status === "Pending Verification";
                  const isSelected = record.requestId === selectedRequestId;
                  const priorityClass =
                    priorityStyles[record.priority] ??
                    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

                  return (
                    <article
                      key={record.requestId}
                      className={`rounded-xl border bg-white p-5 shadow-sm transition-colors duration-200 dark:bg-slate-900 ${
                        isSelected
                          ? "border-blue-300 ring-2 ring-blue-500/10 dark:border-blue-800"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRequestId(record.requestId);
                          setMessage(null);
                        }}
                        className="w-full text-left"
                        aria-pressed={isSelected}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                              {record.requestId}
                            </p>
                            <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                              {record.title}
                            </h3>
                          </div>
                          <StatusBadge status={record.status} />
                        </div>
                      </button>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin aria-hidden="true" className="h-4 w-4" />
                          {record.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Wrench aria-hidden="true" className="h-4 w-4" />
                          {record.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <UserRound aria-hidden="true" className="h-4 w-4" />
                          {record.technician}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                          {record.completedDate}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${priorityClass}`}
                        >
                          {record.priority} priority
                        </span>
                        {isPending ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateRecordStatus(
                                  record.requestId,
                                  "Completed",
                                )
                              }
                              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/25"
                            >
                              <Check
                                aria-hidden="true"
                                className="h-4 w-4"
                              />
                              Verify Work
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateRecordStatus(
                                  record.requestId,
                                  "Needs Rework",
                                )
                              }
                              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-200 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-950 dark:focus:ring-amber-900"
                            >
                              <X aria-hidden="true" className="h-4 w-4" />
                              Reject / Needs Rework
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                              record.status === "Needs Rework"
                                ? "text-amber-700 dark:text-amber-300"
                                : "text-emerald-700 dark:text-emerald-300"
                            }`}
                          >
                            {record.status === "Needs Rework" ? (
                              <AlertTriangle
                                aria-hidden="true"
                                className="h-4 w-4"
                              />
                            ) : (
                              <CheckCircle2
                              aria-hidden="true"
                              className="h-4 w-4"
                              />
                            )}
                            {record.status === "Needs Rework"
                              ? "Sent for rework"
                              : "Verified"}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 rounded-lg bg-slate-50 p-3.5 dark:bg-slate-800/70">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Completion notes
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {record.completionNotes}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="space-y-6">
              {selectedRecord && (
                <section
                  aria-labelledby="review-panel-heading"
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <h2
                        id="review-panel-heading"
                        className="text-base font-semibold text-slate-900 dark:text-slate-100"
                      >
                        Review work
                      </h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Confirm the submitted maintenance details.
                      </p>
                    </div>
                    <StatusBadge status={selectedRecord.status} />
                  </div>

                  <dl className="space-y-4">
                    <div>
                      <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Request ID
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {selectedRecord.requestId}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Maintenance title
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {selectedRecord.title}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Technician
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                          {selectedRecord.technician}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Priority
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                          {selectedRecord.priority}
                        </dd>
                      </div>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Location
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                        {selectedRecord.location}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Completion notes
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {selectedRecord.completionNotes}
                      </dd>
                    </div>
                  </dl>

                  <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                    {[
                      "Work completed",
                      "Technician completion notes provided",
                      "Maintenance location recorded",
                      "Ready for supervisor approval",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          <Check aria-hidden="true" className="h-3.5 w-3.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {selectedRecord.status === "Pending Verification" ? (
                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateRecordStatus(
                            selectedRecord.requestId,
                            "Completed",
                          )
                        }
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/25"
                      >
                        <Check aria-hidden="true" className="h-4 w-4" />
                        Verify Work
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateRecordStatus(
                            selectedRecord.requestId,
                            "Needs Rework",
                          )
                        }
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-200 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-950 dark:focus:ring-amber-900"
                      >
                        <AlertTriangle
                          aria-hidden="true"
                          className="h-4 w-4"
                        />
                        Reject / Needs Rework
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`mt-5 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                        selectedRecord.status === "Needs Rework"
                          ? "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      }`}
                    >
                      {selectedRecord.status === "Needs Rework" ? (
                        <AlertTriangle
                          aria-hidden="true"
                          className="h-4 w-4"
                        />
                      ) : (
                        <CheckCircle2
                          aria-hidden="true"
                          className="h-4 w-4"
                        />
                      )}
                      {selectedRecord.status === "Needs Rework"
                        ? "Sent for rework"
                        : "Work verified"}
                    </div>
                  )}
                </section>
              )}

              <section className="rounded-xl border border-blue-100 bg-blue-50/70 p-5 transition-colors duration-200 dark:border-blue-900/70 dark:bg-blue-950/40">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-800 dark:text-blue-300">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                  Verification workflow
                </div>
                <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
                  <Timeline events={workflowEvents} />
                </div>
                <p className="mt-5 border-t border-blue-100 pt-4 text-sm leading-relaxed text-slate-600 dark:border-blue-900/70 dark:text-slate-300">
                  Supervisor verification ensures completed maintenance work
                  is reviewed before the request is officially closed.
                </p>
              </section>

              <div className="flex items-center gap-2 px-1 text-xs text-slate-400 dark:text-slate-500">
                <Building2 aria-hidden="true" className="h-3.5 w-3.5" />
                Facilities operations · Supervisor workspace
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SupervisorVerification;
