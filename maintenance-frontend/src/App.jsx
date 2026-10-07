import { useEffect, useState } from "react";

import { registerEventHandlers } from "./integration/eventHandlers";
import { loadMockEvents } from "./integration/integrationAdapter";

import Dashboard from "./pages/Dashboard";
import CreateRequest from "./pages/CreateRequest";
import RequestDetails from "./pages/RequestDetails";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    const cleanup = registerEventHandlers();

    loadMockEvents();

    return cleanup;
  }, []);

  if (currentPage === "request-details") {
    return <RequestDetails />;
  }

  if (currentPage === "create-request") {
    return (
      <CreateRequest
        onBack={() => setCurrentPage("dashboard")}
      />
    );
  }

  return (
    <Dashboard
      onCreateRequest={() => setCurrentPage("create-request")}
      onRequestDetails={() => setCurrentPage("request-details")}
    />
  );
}

export default App;