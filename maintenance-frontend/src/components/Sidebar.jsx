import { useEffect, useState } from "react";

import {
  Bell,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  ListTodo,
  Settings,
  UsersRound,
  ChartNoAxesCombined,
  Wrench,
} from "lucide-react";

import {
  getNotifications,
  subscribeToNotifications,
} from "../integration/notificationStore";

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Service Requests", icon: ClipboardList },
  { label: "My Tasks", icon: ListTodo },
  { label: "Technicians", icon: UsersRound },
   { label: "Notifications", icon: Bell },
  { label: "Reports", icon: ChartNoAxesCombined },
  { label: "Settings", icon: Settings },
];

function Sidebar() {
  const [notificationCount, setNotificationCount] = useState(
    getNotifications().length
  );

  useEffect(() => {
    const unsubscribe = subscribeToNotifications((notifications) => {
      setNotificationCount(notifications.length);
    });

    return unsubscribe;
  }, []);
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white text-slate-700 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 max-sm:w-16">
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6 transition-colors duration-200 dark:border-slate-800 max-sm:justify-center max-sm:px-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
          <Wrench aria-hidden="true" className="h-5 w-5" />
        </div>
        <div className="min-w-0 max-sm:hidden">
          <p className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Maintena<span className="text-blue-600 dark:text-blue-400">X</span>
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            Facility management
          </p>
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex-1 space-y-1 px-3 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 max-sm:hidden">
          Workspace
        </p>
        {navigationItems.map(({ label, icon: Icon, active, badge }) => (
          <button
            key={label}
            type="button"
            aria-current={active ? "page" : undefined}
            title={label}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors max-sm:justify-center max-sm:px-0 ${
              active
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            }`}
          >
            <Icon
              aria-hidden="true"
              className={`h-5 w-5 shrink-0 ${
                active
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
              }`}
              strokeWidth={1.8}
            />
            <span className="flex-1 max-sm:hidden">{label}</span>
            {label === "Notifications" && notificationCount > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300 max-sm:hidden">
                {notificationCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4 transition-colors duration-200 dark:border-slate-800 max-sm:px-2">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 max-sm:justify-center max-sm:px-0"
          aria-label="User profile: Alex Morgan, Facility Manager"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
            AM
          </div>
          <div className="min-w-0 flex-1 max-sm:hidden">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              Alex Morgan
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              Facility Manager
            </p>
          </div>
          <ChevronDown
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500 max-sm:hidden"
          />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;