// Mock API service layer
// Replace these functions with real API calls when ready
// Each function simulates an async API call with a small delay

// Simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================
// Auth / User
// ============================================================

const MOCK_USERS = {
  INV001: { password: "password123", role: "invigilator", name: "Dr. Sarah Johnson" },
  ADM001: { password: "admin123", role: "admin", name: "Prof. Michael Chen" },
};

export async function login(universityId, password) {
  await delay(800);
  const user = MOCK_USERS[universityId];
  if (user && user.password === password) {
    return { id: universityId, name: user.name, role: user.role };
  }
  return null;
}

export function getCurrentUser() {
  const stored = sessionStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
}

// ============================================================
// Invigilator – Dashboard
// ============================================================

export async function getInvigilatorDashboardStats() {
  await delay();
  return { totalStudents: 248, activeAlerts: 12, examHalls: 6 };
}

export async function getExamHallOptions() {
  await delay();
  return [
    { id: "1", name: "Hall A - Block 1" },
    { id: "2", name: "Hall B - Block 1" },
    { id: "3", name: "Hall C - Block 2" },
  ];
}

export async function getCameraOptions() {
  await delay();
  return [
    { id: "1", name: "Camera 01 - Front" },
    { id: "2", name: "Camera 02 - Back" },
    { id: "3", name: "Camera 03 - Side Left" },
    { id: "4", name: "Camera 04 - Side Right" },
  ];
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

// ============================================================
// Invigilator – Alerts
// ============================================================

const mockAlerts = [
  { id: "ALT001", studentId: "STU2024001", studentName: "John Smith", alertType: "Head Turn", time: "10:45 AM", examHall: "Hall A", status: "Pending" },
  { id: "ALT002", studentId: "STU2024015", studentName: "Emily Davis", alertType: "Whisper", time: "10:42 AM", examHall: "Hall A", status: "Pending" },
  { id: "ALT003", studentId: "STU2024023", studentName: "Michael Brown", alertType: "Gesture", time: "10:38 AM", examHall: "Hall B", status: "Reviewed" },
  { id: "ALT004", studentId: "STU2024042", studentName: "David Lee", alertType: "Head Turn", time: "10:30 AM", examHall: "Hall C", status: "Ignored" },
  { id: "ALT005", studentId: "STU2024019", studentName: "Jessica Taylor", alertType: "Whisper", time: "10:28 AM", examHall: "Hall B", status: "Reviewed" },
  { id: "ALT006", studentId: "STU2024031", studentName: "Chris Johnson", alertType: "Gesture", time: "10:25 AM", examHall: "Hall A", status: "Pending" },
  { id: "ALT007", studentId: "STU2024055", studentName: "Amanda White", alertType: "Head Turn", time: "10:22 AM", examHall: "Hall C", status: "Pending" },
];

export async function getAlerts() {
  await delay();
  return [...mockAlerts];
}

export async function updateAlertStatus(alertId, newStatus) {
  await delay();
  const alert = mockAlerts.find((a) => a.id === alertId);
  if (alert) alert.status = newStatus;
}

// ============================================================
// Invigilator – Students
// ============================================================

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

// ============================================================
// Invigilator – Exam Halls
// ============================================================

const mockStudents = [
  { id: "STU001", name: "John Smith", rollNumber: "2024001", department: "Computer Science", email: "john.smith@university.edu" },
  { id: "STU002", name: "Emily Davis", rollNumber: "2024002", department: "Electronics", email: "emily.davis@university.edu" },
  { id: "STU003", name: "Michael Brown", rollNumber: "2024003", department: "Mechanical", email: "michael.brown@university.edu" },
  { id: "STU004", name: "Sarah Wilson", rollNumber: "2024004", department: "Computer Science", email: "sarah.wilson@university.edu" },
  { id: "STU005", name: "David Lee", rollNumber: "2024005", department: "Civil", email: "david.lee@university.edu" },
];

const createSeating = () => [
  [
    { status: "occupied", student: mockStudents[0] },
    { status: "occupied", student: mockStudents[1] },
    { status: "flagged", student: mockStudents[2], alert: { id: "ALT001", alertType: "Head Turn", time: "10:45 AM", status: "Pending" } },
    { status: "occupied", student: mockStudents[3] },
    { status: "occupied", student: mockStudents[4] },
    { status: "empty" },
    { status: "occupied", student: mockStudents[0] },
    { status: "occupied", student: mockStudents[1] },
    { status: "occupied", student: mockStudents[2] },
    { status: "occupied", student: mockStudents[3] },
  ],
  [
    { status: "occupied", student: mockStudents[1] },
    { status: "occupied", student: mockStudents[2] },
    { status: "occupied", student: mockStudents[3] },
    { status: "occupied", student: mockStudents[4] },
    { status: "occupied", student: mockStudents[0] },
    { status: "occupied", student: mockStudents[1] },
    { status: "occupied", student: mockStudents[2] },
    { status: "occupied", student: mockStudents[3] },
    { status: "occupied", student: mockStudents[4] },
    { status: "occupied", student: mockStudents[0] },
  ],
  [
    { status: "occupied", student: mockStudents[2] },
    { status: "occupied", student: mockStudents[3] },
    { status: "occupied", student: mockStudents[4] },
    { status: "occupied", student: mockStudents[0] },
    { status: "occupied", student: mockStudents[1] },
    { status: "occupied", student: mockStudents[2] },
    { status: "occupied", student: mockStudents[3] },
    { status: "empty" },
    { status: "occupied", student: mockStudents[4] },
    { status: "occupied", student: mockStudents[0] },
  ],
  [
    { status: "occupied", student: mockStudents[3] },
    { status: "occupied", student: mockStudents[4] },
    { status: "occupied", student: mockStudents[0] },
    { status: "flagged", student: mockStudents[1], alert: { id: "ALT002", alertType: "Whisper", time: "10:42 AM", status: "Pending" } },
    { status: "occupied", student: mockStudents[2] },
    { status: "occupied", student: mockStudents[3] },
    { status: "occupied", student: mockStudents[4] },
    { status: "occupied", student: mockStudents[0] },
    { status: "occupied", student: mockStudents[1] },
    { status: "occupied", student: mockStudents[2] },
  ],
  [
    { status: "occupied", student: mockStudents[4] },
    { status: "empty" },
    { status: "occupied", student: mockStudents[0] },
    { status: "occupied", student: mockStudents[1] },
    { status: "occupied", student: mockStudents[2] },
    { status: "occupied", student: mockStudents[3] },
    { status: "occupied", student: mockStudents[4] },
    { status: "flagged", student: mockStudents[0], alert: { id: "ALT003", alertType: "Gesture", time: "10:38 AM", status: "Pending" } },
    { status: "occupied", student: mockStudents[1] },
    { status: "empty" },
  ],
];

const mockExamHalls = [
  {
    id: "1",
    name: "Hall A - Block 1",
    totalStudents: 45,
    activeCameras: 4,
    currentAlerts: 3,
    capacity: 50,
    cameras: [
      { id: "c1", name: "Camera 01 - Front", status: "active" },
      { id: "c2", name: "Camera 02 - Back", status: "active" },
      { id: "c3", name: "Camera 03 - Left", status: "active" },
      { id: "c4", name: "Camera 04 - Right", status: "inactive" },
    ],
    seating: createSeating(),
  },
  {
    id: "2",
    name: "Hall B - Block 1",
    totalStudents: 38,
    activeCameras: 3,
    currentAlerts: 1,
    capacity: 40,
    cameras: [
      { id: "c5", name: "Camera 01 - Front", status: "active" },
      { id: "c6", name: "Camera 02 - Back", status: "active" },
      { id: "c7", name: "Camera 03 - Center", status: "active" },
    ],
    seating: [
      [{ status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }],
      [{ status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "empty" }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }],
      [{ status: "occupied", student: mockStudents[2] }, { status: "flagged", student: mockStudents[3], alert: { id: "ALT004", alertType: "Head Turn", time: "10:30 AM", status: "Pending" } }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }],
      [{ status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }],
      [{ status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "empty" }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }],
    ],
  },
  {
    id: "3",
    name: "Hall C - Block 2",
    totalStudents: 52,
    activeCameras: 5,
    currentAlerts: 2,
    capacity: 60,
    cameras: [
      { id: "c8", name: "Camera 01 - Front Left", status: "active" },
      { id: "c9", name: "Camera 02 - Front Right", status: "active" },
      { id: "c10", name: "Camera 03 - Back Left", status: "active" },
      { id: "c11", name: "Camera 04 - Back Right", status: "active" },
      { id: "c12", name: "Camera 05 - Center", status: "active" },
    ],
    seating: [
      [{ status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }],
      [{ status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "flagged", student: mockStudents[4], alert: { id: "ALT005", alertType: "Whisper", time: "10:25 AM", status: "Pending" } }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "empty" }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }],
      [{ status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "empty" }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }],
      [{ status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "flagged", student: mockStudents[1], alert: { id: "ALT006", alertType: "Gesture", time: "10:20 AM", status: "Pending" } }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }],
      [{ status: "empty" }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "empty" }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "empty" }],
    ],
  },
];

