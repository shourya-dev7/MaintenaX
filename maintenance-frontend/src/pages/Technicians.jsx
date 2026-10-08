import { useLayoutEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  MapPin,
  Search,
  UsersRound,
  Wrench,
  X,
} from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatusBadge from "../components/StatusBadge";

const THEME_STORAGE_KEY = "maintenax-theme";

const technicians = [
  {
    name: "Arun Kumar",
    skills: ["HVAC", "Mechanical"],
    location: "Building A",
    status: "Unavailable",
    activeTasks: 2,
    tasks: [
      { id: "REQ-1024", title: "AC Unit Not Cooling", status: "Assigned" },
      { id: "REQ-1018", title: "Electrical Panel Inspection", status: "Completed" },
    ],
  },
  {
    name: "Rahul Das",
    skills: ["Mechanical", "Generator"],
    location: "Facility 1",
    status: "Available",
    activeTasks: 1,
    tasks: [
      { id: "REQ-1015", title: "Generator Inspection", status: "Completed" },
    ],
  },
  {
    name: "Priya Sharma",
    skills: ["Plumbing", "Electrical"],
    location: "Building B",
    status: "Available",
    activeTasks: 2,
    tasks: [
      { id: "REQ-1021", title: "Water Leakage", status: "In Progress" },
      { id: "REQ-1009", title: "Lighting Circuit Repair", status: "Assigned" },
    ],
  },
  {
    name: "Amit Roy",
    skills: ["Electrical"],
    location: "Workshop",
    status: "Busy",
    activeTasks: 3,
    tasks: [
      { id: "REQ-1007", title: "Workshop Lighting Repair", status: "In Progress" },
      { id: "REQ-1005", title: "Motor Wiring Check", status: "Assigned" },
      { id: "REQ-1002", title: "Control Panel Service", status: "Assigned" },
    ],
  },
];

const availabilityFilters = ["All", "Available", "Busy", "Unavailable"];
const availabilityStyles = {
  Available:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  Busy: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Unavailable:
    "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme === "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function Technicians({
  onNavigate,
  onLogout,
  userName,
}) {
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  function toggleTheme() {
    const nextTheme = !isDarkMode;
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      nextTheme ? "dark" : "light",
    );
    setIsDarkMode(nextTheme);
  }

  const filteredTechnicians = useMemo(() => {
    const query = search.trim().toLowerCase();
    return technicians.filter((technician) => {
      const matchesSearch =
        !query ||
        technician.name.toLowerCase().includes(query) ||
        technician.skills.some((skill) => skill.toLowerCase().includes(query));
      return (
        matchesSearch &&
        (availabilityFilter === "All" ||
          technician.status === availabilityFilter)
      );
    });
  }, [availabilityFilter, search]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 [&_*]:transition-colors [&_*]:duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed inset-y-0 left-0 z-20">
        <Sidebar
          activePage="technicians"
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
          pageTitle="Technicians"
          pageSubtitle="View technician availability, skills, workload, and assignments."
        />

        <main className="mx-auto max-w-[1600px] space-y-7 p-8 max-lg:p-6 max-sm:p-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Technicians
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View technician availability, skills, workload, and assignments.
            </p>
          </div>

          <section
            aria-label="Find and filter technicians"
            className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-[minmax(0,1fr)_220px] sm:p-5"
          >
            <label className="relative block">
              <span className="sr-only">Search technicians by name or skill</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by technician name or skill"
                className="min-h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400"
              />
            </label>
            <label>
              <span className="sr-only">Filter by availability</span>
              <select
                value={availabilityFilter}
                onChange={(event) => setAvailabilityFilter(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {availabilityFilters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter === "All" ? "All availability" : filter}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section aria-labelledby="technician-list-heading">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2
                id="technician-list-heading"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                Technician directory
              </h2>
              <p aria-live="polite" className="text-sm text-slate-500 dark:text-slate-400">
                {filteredTechnicians.length}{" "}
                {filteredTechnicians.length === 1 ? "technician" : "technicians"}
              </p>
            </div>

            {filteredTechnicians.length ? (
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {filteredTechnicians.map((technician) => {
                  const workload = Math.min(
                    (technician.activeTasks / 4) * 100,
                    100,
                  );
                  return (
                    <article
                      key={technician.name}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {technician.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </span>
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                              {technician.name}
                            </h3>
                            <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                              {technician.location}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${availabilityStyles[technician.status]}`}
                        >
                          {technician.status}
                        </span>
                      </div>

                      <div className="mt-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Skills
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {technician.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                              <Wrench aria-hidden="true" className="h-3 w-3" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            Active tasks
                          </span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {technician.activeTasks}
                          </span>
                        </div>
                        <div
                          className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                          role="progressbar"
                          aria-label={`${technician.name} workload`}
                          aria-valuemin={0}
                          aria-valuemax={4}
                          aria-valuenow={technician.activeTasks}
                        >
                          <div
                            className={`h-full rounded-full ${
                              technician.activeTasks >= 3
                                ? "bg-rose-500"
                                : technician.activeTasks === 2
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                            }`}
                            style={{ width: `${workload}%` }}
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                          {technician.activeTasks >= 3
                            ? "High workload"
                            : technician.activeTasks === 2
                              ? "Moderate workload"
                              : "Light workload"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedTechnician(technician)}
                        className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-500/15 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950"
                      >
                        <ClipboardList aria-hidden="true" className="h-4 w-4" />
                        View Tasks
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
                <UsersRound
                  aria-hidden="true"
                  className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500"
                />
                <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  No technicians found
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try another name, skill, or availability filter.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>

      {selectedTechnician && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-slate-950/40"
          onClick={() => setSelectedTechnician(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setSelectedTechnician(null);
          }}
          role="presentation"
        >
          <aside
            aria-labelledby="technician-tasks-heading"
            aria-modal="true"
            role="dialog"
            className="h-full w-full max-w-lg overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  Technician tasks
                </p>
                <h2
                  id="technician-tasks-heading"
                  className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100"
                >
                  {selectedTechnician.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedTechnician.activeTasks} active tasks ·{" "}
                  {selectedTechnician.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTechnician(null)}
                aria-label="Close task details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {selectedTechnician.tasks.length ? (
                selectedTechnician.tasks.map((task) => (
                  <article
                    key={task.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          {task.id}
                        </p>
                        <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {task.title}
                        </h3>
                      </div>
                      <StatusBadge status={task.status} />
                    </div>
                  </article>
                ))
              ) : (
                <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  No tasks are currently assigned to this technician.
                </p>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Technicians;
