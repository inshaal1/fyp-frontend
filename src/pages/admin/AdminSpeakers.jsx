import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ResourceFormDialog } from "@/components/ui/resource-form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CsvUploadButton } from "@/components/ui/csv-upload-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import * as api from "@/services/api";
import { getCurrentUser } from "@/services/api";
import { toast } from "sonner";

const statusVariant = { active: "success", inactive: "secondary", offline: "destructive" };

export default function AdminSpeakers() {
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
      const [r, h] = await Promise.all([api.speakers.list(), api.getExamHalls()]);
      setRows(r); setHalls(h);
    } catch (e) { toast.error(e.message || "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const hallName = (id) => halls.find((h) => h.id === id)?.hallNumber || "—";

  const fields = useMemo(() => ([
    { name: "label",     label: "Label",      type: "text",   required: true },
    { name: "ipAddress", label: "IP Address", type: "text",   required: true },
    { name: "volume",    label: "Volume (0-100)", type: "number" },
    { name: "hallId",    label: "Hall",       type: "select", required: true,
      options: halls.map((h) => ({ value: h.id, label: h.hallNumber })) },
  ]), [halls]);

  const onSubmit = async (payload) => {
    try {
      if (editing) await api.speakers.update(editing.id, payload);
      else await api.speakers.create({ ...payload, status: "active" });
      toast.success("Saved"); reload();
    } catch (e) { toast.error(e.message || "Save failed"); }
  };
  const setStatus = async (id, status) => {
    try { await api.speakers.setStatus(id, status); toast.success("Status updated"); reload(); }
    catch (e) { toast.error(e.message || "Update failed"); }
  };
  const onDelete = async (row) => {
    try { await api.speakers.remove(row.id); toast.success("Deleted"); reload(); }
    catch (e) { toast.error(e.message || "Delete failed"); }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name} userId={user.id} pageTitle="Speakers">
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-wrap gap-2 justify-end">
          <CsvUploadButton onUpload={api.speakers.uploadCsv} />
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Add Speaker</Button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <DataTable
            emptyMessage="No speakers yet"
            columns={[
              { header: "Label",      accessor: "label" },
              { header: "IP Address", accessor: "ipAddress" },
              { header: "Volume",     accessor: "volume" },
              { header: "Hall",       accessor: (r) => hallName(r.hallId) },
              { header: "Status",     accessor: (r) => <StatusBadge variant={statusVariant[r.status] || "default"}>{r.status}</StatusBadge> },
              { header: "", className: "w-72",
                accessor: (r) => (
                  <div className="flex gap-2 justify-end items-center" onClick={(e) => e.stopPropagation()}>
                    <Select value={r.status} onValueChange={(v) => setStatus(r.id, v)}>
                      <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
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
        title={editing ? "Edit Speaker" : "Add Speaker"}
        fields={fields} initialValues={editing || {}} onSubmit={onSubmit}
      />
      <ConfirmDialog
        open={!!confirmDel} onOpenChange={(v) => !v && setConfirmDel(null)}
        title="Delete speaker?" description={`Remove ${confirmDel?.label}?`}
        destructive confirmLabel="Delete" onConfirm={() => onDelete(confirmDel)}
      />
    </DashboardLayout>
  );
}