export async function getExamHalls() {
  await delay();
  return [...mockExamHalls];
}

// ============================================================
// Admin – Dashboard
// ============================================================

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

// ============================================================
// Admin – Exam Halls
// ============================================================

const adminExamHalls = [
  { id: "1", name: "Hall A", capacity: 50, cameras: 4, status: "Active", block: "Block 1" },
  { id: "2", name: "Hall B", capacity: 40, cameras: 3, status: "Active", block: "Block 1" },
  { id: "3", name: "Hall C", capacity: 60, cameras: 5, status: "Active", block: "Block 2" },
  { id: "4", name: "Hall D", capacity: 35, cameras: 3, status: "Maintenance", block: "Block 2" },
  { id: "5", name: "Hall E", capacity: 45, cameras: 4, status: "Active", block: "Block 3" },
  { id: "6", name: "Hall F", capacity: 55, cameras: 4, status: "Inactive", block: "Block 3" },
];

export async function getAdminExamHalls() {
  await delay();
  return [...adminExamHalls];
}

export async function createAdminExamHall(hall) {
  await delay();
  const newHall = { ...hall, id: Date.now().toString() };
  adminExamHalls.push(newHall);
  return newHall;
}

export async function updateAdminExamHall(id, data) {
  await delay();
  const index = adminExamHalls.findIndex((h) => h.id === id);
  if (index !== -1) Object.assign(adminExamHalls[index], data);
}

export async function deleteAdminExamHall(id) {
  await delay();
  const index = adminExamHalls.findIndex((h) => h.id === id);
  if (index !== -1) adminExamHalls.splice(index, 1);
}

// ============================================================
// Admin – Seating
// ============================================================

const createInitialSeating = (rows, cols) => {
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => ({
      id: `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`,
      studentId: null,
      studentName: null,
    }))
  );
};

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

// Pre-populate seats with students
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

export async function saveSeatingPlan(halls) {
  await delay();
  // In real API, persist to database
}

export async function uploadSeatingPlan(_file) {
  await delay();
  return JSON.parse(JSON.stringify(seatingHalls));
}

export async function uploadStudentsList(_file) {
  await delay();
  return [...seatingStudents];
}

// ============================================================
// Admin – Reports
// ============================================================

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
  // In real API, trigger file download
}
