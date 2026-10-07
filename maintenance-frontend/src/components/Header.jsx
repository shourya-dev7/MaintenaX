import { Bell, Moon, Search, Sun } from "lucide-react";

function Header({ isDarkMode, onToggleTheme, onNavigate, searchQuery, onSearchChange }) {
  return (
    <header className="flex min-h-20 items-center justify-between gap-6 border-b border-slate-200 bg-white px-8 py-4 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 max-md:px-5 max-sm:gap-3 max-sm:px-4">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
          Overview of maintenance operations
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4 max-sm:gap-2">
        <label className="relative block max-md:hidden">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            strokeWidth={1.8}
          />
          <input
            type="search"
            placeholder="Search..."
            aria-label="Search"
            value={searchQuery}
            onChange={(event) => onSearchChange?.(event.target.value)}
            className="h-10 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800 dark:focus:ring-blue-900"
          />
        </label>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={isDarkMode}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          {isDarkMode ? (
            <Sun aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
          ) : (
            <Moon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
          )}
        </button>

        <button
          type="button"
          aria-label="Notifications"
          onClick={() => onNavigate?.("notifications")}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <Bell aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
          <span
            aria-hidden="true"
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900"
          />
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 transition-colors duration-200 dark:border-slate-700 max-sm:gap-0 max-sm:border-0 max-sm:pl-0">
          <div
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
          >
            AM
          </div>
          <div className="max-sm:hidden">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Alex Morgan
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Facility Manager
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;



