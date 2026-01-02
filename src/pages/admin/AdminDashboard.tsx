import { useNavigate } from "react-router-dom";
import { Building2, Users, AlertTriangle, BarChart3 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";

const mockUser = {
  name: "Prof. Michael Chen",
  id: "ADM001",
  role: "admin" as const,
};

const recentActivity = [
  { id: 1, action: "Seating plan updated for Hall A", time: "10 mins ago", type: "info" },
  { id: 2, action: "New exam hall 'Hall D' created", time: "1 hour ago", type: "success" },
  { id: 3, action: "15 alerts reviewed in Hall B", time: "2 hours ago", type: "warning" },
  { id: 4, action: "Report generated for midterm exams", time: "3 hours ago", type: "info" },
  { id: 5, action: "Camera 3 offline in Hall C", time: "5 hours ago", type: "error" },
];

const activityColors = {
  info: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-destructive/10 text-destructive",
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout
      userRole={mockUser.role}
      userName={mockUser.name}
      userId={mockUser.id}
      pageTitle="Admin Dashboard"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Exam Halls"
            value={8}
            icon={Building2}
            variant="primary"
            onClick={() => navigate("/admin/exam-halls")}
          />
          <StatCard
            title="Total Students"
            value={486}
            icon={Users}
            variant="default"
            onClick={() => navigate("/admin/seating")}
          />
          <StatCard
            title="Total Alerts Logged"
            value={127}
            icon={AlertTriangle}
            variant="warning"
            onClick={() => navigate("/admin/reports")}
          />
          <StatCard
            title="Exams This Week"
            value={12}
            icon={BarChart3}
            variant="accent"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/admin/seating")}
                className="w-full p-4 rounded-lg bg-primary/5 border border-primary/20 text-left hover:bg-primary/10 transition-colors group"
              >
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">Manage Seating Plans</p>
                <p className="text-sm text-muted-foreground">Update student seat assignments</p>
              </button>
              <button
                onClick={() => navigate("/admin/exam-halls")}
                className="w-full p-4 rounded-lg bg-accent/5 border border-accent/20 text-left hover:bg-accent/10 transition-colors group"
              >
                <p className="font-medium text-foreground group-hover:text-accent transition-colors">Configure Exam Halls</p>
                <p className="text-sm text-muted-foreground">Add, edit, or remove halls</p>
              </button>
              <button
                onClick={() => navigate("/admin/reports")}
                className="w-full p-4 rounded-lg bg-muted border border-border text-left hover:bg-secondary transition-colors"
              >
                <p className="font-medium text-foreground">Generate Reports</p>
                <p className="text-sm text-muted-foreground">Export exam monitoring data</p>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
                >
                  <div className={`w-2 h-2 rounded-full ${activityColors[activity.type as keyof typeof activityColors].replace('bg-', 'bg-').replace('/10', '')}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">98.5%</p>
              <p className="text-sm text-muted-foreground">System Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-success">32</p>
              <p className="text-sm text-muted-foreground">Active Cameras</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-warning">2</p>
              <p className="text-sm text-muted-foreground">Pending Issues</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">1.2s</p>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
