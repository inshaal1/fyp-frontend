import { useState } from "react";
import { AlertTriangle, X, Clock, MapPin, User, CheckCircle, XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const mockUser = {
  name: "Dr. Sarah Johnson",
  id: "INV001",
  role: "invigilator" as const,
};

interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  alertType: "Whisper" | "Head Turn" | "Gesture";
  time: string;
  examHall: string;
  status: "Pending" | "Reviewed" | "Ignored";
}

const mockAlerts: Alert[] = [
  { id: "ALT001", studentId: "STU2024001", studentName: "John Smith", alertType: "Head Turn", time: "10:45 AM", examHall: "Hall A", status: "Pending" },
  { id: "ALT002", studentId: "STU2024015", studentName: "Emily Davis", alertType: "Whisper", time: "10:42 AM", examHall: "Hall A", status: "Pending" },
  { id: "ALT003", studentId: "STU2024023", studentName: "Michael Brown", alertType: "Gesture", time: "10:38 AM", examHall: "Hall B", status: "Reviewed" },
  { id: "ALT004", studentId: "STU2024042", studentName: "David Lee", alertType: "Head Turn", time: "10:30 AM", examHall: "Hall C", status: "Ignored" },
  { id: "ALT005", studentId: "STU2024019", studentName: "Jessica Taylor", alertType: "Whisper", time: "10:28 AM", examHall: "Hall B", status: "Reviewed" },
  { id: "ALT006", studentId: "STU2024031", studentName: "Chris Johnson", alertType: "Gesture", time: "10:25 AM", examHall: "Hall A", status: "Pending" },
  { id: "ALT007", studentId: "STU2024055", studentName: "Amanda White", alertType: "Head Turn", time: "10:22 AM", examHall: "Hall C", status: "Pending" },
];

const alertTypeColors: Record<Alert["alertType"], "destructive" | "warning" | "default"> = {
  "Whisper": "warning",
  "Head Turn": "default",
  "Gesture": "warning",
};

const statusColors: Record<Alert["status"], "warning" | "success" | "secondary"> = {
  "Pending": "warning",
  "Reviewed": "success",
  "Ignored": "secondary",
};

export default function InvigilatorAlerts() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleStatusChange = (alertId: string, newStatus: "Reviewed" | "Ignored") => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, status: newStatus } : alert
      )
    );
    setSelectedAlert(null);
  };

  const columns = [
    { header: "Alert ID", accessor: "id" as keyof Alert },
    { header: "Student ID", accessor: "studentId" as keyof Alert },
    {
      header: "Alert Type",
      accessor: (row: Alert) => (
        <StatusBadge variant={alertTypeColors[row.alertType]}>
          {row.alertType}
        </StatusBadge>
      ),
    },
    { header: "Time", accessor: "time" as keyof Alert },
    { header: "Exam Hall", accessor: "examHall" as keyof Alert },
    {
      header: "Status",
      accessor: (row: Alert) => (
        <StatusBadge variant={statusColors[row.status]}>
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
      pageTitle="Alerts"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 border border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{alerts.filter(a => a.status === "Pending").length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reviewed</p>
                <p className="text-2xl font-bold">{alerts.filter(a => a.status === "Reviewed").length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <XCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ignored</p>
                <p className="text-2xl font-bold">{alerts.filter(a => a.status === "Ignored").length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <DataTable<Alert>
          columns={columns}
          data={alerts}
          onRowClick={(row) => setSelectedAlert(row)}
        />

        {/* Alert Detail Modal */}
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Alert Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedAlert && (
              <div className="space-y-5">
                {/* Image Placeholder */}
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                  <div className="text-center text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Alert snapshot / video</p>
                  </div>
                </div>

                {/* Alert Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Alert ID</p>
                    <p className="font-medium">{selectedAlert.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Student</p>
                    <p className="font-medium">{selectedAlert.studentName}</p>
                    <p className="text-sm text-muted-foreground">{selectedAlert.studentId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Alert Type</p>
                    <StatusBadge variant={alertTypeColors[selectedAlert.alertType]}>
                      {selectedAlert.alertType}
                    </StatusBadge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                    <StatusBadge variant={statusColors[selectedAlert.status]}>
                      {selectedAlert.status}
                    </StatusBadge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Time
                    </p>
                    <p className="font-medium">{selectedAlert.time}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Location
                    </p>
                    <p className="font-medium">{selectedAlert.examHall}</p>
                  </div>
                </div>

                {/* Alert Description */}
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    AI detected suspicious activity: <strong>{selectedAlert.alertType.toLowerCase()}</strong> behavior 
                    observed from student {selectedAlert.studentName} at {selectedAlert.time}. 
                    Please review the footage and take appropriate action.
                  </p>
                </div>

                {/* Actions */}
                {selectedAlert.status === "Pending" && (
                  <div className="flex gap-3 pt-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleStatusChange(selectedAlert.id, "Reviewed")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Reviewed
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleStatusChange(selectedAlert.id, "Ignored")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Ignore
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
