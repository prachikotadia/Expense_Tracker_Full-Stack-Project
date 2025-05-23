
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses, Expense } from "@/context/ExpenseContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, isAfter } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Upcoming = () => {
  const { expenses } = useExpenses();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "recurring" | "upcoming">("all");
  
  // Get today's date
  const today = new Date();
  
  // Filter upcoming expenses (future dates or recurring expenses)
  const upcomingExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    
    if (filter === "recurring" && expense.isRecurring) {
      return true;
    } else if (filter === "upcoming" && isAfter(expenseDate, today) && !expense.isRecurring) {
      return true;
    } else if (filter === "all" && (isAfter(expenseDate, today) || expense.isRecurring)) {
      return true;
    }
    
    return false;
  });
  
  // Sort expenses by date (closest first)
  const sortedExpenses = [...upcomingExpenses].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(-1)}
                className="mr-2"
              >
                <ArrowLeft size={18} />
              </Button>
              <h1 className="text-2xl font-bold">Upcoming Expenses</h1>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filter Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="recurring">Recurring</TabsTrigger>
                    <TabsTrigger value="upcoming">One-time</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              {sortedExpenses.length > 0 ? (
                sortedExpenses.map((expense) => (
                  <Card key={expense.id} className="overflow-hidden">
                    <div className={`h-2 ${expense.isRecurring ? "bg-purple-500" : "bg-blue-500"}`}></div>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{expense.description}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar size={14} />
                            <span>{format(new Date(expense.date), "MMMM d, yyyy")}</span>
                            {expense.isRecurring && (
                              <>
                                <Clock size={14} className="ml-2" />
                                <span>{expense.recurringFrequency}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-semibold">
                            {expense.currency} {expense.amount.toFixed(2)}
                          </p>
                          <div className="mt-1">
                            <Badge variant={expense.isRecurring ? "secondary" : "outline"}>
                              {expense.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="flex flex-col items-center justify-center p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No upcoming expenses</h3>
                  <p className="text-muted-foreground">
                    You don't have any {filter === "all" ? "" : filter} upcoming expenses.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Upcoming;
