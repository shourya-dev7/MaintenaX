import { subscribe } from "./eventBus";
import { addNotification } from "./notificationStore";
import { addActivity } from "./activityStore";

const eventTypes = [
  "assignment_created",
  "assignment_changed",
  "technician_dropped",
  "part_unavailable",
  "sla_warning",
  "job_completed",
];

const getNotificationSeverity = (eventType) => {
  const severityMap = {
    assignment_created: "info",
    assignment_changed: "info",
    technician_dropped: "warning",
    part_unavailable: "warning",
    sla_warning: "critical",
    job_completed: "success",
  };

  return severityMap[eventType] || "info";
};

export const registerEventHandlers = () => {
  const unsubscribeFunctions = eventTypes.map((eventType) =>
    subscribe(eventType, (event) => {
      console.log(`[MaintenaX Event] ${eventType}`, event);

      const notification = {
        id: `${event.type}-${event.requestId}-${event.timestamp}`,
        type: event.type,
        requestId: event.requestId,
        machineId: event.machineId,
        message: event.message,
        timestamp: event.timestamp,
        status: event.status,
        severity: getNotificationSeverity(event.type),
      };

      addNotification(notification);
      addActivity({
        id: `${event.type}-${event.requestId}-${event.timestamp}`,
        type: event.type,
        requestId: event.requestId,
        machineId: event.machineId,
        message: event.message,
        timestamp: event.timestamp,
        status: event.status,
        });
    })
  );

  return () => {
    unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
  };
};