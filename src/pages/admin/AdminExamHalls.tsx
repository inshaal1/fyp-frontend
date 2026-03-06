import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Camera, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/api";
import * as api from "@/services/api";
import type { AdminExamHall } from "@/services/types";

const statusColors: Record<AdminExamHall["status"], "success" | "destructive" | "warning"> = {
  Active: "success",
  Inactive: "destructive",
  Maintenance: "warning",
};

export default function AdminExamHalls() {
  const user = getCurrentUser() || { name: "Prof. Michael Chen", id: "ADM001", role: "admin" as const };
  const [halls, setHalls] = useState<AdminExamHall[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHall, setEditingHall] = useState<AdminExamHall | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    cameras: "",
    block: "",
    status: "Active" as AdminExamHall["status"],
  });

  useEffect(() => {
    api.getAdminExamHalls().then(setHalls);
  }, []);

  const columns = [
    { header: "Hall Name", accessor: "name" as keyof AdminExamHall },
    { header: "Block", accessor: "block" as keyof AdminExamHall },
    {
      header: "Capacity",
      accessor: (row: AdminExamHall) => (
        <span className="flex items-center gap-1"><Users className="h-4 w-4 text-muted-foreground" />{row.capacity}</span>
      ),
    },
    {
      header: "Cameras",
      accessor: (row: AdminExamHall) => (
        <span className="flex items-center gap-1"><Camera className="h-4 w-4 text-muted-foreground" />{row.cameras}</span>
      ),
    },
    {
      header: "Status",
      accessor: (row: AdminExamHall) => (
        <StatusBadge variant={statusColors[row.status]}>{row.status}</StatusBadge>
      ),
    },
    {
      header: "Actions",
      accessor: (row: AdminExamHall) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row)} className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.id)} className="h-8 w-8 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (hall: AdminExamHall) => {
    setEditingHall(hall);
    setFormData({ name: hall.name, capacity: hall.capacity.toString(), cameras: hall.cameras.toString(), block: hall.block, status: hall.status });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await api.deleteAdminExamHall(id);
    setHalls((prev) => prev.filter((h) => h.id !== id));
    toast.success("Exam hall removed");
  };

  const handleOpenAdd = () => {
    setEditingHall(null);
    setFormData({ name: "", capacity: "", cameras: "", block: "", status: "Active" });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.capacity || !formData.cameras || !formData.block) {
      toast.error("Please fill in all fields");
      return;
    }

    if (editingHall) {
      const updates = {
        name: formData.name,
        capacity: parseInt(formData.capacity),
        cameras: parseInt(formData.cameras),
        block: formData.block,
        status: formData.status,
      };
      await api.updateAdminExamHall(editingHall.id, updates);
      setHalls((prev) => prev.map((h) => h.id === editingHall.id ? { ...h, ...updates } : h));
      toast.success("Exam hall updated");
    } else {
      const newHall = await api.createAdminExamHall({
        name: formData.name,
        capacity: parseInt(formData.capacity),
        cameras: parseInt(formData.cameras),
        block: formData.block,
        status: formData.status,
      });
      setHalls((prev) => [...prev, newHall]);
      toast.success("Exam hall added");
    }
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout
      userRole={user.role}
      userName={user.name}
      userId={user.id}
      pageTitle="Exam Halls"
    >
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div><p className="text-sm text-muted-foreground">Manage examination halls across all blocks</p></div>
          <Button onClick={handleOpenAdd} size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />Add Hall
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 border border-border shadow-card">
            <p className="text-sm text-muted-foreground">Total Halls</p>
            <p className="text-2xl font-bold">{halls.length}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border shadow-card">
            <p className="text-sm text-muted-foreground">Total Capacity</p>
            <p className="text-2xl font-bold">{halls.reduce((sum, h) => sum + h.capacity, 0)}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border shadow-card">
            <p className="text-sm text-muted-foreground">Active Halls</p>
            <p className="text-2xl font-bold text-success">{halls.filter((h) => h.status === "Active").length}</p>
          </div>
        </div>

        <DataTable<AdminExamHall> columns={columns} data={halls} />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingHall ? "Edit Exam Hall" : "Add New Exam Hall"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hall Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} placeholder="e.g., Hall G" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block">Block</Label>
                  <Input id="block" value={formData.block} onChange={(e) => setFormData((prev) => ({ ...prev, block: e.target.value }))} placeholder="e.g., Block 1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))} placeholder="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cameras">Number of Cameras</Label>
                  <Input id="cameras" type="number" value={formData.cameras} onChange={(e) => setFormData((prev) => ({ ...prev, cameras: e.target.value }))} placeholder="4" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as AdminExamHall["status"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>{editingHall ? "Save Changes" : "Add Hall"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
