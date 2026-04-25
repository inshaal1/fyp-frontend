import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ResourceFormDialog } from "@/components/ui/resource-form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CsvUploadButton } from "@/components/ui/csv-upload-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import * as api from "@/services/api";
import { getCurrentUser } from "@/services/api";
import { toast } from "sonner";

const statusVariant = { scheduled: "default", active: "success", ended: "secondary" };

export default function AdminExams() {
  const user = getCurrentUser() || { name: "Admin", id: "admin", role: "admin" };
  const [rows, setRows] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const reload = async () => {
    setLoading(true);
    try {
      const [r, h] = await Promise.all([api.getExams(), api.getExamHalls()]);
      setRows(r); setHalls(h);
    } catch (e) { toast.error(e.message || "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const hallName = (id) => halls.find((h) => h.id === id)?.hallNumber || "—";

  const fields = useMemo(() => ([
    { name: "name",      label: "Exam Name", type: "text", required: true },
    { name: "subject",   label: "Subject",   type: "text", required: true },
    { name: "date",      label: "Date",      type: "date", required: true },
    { name: "startTime", label: "Start",     type: "time", required: true },
    { name: "endTime",   label: "End",       type: "time", required: true },
    { name: "status",    label: "Status",    type: "select",
      options: [{ value: "scheduled", label: "Scheduled" }, { value: "active", label: "Active" }, { value: "ended", label: "Ended" }] },
    { name: "hallId",    label: "Hall",      type: "select", required: true,
      options: halls.map((h) => ({ value: h.id, label: h.hallNumber })) },
  ]), [halls]);

  const onSubmit = async (payload) => {
    try {
      if (editing) await api.updateExam(editing.id, payload);
      else await api.createExam({ ...payload, status: payload.status || "scheduled" });
      toast.success("Saved"); reload();
    } catch (e) { toast.error(e.message || "Save failed"); }
  };
  const onDelete = async (row) => {
    try { await api.deleteExam(row.id); toast.success("Deleted"); reload(); }
    catch (e) { toast.error(e.message || "Delete failed"); }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name} userId={user.id} pageTitle="Exams">
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-wrap gap-2 justify-end">
          <CsvUploadButton onUpload={api.uploadExamsCsv} />
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Add Exam</Button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <DataTable
            emptyMessage="No exams yet"
            columns={[
              { header: "Name",    accessor: "name" },
              { header: "Subject", accessor: "subject" },
              { header: "Date",    accessor: "date" },
              { header: "Start",   accessor: "startTime" },
              { header: "End",     accessor: "endTime" },
              { header: "Hall",    accessor: (r) => hallName(r.hallId) },
              { header: "Status",  accessor: (r) => <StatusBadge variant={statusVariant[r.status] || "default"}>{r.status}</StatusBadge> },
              { header: "", className: "w-32",
                accessor: (r) => (
                  <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="outline" onClick={() => { setEditing(r); setFormOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => setConfirmDel(r)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
        title={editing ? "Edit Exam" : "Add Exam"}
        fields={fields} initialValues={editing || {}} onSubmit={onSubmit}
      />
      <ConfirmDialog
        open={!!confirmDel} onOpenChange={(v) => !v && setConfirmDel(null)}
        title="Delete exam?" description={`Remove ${confirmDel?.name}?`}
        destructive confirmLabel="Delete" onConfirm={() => onDelete(confirmDel)}
      />
    </DashboardLayout>
  );
}
