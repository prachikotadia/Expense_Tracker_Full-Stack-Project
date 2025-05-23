
import DashboardComponent from "@/components/Dashboard";
import { AppSidebar } from "@/components/AppSidebar";
import TravelModeAlert from "@/components/TravelModeAlert";
import { useLocation } from "@/context/LocationContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useAuth } from "@/context/AuthContext";
import BackButton from "@/components/BackButton";

const Dashboard = () => {
  const { currentLocation } = useLocation();
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background to-muted/30">
        <AppSidebar />
        <SidebarInset className="w-full">
          <Navbar />
          <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-full overflow-x-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div className="flex items-center">
                <BackButton to="/" label="Home" className="mr-2" />
                <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Dashboard
                </h1>
              </div>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="text-sm transition-all duration-300 hover:bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full self-start sm:self-auto">
                    {user?.name || "User"}'s Financial Summary
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-72 sm:w-80 bg-card/95 backdrop-blur-sm border border-border/50">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Financial Overview</h4>
                    <p className="text-sm">
                      Welcome back! Your spending this month is 15% lower than last month.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Tap on any card for detailed insights.
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            {currentLocation && <TravelModeAlert location={currentLocation} />}
            <DashboardComponent />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
