import { useLayoutEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  MapPin,
  Sparkles,
  UserCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import Timeline from "../components/Timeline";

const THEME_STORAGE_KEY = "maintenax-theme";

const recommendations = [
  {
    id: "rahul-das",
    name: "Rahul Das",
    skill: "Mechanical",
    availability: "Available",
    location: "Facility 1",
    matchScore: 96,
    reason:
      "Strong skill match, currently available, and already located at Facility 1.",
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    skill: "Mechanical",
    availability: "Available",
    location: "Building B",
    matchScore: 87,
    reason:
      "Required mechanical skill available, but technician is farther from the maintenance location.",
  },
];

const workflowEvents = [
  {
    title: "Request created",
    timestamp: "Today · 8:42 AM",
    responsiblePerson: "Facilities Department",
  },
  {
    title: "Technician assigned",
    timestamp: "Today · 8:50 AM",
    responsiblePerson: "Arun Kumar",
  },
  {
    title: "Conflict detected",
    timestamp: "Today · 9:10 AM",
    responsiblePerson: "MaintenaX availability monitor",
    description: "Assigned technician is currently unavailable.",
  },
  {
    title: "Replacement recommended",
    timestamp: "Today · 9:11 AM",
    responsiblePerson: "MaintenaX smart matching",
  },
];

function Reassignment({
  reassignment,
  onReassignmentChange,
  onNavigate,
  onBack,
  onLogout,
  userName,
}) {
  const { selectedTechnicianId, assignedTechnician } = reassignment;
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

  const selectedTechnician = recommendations.find(
    (technician) => technician.id === selectedTechnicianId,
  );
  const hasReassigned = assignedTechnician !== null;
  const currentTechnician = assignedTechnician ?? {
    name: "Arun Kumar",
    availability: "Unavailable",
    location: "Facility 1",
  };

  const statistics = useMemo(
    () => [
      {
        title: "Active Conflicts",
        value: hasReassigned ? 0 : 1,
        icon: AlertTriangle,
        description: hasReassigned ? "all conflicts resolved" : "needs attention",
      },
      {
        title: "Recommended Replacements",
        value: hasReassigned ? 0 : recommendations.length,
        icon: UserCheck,
        description: hasReassigned ? "recommendation accepted" : "available matches",
      },
      {
        title: "Reassigned Today",
        value: hasReassigned ? 4 : 3,
        icon: CheckCircle2,
        description: hasReassigned ? "including this request" : "requests reassigned",
      },
    ],
    [hasReassigned],
  );

  const timeline = [
    ...workflowEvents,
    {
      title: "Technician reassigned",
      timestamp: hasReassigned ? "Today · 9:14 AM" : "Pending confirmation",
      responsiblePerson: hasReassigned
        ? assignedTechnician.name
        : selectedTechnician
          ? `${selectedTechnician.name} selected · awaiting confirmation`
          : "Awaiting technician selection",
    },
  ];

  function toggleTheme() {
    const nextTheme = !isDarkMode;
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      nextTheme ? "dark" : "light",
    );
    setIsDarkMode(nextTheme);
  }

  function confirmReassignment() {
    if (!selectedTechnician || hasReassigned) return;
    onReassignmentChange((current) => ({
      ...current,
      assignedTechnician: selectedTechnician,
    }));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 [&_*]:transition-colors [&_*]:duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed inset-y-0 left-0 z-20">
        <Sidebar
          activePage="reassignment"
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
          pageTitle="Conflict & Reassignment"
          pageSubtitle="Resolve technician availability conflicts and keep maintenance work moving"
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
              Conflict &amp; Reassignment
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Resolve technician availability conflicts and keep maintenance
              work moving
            </p>
          </div>

          <section aria-label="Reassignment summary">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {statistics.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
          </section>

          {hasReassigned && (
            <p
              role="status"
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
            >
              Request successfully reassigned to {assignedTechnician.name}.
            </p>
          )}

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
            <div className="space-y-6">
              <section
                aria-labelledby="conflict-alert-heading"
                className={`rounded-2xl border p-5 shadow-sm transition-colors duration-200 sm:p-6 ${
                  hasReassigned
                    ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/30"
                    : "border-rose-200 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/30"
                }`}
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        hasReassigned
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {hasReassigned ? (
                        <CheckCircle2
                          aria-hidden="true"
                          className="h-5 w-5"
                        />
                      ) : (
                        <AlertTriangle
                          aria-hidden="true"
                          className="h-5 w-5"
                        />
                      )}
                    </span>
                    <div>
                      <h2
                        id="conflict-alert-heading"
                        className="text-base font-semibold text-slate-900 dark:text-slate-100"
                      >
                        {hasReassigned
                          ? "Conflict resolved"
                          : "Technician availability conflict"}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {hasReassigned
                          ? `Request successfully reassigned to ${assignedTechnician.name}.`
                          : "Assigned technician is currently unavailable and cannot continue this maintenance task."}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge
                      status={hasReassigned ? "Assigned" : "Conflict"}
                    />
                    {!hasReassigned && (
                      <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        Conflict Detected
                      </span>
                    )}
                  </div>
                </div>

                <dl className="mt-5 grid gap-x-6 gap-y-4 border-t border-rose-200/70 pt-5 dark:border-rose-900/70 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Request
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      REQ-1030
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Title
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Generator Maintenance
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Location
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Facility 1
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Category
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Mechanical
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Priority
                    </dt>
                    <dd className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      High
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Original technician
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Arun Kumar
                    </dd>
                  </div>
                </dl>
              </section>

              <section aria-labelledby="recommendations-heading">
                <div className="mb-4 flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <Sparkles aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <div>
                    <h2
                      id="recommendations-heading"
                      className="text-base font-semibold text-slate-900 dark:text-slate-100"
                    >
                      Recommended Replacements
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Select the best available match for this request.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {recommendations.map((technician) => {
                    const isSelected =
                      selectedTechnicianId === technician.id;

                    return (
                      <article
                        key={technician.id}
                        className={`rounded-xl border bg-white p-5 shadow-sm transition-colors duration-200 dark:bg-slate-900 ${
                          isSelected
                            ? "border-blue-400 ring-2 ring-blue-500/15 dark:border-blue-600"
                            : "border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              {technician.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")}
                            </span>
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {technician.name}
                              </h3>
                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                {technician.skill} technician
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1.5 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {technician.matchScore}%
                            <span className="ml-1 text-[10px] font-medium">
                              match
                            </span>
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
                          <span className="inline-flex items-center gap-1.5">
                            <Wrench
                              aria-hidden="true"
                              className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500"
                            />
                            {technician.skill}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2
                              aria-hidden="true"
                              className="h-3.5 w-3.5"
                            />
                            {technician.availability}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin
                              aria-hidden="true"
                              className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500"
                            />
                            {technician.location}
                          </span>
                        </div>

                        <p className="mt-4 min-h-10 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                          {technician.reason}
                        </p>

                        <button
                          type="button"
                          disabled={hasReassigned}
                          onClick={() =>
                            onReassignmentChange((current) => ({
                              ...current,
                              selectedTechnicianId: technician.id,
                            }))
                          }
                          className={`mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-4 ${
                            hasReassigned
                              ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                              : isSelected
                                ? "bg-blue-700 text-white focus:ring-blue-500/25"
                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-700"
                          }`}
                        >
                          {isSelected ? (
                            <Check aria-hidden="true" className="h-4 w-4" />
                          ) : (
                            <UserRound
                              aria-hidden="true"
                              className="h-4 w-4"
                            />
                          )}
                          {isSelected ? "Selected Technician" : "Select Technician"}
                        </button>
                      </article>
                    );
                  })}
                </div>

                {selectedTechnician && !hasReassigned && (
                  <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/40 sm:flex-row sm:items-center">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      Reassign <strong>REQ-1030</strong> to{" "}
                      <strong>{selectedTechnician.name}</strong>?
                    </p>
                    <button
                      type="button"
                      onClick={confirmReassignment}
                      className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/25 sm:w-auto"
                    >
                      <Check aria-hidden="true" className="h-4 w-4" />
                      Confirm Reassignment
                    </button>
                  </div>
                )}
              </section>

              <section
                aria-labelledby="reassignment-timeline-heading"
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-5 flex items-center gap-2">
                  <h2
                    id="reassignment-timeline-heading"
                    className="text-base font-semibold text-slate-900 dark:text-slate-100"
                  >
                    Reassignment Timeline
                  </h2>
                </div>
                <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
                  <Timeline events={timeline} />
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section
                aria-labelledby="current-assignment-heading"
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2
                      id="current-assignment-heading"
                      className="text-base font-semibold text-slate-900 dark:text-slate-100"
                    >
                      Current Assignment
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Live assignment status for this request.
                    </p>
                  </div>
                  <StatusBadge status={hasReassigned ? "Assigned" : "Conflict"} />
                </div>

                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Request ID
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      REQ-1030
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Title
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Generator Maintenance
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Current Technician
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {currentTechnician.name}
                      </dd>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        hasReassigned
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {currentTechnician.availability}
                    </span>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Location
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                      Facility 1
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Priority
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-rose-700 dark:text-rose-300">
                      High
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-xl border border-blue-100 bg-blue-50/70 p-5 transition-colors duration-200 dark:border-blue-900/70 dark:bg-blue-950/40">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-800 dark:text-blue-300">
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                  Smart Reassignment
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  When a technician becomes unavailable, MaintenaX identifies
                  the conflict and recommends available technicians based on
                  skill, availability, and location.
                </p>
                <ul className="mt-4 space-y-3 border-t border-blue-100 pt-4 dark:border-blue-900/70">
                  {[
                    { label: "Skill Match", icon: Wrench },
                    { label: "Availability", icon: CheckCircle2 },
                    { label: "Location Proximity", icon: MapPin },
                  ].map(({ label, icon: Icon }) => (
                    <li
                      key={label}
                      className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-blue-600 dark:bg-slate-900 dark:text-blue-400">
                        <Icon
                          aria-hidden="true"
                          className="h-4 w-4"
                          strokeWidth={1.8}
                        />
                      </span>
                      {label}
                      <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </li>
                  ))}
                </ul>
                {hasReassigned && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                    Conflict successfully resolved
                  </div>
                )}
              </section>

              <div className="flex items-center gap-2 px-1 text-xs text-slate-400 dark:text-slate-500">
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                MaintenaX intelligent maintenance routing
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Reassignment;
