import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ClipboardPlus,
  Info,
  MapPin,
  Send,
} from "lucide-react";

const categories = [
  "Electrical",
  "HVAC",
  "Plumbing",
  "Mechanical",
  "General Maintenance",
];

const priorities = ["Low", "Medium", "High", "Critical"];

const fieldClassName =
  "mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/10";

const labelClassName = "text-sm font-medium text-slate-700 dark:text-slate-200";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function CreateRequest({ onBack }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  function handleReset() {
    setSubmitted(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to dashboard
        </button>

        <div className="mb-7">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none">
            <ClipboardPlus aria-hidden="true" className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
            MaintenaX · Service desk
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Create Service Request
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Tell us what needs attention. We&apos;ll get the right person on it.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <form
            onSubmit={handleSubmit}
            onReset={handleReset}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 sm:p-7"
          >
            <div className="mb-6 border-b border-slate-100 pb-5 dark:border-slate-800">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Request details
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Fields marked with <span className="text-rose-500">*</span> are
                required.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="request-title" className={labelClassName}>
                  Request title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="request-title"
                  name="title"
                  type="text"
                  required
                  maxLength={120}
                  placeholder="e.g. Air conditioning not cooling"
                  className={fieldClassName}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="request-description" className={labelClassName}>
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="request-description"
                  name="description"
                  required
                  rows={4}
                  maxLength={2000}
                  placeholder="Describe the issue, when it started, and any other details that may help."
                  className={`${fieldClassName} resize-y`}
                />
                <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                  Include any useful details to help the technician prepare.
                </p>
              </div>

              <div>
                <label htmlFor="request-category" className={labelClassName}>
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  id="request-category"
                  name="category"
                  required
                  defaultValue=""
                  className={fieldClassName}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="request-priority" className={labelClassName}>
                  Priority <span className="text-rose-500">*</span>
                </label>
                <select
                  id="request-priority"
                  name="priority"
                  required
                  defaultValue="Medium"
                  className={fieldClassName}
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="request-location" className={labelClassName}>
                  Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    id="request-location"
                    name="location"
                    type="text"
                    required
                    placeholder="Building, floor, or room"
                    className={`${fieldClassName} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="preferred-date" className={labelClassName}>
                  Preferred date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <CalendarDays
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    id="preferred-date"
                    name="preferredDate"
                    type="date"
                    required
                    min={getTodayDate()}
                    className={`${fieldClassName} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="preferred-time" className={labelClassName}>
                  Preferred time
                </label>
                <div className="relative">
                  <Clock3
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    id="preferred-time"
                    name="preferredTime"
                    type="time"
                    className={`${fieldClassName} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="requester-name" className={labelClassName}>
                  Requester name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="requester-name"
                  name="requesterName"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                  className={fieldClassName}
                />
              </div>

              <div>
                <label htmlFor="requester-contact" className={labelClassName}>
                  Requester contact <span className="text-rose-500">*</span>
                </label>
                <input
                  id="requester-contact"
                  name="requesterContact"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="Phone number or email"
                  className={fieldClassName}
                />
              </div>
            </div>

            {submitted && (
              <p
                role="status"
                className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
              >
                Request saved locally for this demo. Backend submission is not
                connected.
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
              <button
                type="reset"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
              >
                <Send aria-hidden="true" className="h-4 w-4" />
                Create Service Request
              </button>
            </div>
          </form>

          <aside className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 transition-colors duration-200 dark:border-blue-900/70 dark:bg-blue-950/40 sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400">
              <Info aria-hidden="true" className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
              Smart technician matching
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              MaintenaX will automatically route your request to the best
              available technician based on their skills, availability, and
              location.
            </p>
            <div className="mt-5 space-y-3 border-t border-blue-100 pt-5 dark:border-blue-900/70">
              {["Skills and certifications", "Current availability", "Proximity to the request"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CreateRequest;