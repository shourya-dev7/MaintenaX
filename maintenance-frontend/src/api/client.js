import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://maintenax.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getServiceRequests = () =>
  apiClient.get("/service-requests/");

export const getServiceRequest = (requestId) =>
  apiClient.get(`/service-requests/${requestId}`);

export function mapBackendRequestToTask(request) {
  return {
    requestId: request.id,
    title: request.title || request.fault_type || "Maintenance Request",
    location: request.site_id || "—",
    category: request.required_skill || "General",
    priority: request.priority || "Medium",
    status: request.status || "CREATED",
    technician: request.assigned_technician_id || "Unassigned",
    requester: "Facilities Department",
    assignedDate: "Today",
  };
}

export const getServiceRequestAudit = (requestId) =>
  apiClient.get(`/service-requests/${requestId}/audit`);

export default apiClient;
