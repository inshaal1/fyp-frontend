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

  useEffect(() => {
    (async () => {
      try {
        const [s, a, h] = await Promise.all([api.getInvigilatorDashboardStats(), api.getAlerts(), api.getExamHalls()]);
        setStats(s); setAlerts(a.slice(0, 5)); setHalls(h);
      } catch (e) { toast.error(e.message || "Failed to load"); }
      finally { setLoading(false); }
    })();
  }, []);

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
        </div>
      )}
    </DashboardLayout>
  );
}
