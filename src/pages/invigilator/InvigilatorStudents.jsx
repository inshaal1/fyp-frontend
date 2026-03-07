import { useState, useEffect } from "react";
import { Search, X, User, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getCurrentUser } from "@/services/api";
import * as api from "@/services/api";

export default function InvigilatorStudents() {
  const user = getCurrentUser() || { name: "Dr. Sarah Johnson", id: "INV001", role: "invigilator" };
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hallFilter, setHallFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => { api.getStudentList().then(setStudents); }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    const matchesHall = hallFilter === "all" || student.examHall === hallFilter;
    return matchesSearch && matchesStatus && matchesHall;
  });

  const columns = [
    { header: "Student ID", accessor: "studentId" },
    { header: "Name", accessor: "name" },
    { header: "Seat Number", accessor: "seatNumber" },
    { header: "Exam Hall", accessor: "examHall" },
    { header: "Status", accessor: (row) => (<StatusBadge variant={row.status === "Flagged" ? "destructive" : "success"}>{row.status}</StatusBadge>) },
  ];

  return (
    <DashboardLayout userRole={user.role} userName={user.name} userId={user.id} pageTitle="Student List">
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="relative w-full sm:max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="Normal">Normal</SelectItem><SelectItem value="Flagged">Flagged</SelectItem></SelectContent></Select>
            <Select value={hallFilter} onValueChange={setHallFilter}><SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Hall" /></SelectTrigger><SelectContent><SelectItem value="all">All Halls</SelectItem><SelectItem value="Hall A">Hall A</SelectItem><SelectItem value="Hall B">Hall B</SelectItem><SelectItem value="Hall C">Hall C</SelectItem></SelectContent></Select>
            {(statusFilter !== "all" || hallFilter !== "all" || searchQuery) && (<Button variant="ghost" size="icon" onClick={() => { setSearchQuery(""); setStatusFilter("all"); setHallFilter("all"); }}><X className="h-4 w-4" /></Button>)}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">Showing {filteredStudents.length} of {students.length} students</p>

        <DataTable columns={columns} data={filteredStudents} onRowClick={(row) => setSelectedStudent(row)} />

        <Sheet open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader><SheetTitle>Student Details</SheetTitle></SheetHeader>
            {selectedStudent && (
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center"><User className="h-8 w-8 text-muted-foreground" /></div>
                  <div><h3 className="text-lg font-semibold">{selectedStudent.name}</h3><p className="text-sm text-muted-foreground">{selectedStudent.studentId}</p><StatusBadge variant={selectedStudent.status === "Flagged" ? "destructive" : "success"} className="mt-1">{selectedStudent.status}</StatusBadge></div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Seat Number</p><p className="font-medium flex items-center gap-1"><MapPin className="h-4 w-4" />{selectedStudent.seatNumber}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Exam Hall</p><p className="font-medium">{selectedStudent.examHall}</p></div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p><p className="font-medium text-sm">{selectedStudent.email}</p></div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Department</p><p className="font-medium">{selectedStudent.department}</p></div>
                  <div className={`p-4 rounded-lg border ${selectedStudent.alertCount > 0 ? "bg-destructive/5 border-destructive/20" : "bg-success/5 border-success/20"}`}>
                    <div className="flex items-center gap-3">
                      {selectedStudent.alertCount > 0 ? <AlertTriangle className="h-5 w-5 text-destructive" /> : <CheckCircle className="h-5 w-5 text-success" />}
                      <div><p className="font-medium">{selectedStudent.alertCount > 0 ? `${selectedStudent.alertCount} Alert(s) Recorded` : "No Alerts"}</p><p className="text-sm text-muted-foreground">{selectedStudent.alertCount > 0 ? "Review in Alerts section" : "Student behavior is normal"}</p></div>
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
