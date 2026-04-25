// ============================================================
// API service layer
//
// Real backend endpoints are called via httpRequest() against
// API_BASE_URL. Endpoints not yet built on the backend
// (dashboards, students, seat allocations, reports) still
// return mock data and are clearly marked as TODO.
//
// To switch environments, set VITE_API_BASE_URL in your env.
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const TOKEN_KEY = "token";
const USER_KEY = "user";

// ---- HTTP helper ------------------------------------------------

async function httpRequest(path, { method = "GET", body, headers = {}, isForm = false } = {}) {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const finalHeaders = { ...headers };

  if (!isForm && body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }
  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

// Mock latency for endpoints not yet implemented on the backend
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================
// Auth — REAL  (POST /api/auth/login)
// ============================================================

export async function login(universityId, password) {
  try {
    const data = await httpRequest("/auth/login", {
      method: "POST",
      body: { universityId, password },
    });

    // Backend is expected to return { token, user: { id, name, role, ... } }
    // Adapt here if your shape differs.
    const token = data?.token;
    const user = data?.user || data;

    if (!token || !user) return null;

    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch (err) {
    console.error("login failed:", err);
    return null;
  }
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getCurrentUser() {
  const stored = sessionStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

// ============================================================
// Exam Halls — REAL  (/api/examhalls)
// ============================================================

export async function getExamHalls() {
  // Used by invigilator exam halls page — backend returns hall list
  const data = await httpRequest("/examhalls");
  return Array.isArray(data) ? data : data?.data || [];
}

export async function getAdminExamHalls() {
  const data = await httpRequest("/examhalls");
  return Array.isArray(data) ? data : data?.data || [];
}

export async function getExamHallById(id) {
  return httpRequest(`/examhalls/${id}`);
}

export async function createAdminExamHall(hall) {
  return httpRequest("/examhalls", { method: "POST", body: hall });
}

export async function updateAdminExamHallStatus(id, status) {
  return httpRequest(`/examhalls/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function deleteAdminExamHall(id) {
  return httpRequest(`/examhalls/${id}`, { method: "DELETE" });
}

export async function uploadExamHallsCsv(file) {
  const fd = new FormData();
  fd.append("file", file);
  return httpRequest("/examhalls/upload/csv", {
    method: "POST",
    body: fd,
    isForm: true,
  });
}

// Backwards-compat alias used by older components
export async function updateAdminExamHall(id, data) {
  if (data?.status) return updateAdminExamHallStatus(id, data.status);
  // No general PUT in backend yet for halls — surface a clear error
  throw new Error("Only status updates are supported by the backend right now.");
}

// ============================================================
// Alerts — REAL  (/api/alerts)
// ============================================================

export async function getAlerts() {
  const data = await httpRequest("/alerts");
  return Array.isArray(data) ? data : data?.data || [];
}

export async function getAlertById(id) {
  return httpRequest(`/alerts/${id}`);
}

export async function createAlert(payload) {
  return httpRequest("/alerts", { method: "POST", body: payload });
}

export async function updateAlertStatus(alertId, status) {
  return httpRequest(`/alerts/${alertId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function deleteAlert(id) {
  return httpRequest(`/alerts/${id}`, { method: "DELETE" });
}

// ============================================================
// Invigilators — REAL (admin only) (/api/invigilators)
// ============================================================

export async function getInvigilators() {
  const data = await httpRequest("/invigilators");
  return Array.isArray(data) ? data : data?.data || [];
}
export async function getInvigilatorById(id) { return httpRequest(`/invigilators/${id}`); }
export async function createInvigilator(payload) { return httpRequest("/invigilators", { method: "POST", body: payload }); }
export async function updateInvigilator(id, payload) { return httpRequest(`/invigilators/${id}`, { method: "PUT", body: payload }); }
export async function deleteInvigilator(id) { return httpRequest(`/invigilators/${id}`, { method: "DELETE" }); }
export async function uploadInvigilatorsCsv(file) {
  const fd = new FormData(); fd.append("file", file);
  return httpRequest("/invigilators/upload/csv", { method: "POST", body: fd, isForm: true });
}

// ============================================================
// Exams — REAL (/api/exams)
// ============================================================

export async function getExams() {
  const data = await httpRequest("/exams");
  return Array.isArray(data) ? data : data?.data || [];
}
export async function getExamById(id) { return httpRequest(`/exams/${id}`); }
export async function createExam(payload) { return httpRequest("/exams", { method: "POST", body: payload }); }
export async function updateExam(id, payload) { return httpRequest(`/exams/${id}`, { method: "PUT", body: payload }); }
export async function deleteExam(id) { return httpRequest(`/exams/${id}`, { method: "DELETE" }); }
export async function uploadExamsCsv(file) {
  const fd = new FormData(); fd.append("file", file);
  return httpRequest("/exams/upload/csv", { method: "POST", body: fd, isForm: true });
}
export async function refreshExamStatuses() { return httpRequest("/exams/status/update"); }

// ============================================================
// Cameras / Speakers / Microphones — REAL
// ============================================================

const deviceApi = (resource) => ({
  list: async () => {
    const data = await httpRequest(`/${resource}`);
    return Array.isArray(data) ? data : data?.data || [];
  },
  get: (id) => httpRequest(`/${resource}/${id}`),
  create: (payload) => httpRequest(`/${resource}`, { method: "POST", body: payload }),
  update: (id, payload) => httpRequest(`/${resource}/${id}`, { method: "PUT", body: payload }),
  setStatus: (id, status) =>
    httpRequest(`/${resource}/${id}/status`, { method: "PATCH", body: { status } }),
  remove: (id) => httpRequest(`/${resource}/${id}`, { method: "DELETE" }),
  uploadCsv: (file) => {
    const fd = new FormData(); fd.append("file", file);
    return httpRequest(`/${resource}/upload/csv`, { method: "POST", body: fd, isForm: true });
  },
});

export const cameras = deviceApi("cameras");
export const speakers = deviceApi("speakers");
export const microphones = deviceApi("microphones");

// ============================================================
// Violations — REAL (/api/violations)
// ============================================================

export async function getViolations() {
  const data = await httpRequest("/violations");
  return Array.isArray(data) ? data : data?.data || [];
}
export async function getViolationById(id) { return httpRequest(`/violations/${id}`); }
export async function createViolation(payload) { return httpRequest("/violations", { method: "POST", body: payload }); }
export async function updateViolationStatus(id, status) {
  return httpRequest(`/violations/${id}/status`, { method: "PATCH", body: { status } });
}
export async function deleteViolation(id) { return httpRequest(`/violations/${id}`, { method: "DELETE" }); }

// ============================================================
// Camera options helper (for invigilator dashboard dropdowns)
// Derives from real /api/cameras
// ============================================================

export async function getCameraOptions() {
  try {
    const list = await cameras.list();
    return list.map((c) => ({ id: c.id || c._id, name: c.name || c.label || `Camera ${c.id}` }));
  } catch (err) {
    console.error("getCameraOptions failed, returning empty list:", err);
    return [];
  }
}

export async function getExamHallOptions() {
  try {
    const list = await getExamHalls();
    return list.map((h) => ({ id: h.id || h._id, name: h.name }));
  } catch (err) {
    console.error("getExamHallOptions failed, returning empty list:", err);
    return [];
  }
}

// ============================================================
// MOCK ENDPOINTS — backend not yet implemented
// TODO: replace with real calls when these routes ship
// ============================================================

// ---- Invigilator Dashboard (TODO: GET /api/dashboard/invigilator)
export async function getInvigilatorDashboardStats() {
  await delay();
  return { totalStudents: 248, activeAlerts: 12, examHalls: 6 };
}

export async function getCurrentSession() {
  await delay();
  return {
    examName: "CS201 Midterm",
    duration: "2h 30m",
    timeLeft: "1h 15m",
    students: "42 / 45",
  };
}

// ---- Students (TODO: GET /api/students)
const mockStudentList = [
  { id: "1", studentId: "STU2024001", name: "John Smith", seatNumber: "A-01", examHall: "Hall A", status: "Flagged", alertCount: 2, email: "john.smith@university.edu", department: "Computer Science" },
  { id: "2", studentId: "STU2024002", name: "Emily Davis", seatNumber: "A-02", examHall: "Hall A", status: "Normal", alertCount: 0, email: "emily.davis@university.edu", department: "Mathematics" },
  { id: "3", studentId: "STU2024003", name: "Michael Brown", seatNumber: "A-03", examHall: "Hall A", status: "Normal", alertCount: 0, email: "michael.brown@university.edu", department: "Physics" },
  { id: "4", studentId: "STU2024004", name: "Sarah Wilson", seatNumber: "A-04", examHall: "Hall A", status: "Flagged", alertCount: 1, email: "sarah.wilson@university.edu", department: "Chemistry" },
  { id: "5", studentId: "STU2024005", name: "David Lee", seatNumber: "B-01", examHall: "Hall B", status: "Normal", alertCount: 0, email: "david.lee@university.edu", department: "Engineering" },
  { id: "6", studentId: "STU2024006", name: "Jessica Taylor", seatNumber: "B-02", examHall: "Hall B", status: "Normal", alertCount: 0, email: "jessica.taylor@university.edu", department: "Biology" },
  { id: "7", studentId: "STU2024007", name: "Chris Johnson", seatNumber: "B-03", examHall: "Hall B", status: "Flagged", alertCount: 3, email: "chris.johnson@university.edu", department: "Computer Science" },
  { id: "8", studentId: "STU2024008", name: "Amanda White", seatNumber: "C-01", examHall: "Hall C", status: "Normal", alertCount: 0, email: "amanda.white@university.edu", department: "Economics" },
  { id: "9", studentId: "STU2024009", name: "Robert Garcia", seatNumber: "C-02", examHall: "Hall C", status: "Normal", alertCount: 0, email: "robert.garcia@university.edu", department: "History" },
  { id: "10", studentId: "STU2024010", name: "Lisa Martinez", seatNumber: "C-03", examHall: "Hall C", status: "Flagged", alertCount: 1, email: "lisa.martinez@university.edu", department: "Psychology" },
];

export async function getStudentList() {
  await delay();
  return [...mockStudentList];
}

// ---- Admin Dashboard (TODO: GET /api/dashboard/admin)
export async function getAdminDashboardStats() {
  await delay();
  return { totalExamHalls: 8, totalStudents: 486, totalAlertsLogged: 127, examsThisWeek: 12 };
}

export async function getRecentActivity() {
  await delay();
  return [
    { id: 1, action: "Seating plan updated for Hall A", time: "10 mins ago", type: "info" },
    { id: 2, action: "New exam hall 'Hall D' created", time: "1 hour ago", type: "success" },
    { id: 3, action: "15 alerts reviewed in Hall B", time: "2 hours ago", type: "warning" },
    { id: 4, action: "Report generated for midterm exams", time: "3 hours ago", type: "info" },
    { id: 5, action: "Camera 3 offline in Hall C", time: "5 hours ago", type: "error" },
  ];
}

export async function getSystemOverview() {
  await delay();
  return { uptime: "98.5%", activeCameras: 32, pendingIssues: 2, avgResponseTime: "1.2s" };
}

// ---- Seat allocations (TODO: GET/POST /api/seat-allocations)
const createInitialSeating = (rows, cols) =>
  Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => ({
      id: `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`,
      studentId: null,
      studentName: null,
    }))
  );

const seatingStudents = [
  { id: "STU2024001", name: "John Smith" },
  { id: "STU2024002", name: "Emily Davis" },
  { id: "STU2024003", name: "Michael Brown" },
  { id: "STU2024004", name: "Sarah Wilson" },
  { id: "STU2024005", name: "David Lee" },
  { id: "STU2024006", name: "Jessica Taylor" },
  { id: "STU2024007", name: "Chris Johnson" },
  { id: "STU2024008", name: "Amanda White" },
  { id: "STU2024009", name: "Robert Garcia" },
  { id: "STU2024010", name: "Lisa Martinez" },
];

const seatingHalls = [
  { id: "1", name: "Hall A - Block 1", rows: 5, cols: 10, seats: createInitialSeating(5, 10) },
  { id: "2", name: "Hall B - Block 1", rows: 5, cols: 8, seats: createInitialSeating(5, 8) },
  { id: "3", name: "Hall C - Block 2", rows: 6, cols: 12, seats: createInitialSeating(6, 12) },
];

(() => {
  let idx = 0;
  for (const hall of seatingHalls) {
    for (const row of hall.seats) {
      for (const seat of row) {
        if (idx < seatingStudents.length) {
          seat.studentId = seatingStudents[idx].id;
          seat.studentName = seatingStudents[idx].name;
          idx++;
        }
      }
    }
  }
})();

export async function getSeatingHalls() {
  await delay();
  return JSON.parse(JSON.stringify(seatingHalls));
}

export async function getSeatingStudents() {
  await delay();
  return [...seatingStudents];
}

export async function saveSeatingPlan(_halls) {
  await delay();
}

export async function uploadSeatingPlan(_file) {
  await delay();
  return JSON.parse(JSON.stringify(seatingHalls));
}

export async function uploadStudentsList(_file) {
  await delay();
  return [...seatingStudents];
}

// ---- Reports (TODO: GET /api/reports)
const mockReports = [
  { id: "RPT001", date: "2024-01-15", examHall: "Hall A", examName: "CS201 Midterm", totalAlerts: 12, reviewedAlerts: 12, studentsMonitored: 45, duration: "2h 30m" },
  { id: "RPT002", date: "2024-01-15", examHall: "Hall B", examName: "MATH101 Quiz", totalAlerts: 5, reviewedAlerts: 5, studentsMonitored: 38, duration: "1h 00m" },
  { id: "RPT003", date: "2024-01-14", examHall: "Hall C", examName: "PHY301 Final", totalAlerts: 23, reviewedAlerts: 20, studentsMonitored: 52, duration: "3h 00m" },
  { id: "RPT004", date: "2024-01-14", examHall: "Hall A", examName: "ENG102 Midterm", totalAlerts: 8, reviewedAlerts: 8, studentsMonitored: 44, duration: "2h 00m" },
  { id: "RPT005", date: "2024-01-13", examHall: "Hall D", examName: "CHEM201 Quiz", totalAlerts: 3, reviewedAlerts: 3, studentsMonitored: 35, duration: "45m" },
  { id: "RPT006", date: "2024-01-12", examHall: "Hall B", examName: "BIO101 Final", totalAlerts: 15, reviewedAlerts: 14, studentsMonitored: 40, duration: "3h 00m" },
  { id: "RPT007", date: "2024-01-11", examHall: "Hall E", examName: "CS301 Midterm", totalAlerts: 18, reviewedAlerts: 18, studentsMonitored: 45, duration: "2h 30m" },
];

export async function getReports() {
  await delay();
  return [...mockReports];
}

export async function exportReport(_format) {
  await delay();
}
