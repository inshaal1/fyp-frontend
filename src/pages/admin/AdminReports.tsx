import { useState } from "react";
import { FileText, Download, Calendar, Building2, AlertTriangle, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface Report {
  id: string;
  date: string;
  examHall: string;
  examName: string;
  totalAlerts: number;
  reviewedAlerts: number;
  studentsMonitored: number;
  duration: string;
}

const mockReports: Report[] = [
  { id: "RPT001", date: "2024-01-15", examHall: "Hall A", examName: "CS201 Midterm", totalAlerts: 12, reviewedAlerts: 12, studentsMonitored: 45, duration: "2h 30m" },
  { id: "RPT002", date: "2024-01-15", examHall: "Hall B", examName: "MATH101 Quiz", totalAlerts: 5, reviewedAlerts: 5, studentsMonitored: 38, duration: "1h 00m" },
  { id: "RPT003", date: "2024-01-14", examHall: "Hall C", examName: "PHY301 Final", totalAlerts: 23, reviewedAlerts: 20, studentsMonitored: 52, duration: "3h 00m" },
  { id: "RPT004", date: "2024-01-14", examHall: "Hall A", examName: "ENG102 Midterm", totalAlerts: 8, reviewedAlerts: 8, studentsMonitored: 44, duration: "2h 00m" },
  { id: "RPT005", date: "2024-01-13", examHall: "Hall D", examName: "CHEM201 Quiz", totalAlerts: 3, reviewedAlerts: 3, studentsMonitored: 35, duration: "45m" },
  { id: "RPT006", date: "2024-01-12", examHall: "Hall B", examName: "BIO101 Final", totalAlerts: 15, reviewedAlerts: 14, studentsMonitored: 40, duration: "3h 00m" },
  { id: "RPT007", date: "2024-01-11", examHall: "Hall E", examName: "CS301 Midterm", totalAlerts: 18, reviewedAlerts: 18, studentsMonitored: 45, duration: "2h 30m" },
];

export default function AdminReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hallFilter, setHallFilter] = useState("all");

  const filteredReports = mockReports.filter((report) => {
    const matchesHall = hallFilter === "all" || report.examHall === hallFilter;
    const matchesStartDate = !startDate || report.date >= startDate;
    const matchesEndDate = !endDate || report.date <= endDate;
    return matchesHall && matchesStartDate && matchesEndDate;
  });

  const totalAlerts = filteredReports.reduce((sum, r) => sum + r.totalAlerts, 0);
  const reviewedAlerts = filteredReports.reduce((sum, r) => sum + r.reviewedAlerts, 0);
  const totalStudents = filteredReports.reduce((sum, r) => sum + r.studentsMonitored, 0);

  const handleExport = (format: "pdf" | "csv") => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const columns = [
    { header: "Report ID", accessor: "id" as keyof Report },
    { header: "Date", accessor: "date" as keyof Report },
    { header: "Exam Hall", accessor: "examHall" as keyof Report },
    { header: "Exam Name", accessor: "examName" as keyof Report },
    {
      header: "Alerts",
      accessor: (row: Report) => (
        <span className={row.totalAlerts > 10 ? "text-warning font-medium" : ""}>
          {row.totalAlerts}
        </span>
      ),
    },
    {
      header: "Reviewed",
      accessor: (row: Report) => (
        <StatusBadge
          variant={row.reviewedAlerts === row.totalAlerts ? "success" : "warning"}
        >
          {row.reviewedAlerts}/{row.totalAlerts}
        </StatusBadge>
      ),
    },
    { header: "Students", accessor: "studentsMonitored" as keyof Report },
    { header: "Duration", accessor: "duration" as keyof Report },
  ];

  return (
    <DashboardLayout
      userRole={mockUser.role}
      userName={mockUser.name}
      userId={mockUser.id}
      pageTitle="Reports"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Filters */}
        <div className="bg-card rounded-lg border border-border p-4 shadow-card">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Exam Hall</Label>
              <Select value={hallFilter} onValueChange={setHallFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Halls</SelectItem>
                  <SelectItem value="Hall A">Hall A</SelectItem>
                  <SelectItem value="Hall B">Hall B</SelectItem>
                  <SelectItem value="Hall C">Hall C</SelectItem>
                  <SelectItem value="Hall D">Hall D</SelectItem>
                  <SelectItem value="Hall E">Hall E</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setHallFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Reports"
            value={filteredReports.length}
            icon={FileText}
            variant="primary"
          />
          <StatCard
            title="Total Alerts"
            value={totalAlerts}
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard
            title="Reviewed Alerts"
            value={reviewedAlerts}
            icon={CheckCircle}
            variant="accent"
          />
          <StatCard
            title="Students Monitored"
            value={totalStudents}
            icon={Building2}
            variant="default"
          />
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3">
          <Button onClick={() => handleExport("pdf")} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={() => handleExport("csv")} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Reports Table */}
        <DataTable<Report> columns={columns} data={filteredReports} />
      </div>
    </DashboardLayout>
  );
}
