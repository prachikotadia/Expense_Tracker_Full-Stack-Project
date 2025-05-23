
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import StudentExpenseForm from "@/components/StudentExpenseForm";
import StudentExpenseSummary from "@/components/StudentExpenseSummary";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { School } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const StudentExpenseTracker = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const isMobile = useIsMobile();

  const handleExpenseAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="w-full overflow-hidden">
          <Navbar />
          <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full">
            <div className="flex items-center space-x-2 mb-6">
              <BackButton to="/dashboard" />
              
              <div className="flex items-center">
                <School className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary" />
                <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Student Expenses
                </h1>
              </div>
            </div>
            
            <div className="grid gap-4 sm:gap-6">
              <Card className="bg-gradient-to-br from-card to-background/70 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl">Student Expense Tracker</CardTitle>
                  <CardDescription className="text-sm">
                    Track and analyze your education-related expenses by university, category, and more
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StudentExpenseForm onComplete={handleExpenseAdded} />
                </CardContent>
              </Card>
              
              <StudentExpenseSummary key={refreshKey} onReset={() => setRefreshKey(prev => prev + 1)} />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentExpenseTracker;
