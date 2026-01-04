import { useState, useRef } from "react";
import { Save, RotateCcw, User, X, Upload, FileSpreadsheet, Check } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const mockUser = {
  name: "Prof. Michael Chen",
  id: "ADM001",
  role: "admin" as const,
};

interface Seat {
  id: string;
  studentId: string | null;
  studentName: string | null;
}

interface ExamHall {
  id: string;
  name: string;
  rows: number;
  cols: number;
  seats: Seat[][];
}

interface Student {
  id: string;
  name: string;
}

const createInitialSeating = (rows: number, cols: number): Seat[][] => {
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => ({
      id: `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`,
      studentId: null,
      studentName: null,
    }))
  );
};

export default function AdminSeating() {
  const [seatingPlanUploaded, setSeatingPlanUploaded] = useState(false);
  const [studentsUploaded, setStudentsUploaded] = useState(false);
  const [halls, setHalls] = useState<ExamHall[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedHallId, setSelectedHallId] = useState<string>("");
  const [selectedSeat, setSelectedSeat] = useState<{ row: number; col: number } | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  
  const seatingPlanInputRef = useRef<HTMLInputElement>(null);
  const studentsInputRef = useRef<HTMLInputElement>(null);

  const selectedHall = halls.find((h) => h.id === selectedHallId) || halls[0];

  const handleSeatingPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mock parsing seating plan file - in real app this would parse CSV/Excel
    const mockHalls: ExamHall[] = [
      {
        id: "1",
        name: "Hall A - Block 1",
        rows: 5,
        cols: 10,
        seats: createInitialSeating(5, 10),
      },
      {
        id: "2",
        name: "Hall B - Block 1",
        rows: 5,
        cols: 8,
        seats: createInitialSeating(5, 8),
      },
      {
        id: "3",
        name: "Hall C - Block 2",
        rows: 6,
        cols: 12,
        seats: createInitialSeating(6, 12),
      },
    ];

    setHalls(mockHalls);
    setSelectedHallId(mockHalls[0].id);
    setSeatingPlanUploaded(true);
    toast.success(`Seating plan uploaded: ${file.name}`);
  };

  const handleStudentsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mock parsing students file - in real app this would parse CSV/Excel
    const mockStudents: Student[] = [
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

    setStudents(mockStudents);
    setStudentsUploaded(true);
    toast.success(`Students file uploaded: ${file.name}`);

    // Auto-map students to seats
    autoMapStudents(mockStudents);
  };

  const autoMapStudents = (studentList: Student[]) => {
    setHalls((prev) => {
      let studentIndex = 0;
      return prev.map((hall) => {
        const newSeats = hall.seats.map((row) =>
          row.map((seat) => {
            if (studentIndex < studentList.length) {
              const student = studentList[studentIndex];
              studentIndex++;
              return { ...seat, studentId: student.id, studentName: student.name };
            }
            return seat;
          })
        );
        return { ...hall, seats: newSeats };
      });
    });
    toast.success("Students automatically mapped to seats");
  };

  const handleAssignStudent = (studentId: string, studentName: string) => {
    if (!selectedSeat) return;

    setHalls((prev) =>
      prev.map((hall) => {
        if (hall.id !== selectedHallId) return hall;

        const newSeats = hall.seats.map((row, rowIndex) =>
          row.map((seat, colIndex) => {
            // Clear student from previous seat
            if (seat.studentId === studentId) {
              return { ...seat, studentId: null, studentName: null };
            }
            // Assign to new seat
            if (rowIndex === selectedSeat.row && colIndex === selectedSeat.col) {
              return { ...seat, studentId, studentName };
            }
            return seat;
          })
        );

        return { ...hall, seats: newSeats };
      })
    );

    setSelectedSeat(null);
    setStudentSearch("");
    toast.success(`${studentName} assigned to seat ${selectedHall.seats[selectedSeat.row][selectedSeat.col].id}`);
  };

  const handleClearSeat = (row: number, col: number) => {
    setHalls((prev) =>
      prev.map((hall) => {
        if (hall.id !== selectedHallId) return hall;

        const newSeats = hall.seats.map((r, rowIndex) =>
          r.map((seat, colIndex) => {
            if (rowIndex === row && colIndex === col) {
              return { ...seat, studentId: null, studentName: null };
            }
            return seat;
          })
        );

        return { ...hall, seats: newSeats };
      })
    );
    toast.info("Seat cleared");
  };

  const handleReset = () => {
    setHalls((prev) =>
      prev.map((hall) => {
        if (hall.id !== selectedHallId) return hall;
        return { ...hall, seats: createInitialSeating(hall.rows, hall.cols) };
      })
    );
    toast.info("Seating layout reset");
  };

  const handleSave = () => {
    toast.success("Seating plan saved successfully!");
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const assignedCount = selectedHall?.seats.flat().filter((s) => s.studentId).length || 0;
  const totalSeats = selectedHall ? selectedHall.rows * selectedHall.cols : 0;

  // Upload UI when no seating plan is uploaded yet
  if (!seatingPlanUploaded) {
    return (
      <DashboardLayout
        userRole={mockUser.role}
        userName={mockUser.name}
        userId={mockUser.id}
        pageTitle="Manage Seating Plan"
      >
        <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <FileSpreadsheet className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Upload Seating Plan</h2>
              <p className="text-muted-foreground text-sm">
                Upload a seating plan file (CSV/Excel) to define exam halls and seat layouts
              </p>
            </div>
            <input
              ref={seatingPlanInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleSeatingPlanUpload}
              className="hidden"
            />
            <Button onClick={() => seatingPlanInputRef.current?.click()} size="lg">
              <Upload className="h-4 w-4 mr-2" />
              Upload Seating Plan
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Upload students UI when seating plan is uploaded but students aren't
  if (!studentsUploaded) {
    return (
      <DashboardLayout
        userRole={mockUser.role}
        userName={mockUser.name}
        userId={mockUser.id}
        pageTitle="Manage Seating Plan"
      >
        <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
          <div className="text-center space-y-6 max-w-md">
            <div className="flex justify-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-success">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-success-foreground" />
                </div>
                <span className="text-sm font-medium">Seating Plan</span>
              </div>
              <div className="w-8 h-px bg-border self-center" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                  2
                </div>
                <span className="text-sm">Students</span>
              </div>
            </div>
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Upload Students List</h2>
              <p className="text-muted-foreground text-sm">
                Upload a students file (CSV/Excel) to automatically map students to seats
              </p>
            </div>
            <input
              ref={studentsInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleStudentsUpload}
              className="hidden"
            />
            <Button onClick={() => studentsInputRef.current?.click()} size="lg">
              <Upload className="h-4 w-4 mr-2" />
              Upload Students List
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userRole={mockUser.role}
      userName={mockUser.name}
      userId={mockUser.id}
      pageTitle="Manage Seating Plan"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-foreground">Exam Hall:</label>
            <Select value={selectedHallId} onValueChange={setSelectedHallId}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {halls.map((hall) => (
                  <SelectItem key={hall.id} value={hall.id}>
                    {hall.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Layout
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Seating Plan
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm">
          <div className="px-4 py-2 bg-card rounded-lg border border-border">
            <span className="text-muted-foreground">Total Seats: </span>
            <span className="font-semibold">{totalSeats}</span>
          </div>
          <div className="px-4 py-2 bg-success/10 rounded-lg border border-success/20">
            <span className="text-muted-foreground">Assigned: </span>
            <span className="font-semibold text-success">{assignedCount}</span>
          </div>
          <div className="px-4 py-2 bg-muted rounded-lg border border-border">
            <span className="text-muted-foreground">Available: </span>
            <span className="font-semibold">{totalSeats - assignedCount}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Seating Grid */}
          <div className="lg:col-span-3 bg-card rounded-lg border border-border p-6 shadow-card">
            <div className="mb-4 text-center">
              <div className="inline-block px-6 py-1 bg-muted rounded text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Front / Stage
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center overflow-x-auto pb-4">
              {selectedHall?.seats.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                  <span className="w-6 text-xs text-muted-foreground flex items-center justify-center">
                    {String.fromCharCode(65 + rowIndex)}
                  </span>
                  {row.map((seat, colIndex) => (
                    <div
                      key={seat.id}
                      onClick={() => {
                        if (seat.studentId) {
                          handleClearSeat(rowIndex, colIndex);
                        } else {
                          setSelectedSeat({ row: rowIndex, col: colIndex });
                        }
                      }}
                      className={`
                        w-12 h-12 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all
                        ${
                          seat.studentId
                            ? "bg-success/20 border-success hover:bg-success/30"
                            : selectedSeat?.row === rowIndex && selectedSeat?.col === colIndex
                            ? "bg-primary/20 border-primary ring-2 ring-primary/30"
                            : "bg-muted border-border hover:border-primary/50"
                        }
                      `}
                      title={seat.studentId ? `${seat.studentName} (${seat.studentId})` : `Seat ${seat.id} - Click to assign`}
                    >
                      {seat.studentId ? (
                        <User className="h-4 w-4 text-success" />
                      ) : (
                        <span className="text-xs text-muted-foreground">{seat.id}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-center gap-6 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-success/20 border-2 border-success" />
                <span className="text-muted-foreground">Assigned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-muted border-2 border-border" />
                <span className="text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-primary/20 border-2 border-primary" />
                <span className="text-muted-foreground">Selected</span>
              </div>
            </div>
          </div>

          {/* Student Assignment Panel */}
          <div className="bg-card rounded-lg border border-border p-4 shadow-card">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Change Seat Assignment
            </h3>

            {selectedSeat ? (
              <div className="space-y-4">
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-xs text-muted-foreground">Selected Seat</p>
                  <p className="font-semibold text-lg text-primary">
                    {selectedHall?.seats[selectedSeat.row][selectedSeat.col].id}
                  </p>
                </div>

                <div className="relative">
                  <Input
                    placeholder="Search student..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="pr-8"
                  />
                  {studentSearch && (
                    <button
                      onClick={() => setStudentSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleAssignStudent(student.id, student.name)}
                      className="w-full p-2 text-left rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border"
                    >
                      <p className="text-sm font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.id}</p>
                    </button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setSelectedSeat(null)}
                >
                  Cancel Selection
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Click on any seat to reassign a student
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
