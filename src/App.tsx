import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import InvigilatorDashboard from "./pages/invigilator/InvigilatorDashboard";
import InvigilatorAlerts from "./pages/invigilator/InvigilatorAlerts";
import InvigilatorExamHalls from "./pages/invigilator/InvigilatorExamHalls";
import InvigilatorStudents from "./pages/invigilator/InvigilatorStudents";
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
          {/* Invigilator Routes */}
          <Route path="/invigilator/dashboard" element={<InvigilatorDashboard />} />
          <Route path="/invigilator/alerts" element={<InvigilatorAlerts />} />
          <Route path="/invigilator/exam-halls" element={<InvigilatorExamHalls />} />
          <Route path="/invigilator/students" element={<InvigilatorStudents />} />
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/seating" element={<AdminSeating />} />
          <Route path="/admin/exam-halls" element={<AdminExamHalls />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
