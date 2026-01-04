import { useState } from "react";
import { Search, Filter, X, User, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const mockUser = {
  name: "Dr. Sarah Johnson",
  id: "INV001",
  role: "invigilator" as const,
};

interface Student {
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

const mockStudents: Student[] = [
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

export default function InvigilatorStudents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [hallFilter, setHallFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    const matchesHall = hallFilter === "all" || student.examHall === hallFilter;
    return matchesSearch && matchesStatus && matchesHall;
  });

  const columns = [
    { header: "Student ID", accessor: "studentId" as keyof Student },
    { header: "Name", accessor: "name" as keyof Student },
    { header: "Seat Number", accessor: "seatNumber" as keyof Student },
    { header: "Exam Hall", accessor: "examHall" as keyof Student },
    {
      header: "Status",
      accessor: (row: Student) => (
        <StatusBadge variant={row.status === "Flagged" ? "destructive" : "success"}>
          {row.status}
        </StatusBadge>
      ),
    },
  ];

  return (
    <DashboardLayout
      userRole={mockUser.role}
      userName={mockUser.name}
      userId={mockUser.id}
      pageTitle="Student List"
    >
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>

            <Select value={hallFilter} onValueChange={setHallFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Hall" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Halls</SelectItem>
                <SelectItem value="Hall A">Hall A</SelectItem>
                <SelectItem value="Hall B">Hall B</SelectItem>
                <SelectItem value="Hall C">Hall C</SelectItem>
              </SelectContent>
            </Select>

            {(statusFilter !== "all" || hallFilter !== "all" || searchQuery) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setHallFilter("all");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredStudents.length} of {mockStudents.length} students
        </p>

        {/* Students Table */}
        <DataTable<Student>
          columns={columns}
          data={filteredStudents}
          onRowClick={(row) => setSelectedStudent(row)}
        />

        {/* Student Detail Panel */}
        <Sheet open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Student Details</SheetTitle>
            </SheetHeader>
            
            {selectedStudent && (
              <div className="mt-6 space-y-6">
                {/* Avatar & Basic Info */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStudent.studentId}</p>
                    <StatusBadge 
                      variant={selectedStudent.status === "Flagged" ? "destructive" : "success"}
                      className="mt-1"
                    >
                      {selectedStudent.status}
                    </StatusBadge>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Seat Number</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedStudent.seatNumber}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Exam Hall</p>
                      <p className="font-medium">{selectedStudent.examHall}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                    <p className="font-medium text-sm">{selectedStudent.email}</p>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Department</p>
                    <p className="font-medium">{selectedStudent.department}</p>
                  </div>

                  <div className={`p-4 rounded-lg border ${selectedStudent.alertCount > 0 ? "bg-destructive/5 border-destructive/20" : "bg-success/5 border-success/20"}`}>
                    <div className="flex items-center gap-3">
                      {selectedStudent.alertCount > 0 ? (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                      <div>
                        <p className="font-medium">
                          {selectedStudent.alertCount > 0 
                            ? `${selectedStudent.alertCount} Alert(s) Recorded`
                            : "No Alerts"
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedStudent.alertCount > 0 
                            ? "Review in Alerts section"
                            : "Student behavior is normal"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
}
