import { useLayoutEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCheck,
  ClipboardList,
  Flame,
  ListTodo,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import Header from "../components/Header";
import RequestCard from "../components/RequestCard";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

const THEME_STORAGE_KEY = "maintenax-theme";

const workflowSteps = [
  { label: "Assigned", icon: ClipboardList },
  { label: "Accept Task", icon: Check },
  { label: "In Progress", icon: Wrench },
  { label: "Complete Work", icon: CheckCheck },
  { label: "Supervisor Verification", icon: ShieldCheck },
];

function TechnicianTasks({
  tasks,
  onTaskStatusChange,
  onNavigate,
  onOpenRequest,
  onBack,
  onLogout,
  userName,
}) {
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

  function toggleTheme() {
    const nextTheme = !isDarkMode;
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      nextTheme ? "dark" : "light",
    );
    setIsDarkMode(nextTheme);
  }

  function updateTaskStatus(requestId, status) {
    onTaskStatusChange(requestId, status);
  }

  const statistics = [
    {
      title: "Assigned",
      value: tasks.length,
      icon: ListTodo,
      description: "tasks on your board",
    },
    {
      title: "In Progress",
      value: tasks.filter((task) => task.status === "In Progress").length,
      icon: Wrench,
      description: "currently being worked on",
    },
    {
      title: "Completed",
      value: tasks.filter((task) => task.status === "Completed").length,
      icon: CheckCheck,
      description: "work finished",
    },
    {
      title: "High Priority",
      value: tasks.filter((task) =>
        ["High", "Critical"].includes(task.priority),
      ).length,
      icon: Flame,
      description: "high or critical priority",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 [&_*]:transition-colors [&_*]:duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed inset-y-0 left-0 z-20">
        <Sidebar
          activePage="technician-tasks"
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
          pageTitle="My Tasks"
          pageSubtitle="Manage your assigned maintenance tasks"
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
              My Tasks
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your assigned maintenance tasks
            </p>
          </div>

          <section aria-label="Task summary">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statistics.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
            <section aria-labelledby="assigned-tasks-heading" className="min-w-0">
              <div className="mb-4">
                <h2
                  id="assigned-tasks-heading"
                  className="text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  My Assigned Tasks
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Review your work and update each task as it progresses.
                </p>
              </div>

              <div className="space-y-4">
                {tasks.map((task) => (
                  <RequestCard
                    key={task.requestId}
                    {...task}
                    id={task.requestId}
                    technician="Arun Kumar"
                    onClick={() => onOpenRequest?.(task)}
                  >
                    <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Wrench
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500"
                          />
                          {task.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <UserRound
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500"
                          />
                          Requested by {task.requester}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500"
                          />
                          Assigned {task.assignedDate}
                        </span>
                      </div>

                      {task.status === "Assigned" && (
                        <button
                          type="button"
                          onClick={() =>
                            updateTaskStatus(task.requestId, "In Progress")
                          }
                          className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
                        >
                          <Check aria-hidden="true" className="h-4 w-4" />
                          Accept Task
                        </button>
                      )}
                      {task.status === "In Progress" && (
                        <button
                          type="button"
                          onClick={() =>
                            updateTaskStatus(task.requestId, "Completed")
                          }
                          className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/25"
                        >
                          <CheckCheck
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                          Mark Work Completed
                        </button>
                      )}
                      {task.status === "Completed" && (
                        <span
                          className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        >
                          <CheckCheck
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                          Completed
                        </span>
                      )}
                    </div>
                  </RequestCard>
                ))}
              </div>
            </section>

            <aside className="space-y-6">
              <section
                aria-labelledby="task-workflow-heading"
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900"
              >
                <h2
                  id="task-workflow-heading"
                  className="text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  Task Workflow
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Follow each task through its lifecycle.
                </p>
                <ol className="mt-5 space-y-0">
                  {workflowSteps.map(({ label, icon: Icon }, index) => (
                    <li key={label} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                          <Icon
                            aria-hidden="true"
                            className="h-4 w-4"
                            strokeWidth={1.8}
                          />
                        </span>
                        {index < workflowSteps.length - 1 && (
                          <span className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {label}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="rounded-xl border border-blue-100 bg-blue-50/70 p-5 transition-colors duration-200 dark:border-blue-900/70 dark:bg-blue-950/40">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-800 dark:text-blue-300">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                  Smart technician assignments
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Technician assignments are generated based on skill,
                  availability, and location to help match each request with
                  the right person.
                </p>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TechnicianTasks;
