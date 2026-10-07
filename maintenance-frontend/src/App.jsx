import { useEffect, useState } from "react";

import { registerEventHandlers } from "./integration/eventHandlers";
import { loadMockEvents } from "./integration/integrationAdapter";

import Dashboard from "./pages/Dashboard";
import CreateRequest from "./pages/CreateRequest";
import RequestDetails from "./pages/RequestDetails";
import TechnicianTasks from "./pages/TechnicianTasks";
import SupervisorVerification from "./pages/SupervisorVerification";
import Reassignment from "./pages/Reassignment";
import { initialRecords, initialTasks } from "./data/mockMaintenanceData";
import {
  getServiceRequests,
  getServiceRequest,
  mapBackendRequestToTask,
} from "./api/client";
import Login from "./pages/Login";
import RoleSelect from "./pages/RoleSelect";
import ServiceRequests from "./pages/ServiceRequests";
import Technicians from "./pages/Technicians";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import {
  getExternalSession,
  onExternalAuthChange,
  signOutExternal,
} from "./lib/auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("maintenax-authenticated") === "true"
  );
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [accounts, setAccounts] = useState([
    { username: "admin", password: "admin123", role: "Facility Manager" },
    { username: "supervisor", password: "super123", role: "Supervisor" },
    { username: "technician", password: "tech123", role: "Technician" },
    { username: "requester", password: "user123", role: "Requester" },
  ]);

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestReturnPage, setRequestReturnPage] = useState("dashboard");
  const [nextRequestNumber, setNextRequestNumber] = useState(1025);
  const [tasks, setTasks] = useState(initialTasks);
  const [verificationRecords, setVerificationRecords] =
    useState(initialRecords);
  const [reassignment, setReassignment] = useState({
    selectedTechnicianId: null,
    assignedTechnician: null,
  });

  useEffect(() => {
    const cleanup = registerEventHandlers();

    loadMockEvents();

    return cleanup;
  }, []);

  useEffect(() => {
    getServiceRequests()
      .then((response) => {
        const backendTasks = response.data.map(mapBackendRequestToTask);

        setTasks((currentTasks) => {
          const existingIds = new Set(
            currentTasks.map((task) => task.requestId),
          );

          const newTasks = backendTasks.filter(
            (task) => !existingIds.has(task.requestId),
          );

          return [...newTasks, ...currentTasks];
        });
      })
      .catch((error) => {
        console.error("Failed to load backend service requests:", error);
      });
  }, []);

  function handleLogin(username, password, role) {
    let stored = [];

    try {
      stored = JSON.parse(
        localStorage.getItem("maintenax-users") || "[]",
      );
    } catch {}

    const account = [...accounts, ...stored].find(
      (item) =>
        item.username === username &&
        item.password === password &&
        item.role === role,
    );

    if (!account) return false;

    setCurrentUser(account.username);
    localStorage.setItem("maintenax-current-role", account.role);
    setIsAuthenticated(true);
    localStorage.setItem("maintenax-authenticated", "true");

    return true;
  }

  function handleSignUp(username, password) {
    setAccounts((currentAccounts) => [
      ...currentAccounts,
      { username, password },
    ]);

    setCurrentUser(username);
    setIsAuthenticated(true);
    localStorage.setItem("maintenax-authenticated", "true");
  }

  function handleLogout() {
    signOutExternal().catch(() => {});
    setIsAuthenticated(false);
    localStorage.removeItem("maintenax-authenticated");
    setCurrentUser("");
    setCurrentPage("dashboard");
    setSelectedRole(null);
    localStorage.removeItem("maintenax-current-role");
  }

  useEffect(() => {
    let mounted = true;

    const acceptSession = (session) => {
      if (!mounted || !session?.user) return;

      const role =
        localStorage.getItem("maintenax-pending-role") ||
        localStorage.getItem("maintenax-current-role") ||
        "Requester";

      localStorage.setItem("maintenax-current-role", role);
      localStorage.removeItem("maintenax-pending-role");

      setSelectedRole(role);
      setCurrentUser(
        session.user.email ||
          session.user.user_metadata?.full_name ||
          "User",
      );
      setIsAuthenticated(true);
      localStorage.setItem("maintenax-authenticated", "true");
    };

    getExternalSession().then(acceptSession).catch(console.error);

    const unsubscribe = onExternalAuthChange(acceptSession);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handler = (event) => {
      if (event.detail) {
        setCurrentPage(event.detail);
      }
    };

    window.addEventListener("maintenax:navigate", handler);

    return () => {
      window.removeEventListener("maintenax:navigate", handler);
    };
  }, []);

  if (!selectedRole) {
    return <RoleSelect onSelect={setSelectedRole} />;
  }

  if (!isAuthenticated) {
    return (
      <Login
        role={selectedRole}
        onBack={() => setSelectedRole(null)}
        onLogin={handleLogin}
      />
    );
  }

  function addVerificationRecord(request) {
    const record = {
      requestId: request.requestId,
      title: request.title,
      location: request.location,
      category: request.category,
      priority: request.priority,
      technician: "Arun Kumar",
      status: "Pending Verification",
      completedDate: "Today",
      completionNotes:
        "Technician marked the maintenance work complete and submitted it for supervisor verification.",
    };

    setVerificationRecords((currentRecords) => {
      const existing = currentRecords.some(
        (item) => item.requestId === record.requestId,
      );

      return existing
        ? currentRecords.map((item) =>
            item.requestId === record.requestId ? record : item,
          )
        : [record, ...currentRecords];
    });
  }

  function updateTaskStatus(requestId, status) {
    const task = tasks.find((item) => item.requestId === requestId);

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.requestId === requestId ? { ...item, status } : item,
      ),
    );

    if (selectedRequest?.requestId === requestId) {
      setSelectedRequest((currentRequest) => ({
        ...currentRequest,
        status,
      }));
    }

    if (status === "Completed" && task) {
      addVerificationRecord(
        selectedRequest?.requestId === requestId
          ? selectedRequest
          : task,
      );

      if (selectedRequest?.requestId === requestId) {
        setSelectedRequest((currentRequest) => ({
          ...currentRequest,
          status: "Pending Verification",
        }));
      }
    }
  }

  function updateVerificationStatus(requestId, status) {
    setVerificationRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.requestId === requestId
          ? { ...record, status }
          : record,
      ),
    );

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.requestId === requestId
          ? {
              ...task,
              status:
                status === "Needs Rework"
                  ? "In Progress"
                  : "Completed",
            }
          : task,
      ),
    );

    if (selectedRequest?.requestId === requestId) {
      setSelectedRequest((currentRequest) => ({
        ...currentRequest,
        status:
          status === "Needs Rework"
            ? "In Progress"
            : "Completed",
      }));
    }
  }

  function updateRequestStatus(status) {
    if (!selectedRequest) return;

    setSelectedRequest((currentRequest) => ({
      ...currentRequest,
      status,
    }));

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.requestId === selectedRequest.requestId
          ? { ...task, status }
          : task,
      ),
    );

    if (status === "Pending Verification") {
      addVerificationRecord({
        ...selectedRequest,
        status: "Pending Verification",
      });
    }
  }

  if (currentPage === "create-request") {
    return (
      <CreateRequest
        onBack={() => setCurrentPage("dashboard")}
        onCreate={(requestData) => {
          const requestId = `REQ-${nextRequestNumber}`;

          const request = {
            ...requestData,
            requestId,
            status: "New",
            createdAt: new Date().toISOString(),
          };

          setSelectedRequest(request);
          setRequestReturnPage("dashboard");

          setTasks((currentTasks) => [
            {
              requestId,
              title: request.title,
              location: request.location,
              category: request.category,
              priority: request.priority,
              status: "Assigned",
              requester: request.requesterName,
              assignedDate: "Today",
            },
            ...currentTasks,
          ]);

          setNextRequestNumber((number) => number + 1);
          setCurrentPage("request-details");
        }}
      />
    );
  }

  if (currentPage === "service-requests") {
    return (
      <ServiceRequests
        onNavigate={setCurrentPage}
        onCreateRequest={() => setCurrentPage("create-request")}
        onOpenRequest={(request) => {
          setSelectedRequest({
            ...request,
            requesterName: "Facilities Department",
            requesterContact: "—",
            description:
              "Request details are available in this record.",
            createdAt: new Date().toISOString(),
          });

          setRequestReturnPage("service-requests");
          setCurrentPage("request-details");
        }}
        onLogout={handleLogout}
        userName={currentUser}
      />
    );
  }

  if (currentPage === "technicians") {
    return (
      <Technicians
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        userName={currentUser}
      />
    );
  }

  if (currentPage === "notifications") {
    return (
      <Notifications
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        userName={currentUser}
      />
    );
  }

  if (currentPage === "reports") {
    return (
      <Reports
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        userName={currentUser}
      />
    );
  }

  if (currentPage === "settings") {
    return (
      <Settings
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        userName={currentUser}
      />
    );
  }

  if (currentPage === "request-details") {
    return (
      <RequestDetails
        request={selectedRequest}
        onBack={() => setCurrentPage(requestReturnPage)}
        onNavigate={setCurrentPage}
        onStatusChange={updateRequestStatus}
      />
    );
  }

  if (currentPage === "technician-tasks") {
    return (
      <TechnicianTasks
        tasks={tasks}
        onTaskStatusChange={updateTaskStatus}
        onNavigate={setCurrentPage}
        onBack={() => setCurrentPage("dashboard")}
        onLogout={handleLogout}
        userName={currentUser}
        onOpenRequest={async (request) => {
          try {
            const response = await getServiceRequest(request.requestId);
            const backendRequest = response.data;

            setSelectedRequest({
              ...request,
              ...backendRequest,
              requestId: backendRequest.id,
              title: backendRequest.title || backendRequest.fault_type,
              category: backendRequest.required_skill,
              priority: backendRequest.priority,
              status: backendRequest.status,
              location: backendRequest.site_id,
              requesterName: "Facilities Department",
              technicianName:
                backendRequest.assigned_technician_id === "T02"
                  ? "Arjun Mehta"
                  : backendRequest.assigned_technician_id || "Unassigned",
            });
          } catch (error) {
            console.error("Failed to load request details:", error);
            setSelectedRequest(request);
          }

          setRequestReturnPage("technician-tasks");
          setCurrentPage("request-details");
        }}
      />
    );
  }

  if (currentPage === "supervisor-verification") {
    return (
      <SupervisorVerification
        records={verificationRecords}
        onRecordStatusChange={updateVerificationStatus}
        onNavigate={setCurrentPage}
        onBack={() => setCurrentPage("dashboard")}
        onLogout={handleLogout}
        userName={currentUser}
      />
    );
  }

  if (currentPage === "reassignment") {
    return (
      <Reassignment
        reassignment={reassignment}
        onReassignmentChange={setReassignment}
        onNavigate={setCurrentPage}
        onBack={() => setCurrentPage("dashboard")}
        onLogout={handleLogout}
        userName={currentUser}
      />
    );
  }

  return (
    <Dashboard
      onCreateRequest={() => setCurrentPage("create-request")}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      userName={currentUser}
      tasks={tasks}
    />
  );
}

export default App;
