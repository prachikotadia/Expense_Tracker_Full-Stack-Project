
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExpenses, Expense } from "@/context/ExpenseContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, isToday, isThisWeek, isThisMonth, isThisYear, isAfter, isBefore } from "date-fns";

const Calendar = () => {
  const { expenses } = useExpenses();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "month" | "year">("day");
  
  // Function to filter expenses based on the selected date and view
  const getFilteredExpenses = () => {
    if (!date) return [];
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      
      switch (view) {
        case "day":
          return format(expenseDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
        case "month":
          return format(expenseDate, "yyyy-MM") === format(date, "yyyy-MM");
        case "year":
          return format(expenseDate, "yyyy") === format(date, "yyyy");
        default:
          return false;
      }
    });
  };
  
  const filteredExpenses = getFilteredExpenses();

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
              <h1 className="text-2xl font-bold">Calendar</h1>
            </div>
            
            <div className="grid md:grid-cols-[350px_1fr] gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CalendarIcon className="mr-2 h-5 w-5" /> 
                      Select Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>View Mode</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="day" onValueChange={(value) => setView(value as any)}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="year">Year</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {view === "day" && date && `Expenses for ${format(date, "MMMM d, yyyy")}`}
                    {view === "month" && date && `Expenses for ${format(date, "MMMM yyyy")}`}
                    {view === "year" && date && `Expenses for ${format(date, "yyyy")}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredExpenses.length > 0 ? (
                    <div className="space-y-4">
                      {filteredExpenses.map((expense) => (
                        <div 
                          key={expense.id} 
                          className="flex items-center justify-between p-3 rounded-lg border bg-card/60"
                        >
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-sm text-muted-foreground">{expense.category} • {format(new Date(expense.date), "MMM d, yyyy")}</p>
                          </div>
                          <p className={`font-mono font-semibold ${expense.category === "Income" ? "text-green-500" : "text-foreground"}`}>
                            {expense.category === "Income" ? "+" : "-"}{expense.currency} {expense.amount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No expenses found for this {view}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Calendar;
