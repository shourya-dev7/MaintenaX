import TechnicianLiveMap from "../components/TechnicianLiveMap";
import { useLayoutEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  ClipboardPlus,
  Clock3,
  ShieldCheck,
  UsersRound,
  Wrench,
} from "lucide-react";
import Header from "../components/Header";
import RequestCard from "../components/RequestCard";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

const statistics = [
  {
    title: "Total Requests",
    value: "128",
    icon: ClipboardList,
    trend: "+12%",
    trendType: "positive",
    description: "vs. last month",
  },
  {
    title: "Open Requests",
    value: "24",
    icon: Clock3,
    trend: "-8%",
    trendType: "positive",
    description: "vs. last week",
  },
  {
    title: "In Progress",
    value: "18",
    icon: Wrench,
    trend: "+3",
    trendType: "neutral",
    description: "since yesterday",
  },
  {
    title: "Completed",
    value: "86",
    icon: CheckCircle2,
    trend: "+16%",
    trendType: "positive",
    description: "this month",
  },
];

const requests = [
  {
    requestId: "MX-1048",
    title: "AC Unit Not Cooling",
    location: "Building A",
    category: "HVAC",
    priority: "High",
    technician: "Jordan Lee",
    requester: "Facilities Department",
    status: "In Progress",
    createdDate: "Oct 7, 2026",
  },
  {
    requestId: "MX-1047",
    title: "Water Leakage",
    location: "Block B",
    category: "Plumbing",
    priority: "Urgent",
    technician: "Priya Sharma",
    requester: "Administration",
    status: "Assigned",
    createdDate: "Oct 7, 2026",
  },
  {
    requestId: "MX-1046",
    title: "Elevator Maintenance",
    location: "Main Building",
    category: "Mechanical",
    priority: "Medium",
    technician: "Marcus Chen",
    requester: "Operations",
    status: "Pending Verification",
    createdDate: "Oct 6, 2026",
  },
  {
    requestId: "MX-1045",
    title: "Electrical Panel Issue",
    location: "Workshop",
    category: "Electrical",
    priority: "High",
    technician: "Avery Patel",
    requester: "Maintenance Department",
    status: "New",
    createdDate: "Oct 6, 2026",
  },
  {
    requestId: "MX-1044",
    title: "Generator Inspection",
    location: "Facility 1",
    category: "Mechanical",
    priority: "Low",
    technician: "Sam Rivera",
    requester: "Facilities",
    status: "Completed",
    createdDate: "Oct 5, 2026",
  },
];

const operations = [
  {
    label: "Technicians working",
    value: "8",
    detail: "across 4 facilities",
    icon: UsersRound,
    iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    label: "Pending verification",
    value: "5",
    detail: "awaiting supervisor review",
    icon: ShieldCheck,
    iconClass: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
  {
    label: "Urgent requests",
    value: "3",
    detail: "need immediate attention",
    icon: AlertTriangle,
    iconClass: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  },
];

const recentActivity = [
  {
    title: "Work completed",
    detail: "Generator inspection · Facility 1",
    time: "10:42 AM",
    status: "Completed",
  },
  {
    title: "Technician assigned",
    detail: "Water leakage · Block B",
    time: "9:18 AM",
    status: "Assigned",
  },
  {
    title: "Request received",
    detail: "Electrical panel issue · Workshop",
    time: "8:56 AM",
    status: "New",
  },
];

const THEME_STORAGE_KEY = "maintenax-theme";

function Dashboard({
  onCreateRequest,
  onRequestDetails,
  onNavigate,
  onLogout,
  userName,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLiveGraph, setShowLiveGraph] = useState(false);

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

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      nextTheme ? "dark" : "light",
    );
    setIsDarkMode(nextTheme);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 [&_*]:transition-colors [&_*]:duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed inset-y-0 left-0 z-20">
        <Sidebar
          activePage="dashboard"
          onNavigate={onNavigate}
          onLogout={onLogout}
          userName={userName}
        />
      </div>

      <div className="ml-64 min-h-screen max-sm:ml-16">
        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onNavigate={onNavigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="mx-auto max-w-[1600px] space-y-8 p-8 max-lg:p-6 max-sm:p-4">
          <section aria-label="Request statistics">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Operations at a glance
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Track maintenance performance across your facilities.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowLiveGraph(true)}
                  title="Open live servicing graph"
                  aria-label="Open live servicing graph"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Activity
                    aria-hidden="true"
                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                  />
                  Live overview
                </button>
                <button
                  type="button"
                  onClick={onCreateRequest}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
                >
                  <ClipboardPlus aria-hidden="true" className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Service Request</span>
                  <span className="sm:hidden">Create Request</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statistics.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
          </section>

          <div id="live-field-overview">
  <div id="live-field-overview">
    <TechnicianLiveMap
      onShowGraph={(value = true) => setShowLiveGraph(value)}
      showGraph={showLiveGraph}
    />
  </div>
</div>

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.9fr)]">
            <section aria-labelledby="recent-requests-heading" className="min-w-0">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2
                    id="recent-requests-heading"
                    className="text-base font-semibold text-slate-900 dark:text-slate-100"
                  >
                    Recent Service Requests
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    The latest maintenance activity from your facilities.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View all
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {requests.filter((request) => {
                  const query = searchQuery.trim().toLowerCase();
                  if (!query) return true;
                  return Object.values(request).some((value) =>
                    String(value).toLowerCase().includes(query),
                  );
                }).map((request) => (
                  <RequestCard
                    key={request.requestId}
                    {...request}
                    onClick={() => onRequestDetails(request.requestId)}
                  />
                ))}
              </div>
            </section>

            <aside className="space-y-6">
              <section
                aria-labelledby="maintenance-overview-heading"
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-5">
                  <h2
                    id="maintenance-overview-heading"
                    className="text-base font-semibold text-slate-900 dark:text-slate-100"
                  >
                    Maintenance Overview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Current workload across your team.
                  </p>
                </div>

                <div className="space-y-4">
                  {operations.map(
                    ({ label, value, detail, icon: Icon, iconClass }) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 transition-colors duration-200 dark:bg-slate-800/70"
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
                        >
                          <Icon
                            aria-hidden="true"
                            className="h-5 w-5"
                            strokeWidth={1.8}
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {label}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {detail}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </section>

              <section
                aria-labelledby="todays-activity-heading"
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2
                      id="todays-activity-heading"
                      className="text-base font-semibold text-slate-900 dark:text-slate-100"
                    >
                      Today&apos;s Activity
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Recent updates from your team.
                    </p>
                  </div>
                  <Activity
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500"
                    strokeWidth={1.8}
                  />
                </div>

                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentActivity.map((item) => (
                    <li key={item.title + item.detail} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            {item.detail}
                          </p>
                        </div>
                        <time className="shrink-0 pt-0.5 text-xs text-slate-400 dark:text-slate-500">
                          {item.time}
                        </time>
                      </div>
                      <div className="mt-2">
                        <StatusBadge status={item.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;








