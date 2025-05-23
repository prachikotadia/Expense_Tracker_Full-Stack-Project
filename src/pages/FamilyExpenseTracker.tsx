
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import FamilyExpenseForm from "@/components/FamilyExpenseForm";
import FamilyExpenseSummary from "@/components/FamilyExpenseSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const FamilyExpenseTracker = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(-1)}
                className="mr-2"
              >
                <ArrowLeft size={18} />
              </Button>
              <h1 className="text-2xl font-bold">Family Expenses</h1>
            </div>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Family Expense</CardTitle>
                </CardHeader>
                <CardContent>
                  <FamilyExpenseForm onComplete={handleExpenseAdded} />
                </CardContent>
              </Card>
              
              <FamilyExpenseSummary key={refreshKey} onReset={() => setRefreshKey(prev => prev + 1)} />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default FamilyExpenseTracker;
