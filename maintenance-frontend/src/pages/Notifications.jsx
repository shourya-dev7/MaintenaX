import { useLayoutEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  ClipboardCheck,
  UserRoundCheck,
} from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const THEME_STORAGE_KEY = "maintenax-theme";

const initialNotifications = [
  {
    id: "request-high-priority",
    title: "New high-priority request",
    message: "REQ-1024 requires attention.",
    type: "Urgent",
    unread: true,
    time: "5 min ago",
  },
  {
    id: "task-assigned",
    title: "Task assigned",
    message: "REQ-1021 has been assigned to you.",
    type: "Assignment",
    unread: true,
    time: "18 min ago",
  },
  {
    id: "verification-required",
    title: "Supervisor verification required",
    message: "REQ-1018 is waiting for verification.",
    type: "Verification",
    unread: true,
    time: "1 hour ago",
  },
  {
    id: "technician-unavailable",
    title: "Technician unavailable",
    message: "Arun Kumar is unavailable for REQ-1030.",
    type: "Conflict",
    unread: false,
    time: "Yesterday",
  },
];

const filters = [
  "All",
  "Unread",
  "Urgent",
  "Assignment",
  "Verification",
  "Conflict",
];

const notificationStyles = {
  Urgent: {
    Icon: AlertTriangle,
    className:
      "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
  Assignment: {
    Icon: UserRoundCheck,
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  Verification: {
    Icon: ClipboardCheck,
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  Conflict: {
    Icon: Bell,
    className:
      "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
};

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme === "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function Notifications({ onNavigate, onLogout, userName }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);
  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

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

  function markAsRead(id) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, unread: false })),
    );
  }

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Unread") return notification.unread;
        return notification.type === activeFilter;
      }),
    [activeFilter, notifications],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 [&_*]:transition-colors [&_*]:duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed inset-y-0 left-0 z-20">
        <Sidebar
          activePage="notifications"
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
          pageTitle="Notifications"
          pageSubtitle="Stay updated on maintenance activities and system alerts."
        />

        <main className="mx-auto max-w-[1200px] space-y-7 p-8 max-lg:p-6 max-sm:p-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Notifications
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Stay updated on maintenance activities and system alerts.
              </p>
            </div>
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:self-auto"
            >
              <CheckCheck aria-hidden="true" className="h-4 w-4" />
              Mark all as read
            </button>
          </div>

          <section
            aria-label="Notification summary"
            className="flex flex-wrap items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/70 dark:bg-blue-950/40"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600 dark:bg-slate-900 dark:text-blue-400">
              <Bell aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {unreadCount} unread{" "}
                {unreadCount === 1 ? "notification" : "notifications"}
              </p>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                Click any notification to mark it as read.
              </p>
            </div>
          </section>

          <section aria-label="Filter notifications">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filters.map((filter) => {
                const selected = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveFilter(filter)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                      selected
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </section>

          <section
            aria-label={`${activeFilter} notifications`}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            {filteredNotifications.length > 0 ? (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredNotifications.map((notification) => {
                  const { Icon, className } =
                    notificationStyles[notification.type];
                  return (
                    <li key={notification.id}>
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        aria-label={`${notification.title}. ${notification.message}. ${notification.unread ? "Unread" : "Read"}.`}
                        className={`flex w-full items-start gap-4 p-4 text-left sm:p-5 ${
                          notification.unread
                            ? "bg-blue-50/60 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/40"
                            : "bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${className}`}
                        >
                          <Icon aria-hidden="true" className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {notification.title}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${className}`}
                            >
                              {notification.type}
                            </span>
                          </span>
                          <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">
                            {notification.message}
                          </span>
                          <span className="mt-2 block text-xs text-slate-400 dark:text-slate-500">
                            {notification.time}
                          </span>
                        </span>
                        {notification.unread && (
                          <span
                            aria-label="Unread"
                            className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-5 py-14 text-center">
                <Bell
                  aria-hidden="true"
                  className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500"
                />
                <h2 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  No notifications here
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {activeFilter === "Unread"
                    ? "You’re all caught up."
                    : `There are no ${activeFilter.toLowerCase()} notifications right now.`}
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Notifications;
