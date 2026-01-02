import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Mock credentials for demo
const MOCK_USERS = {
  "INV001": { password: "password123", role: "invigilator", name: "Dr. Sarah Johnson" },
  "ADM001": { password: "admin123", role: "admin", name: "Prof. Michael Chen" },
};

export default function Login() {
  const navigate = useNavigate();
  const [universityId, setUniversityId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = MOCK_USERS[universityId as keyof typeof MOCK_USERS];
    
    if (user && user.password === password) {
      toast.success(`Welcome back, ${user.name}!`);
      
      // Store user info in sessionStorage for demo
      sessionStorage.setItem("user", JSON.stringify({
        id: universityId,
        name: user.name,
        role: user.role,
      }));

      // Navigate based on role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/invigilator/dashboard");
      }
    } else {
      toast.error("Invalid credentials. Try INV001/password123 or ADM001/admin123");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 stat-card-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent">
              <Eye className="h-8 w-8 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">EYESON AI</h1>
              <p className="text-primary-foreground/70 text-lg">Intelligent Exam Proctoring</p>
            </div>
          </div>
          
          <div className="space-y-6 max-w-md">
            <h2 className="text-2xl font-semibold">Secure. Reliable. Intelligent.</h2>
            <p className="text-primary-foreground/80 leading-relaxed">
              Advanced AI-powered examination monitoring system designed for universities. 
              Ensuring academic integrity with real-time surveillance and instant alerts.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="rounded-lg bg-primary-foreground/10 p-4 backdrop-blur">
                <p className="text-3xl font-bold">99.9%</p>
                <p className="text-sm text-primary-foreground/70">Detection Accuracy</p>
              </div>
              <div className="rounded-lg bg-primary-foreground/10 p-4 backdrop-blur">
                <p className="text-3xl font-bold">&lt;1s</p>
                <p className="text-sm text-primary-foreground/70">Alert Response</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Eye className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">EYESON AI</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">Sign in with your university credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="universityId" className="text-sm font-medium">
                University ID
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="universityId"
                  type="text"
                  placeholder="Enter your ID"
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value.toUpperCase())}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Demo Credentials:</strong>
              <br />
              Invigilator: INV001 / password123
              <br />
              Admin: ADM001 / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
