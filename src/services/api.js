// ============================================================
// API service layer — DEMO MOCKS
//
// Everything here is in-memory mock data so the UI can be
// built and demoed without a backend. Each section is shaped
// to match the planned REST endpoints; swap the mock body
// with a fetch() call when you integrate the real server.
//
// Real base URL (for later): http://localhost:5000/api
// Auth header (for later):   Authorization: Bearer <token>
// ============================================================

const TOKEN_KEY = "token";
const USER_KEY = "user";
const ROLE_KEY = "role";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const uid = (prefix = "id") =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const clone = (v) => JSON.parse(JSON.stringify(v));

// ============================================================
// AUTH
// ============================================================

const DEMO_USERS = [
  {
    id: "u-adm-001",
    email: "admin@eyeson.ai",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "u-inv-001",
    email: "inv@eyeson.ai",
    password: "password123",
    name: "Invigilator User",
    role: "invigilator",
    hallIds: ["hall-1", "hall-2"], // halls this invigilator covers
  },
];

export async function login(email, password) {
  await delay(400);
  const match = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password
  );
  if (!match) {
    return { error: "Invalid credentials. Try admin@eyeson.ai/admin123 or inv@eyeson.ai/password123" };
  }
  const { password: _pw, ...user } = match;
  sessionStorage.setItem(TOKEN_KEY, `demo-token-${user.id}`);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  sessionStorage.setItem(ROLE_KEY, user.role);
  return { user };
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(ROLE_KEY);
}

