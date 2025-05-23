
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses, Expense, ExpenseCategory } from "@/context/ExpenseContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, subDays, isAfter, isBefore } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const History = () => {
  const { expenses, categories, currency } = useExpenses();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("30");
  
  // Get filter time range
  const getTimeRange = () => {
    const today = new Date();
    const days = parseInt(timeRange);
    
    if (isNaN(days)) return subDays(today, 30); // Default to 30 days
    return subDays(today, days);
  };
  
  // Filter expenses based on search, category and time range
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = searchTerm === "" || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    
    const expenseDate = new Date(expense.date);
    const startDate = getTimeRange();
    const matchesTimeRange = isBefore(startDate, expenseDate) && isBefore(expenseDate, new Date());
    
    return matchesSearch && matchesCategory && matchesTimeRange;
  });
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Group expenses by date
  const groupExpensesByDate = () => {
    const groups: Record<string, Expense[]> = {};
    
    sortedExpenses.forEach(expense => {
      const dateKey = format(new Date(expense.date), "yyyy-MM-dd");
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(expense);
    });
    
    return groups;
  };
  
  const groupedExpenses = groupExpensesByDate();
  
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
              <h1 className="text-2xl font-bold">Transaction History</h1>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filter Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search transactions..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 3 months</SelectItem>
                      <SelectItem value="365">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {Object.keys(groupedExpenses).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(groupedExpenses).map(([date, dayExpenses]) => (
                  <div key={date}>
                    <div className="sticky top-0 z-10 bg-background py-2">
                      <h2 className="font-medium">{format(new Date(date), "EEEE, MMMM d, yyyy")}</h2>
                      <Separator className="my-2" />
                    </div>
                    
                    <div className="space-y-2">
                      {dayExpenses.map((expense) => (
                        <Card key={expense.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{expense.description}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {expense.category}
                                </p>
                              </div>
                              <p className={`font-mono font-medium ${expense.category === "Income" ? "text-green-500" : ""}`}>
                                {expense.category === "Income" ? "+" : "-"}{expense.currency} {expense.amount.toFixed(2)}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No transactions found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search term
                </p>
              </Card>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default History;
