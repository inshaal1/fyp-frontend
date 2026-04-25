import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ResourceFormDialog } from "@/components/ui/resource-form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CsvUploadButton } from "@/components/ui/csv-upload-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Pencil, Trash2, Power } from "lucide-react";
import * as api from "@/services/api";
import { getCurrentUser } from "@/services/api";
import { toast } from "sonner";

export default function AdminCameras() {
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
      const [r, h] = await Promise.all([api.cameras.list(), api.getExamHalls()]);
      setRows(r); setHalls(h);
    } catch (e) { toast.error(e.message || "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const hallName = (id) => halls.find((h) => h.id === id)?.hallNumber || "—";

  const fields = useMemo(() => ([
    { name: "position",  label: "Position",   type: "text", required: true },
    { name: "ipAddress", label: "IP Address", type: "text", required: true },
    { name: "model",     label: "Model",      type: "text" },
    { name: "hallId",    label: "Hall",       type: "select", required: true,
      options: halls.map((h) => ({ value: h.id, label: h.hallNumber })) },
  ]), [halls]);

  const onSubmit = async (payload) => {
    try {
      if (editing) await api.cameras.update(editing.id, payload);
      else await api.cameras.create({ ...payload, isActive: true });
      toast.success("Saved"); reload();
    } catch (e) { toast.error(e.message || "Save failed"); }
  };
  const toggle = async (row) => {
    try { await api.cameras.setActive(row.id, !row.isActive); toast.success("Updated"); reload(); }
    catch (e) { toast.error(e.message || "Update failed"); }
  };
  const onDelete = async (row) => {
    try { await api.cameras.remove(row.id); toast.success("Deleted"); reload(); }
    catch (e) { toast.error(e.message || "Delete failed"); }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name} userId={user.id} pageTitle="Cameras">
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-wrap gap-2 justify-end">
          <CsvUploadButton onUpload={api.cameras.uploadCsv} />
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Add Camera</Button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <DataTable
            emptyMessage="No cameras yet"
            columns={[
              { header: "Position",   accessor: "position" },
              { header: "IP Address", accessor: "ipAddress" },
              { header: "Model",      accessor: "model" },
              { header: "Hall",       accessor: (r) => hallName(r.hallId) },
              { header: "Active",     accessor: (r) => <StatusBadge variant={r.isActive ? "success" : "destructive"}>{r.isActive ? "Active" : "Inactive"}</StatusBadge> },
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
        title={editing ? "Edit Camera" : "Add Camera"}
        fields={fields} initialValues={editing || {}} onSubmit={onSubmit}
      />
      <ConfirmDialog
        open={!!confirmDel} onOpenChange={(v) => !v && setConfirmDel(null)}
        title="Delete camera?" description={`Remove ${confirmDel?.position}?`}
        destructive confirmLabel="Delete" onConfirm={() => onDelete(confirmDel)}
      />
    </DashboardLayout>
  );
}
