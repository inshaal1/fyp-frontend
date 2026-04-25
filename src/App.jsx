import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

// Invigilator
import InvigilatorOverview from "./pages/invigilator/InvigilatorOverview";
import InvigilatorAlertsPage from "./pages/invigilator/InvigilatorAlertsPage";
import InvigilatorViolations from "./pages/invigilator/InvigilatorViolations";
// Legacy invigilator pages (kept)
import InvigilatorDashboard from "./pages/invigilator/InvigilatorDashboard";
import InvigilatorAlerts from "./pages/invigilator/InvigilatorAlerts";
import InvigilatorExamHalls from "./pages/invigilator/InvigilatorExamHalls";
import InvigilatorStudents from "./pages/invigilator/InvigilatorStudents";

// Admin
import AdminOverview from "./pages/admin/AdminOverview";
import AdminInvigilators from "./pages/admin/AdminInvigilators";
import AdminExamHallsNew from "./pages/admin/AdminExamHallsNew";
import AdminExams from "./pages/admin/AdminExams";
import AdminCameras from "./pages/admin/AdminCameras";
import AdminSpeakers from "./pages/admin/AdminSpeakers";
import AdminMicrophones from "./pages/admin/AdminMicrophones";
import AdminViolations from "./pages/admin/AdminViolations";
import AdminAlerts from "./pages/admin/AdminAlerts";
// Legacy admin pages (kept)
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSeating from "./pages/admin/AdminSeating";
import AdminExamHalls from "./pages/admin/AdminExamHalls";
import AdminReports from "./pages/admin/AdminReports";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Invigilator (new spec) */}
          <Route path="/invigilator/dashboard"  element={<InvigilatorOverview />} />
          <Route path="/invigilator/alerts"     element={<InvigilatorAlertsPage />} />
          <Route path="/invigilator/violations" element={<InvigilatorViolations />} />
          {/* Invigilator (legacy) */}
          <Route path="/invigilator/legacy-dashboard" element={<InvigilatorDashboard />} />
          <Route path="/invigilator/live-alerts"      element={<InvigilatorAlerts />} />
          <Route path="/invigilator/exam-halls"       element={<InvigilatorExamHalls />} />
          <Route path="/invigilator/students"         element={<InvigilatorStudents />} />

          {/* Admin (new spec) */}
          <Route path="/admin/dashboard"     element={<AdminOverview />} />
          <Route path="/admin/invigilators"  element={<AdminInvigilators />} />
          <Route path="/admin/halls"         element={<AdminExamHallsNew />} />
          <Route path="/admin/exams"         element={<AdminExams />} />
          <Route path="/admin/cameras"       element={<AdminCameras />} />
          <Route path="/admin/speakers"      element={<AdminSpeakers />} />
          <Route path="/admin/microphones"   element={<AdminMicrophones />} />
          <Route path="/admin/violations"    element={<AdminViolations />} />
          <Route path="/admin/alerts"        element={<AdminAlerts />} />
          {/* Admin (legacy) */}
          <Route path="/admin/legacy-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/seating"          element={<AdminSeating />} />
          <Route path="/admin/exam-halls"       element={<AdminExamHalls />} />
          <Route path="/admin/reports"          element={<AdminReports />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
