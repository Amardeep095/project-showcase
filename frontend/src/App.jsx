import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import SitePage from "./pages/SitePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollProgress from "./components/ui/ScrollProgress";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollProgress />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/site/:id" element={<SitePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0f1620",
              color: "#e2e8f0",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#10b981", secondary: "#0f1620" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#0f1620" } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
