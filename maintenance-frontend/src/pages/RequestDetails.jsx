import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  CircleCheck,
  Clock3,
  MapPin,
  Play,
  RotateCcw,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import Timeline from "../components/Timeline";

import {
  getActivities,
  subscribeToActivities,
} from "../integration/activityStore";
import { getServiceRequestAudit } from "../api/client";

const requestTimeline = [
  {
    title: "Request Created",
    timestamp: "Oct 7, 2026 · 9:14 AM",
    responsiblePerson: "Facilities Department",
    description: "Service request submitted for the second-floor meeting room.",
  },
  {
    title: "Request Assigned",
    timestamp: "Oct 7, 2026 · 9:22 AM",
    responsiblePerson: "MaintenaX smart assignment",
    description: "Assigned to Arun Kumar based on skills, availability, and location.",
  },
  {
    title: "Technician Accepted",
    timestamp: "Upcoming",
    responsiblePerson: "Arun Kumar",
    description: "Pending technician acceptance.",
  },
  {
    title: "Work Started",
    timestamp: "Upcoming",
    responsiblePerson: "Arun Kumar",
    description: "Pending completion of the technician's initial assessment.",
  },
  {
    title: "Work Completed",
    timestamp: "Upcoming",
    responsiblePerson: "Arun Kumar",
    description: "Pending work completion.",
  },
  {
    title: "Supervisor Verification",
    timestamp: "Upcoming",
    responsiblePerson: "Facilities supervisor",
    description: "Pending work completion and supervisor review.",
  },
];

const actionButtons = [
  {
    label: "Accept Assignment",
    icon: Check,
    className:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/25",
  },
  {
    label: "Start Work",
    icon: Play,
    className:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-700",
  },
  {
    label: "Mark Work Completed",
    icon: CircleCheck,
    className:
      "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-200 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-950 dark:focus:ring-emerald-900",
  },
  {
    label: "Request Reassignment",
    icon: RotateCcw,
    className:
      "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-slate-700",
  },
];

function DetailItem({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-slate-400 dark:text-slate-500">
        <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <div>
        <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </dt>
        <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
          {children}
        </dd>
      </div>
    </div>
  );
}

function RequestDetails({ request, onBack, onNavigate, onStatusChange }) {
  const [activities, setActivities] = useState(getActivities());
  useEffect(() => {
    const unsubscribe = subscribeToActivities((updatedActivities) => {
      setActivities(updatedActivities);
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    if (!request?.requestId) {
      return;
    }

    getServiceRequestAudit(request.requestId)
      .then((response) => {
        setActivities(response.data.audit_history || []);
      })
      .catch((error) => {
        console.error("Failed to load backend audit history:", error);
      });
  }, [request?.requestId]);
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to Dashboard
        </button>

        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                Request {request?.requestId || "Unknown"}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                {request?.title || request?.fault_type || "Maintenance Request"}
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Maintenance request · {request?.category || request?.required_skill || "General"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={request?.status || "Assigned"} />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                {request?.priority || "Medium"} priority
              </span>
            </div>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <section
              aria-labelledby="request-information-heading"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 sm:p-6"
            >
              <div className="mb-5">
                <h2
                  id="request-information-heading"
                  className="text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  Request information
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Details submitted by the requesting department.
                </p>
              </div>

              <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <DetailItem icon={Wrench} label="Category">
                  {request?.category || request?.required_skill || "General"}
                </DetailItem>
                <DetailItem icon={CalendarDays} label="Created date">
                  {request?.created_at
                    ? new Date(request.created_at).toLocaleString()
                    : "Unknown date"}
                </DetailItem>
                <DetailItem icon={MapPin} label="Location">
                  {request?.location || request?.site_id || "Unknown location"}
                </DetailItem>
                <DetailItem icon={Building2} label="Requested by">
                  {request?.requesterName || request?.requester || "Facilities Department"}
                </DetailItem>
              </dl>

              <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Description
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {request?.description || request?.fault_type || "Maintenance request details unavailable."}
                </p>
              </div>
            </section>

            <section
              aria-labelledby="request-timeline-heading"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 sm:p-6"
            >
              <div className="mb-6">
                <h2
                  id="request-timeline-heading"
                  className="text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  Request timeline
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Follow the request from submission through verification.
                </p>
              </div>
              <Timeline events={activities} />
            </section>

            <section
              aria-labelledby="request-actions-heading"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 sm:p-6"
            >
              <div className="mb-4">
                <h2
                  id="request-actions-heading"
                  className="text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  Actions
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage the next step for this service request.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {actionButtons.map(({ label, icon: Icon, className }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {

                      if (label === "Accept Assignment") onStatusChange?.("Assigned");
                      if (label === "Start Work") onStatusChange?.("In Progress");
                      if (label === "Mark Work Completed") onStatusChange?.("Pending Verification");
                      if (label === "Request Reassignment") onNavigate?.("reassignment");
                    }}
                    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-4 ${className}`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section
              aria-labelledby="assigned-technician-heading"
              className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm transition-colors duration-200 dark:border-blue-900 dark:bg-slate-900"
            >
              <div className="flex items-center gap-2 bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white">
                <Sparkles aria-hidden="true" className="h-4 w-4" />
                Smart technician assignment
              </div>
              <div className="p-5">
                <h2
                  id="assigned-technician-heading"
                  className="sr-only"
                >
                  Assigned technician
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700 ring-1 ring-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-900">
                    {request?.technicianInitials ||
                      (request?.assigned_technician_id === "T02" ? "AM" : "—")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                      {request?.technicianName ||
                        (request?.assigned_technician_id === "T02"
                          ? "Arjun Mehta"
                          : request?.technician || request?.assigned_technician_id || "Unassigned")}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {request?.technicianRole || `${request?.category || request?.required_skill || "Maintenance"} Technician`}
                    </p>
                  </div>
                  <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {request?.technicianAvailability || "Available"}
                  </span>
                </div>

                <div className="mt-5 space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <DetailItem icon={Wrench} label="Skill">
                    {request?.category || request?.required_skill || "General"}
                  </DetailItem>
                  <DetailItem icon={MapPin} label="Current location">
                    {request?.technicianLocation || "Unknown location"}
                  </DetailItem>
                </div>

                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 dark:border-blue-900/70 dark:bg-blue-950/40">
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                    Assignment reason
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Best match based on {request?.category || request?.required_skill || "maintenance"} skill, availability and location.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400">
                <BadgeCheck aria-hidden="true" className="h-5 w-5" />
              </div>
              <h2 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                How smart assignment works
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                MaintenaX selected the technician using skill compatibility,
                technician availability, and location proximity.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-300">
                <UserRound aria-hidden="true" className="h-4 w-4" />
                Matched to the best available technician
              </div>
            </section>

            <div className="flex items-center gap-2 px-1 text-xs text-slate-400 dark:text-slate-500">
              <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
              {request?.updated_at
                ? new Date(request.updated_at).toLocaleString()
                : "Unknown date"}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default RequestDetails;





