
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

const ProtectedRoute = () => {
  // For now, we'll simulate authentication check
  // Later this will be replaced with proper auth checks using a context
  const isAuthenticated = localStorage.getItem("auth") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-raksha-light-gray">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;
