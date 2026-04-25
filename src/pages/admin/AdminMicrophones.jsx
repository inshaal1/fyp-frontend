import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ResourceFormDialog } from "@/components/ui/resource-form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CsvUploadButton } from "@/components/ui/csv-upload-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Trash2, Power, Pencil } from "lucide-react";
import * as api from "@/services/api";
import { getCurrentUser } from "@/services/api";
import { toast } from "sonner";

export default function AdminMicrophones() {
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
      const [r, h] = await Promise.all([api.microphones.list(), api.getExamHalls()]);
      setRows(r); setHalls(h);
    } catch (e) { toast.error(e.message || "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const hallName = (id) => halls.find((h) => h.id === id)?.hallNumber || "—";

  const fields = useMemo(() => ([
    { name: "range",       label: "Range",       type: "text", required: true },
    { name: "sensitivity", label: "Sensitivity", type: "select", options: [
      { value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" },
    ]},
    { name: "row",         label: "Row",         type: "number" },
    { name: "column",      label: "Column",      type: "number" },
    { name: "hallId",      label: "Hall",        type: "select", required: true,
      options: halls.map((h) => ({ value: h.id, label: h.hallNumber })) },
  ]), [halls]);

  const onSubmit = async (payload) => {
    try {
      if (editing) await api.microphones.update(editing.id, payload);
      else await api.microphones.create({ ...payload, isActive: true });
      toast.success("Saved"); reload();
    } catch (e) { toast.error(e.message || "Save failed"); }
  };
  const toggle = async (row) => {
    try { await api.microphones.setActive(row.id, !row.isActive); toast.success("Updated"); reload(); }
    catch (e) { toast.error(e.message || "Update failed"); }
  };
  const onDelete = async (row) => {
    try { await api.microphones.remove(row.id); toast.success("Deleted"); reload(); }
    catch (e) { toast.error(e.message || "Delete failed"); }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name} userId={user.id} pageTitle="Microphones">
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-wrap gap-2 justify-end">
          <CsvUploadButton onUpload={api.microphones.uploadCsv} />
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Add Microphone</Button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <DataTable
            emptyMessage="No microphones yet"
            columns={[
              { header: "Range",       accessor: "range" },
              { header: "Sensitivity", accessor: "sensitivity" },
              { header: "Hall",        accessor: (r) => hallName(r.hallId) },
              { header: "Row",         accessor: "row" },
              { header: "Column",      accessor: "column" },
              { header: "Active",      accessor: (r) => <StatusBadge variant={r.isActive ? "success" : "destructive"}>{r.isActive ? "Active" : "Inactive"}</StatusBadge> },
              { header: "", className: "w-44",
                accessor: (r) => (
                  <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="outline" onClick={() => toggle(r)}><Power className="h-3.5 w-3.5" /></Button>
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
        title={editing ? "Edit Microphone" : "Add Microphone"}
        fields={fields} initialValues={editing || {}} onSubmit={onSubmit}
      />
      <ConfirmDialog
        open={!!confirmDel} onOpenChange={(v) => !v && setConfirmDel(null)}
        title="Delete microphone?" description="This action is permanent."
        destructive confirmLabel="Delete" onConfirm={() => onDelete(confirmDel)}
      />
    </DashboardLayout>
  );
}