export function getCurrentUser() {
  const stored = sessionStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

// ============================================================
// MOCK DATA STORES
// ============================================================

const invigilatorsStore = [
  { id: "inv-1", name: "Sarah Connor",  email: "sarah@eyeson.ai",  phone: "+1 555 0101", department: "Computer Science" },
  { id: "inv-2", name: "James Holden",  email: "james@eyeson.ai",  phone: "+1 555 0102", department: "Mathematics" },
  { id: "inv-3", name: "Naomi Nagata",  email: "naomi@eyeson.ai",  phone: "+1 555 0103", department: "Physics" },
  { id: "inv-4", name: "Amos Burton",   email: "amos@eyeson.ai",   phone: "+1 555 0104", department: "Engineering" },
];

const examHallsStore = [
  { id: "hall-1", hallNumber: "A-101", floor: 1, capacity: 60, location: "Block A, Ground", status: "open" },
  { id: "hall-2", hallNumber: "A-202", floor: 2, capacity: 50, location: "Block A, Floor 2", status: "open" },
  { id: "hall-3", hallNumber: "B-105", floor: 1, capacity: 40, location: "Block B, Ground", status: "closed" },
  { id: "hall-4", hallNumber: "C-310", floor: 3, capacity: 80, location: "Block C, Floor 3", status: "open" },
];

const examsStore = [
  { id: "exam-1", name: "CS201 Midterm",   subject: "Algorithms",      date: "2026-05-02", startTime: "09:00", endTime: "11:00", status: "scheduled", hallId: "hall-1" },
  { id: "exam-2", name: "MATH101 Quiz",    subject: "Calculus I",      date: "2026-04-25", startTime: "13:00", endTime: "14:00", status: "active",    hallId: "hall-2" },
  { id: "exam-3", name: "PHY301 Final",    subject: "Quantum Physics", date: "2026-04-20", startTime: "10:00", endTime: "13:00", status: "ended",     hallId: "hall-4" },
  { id: "exam-4", name: "ENG102 Midterm",  subject: "English Lit",     date: "2026-05-10", startTime: "14:00", endTime: "16:00", status: "scheduled", hallId: "hall-1" },
];

const camerasStore = [
  { id: "cam-1", position: "Front-Left",  ipAddress: "10.0.1.11", model: "Hikvision DS-2CD", hallId: "hall-1", isActive: true  },
  { id: "cam-2", position: "Front-Right", ipAddress: "10.0.1.12", model: "Hikvision DS-2CD", hallId: "hall-1", isActive: true  },
  { id: "cam-3", position: "Rear-Center", ipAddress: "10.0.1.13", model: "Axis P3245",       hallId: "hall-2", isActive: false },
  { id: "cam-4", position: "Front-Left",  ipAddress: "10.0.1.14", model: "Axis P3245",       hallId: "hall-4", isActive: true  },
];

const speakersStore = [
  { id: "spk-1", label: "Front Speaker",  ipAddress: "10.0.2.11", volume: 70, status: "active",   hallId: "hall-1" },
  { id: "spk-2", label: "Rear Speaker",   ipAddress: "10.0.2.12", volume: 60, status: "inactive", hallId: "hall-1" },
  { id: "spk-3", label: "Center Speaker", ipAddress: "10.0.2.13", volume: 80, status: "offline",  hallId: "hall-2" },
];

const microphonesStore = [
  { id: "mic-1", range: "5m", sensitivity: "High",   hallId: "hall-1", row: 1, column: 1, isActive: true  },
  { id: "mic-2", range: "5m", sensitivity: "Medium", hallId: "hall-1", row: 2, column: 3, isActive: true  },
  { id: "mic-3", range: "3m", sensitivity: "High",   hallId: "hall-2", row: 1, column: 2, isActive: false },
];

const violationsStore = [
  { id: "vio-1", type: "Whispering",    timestamp: "2026-04-25T13:12:04Z", confidence: 0.91, hallId: "hall-2", studentId: "STU2024007", status: "pending",   evidencePath: "/evidence/vio-1.mp4", cameraId: "cam-3", micId: "mic-3" },
  { id: "vio-2", type: "Head Turning",  timestamp: "2026-04-25T13:18:55Z", confidence: 0.78, hallId: "hall-1", studentId: "STU2024001", status: "reviewed",  evidencePath: "/evidence/vio-2.mp4", cameraId: "cam-1", micId: "mic-1" },
  { id: "vio-3", type: "Hand Gesture",  timestamp: "2026-04-25T13:22:11Z", confidence: 0.66, hallId: "hall-1", studentId: "STU2024004", status: "pending",   evidencePath: "/evidence/vio-3.mp4", cameraId: "cam-2", micId: "mic-2" },
  { id: "vio-4", type: "Whispering",    timestamp: "2026-04-25T13:30:42Z", confidence: 0.83, hallId: "hall-4", studentId: "STU2024010", status: "dismissed", evidencePath: "/evidence/vio-4.mp4", cameraId: "cam-4", micId: "mic-1" },
];

const alertsStore = [
  { id: "alert-1", violationType: "Whispering",   sentTo: "inv-1", hallId: "hall-2", studentId: "STU2024007", status: "pending",  timestamp: "2026-04-25T13:12:09Z" },
  { id: "alert-2", violationType: "Head Turning", sentTo: "inv-1", hallId: "hall-1", studentId: "STU2024001", status: "reviewed", timestamp: "2026-04-25T13:19:00Z" },
  { id: "alert-3", violationType: "Hand Gesture", sentTo: "inv-2", hallId: "hall-1", studentId: "STU2024004", status: "pending",  timestamp: "2026-04-25T13:22:18Z" },
  { id: "alert-4", violationType: "Whispering",   sentTo: "inv-3", hallId: "hall-4", studentId: "STU2024010", status: "pending",  timestamp: "2026-04-25T13:30:50Z" },
];

// ============================================================
// Generic CRUD helper
// ============================================================
function crud(store, prefix) {
  return {
    list: async () => { await delay(); return clone(store); },
    get:  async (id) => { await delay(); return clone(store.find((x) => x.id === id) || null); },
    create: async (payload) => {
      await delay();
      const item = { id: uid(prefix), ...payload };
      store.push(item);
      return clone(item);
    },
    update: async (id, payload) => {
      await delay();
      const idx = store.findIndex((x) => x.id === id);
      if (idx < 0) throw new Error("Not found");
      store[idx] = { ...store[idx], ...payload, id };
      return clone(store[idx]);
    },
    setStatus: async (id, status) => {
      await delay();
      const idx = store.findIndex((x) => x.id === id);
      if (idx < 0) throw new Error("Not found");
      store[idx].status = status;
      return clone(store[idx]);
    },
    setActive: async (id, isActive) => {
      await delay();
      const idx = store.findIndex((x) => x.id === id);
      if (idx < 0) throw new Error("Not found");
      store[idx].isActive = isActive;
      return clone(store[idx]);
    },
    remove: async (id) => {
      await delay();
      const idx = store.findIndex((x) => x.id === id);
      if (idx < 0) throw new Error("Not found");
      store.splice(idx, 1);
      return { success: true };
    },
    uploadCsv: async (_file) => {
      await delay(500);
      return { success: true, message: "CSV processed (demo)" };
    },
  };
}

// ============================================================
// EXPORTED RESOURCES
// ============================================================

// ----- Invigilators -----
const invigilatorsCrud = crud(invigilatorsStore, "inv");
export const getInvigilators       = invigilatorsCrud.list;
export const getInvigilatorById    = invigilatorsCrud.get;
export const createInvigilator     = invigilatorsCrud.create;
export const updateInvigilator     = invigilatorsCrud.update;
export const deleteInvigilator     = invigilatorsCrud.remove;
export const uploadInvigilatorsCsv = invigilatorsCrud.uploadCsv;

// ----- Exam Halls -----
const hallsCrud = crud(examHallsStore, "hall");
export const getExamHalls           = hallsCrud.list;
export const getAdminExamHalls      = hallsCrud.list;
export const getExamHallById        = hallsCrud.get;
export const createAdminExamHall    = hallsCrud.create;
export const uploadExamHallsCsv     = hallsCrud.uploadCsv;
export async function updateAdminExamHallStatus(id, status) {
  return hallsCrud.setStatus(id, status);
}
export async function deleteAdminExamHall(id) {
  // block delete if an active exam exists in this hall
  const blocking = examsStore.find((e) => e.hallId === id && e.status === "active");
  if (blocking) {
    throw new Error(`Cannot delete: hall has an active exam (${blocking.name}).`);
  }
  return hallsCrud.remove(id);
}
export async function updateAdminExamHall(id, data) {
  if (data?.status) return hallsCrud.setStatus(id, data.status);
  return hallsCrud.update(id, data);
}

// ----- Exams -----
const examsCrud = crud(examsStore, "exam");
export const getExams        = examsCrud.list;
export const getExamById     = examsCrud.get;
export const createExam      = examsCrud.create;
export const updateExam      = examsCrud.update;
export const deleteExam      = examsCrud.remove;
export const uploadExamsCsv  = examsCrud.uploadCsv;
export async function refreshExamStatuses() { await delay(); return { success: true }; }

// ----- Cameras / Speakers / Microphones -----
export const cameras     = crud(camerasStore, "cam");
export const speakers    = crud(speakersStore, "spk");
export const microphones = crud(microphonesStore, "mic");

// ----- Violations -----
const violationsCrud = crud(violationsStore, "vio");
export const getViolations          = violationsCrud.list;
export const getViolationById       = violationsCrud.get;
export const createViolation        = violationsCrud.create;
export const deleteViolation        = violationsCrud.remove;
export async function updateViolationStatus(id, status) {
  return violationsCrud.setStatus(id, status);
}

// ----- Alerts -----
const alertsCrud = crud(alertsStore, "alert");
export async function getAlerts() {
  await delay();
  const user = getCurrentUser();
  if (user?.role === "invigilator") {
    const myHalls = new Set(user.hallIds || []);
    return clone(alertsStore.filter((a) => myHalls.has(a.hallId)));
  }
  return clone(alertsStore);
}
export const getAlertById     = alertsCrud.get;
export const createAlert      = alertsCrud.create;
export const deleteAlert      = alertsCrud.remove;
export async function updateAlertStatus(id, status) {
  return alertsCrud.setStatus(id, status);
}

// ----- Helpers used across pages -----
export async function getCameraOptions() {
  await delay();
  return camerasStore.map((c) => ({ id: c.id, name: `${c.position} (${c.ipAddress})` }));
}
export async function getExamHallOptions() {
  await delay();
  return examHallsStore.map((h) => ({ id: h.id, name: h.hallNumber }));
}

// ============================================================
// LEGACY mocks still used by older Seating / Reports / Students pages
// ============================================================

export async function getInvigilatorDashboardStats() {
  await delay();
  const user = getCurrentUser();
  const myHalls = new Set(user?.hallIds || []);
  const activeExamsInMyHalls = examsStore.filter((e) => myHalls.has(e.hallId) && e.status === "active").length;
  const pendingAlerts = alertsStore.filter((a) => myHalls.has(a.hallId) && a.status === "pending").length;
  return { totalStudents: 248, activeAlerts: pendingAlerts, examHalls: myHalls.size, activeExamsInMyHalls };
}

export async function getCurrentSession() {
  await delay();
  return { examName: "CS201 Midterm", duration: "2h 30m", timeLeft: "1h 15m", students: "42 / 45" };
}

const mockStudentList = [
  { id: "1",  studentId: "STU2024001", name: "John Smith",     seatNumber: "A-01", examHall: "Hall A", status: "Flagged", alertCount: 2, email: "john.smith@university.edu",     department: "Computer Science" },
  { id: "2",  studentId: "STU2024002", name: "Emily Davis",    seatNumber: "A-02", examHall: "Hall A", status: "Normal",  alertCount: 0, email: "emily.davis@university.edu",    department: "Mathematics" },
  { id: "3",  studentId: "STU2024003", name: "Michael Brown",  seatNumber: "A-03", examHall: "Hall A", status: "Normal",  alertCount: 0, email: "michael.brown@university.edu",  department: "Physics" },
  { id: "4",  studentId: "STU2024004", name: "Sarah Wilson",   seatNumber: "A-04", examHall: "Hall A", status: "Flagged", alertCount: 1, email: "sarah.wilson@university.edu",   department: "Chemistry" },
  { id: "5",  studentId: "STU2024005", name: "David Lee",      seatNumber: "B-01", examHall: "Hall B", status: "Normal",  alertCount: 0, email: "david.lee@university.edu",      department: "Engineering" },
  { id: "6",  studentId: "STU2024006", name: "Jessica Taylor", seatNumber: "B-02", examHall: "Hall B", status: "Normal",  alertCount: 0, email: "jessica.taylor@university.edu", department: "Biology" },
  { id: "7",  studentId: "STU2024007", name: "Chris Johnson",  seatNumber: "B-03", examHall: "Hall B", status: "Flagged", alertCount: 3, email: "chris.johnson@university.edu",  department: "Computer Science" },
  { id: "8",  studentId: "STU2024008", name: "Amanda White",   seatNumber: "C-01", examHall: "Hall C", status: "Normal",  alertCount: 0, email: "amanda.white@university.edu",   department: "Economics" },
  { id: "9",  studentId: "STU2024009", name: "Robert Garcia",  seatNumber: "C-02", examHall: "Hall C", status: "Normal",  alertCount: 0, email: "robert.garcia@university.edu",  department: "History" },
  { id: "10", studentId: "STU2024010", name: "Lisa Martinez",  seatNumber: "C-03", examHall: "Hall C", status: "Flagged", alertCount: 1, email: "lisa.martinez@university.edu",  department: "Psychology" },
];
export async function getStudentList() { await delay(); return [...mockStudentList]; }

export async function getAdminDashboardStats() {
  await delay();
  return {
    totalInvigilators: invigilatorsStore.length,
    totalExams:        examsStore.length,
    totalExamHalls:    examHallsStore.length,
    totalCameras:      camerasStore.length,
    totalSpeakers:     speakersStore.length,
    totalMicrophones:  microphonesStore.length,
    // legacy fields kept for the old AdminDashboard page
    totalStudents: 486,
    totalAlertsLogged: alertsStore.length,
    examsThisWeek: examsStore.length,
  };
}

export async function getRecentActivity() {
  await delay();
  return [
    { id: 1, action: "Seating plan updated for Hall A",         time: "10 mins ago", type: "info" },
    { id: 2, action: "New exam hall 'Hall D' created",          time: "1 hour ago",  type: "success" },
    { id: 3, action: "15 alerts reviewed in Hall B",            time: "2 hours ago", type: "warning" },
    { id: 4, action: "Report generated for midterm exams",      time: "3 hours ago", type: "info" },
    { id: 5, action: "Camera 3 offline in Hall C",              time: "5 hours ago", type: "error" },
  ];
}

export async function getSystemOverview() {
  await delay();
  return { uptime: "98.5%", activeCameras: camerasStore.filter(c => c.isActive).length, pendingIssues: 2, avgResponseTime: "1.2s" };
}

// ----- Seating (legacy) -----
const createInitialSeating = (rows, cols) =>
  Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      id: `${String.fromCharCode(65 + r)}${c + 1}`,
      studentId: null,
      studentName: null,
    }))
  );

