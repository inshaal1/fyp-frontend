import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpenCheck, Bell, AlertTriangle, Clock, MapPin, User, CheckCircle, XCircle } from "lucide-react";
import * as api from "@/services/api";
import { getCurrentUser } from "@/services/api";
import { toast } from "sonner";

const alertVariant = { pending: "warning", reviewed: "success" };

export default function InvigilatorOverview() {
  const user = getCurrentUser() || { name: "Invigilator", id: "inv", role: "invigilator" };
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [s, a, h] = await Promise.all([api.getInvigilatorDashboardStats(), api.getAlerts(), api.getExamHalls()]);
      setStats(s); setAlerts(a.slice(0, 5)); setHalls(h);
    } catch (e) { toast.error(e.message || "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (row, status) => {
    try {
      await api.updateAlertStatus(row.id, status);
      toast.success(`Marked ${status}`);
      setSelected(null);
      load();
    } catch (e) { toast.error(e.message || "Update failed"); }
  };

  const hallName = (id) => halls.find((h) => h.id === id)?.hallNumber || "—";

  return (
    <DashboardLayout userRole={user.role} userName={user.name} userId={user.id} pageTitle="Overview">
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard title="Active Exams in My Halls" value={stats?.activeExamsInMyHalls ?? 0} icon={BookOpenCheck} variant="primary" />
            <StatCard title="Pending Alerts"           value={stats?.activeAlerts ?? 0}         icon={Bell} variant="warning" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Recent Alerts in My Halls</h2>
            </div>
            <DataTable
              emptyMessage="No alerts assigned to you"
              onRowClick={(row) => setSelected({ ...row, hallName: hallName(row.hallId) })}
              columns={[
                { header: "Type",    accessor: "violationType" },
                { header: "Hall",    accessor: (r) => hallName(r.hallId) },
                { header: "Student", accessor: "studentId" },
                { header: "When",    accessor: (r) => new Date(r.timestamp).toLocaleString() },
                { header: "Status",  accessor: (r) => <StatusBadge variant={alertVariant[r.status] || "default"}>{r.status}</StatusBadge> },
              ]}
              data={alerts}
            />
          </div>

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
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase tracking-wider">Alert ID</p><p className="font-medium">{selected.id}</p></div>
                    <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase tracking-wider">Student</p><p className="font-medium">{selected.studentId}</p></div>
                    <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase tracking-wider">Type</p><p className="font-medium">{selected.violationType}</p></div>
                    <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p><StatusBadge variant={alertVariant[selected.status] || "default"}>{selected.status}</StatusBadge></div>
                    <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Clock className="h-3 w-3" /> When</p><p className="font-medium">{new Date(selected.timestamp).toLocaleString()}</p></div>
                    <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1"><MapPin className="h-3 w-3" /> Hall</p><p className="font-medium">{selected.hallName}</p></div>
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
      )}
    </DashboardLayout>
  );
}
