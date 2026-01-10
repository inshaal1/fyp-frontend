import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Users, Camera, AlertTriangle, Monitor, User } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const mockUser = {
  name: "Dr. Sarah Johnson",
  id: "INV001",
  role: "invigilator" as const,
};

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  email: string;
}

interface SeatInfo {
  status: "occupied" | "empty" | "flagged";
  student?: Student;
}

interface ExamHall {
  id: string;
  name: string;
  totalStudents: number;
  activeCameras: number;
  currentAlerts: number;
  capacity: number;
  cameras: { id: string; name: string; status: "active" | "inactive" }[];
  seating: SeatInfo[][];
}

const mockStudents: Student[] = [
  { id: "STU001", name: "John Smith", rollNumber: "2024001", department: "Computer Science", email: "john.smith@university.edu" },
  { id: "STU002", name: "Emily Davis", rollNumber: "2024002", department: "Electronics", email: "emily.davis@university.edu" },
  { id: "STU003", name: "Michael Brown", rollNumber: "2024003", department: "Mechanical", email: "michael.brown@university.edu" },
  { id: "STU004", name: "Sarah Wilson", rollNumber: "2024004", department: "Computer Science", email: "sarah.wilson@university.edu" },
  { id: "STU005", name: "David Lee", rollNumber: "2024005", department: "Civil", email: "david.lee@university.edu" },
];

const createSeating = (): SeatInfo[][] => [
  [
    { status: "occupied", student: mockStudents[0] },
    { status: "occupied", student: mockStudents[1] },
    { status: "flagged", student: mockStudents[2] },
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
    { status: "flagged", student: mockStudents[1] },
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
    { status: "flagged", student: mockStudents[0] },
    { status: "occupied", student: mockStudents[1] },
    { status: "empty" },
  ],
];

const mockExamHalls: ExamHall[] = [
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
      [{ status: "occupied", student: mockStudents[2] }, { status: "flagged", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }],
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
      [{ status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "flagged", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "empty" }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }],
      [{ status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "empty" }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }],
      [{ status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "flagged", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "occupied", student: mockStudents[4] }],
      [{ status: "empty" }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "empty" }, { status: "occupied", student: mockStudents[4] }, { status: "occupied", student: mockStudents[0] }, { status: "occupied", student: mockStudents[1] }, { status: "occupied", student: mockStudents[2] }, { status: "occupied", student: mockStudents[3] }, { status: "empty" }],
    ],
  },
];

const seatColors = {
  occupied: "bg-success/60 border-success",
  empty: "bg-muted border-border",
  flagged: "bg-destructive/60 border-destructive animate-pulse-soft",
};

export default function InvigilatorExamHalls() {
  const navigate = useNavigate();
  const [selectedHallId, setSelectedHallId] = useState("1");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const selectedHall = mockExamHalls.find(h => h.id === selectedHallId) || mockExamHalls[0];

  const handleSeatClick = (seat: SeatInfo, seatLabel: string) => {
    if (seat.status === "empty") {
      toast({
        title: "Empty Seat",
        description: `Seat ${seatLabel} - No student assigned`,
      });
    } else if (seat.status === "flagged") {
      navigate("/invigilator/alerts");
    } else if (seat.status === "occupied" && seat.student) {
      setSelectedStudent(seat.student);
    }
  };

  return (
    <DashboardLayout
      userRole={mockUser.role}
      userName={mockUser.name}
      userId={mockUser.id}
      pageTitle="Exam Hall Details"
    >
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Hall Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="text-sm font-medium text-foreground">Select Exam Hall:</label>
          <Select value={selectedHallId} onValueChange={setSelectedHallId}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockExamHalls.map((hall) => (
                <SelectItem key={hall.id} value={hall.id}>
                  {hall.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Hall Name"
            value={selectedHall.name.split(" - ")[0]}
            icon={Building2}
            variant="primary"
          />
          <StatCard
            title="Total Students"
            value={`${selectedHall.totalStudents} / ${selectedHall.capacity}`}
            icon={Users}
            variant="default"
          />
          <StatCard
            title="Active Cameras"
            value={selectedHall.activeCameras}
            icon={Camera}
            variant="accent"
          />
          <StatCard
            title="Current Alerts"
            value={selectedHall.currentAlerts}
            icon={AlertTriangle}
            variant={selectedHall.currentAlerts > 0 ? "destructive" : "default"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Seating Layout */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-4 sm:p-6 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Seating Layout</h3>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-success/60 border border-success" />
                  <span className="text-muted-foreground">Occupied</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-muted border border-border" />
                  <span className="text-muted-foreground">Empty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-destructive/60 border border-destructive" />
                  <span className="text-muted-foreground">Flagged</span>
                </div>
              </div>
            </div>
            
            {/* Stage/Front indicator */}
            <div className="mb-4 text-center">
              <div className="inline-block px-4 sm:px-6 py-1 bg-muted rounded text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Front / Stage
              </div>
            </div>

            {/* Seating Grid */}
            <div className="flex flex-col gap-1 sm:gap-2 items-center overflow-x-auto pb-2">
              {selectedHall.seating.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1 sm:gap-2">
                  <span className="w-5 sm:w-6 text-xs text-muted-foreground flex items-center justify-center">
                    {String.fromCharCode(65 + rowIndex)}
                  </span>
                  {row.map((seat, seatIndex) => {
                    const seatLabel = `${String.fromCharCode(65 + rowIndex)}${seatIndex + 1}`;
                    return (
                      <div
                        key={seatIndex}
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded border-2 transition-all duration-200 hover:scale-110 cursor-pointer ${seatColors[seat.status]}`}
                        title={`Seat ${seatLabel} - ${seat.status}${seat.student ? ` (${seat.student.name})` : ''}`}
                        onClick={() => handleSeatClick(seat, seatLabel)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Camera List */}
          <div className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-card">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Camera List</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {selectedHall.cameras.map((camera) => (
                <div
                  key={camera.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border"
                >
                  <div className={`p-2 rounded-lg ${camera.status === "active" ? "bg-success/10" : "bg-muted"}`}>
                    <Monitor className={`h-4 w-4 ${camera.status === "active" ? "text-success" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{camera.name}</p>
                    <p className={`text-xs ${camera.status === "active" ? "text-success" : "text-muted-foreground"}`}>
                      {camera.status === "active" ? "● Active" : "○ Inactive"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Detail Modal */}
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Student Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedStudent && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStudent.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Roll Number</p>
                    <p className="font-medium">{selectedStudent.rollNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Department</p>
                    <p className="font-medium">{selectedStudent.department}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                    <p className="font-medium text-sm">{selectedStudent.email}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
