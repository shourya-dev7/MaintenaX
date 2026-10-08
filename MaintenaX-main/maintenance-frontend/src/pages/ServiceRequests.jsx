import { useLayoutEffect, useMemo, useState } from "react";
import { ClipboardPlus, Search, SlidersHorizontal } from "lucide-react";
import Header from "../components/Header";
import RequestCard from "../components/RequestCard";
import Sidebar from "../components/Sidebar";

const THEME_STORAGE_KEY = "maintenax-theme";

const mockRequests = [
  {
    requestId: "REQ-1024",
    title: "AC Unit Not Cooling",
    location: "Building A, Floor 2",
    category: "HVAC",
    priority: "High",
    status: "Assigned",
    technician: "Arun Kumar",
  },
  {
    requestId: "REQ-1021",
    title: "Water Leakage",
    location: "Block B, Ground Floor",
    category: "Plumbing",
    priority: "Critical",
    status: "In Progress",
    technician: "Priya Sharma",
  },
  {
    requestId: "REQ-1018",
    title: "Electrical Panel Inspection",
    location: "Workshop",
    category: "Electrical",
    priority: "Medium",
    status: "Completed",
    technician: "Arun Kumar",
  },
  {
    requestId: "REQ-1015",
    title: "Generator Inspection",
    location: "Facility 1",
    category: "Mechanical",
    priority: "Low",
    status: "Completed",
    technician: "Rahul Das",
  },
  {
    requestId: "REQ-1030",
    title: "Generator Maintenance",
    location: "Facility 1",
    category: "Mechanical",
    priority: "High",
    status: "Conflict",
    technician: "Arun Kumar",
  },
];

const statusOptions = [
  "All",
  "New",
  "Assigned",
  "In Progress",
  "Pending Verification",
  "Completed",
  "Conflict",
];
const priorityOptions = ["All", "Low", "Medium", "High", "Critical"];

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme === "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function ServiceRequests({
  onNavigate,
  onCreateRequest,
  onOpenRequest,
  onLogout,
  userName,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
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

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();
    return mockRequests.filter((request) => {
      const matchesSearch =
        !query ||
        [
          request.requestId,
          request.title,
          request.location,
          request.category,
          request.technician,
        ].some((value) => value.toLowerCase().includes(query));
      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;
      const matchesPriority =
        priorityFilter === "All" || request.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [priorityFilter, search, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 [&_*]:transition-colors [&_*]:duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed inset-y-0 left-0 z-20">
        <Sidebar
          activePage="service-requests"
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
          pageTitle="Service Requests"
          pageSubtitle="View and manage maintenance requests across your facilities."
        />

        <main className="mx-auto max-w-[1600px] space-y-7 p-8 max-lg:p-6 max-sm:p-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Service Requests
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                View and manage maintenance requests across your facilities.
              </p>
            </div>
            <button
              type="button"
              onClick={onCreateRequest}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
            >
              <ClipboardPlus aria-hidden="true" className="h-4 w-4" />
              Create Service Request
            </button>
          </div>

          <section
            aria-label="Search and filter service requests"
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_190px]">
              <label className="relative block">
                <span className="sr-only">Search service requests</span>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search ID, title, location, category, or technician"
                  className="min-h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400"
                />
              </label>

              <label className="relative">
                <span className="sr-only">Filter by status</span>
                <SlidersHorizontal
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="min-h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === "All" ? "All statuses" : status}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="sr-only">Filter by priority</span>
                <select
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority === "All" ? "All priorities" : priority}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section aria-labelledby="request-results-heading">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2
                  id="request-results-heading"
                  className="text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  All requests
                </h2>
                <p
                  aria-live="polite"
                  className="mt-1 text-sm text-slate-500 dark:text-slate-400"
                >
                  {filteredRequests.length}{" "}
                  {filteredRequests.length === 1 ? "request" : "requests"} found
                </p>
              </div>
            </div>

            {filteredRequests.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {filteredRequests.map((request) => (
                  <RequestCard
                    key={request.requestId}
                    {...request}
                    onClick={() => onOpenRequest(request)}
                  >
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {request.category}
                      </span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        View request details
                      </span>
                    </div>
                  </RequestCard>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
                <Search
                  aria-hidden="true"
                  className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500"
                />
                <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  No matching requests
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try a different search term or clear one of the filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setPriorityFilter("All");
                  }}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Clear search and filters
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default ServiceRequests;
