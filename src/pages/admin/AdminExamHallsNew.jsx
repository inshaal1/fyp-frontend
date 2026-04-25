import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ResourceFormDialog } from "@/components/ui/resource-form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CsvUploadButton } from "@/components/ui/csv-upload-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Trash2, Power } from "lucide-react";
import * as api from "@/services/api";
import { getCurrentUser } from "@/services/api";
import { toast } from "sonner";

const fields = [
  { name: "hallNumber", label: "Hall Number", type: "text",   required: true },
  { name: "floor",      label: "Floor",       type: "number", required: true },
  { name: "capacity",   label: "Capacity",    type: "number", required: true },
  { name: "location",   label: "Location",    type: "text" },
  { name: "status",     label: "Status",      type: "select", options: [{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }] },
];

export default function AdminExamHallsNew() {
  const user = getCurrentUser() || { name: "Admin", id: "admin", role: "admin" };
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const reload = async () => {
    setLoading(true);
    try { setRows(await api.getAdminExamHalls()); }
    catch (e) { toast.error(e.message || "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const onSubmit = async (payload) => {
    try { await api.createAdminExamHall({ ...payload, status: payload.status || "open" }); toast.success("Hall created"); reload(); }
    catch (e) { toast.error(e.message || "Save failed"); }
  };

  const toggleStatus = async (row) => {
    const next = row.status === "open" ? "closed" : "open";
    try { await api.updateAdminExamHallStatus(row.id, next); toast.success(`Hall ${next}`); reload(); }
    catch (e) { toast.error(e.message || "Update failed"); }
  };

  const onDelete = async (row) => {
    try { await api.deleteAdminExamHall(row.id); toast.success("Deleted"); reload(); }
    catch (e) { toast.error(e.message || "Delete failed"); }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name} userId={user.id} pageTitle="Exam Halls">
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-wrap gap-2 justify-end">
          <CsvUploadButton onUpload={api.uploadExamHallsCsv} />
          <Button onClick={() => setFormOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Hall</Button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <DataTable
            emptyMessage="No halls yet"
            columns={[
              { header: "Hall #",   accessor: "hallNumber" },
              { header: "Floor",    accessor: "floor" },
              { header: "Capacity", accessor: "capacity" },
              { header: "Location", accessor: "location" },
              { header: "Status",   accessor: (r) => <StatusBadge variant={r.status === "open" ? "success" : "secondary"}>{r.status}</StatusBadge> },
              { header: "", className: "w-44",
                accessor: (r) => (
                  <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="outline" onClick={() => toggleStatus(r)}>
                      <Power className="h-3.5 w-3.5 mr-1" /> {r.status === "open" ? "Close" : "Open"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setConfirmDel(r)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={rows}
          />
        )}
      </div>

      <ResourceFormDialog
        open={formOpen} onOpenChange={setFormOpen}
        title="Add Exam Hall" fields={fields} onSubmit={onSubmit}
      />
      <ConfirmDialog
        open={!!confirmDel} onOpenChange={(v) => !v && setConfirmDel(null)}
        title="Delete hall?" description={`Remove ${confirmDel?.hallNumber}? Halls with active exams cannot be deleted.`}
        destructive confirmLabel="Delete" onConfirm={() => onDelete(confirmDel)}
      />
    </DashboardLayout>
  );
}
