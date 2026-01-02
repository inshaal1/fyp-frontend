import { useNavigate } from "react-router-dom";
import { Users, AlertTriangle, Building2, Video, ChevronDown } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockUser = {
  name: "Dr. Sarah Johnson",
  id: "INV001",
  role: "invigilator" as const,
};

const examHalls = [
  { id: "1", name: "Hall A - Block 1" },
  { id: "2", name: "Hall B - Block 1" },
  { id: "3", name: "Hall C - Block 2" },
];

const cameras = [
  { id: "1", name: "Camera 01 - Front" },
  { id: "2", name: "Camera 02 - Back" },
  { id: "3", name: "Camera 03 - Side Left" },
  { id: "4", name: "Camera 04 - Side Right" },
];

export default function InvigilatorDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout
      userRole={mockUser.role}
      userName={mockUser.name}
      userId={mockUser.id}
      pageTitle="Dashboard"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Students"
            value={248}
            icon={Users}
            variant="primary"
            onClick={() => navigate("/invigilator/students")}
          />
          <StatCard
            title="Active Alerts"
            value={12}
            icon={AlertTriangle}
            variant="destructive"
            onClick={() => navigate("/invigilator/alerts")}
          />
          <StatCard
            title="Exam Halls"
            value={6}
            icon={Building2}
            variant="default"
            onClick={() => navigate("/invigilator/exam-halls")}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Live Feed - Takes up 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Live Feed</h2>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
                  <span className="text-xs text-muted-foreground">Live</span>
                </span>
              </div>
            </div>
            
            <div className="live-feed-gradient aspect-video rounded-lg flex items-center justify-center relative overflow-hidden border border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-muted/5 to-transparent" />
              <div className="text-center text-muted-foreground/80 z-10">
                <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">LIVE FEED</p>
                <p className="text-sm">Select an exam hall and camera to view</p>
              </div>
              
              {/* Camera grid overlay */}
              <div className="absolute inset-4 border border-dashed border-muted-foreground/20 rounded-lg grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-dashed border-muted-foreground/10" />
                ))}
              </div>
            </div>
          </div>

          {/* Controls Panel - Takes up 1 column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Camera Controls
            </h3>
            
            <div className="space-y-4 p-4 bg-card rounded-lg border border-border shadow-card">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Select Exam Hall
                </label>
                <Select defaultValue="1">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose hall" />
                  </SelectTrigger>
                  <SelectContent>
                    {examHalls.map((hall) => (
                      <SelectItem key={hall.id} value={hall.id}>
                        {hall.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Select Camera
                </label>
                <Select defaultValue="1">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose camera" />
                  </SelectTrigger>
                  <SelectContent>
                    {cameras.map((camera) => (
                      <SelectItem key={camera.id} value={camera.id}>
                        {camera.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-4 bg-card rounded-lg border border-border shadow-card space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Current Session
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exam</span>
                  <span className="font-medium">CS201 Midterm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">2h 30m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Left</span>
                  <span className="font-medium text-warning">1h 15m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-medium">42 / 45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
