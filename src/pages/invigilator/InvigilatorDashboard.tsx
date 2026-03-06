import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, AlertTriangle, Building2, Video } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrentUser } from "@/services/api";
import * as api from "@/services/api";
import type { ExamHallOption, CameraOption } from "@/services/types";

export default function InvigilatorDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser() || { name: "Dr. Sarah Johnson", id: "INV001", role: "invigilator" as const };

  const [stats, setStats] = useState({ totalStudents: 0, activeAlerts: 0, examHalls: 0 });
  const [examHalls, setExamHalls] = useState<ExamHallOption[]>([]);
  const [cameras, setCameras] = useState<CameraOption[]>([]);
  const [session, setSession] = useState({ examName: "", duration: "", timeLeft: "", students: "" });

  useEffect(() => {
    api.getInvigilatorDashboardStats().then(setStats);
    api.getExamHallOptions().then(setExamHalls);
    api.getCameraOptions().then(setCameras);
    api.getCurrentSession().then(setSession);
  }, []);

  return (
    <DashboardLayout
      userRole={user.role}
      userName={user.name}
      userId={user.id}
      pageTitle="Dashboard"
    >
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Students" value={stats.totalStudents} icon={Users} variant="primary" onClick={() => navigate("/invigilator/students")} />
          <StatCard title="Active Alerts" value={stats.activeAlerts} icon={AlertTriangle} variant="destructive" onClick={() => navigate("/invigilator/alerts")} />
          <StatCard title="Exam Halls" value={stats.examHalls} icon={Building2} variant="default" onClick={() => navigate("/invigilator/exam-halls")} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Live Feed</h2>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
                  <span className="text-xs text-muted-foreground">Live</span>
                </span>
              </div>
            </div>
            
            <div className="live-feed-gradient aspect-video rounded-lg flex items-center justify-center relative overflow-hidden border border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-muted/5 to-transparent" />
              <div className="text-center text-muted-foreground/80 z-10 px-4">
                <Video className="h-10 w-10 sm:h-16 sm:w-16 mx-auto mb-2 sm:mb-4 opacity-50" />
                <p className="text-sm sm:text-lg font-medium">LIVE FEED</p>
                <p className="text-xs sm:text-sm">Select an exam hall and camera to view</p>
              </div>
              <div className="absolute inset-2 sm:inset-4 border border-dashed border-muted-foreground/20 rounded-lg grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-dashed border-muted-foreground/10" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 order-1 lg:order-2">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Camera Controls</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="space-y-4 p-4 bg-card rounded-lg border border-border shadow-card">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Select Exam Hall</label>
                  <Select defaultValue="1">
                    <SelectTrigger className="w-full"><SelectValue placeholder="Choose hall" /></SelectTrigger>
                    <SelectContent>
                      {examHalls.map((hall) => (
                        <SelectItem key={hall.id} value={hall.id}>{hall.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Select Camera</label>
                  <Select defaultValue="1">
                    <SelectTrigger className="w-full"><SelectValue placeholder="Choose camera" /></SelectTrigger>
                    <SelectContent>
                      {cameras.map((camera) => (
                        <SelectItem key={camera.id} value={camera.id}>{camera.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-card rounded-lg border border-border shadow-card space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Current Session</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exam</span>
                    <span className="font-medium text-right">{session.examName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{session.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Left</span>
                    <span className="font-medium text-warning">{session.timeLeft}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-medium">{session.students}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
