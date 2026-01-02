import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  AlertTriangle,
  Building2,
  Users,
  LogOut,
  FileText,
  Grid3X3,
  Eye,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  userRole: "admin" | "invigilator";
  userName: string;
  userId: string;
}

const invigilatorNavItems = [
  { to: "/invigilator/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/invigilator/alerts", icon: AlertTriangle, label: "Alerts" },
  { to: "/invigilator/exam-halls", icon: Building2, label: "Exam Hall Details" },
  { to: "/invigilator/students", icon: Users, label: "Student List" },
];

const adminNavItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/seating", icon: Grid3X3, label: "Manage Seating Plan" },
  { to: "/admin/exam-halls", icon: Building2, label: "Exam Halls" },
  { to: "/admin/reports", icon: FileText, label: "Reports" },
];

export function DashboardSidebar({ userRole, userName, userId }: SidebarProps) {
  const navigate = useNavigate();
  const navItems = userRole === "admin" ? adminNavItems : invigilatorNavItems;

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
          <Eye className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">EYESON AI</h1>
          <p className="text-xs text-sidebar-foreground/60">Exam Proctoring</p>
        </div>
      </div>

      {/* User Info */}
      <div className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-sidebar-primary/30">
            <AvatarImage src="" />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium">
              {userName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="text-xs text-sidebar-foreground/60">{userId}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-destructive/20 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
