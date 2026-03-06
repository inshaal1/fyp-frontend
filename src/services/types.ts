// Shared types used across the application
// When switching to real APIs, these types remain the same

export interface User {
  name: string;
  id: string;
  role: "invigilator" | "admin";
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  email: string;
}

export interface StudentListItem {
  id: string;
  studentId: string;
  name: string;
  seatNumber: string;
  examHall: string;
  status: "Normal" | "Flagged";
  alertCount: number;
  email: string;
  department: string;
}

export interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  alertType: "Whisper" | "Head Turn" | "Gesture";
  time: string;
  examHall: string;
  status: "Pending" | "Reviewed" | "Ignored";
}

export interface SeatAlert {
  id: string;
  alertType: "Whisper" | "Head Turn" | "Gesture";
  time: string;
  status: "Pending" | "Reviewed" | "Ignored";
}

export interface SeatInfo {
  status: "occupied" | "empty" | "flagged";
  student?: Student;
  alert?: SeatAlert;
}

export interface Camera {
  id: string;
  name: string;
  status: "active" | "inactive";
}

export interface ExamHall {
  id: string;
  name: string;
  totalStudents: number;
  activeCameras: number;
  currentAlerts: number;
  capacity: number;
  cameras: Camera[];
  seating: SeatInfo[][];
}

export interface AdminExamHall {
  id: string;
  name: string;
  capacity: number;
  cameras: number;
  status: "Active" | "Inactive" | "Maintenance";
  block: string;
}

export interface Seat {
  id: string;
  studentId: string | null;
  studentName: string | null;
}

export interface SeatingHall {
  id: string;
  name: string;
  rows: number;
  cols: number;
  seats: Seat[][];
}

export interface SimpleStudent {
  id: string;
  name: string;
}

export interface Report {
  id: string;
  date: string;
  examHall: string;
  examName: string;
  totalAlerts: number;
  reviewedAlerts: number;
  studentsMonitored: number;
  duration: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeAlerts: number;
  examHalls: number;
}

export interface AdminDashboardStats {
  totalExamHalls: number;
  totalStudents: number;
  totalAlertsLogged: number;
  examsThisWeek: number;
}

export interface ActivityItem {
  id: number;
  action: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
}

export interface SystemOverview {
  uptime: string;
  activeCameras: number;
  pendingIssues: number;
  avgResponseTime: string;
}

export interface ExamHallOption {
  id: string;
  name: string;
}

export interface CameraOption {
  id: string;
  name: string;
}
