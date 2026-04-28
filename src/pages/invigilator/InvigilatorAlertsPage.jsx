import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StatusBadge } from "@/components/ui/status-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, AlertTriangle, Clock, MapPin, User, XCircle, CheckCircle } from "lucide-react";
import * as api from "@/services/api";
import { getCurrentUser } from "@/services/api";
import { toast } from "sonner";

const statusVariant = { pending: "warning", reviewed: "success", dismissed: "secondary" };

export default function InvigilatorAlertsPage() {
  const user = getCurrentUser() || { name: "Invigilator", id: "inv", role: "invigilator" };
  const [rows, setRows] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const reload = async () => {
    setLoading(true);
    try {
      const [r, h] = await Promise.all([api.getAlerts(), api.getExamHalls()]);
      setRows(r); setHalls(h);
    } catch (e) { toast.error(e.message || "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const hallName = (id) => halls.find((h) => h.id === id)?.hallNumber || "—";

  const updateStatus = async (row, status) => {
    try {
      await api.updateAlertStatus(row.id, status);
      toast.success(`Marked ${status}`);
      setSelected(null);
      reload();
    } catch (e) { toast.error(e.message || "Update failed"); }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name} userId={user.id} pageTitle="My Alerts">
      <div className="space-y-4 animate-fade-in">
        {loading ? <LoadingSpinner /> : (
          <DataTable
            emptyMessage="No alerts assigned to your halls"
            onRowClick={(row) => setSelected({ ...row, hallName: hallName(row.hallId) })}
            columns={[
              { header: "Type",    accessor: "violationType" },
              { header: "Hall",    accessor: (r) => hallName(r.hallId) },
              { header: "Student", accessor: "studentId" },
              { header: "When",    accessor: (r) => new Date(r.timestamp).toLocaleString() },
              { header: "Status",  accessor: (r) => <StatusBadge variant={statusVariant[r.status] || "default"}>{r.status}</StatusBadge> },
              { header: "", className: "w-40",
                accessor: (r) => (
                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="outline" disabled={r.status === "reviewed"} onClick={() => updateStatus(r, "reviewed")}>
                      <Check className="h-3.5 w-3.5 mr-1" /> Reviewed
                    </Button>
                  </div>
                ),
              },
            ]}
            data={rows}
          />
        )}

        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" /> Alert Details
              </DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-5">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                  <div className="text-center text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Alert snapshot / video</p>
                    <p className="text-xs mt-1 opacity-70">{selected.evidencePath || "No evidence path"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase tracking-wider">Alert ID</p><p className="font-medium">{selected.id}</p></div>
                  <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase tracking-wider">Student</p><p className="font-medium">{selected.studentId}</p></div>
                  <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase tracking-wider">Type</p><p className="font-medium">{selected.violationType}</p></div>
                  <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p><StatusBadge variant={statusVariant[selected.status] || "default"}>{selected.status}</StatusBadge></div>
                  <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Clock className="h-3 w-3" /> When</p><p className="font-medium">{new Date(selected.timestamp).toLocaleString()}</p></div>
                  <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1"><MapPin className="h-3 w-3" /> Hall</p><p className="font-medium">{selected.hallName}</p></div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border border-border text-sm text-muted-foreground">
                  AI detected <strong>{selected.violationType?.toLowerCase()}</strong> for student {selected.studentId} in {selected.hallName}. Review the snapshot and take appropriate action.
                </div>
                {selected.status === "pending" && (
                  <div className="flex gap-3 pt-2">
                    <Button className="flex-1" onClick={() => updateStatus(selected, "reviewed")}>
                      <CheckCircle className="h-4 w-4 mr-2" /> Mark as Reviewed
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => updateStatus(selected, "dismissed")}>
                      <XCircle className="h-4 w-4 mr-2" /> Dismiss
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
