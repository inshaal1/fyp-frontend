import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StatusBadge } from "@/components/ui/status-badge";
import * as api from "@/services/api";
import { getCurrentUser } from "@/services/api";
import { toast } from "sonner";

const statusVariant = { pending: "warning", reviewed: "success", dismissed: "secondary" };

export default function InvigilatorViolations() {
  const user = getCurrentUser() || { name: "Invigilator", id: "inv", role: "invigilator", hallIds: [] };
  const [rows, setRows] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [r, h] = await Promise.all([api.getViolations(), api.getExamHalls()]);
        setRows(r); setHalls(h);
      } catch (e) { toast.error(e.message || "Failed to load"); }
      finally { setLoading(false); }
    })();
  }, []);

  const myHalls = useMemo(() => new Set(user.hallIds || []), [user]);
  const visible = useMemo(() => rows.filter((r) => myHalls.has(r.hallId)), [rows, myHalls]);
  const hallName = (id) => halls.find((h) => h.id === id)?.hallNumber || "—";

  return (
    <DashboardLayout userRole={user.role} userName={user.name} userId={user.id} pageTitle="Violations in My Halls">
      <div className="space-y-4 animate-fade-in">
        {loading ? <LoadingSpinner /> : (
          <DataTable
            emptyMessage="No violations in your halls"
            columns={[
              { header: "Type",       accessor: "type" },
              { header: "Confidence", accessor: (r) => `${Math.round((r.confidence || 0) * 100)}%` },
              { header: "Hall",       accessor: (r) => hallName(r.hallId) },
              { header: "When",       accessor: (r) => new Date(r.timestamp).toLocaleString() },
              { header: "Status",     accessor: (r) => <StatusBadge variant={statusVariant[r.status] || "default"}>{r.status}</StatusBadge> },
            ]}
            data={visible}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
