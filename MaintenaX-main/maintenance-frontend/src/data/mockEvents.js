export const mockEvents = [
  {
    type: "assignment_created",
    timestamp: "2026-10-07T10:00:00",
    requestId: "MR-001",
    machineId: "M-104",
    technicianId: "T07",
    technicianName: "Rahul",
    score: 91,
    status: "ASSIGNED",
    message: "Technician Rahul has been assigned to Machine M-104."
  },

  {
    type: "technician_dropped",
    timestamp: "2026-10-07T10:30:00",
    requestId: "MR-001",
    machineId: "M-104",
    technicianId: "T07",
    technicianName: "Rahul",
    status: "TECHNICIAN_UNAVAILABLE",
    message: "Technician Rahul is unavailable for Machine M-104."
  },

  {
    type: "assignment_changed",
    timestamp: "2026-10-07T10:32:00",
    requestId: "MR-001",
    machineId: "M-104",
    technicianId: "T12",
    technicianName: "Arjun",
    score: 88,
    status: "ASSIGNED",
    message: "Technician Arjun has been assigned as a replacement."
  },

  {
    type: "part_unavailable",
    timestamp: "2026-10-07T11:00:00",
    requestId: "MR-002",
    machineId: "M-108",
    partId: "P-204",
    partName: "Bearing",
    status: "PART_UNAVAILABLE",
    message: "Required bearing is unavailable."
  },

  {
    type: "sla_warning",
    timestamp: "2026-10-07T11:15:00",
    requestId: "MR-003",
    machineId: "M-110",
    status: "SLA_BREACH",
    message: "Maintenance request MR-003 is approaching its SLA limit."
  },

  {
    type: "job_completed",
    timestamp: "2026-10-07T11:45:00",
    requestId: "MR-001",
    machineId: "M-104",
    technicianId: "T12",
    technicianName: "Arjun",
    status: "COMPLETED",
    message: "Maintenance job MR-001 has been completed."
  }
];