const seatingStudents = mockStudentList.map((s) => ({ id: s.studentId, name: s.name }));
const seatingHalls = [
  { id: "1", name: "Hall A - Block 1", rows: 5, cols: 10, seats: createInitialSeating(5, 10) },
  { id: "2", name: "Hall B - Block 1", rows: 5, cols: 8,  seats: createInitialSeating(5, 8)  },
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

export async function getSeatingHalls()   { await delay(); return clone(seatingHalls); }
export async function getSeatingStudents(){ await delay(); return [...seatingStudents]; }
export async function saveSeatingPlan()   { await delay(); }
export async function uploadSeatingPlan() { await delay(); return clone(seatingHalls); }
export async function uploadStudentsList(){ await delay(); return [...seatingStudents]; }

// ----- Reports (legacy) -----
const mockReports = [
  { id: "RPT001", date: "2024-01-15", examHall: "Hall A", examName: "CS201 Midterm",    totalAlerts: 12, reviewedAlerts: 12, studentsMonitored: 45, duration: "2h 30m" },
  { id: "RPT002", date: "2024-01-15", examHall: "Hall B", examName: "MATH101 Quiz",     totalAlerts: 5,  reviewedAlerts: 5,  studentsMonitored: 38, duration: "1h 00m" },
  { id: "RPT003", date: "2024-01-14", examHall: "Hall C", examName: "PHY301 Final",     totalAlerts: 23, reviewedAlerts: 20, studentsMonitored: 52, duration: "3h 00m" },
  { id: "RPT004", date: "2024-01-14", examHall: "Hall A", examName: "ENG102 Midterm",   totalAlerts: 8,  reviewedAlerts: 8,  studentsMonitored: 44, duration: "2h 00m" },
];
export async function getReports() { await delay(); return [...mockReports]; }
export async function exportReport() { await delay(); }

// ----- Invigilator Hall Details (legacy rich data) -----
function buildSeating(rows, cols, flagged = []) {
  const grid = [];
  let studentIdx = 0;
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const isFlagged = flagged.some(f => f.r === r && f.c === c);
      const studentSrc = mockStudentList[studentIdx % mockStudentList.length];
      const student = {
        id: studentSrc.studentId,
        name: studentSrc.name,
        rollNumber: studentSrc.studentId,
        department: studentSrc.department,
        email: studentSrc.email,
      };
      const seat = isFlagged
        ? { status: "flagged", student, alert: { id: `ALT-${r}${c}`, alertType: "Whisper", time: "10:24 AM", status: "Pending" } }
        : (Math.random() > 0.15 ? { status: "occupied", student } : { status: "empty" });
      row.push(seat);
      studentIdx++;
    }
    grid.push(row);
  }
  return grid;
}
const invigilatorHallsRich = [
  {
    id: "1", name: "Hall A - Block 1", capacity: 50, totalStudents: 45, activeCameras: 4, currentAlerts: 2,
    seating: buildSeating(5, 10, [{ r: 0, c: 3 }, { r: 2, c: 5 }]),
    cameras: [
      { id: "c1", name: "Camera 1 - Front Left",  status: "active" },
      { id: "c2", name: "Camera 2 - Front Right", status: "active" },
      { id: "c3", name: "Camera 3 - Back Left",   status: "active" },
      { id: "c4", name: "Camera 4 - Back Right",  status: "inactive" },
    ],
  },
  {
    id: "2", name: "Hall B - Block 1", capacity: 40, totalStudents: 38, activeCameras: 3, currentAlerts: 1,
    seating: buildSeating(5, 8, [{ r: 1, c: 2 }]),
    cameras: [
      { id: "c5", name: "Camera 1 - Front", status: "active" },
      { id: "c6", name: "Camera 2 - Mid",   status: "active" },
      { id: "c7", name: "Camera 3 - Back",  status: "active" },
    ],
  },
];
export async function getInvigilatorHallDetails() { await delay(); return clone(invigilatorHallsRich); }
