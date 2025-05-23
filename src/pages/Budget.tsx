
import { useState } from "react";
import ThemeProvider from "@/context/ThemeContext";
import { ExpenseProvider } from "@/context/ExpenseContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useExpenses } from "@/context/ExpenseContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, AlertTriangle, Pencil, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import BudgetCategoryItem from "@/components/BudgetCategoryItem";
import TravelModeAlert from "@/components/TravelModeAlert";
import { useLocation } from "@/context/LocationContext";
import BackButton from "@/components/BackButton";

const Budget = () => {
  const { 
    getExpensesByCategory, 
    categories, 
    getTotalExpenses, 
    getTotalIncome,
    getMonthlyBudget,
    setMonthlyBudget,
    currency 
  } = useExpenses();
  
  const { toast } = useToast();
  const { currentLocation } = useLocation();
  const [editingBudget, setEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(() => getMonthlyBudget().toString());
  
  const totalExpenses = getTotalExpenses();
  const monthlyBudget = getMonthlyBudget();
  const totalIncome = getTotalIncome();
  const remainingBudget = monthlyBudget - totalExpenses;
  const budgetProgress = Math.min((totalExpenses / monthlyBudget) * 100, 100);
  
  const expensesByCategory = getExpensesByCategory();
  
  // Filter out zero-value categories and sort by amount
  const categoryBudgetData = Object.entries(expensesByCategory)
    .filter(([category, amount]) => amount > 0 && category !== "Income")
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalExpenses) * 100
    }));

  const handleSaveBudget = () => {
    const budgetValue = parseFloat(newBudget);
    if (isNaN(budgetValue) || budgetValue <= 0) {
      toast({
        title: "Invalid budget",
        description: "Please enter a valid budget amount",
        variant: "destructive"
      });
      return;
    }
    
    setMonthlyBudget(budgetValue);
    setEditingBudget(false);
    
    toast({
      title: "Budget updated",
      description: `Your monthly budget has been updated to ${formatCurrency(budgetValue)}`
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Define the modern color palette matching the reference images
  const CHART_COLORS = [
    "#6B8AF2", // Light blue
    "#FF6370", // Coral red 
    "#FFD650", // Bright yellow
    "#50D2C2", // Turquoise
    "#9E7BF6"  // Purple
  ];

  return (
    <ThemeProvider>
      <ExpenseProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <Navbar />
          {currentLocation && <TravelModeAlert location={currentLocation} />}
          <main className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
              <BackButton to="/dashboard" className="mr-2" />
              <h1 className="text-3xl font-bold">Budget Planning</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Monthly Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  {editingBudget ? (
                    <div className="flex gap-2 mt-2 items-center">
                      <Input 
                        type="number" 
                        value={newBudget}
                        onChange={(e) => setNewBudget(e.target.value)}
                        className="max-w-48"
                      />
                      <Button size="icon" variant="ghost" onClick={handleSaveBudget}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingBudget(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-3xl font-bold">{formatCurrency(monthlyBudget)}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setNewBudget(monthlyBudget.toString());
                          setEditingBudget(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Spent This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
                  <Progress value={budgetProgress} className="h-2 mt-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {budgetProgress.toFixed(0)}% of monthly budget used
                  </p>
                </CardContent>
              </Card>
              
              <Card className={remainingBudget < 0 ? "border-destructive" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Remaining Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <p className={`text-3xl font-bold ${remainingBudget < 0 ? "text-destructive" : ""}`}>
                      {formatCurrency(remainingBudget)}
                    </p>
                    {remainingBudget < 0 && (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  {remainingBudget < 0 ? (
                    <p className="text-sm text-destructive mt-2">
                      You've exceeded your monthly budget
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      Available to spend this month
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>
                    How your budget is allocated across different categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryBudgetData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                        <YAxis dataKey="category" type="category" width={80} />
                        <Tooltip 
                          formatter={(value) => formatCurrency(value as number)}
                          labelFormatter={(label) => `Category: ${label}`}
                          contentStyle={{ 
                            backgroundColor: 'var(--background)',
                            borderColor: 'var(--border)',
                            borderRadius: '0.5rem',
                          }}
                        />
                        {categoryBudgetData.map((entry, index) => (
                          <Bar 
                            key={entry.category}
                            dataKey="amount" 
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                            name={entry.category} 
                            radius={[0, 4, 4, 0]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Category Budget Breakdown</CardTitle>
                  <CardDescription>
                    How much you've spent in each category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {categoryBudgetData.map(({ category, amount, percentage }, index) => (
                      <BudgetCategoryItem 
                        key={category}
                        category={category}
                        amount={amount}
                        percentage={percentage}
                        currency={currency}
                        color={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Budget vs. Income</CardTitle>
                <CardDescription>
                  Compare your budget and spending with your income
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground mb-1">Monthly Income</span>
                    <span className="text-2xl font-bold">{formatCurrency(totalIncome)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground mb-1">Monthly Budget</span>
                    <span className="text-2xl font-bold">{formatCurrency(monthlyBudget)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground mb-1">Monthly Expenses</span>
                    <span className="text-2xl font-bold">{formatCurrency(totalExpenses)}</span>
                  </div>
                </div>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Income vs Expenses', income: totalIncome, budget: monthlyBudget, expenses: totalExpenses }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="income" name="Income" fill="#50D2C2" />
                      <Bar dataKey="budget" name="Budget" fill="#6B8AF2" />
                      <Bar dataKey="expenses" name="Expenses" fill="#FF6370" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </ExpenseProvider>
    </ThemeProvider>
  );
};

export default Budget;
