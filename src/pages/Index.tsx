
import { useToast } from "@/hooks/use-toast";
import DashboardComponent from "@/components/Dashboard";
import { AppSidebar } from "@/components/AppSidebar";
import TravelModeAlert from "@/components/TravelModeAlert";
import { useLocation } from "@/context/LocationContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to dashboard
  return <Navigate to="/dashboard" />;
};

export default Index;
