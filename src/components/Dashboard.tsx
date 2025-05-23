
import { useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseCharts from "@/components/ExpenseCharts";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingDown, TrendingUp, Wallet, LineChart, BarChart as BarChartIcon } from "lucide-react";
import DashboardOptions from "./DashboardOptions";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { BarChart, Bar, LineChart as RechartLineChart, Line, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip } from "recharts";
import { useAuth } from "@/context/AuthContext";
import AccountOverview from "./AccountOverview";
import FinancialInsights from "./FinancialInsights";
import { useBanking } from "@/context/BankContext";

const Dashboard = () => {
  const { getTotalExpenses, currency, getTotalIncome, getExpensesByDay, getRecentExpenses } = useExpenses();
  const [activeTab, setActiveTab] = useState("overview");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const { user } = useAuth();
  const { accounts } = useBanking();
  
  const totalExpenses = getTotalExpenses();
  const totalIncome = getTotalIncome ? getTotalIncome() : 2800; // Fallback if not implemented
  const balance = totalIncome - totalExpenses;
  const expensePercentage = totalExpenses > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;
  const incomePercentage = 100; // Always 100% as reference
  const recentExpenses = getRecentExpenses ? getRecentExpenses(5) : [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get daily expenses for the last 7 days for the charts
  const dailyData = getExpensesByDay(7).map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    expense: day.amount,
    income: totalIncome / 7 // Just for demonstration, distribute income evenly
  })).reverse(); // Reverse to show oldest to newest

  const chartColors = {
    income: "#6BDE95", // Green
    expense: "#FF6370", // Red
    balance: "#33c3f0", // Blue
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Button 
          onClick={() => setShowExpenseForm(true)} 
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
        >
          <PlusCircle className="w-4 h-4" />
          Add Expense
        </Button>
      </div>

      {showExpenseForm && (
        <Card className="animate-fade-in border border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseForm onClose={() => setShowExpenseForm(false)} />
          </CardContent>
        </Card>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-card to-background border-border/50 hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground">Balance</h3>
              </div>
              <span className="rounded-full text-xs font-medium bg-primary/10 text-primary px-2 py-1">
                {expensePercentage}%
              </span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-card to-background border-border/50 hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-destructive" />
                <h3 className="text-sm font-medium text-muted-foreground">Expense</h3>
              </div>
              <span className="rounded-full text-xs font-medium bg-destructive/10 text-destructive px-2 py-1">
                -{expensePercentage}%
              </span>
            </div>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(-totalExpenses)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-card to-background border-border/50 hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="text-sm font-medium text-muted-foreground">Income</h3>
              </div>
              <span className="rounded-full text-xs font-medium bg-green-500/10 text-green-500 px-2 py-1">
                +{incomePercentage}%
              </span>
            </div>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bank Account Overview - Show if accounts exist */}
      {accounts.length > 0 && (
        <AccountOverview className="mt-6" />
      )}

      {/* Financial Insights */}
      <FinancialInsights variant="compact" />

      <DashboardOptions />

      {/* Fixed Charts - Line and Bar not overlapping */}
      <Card className="border border-border/50 bg-background/50 hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Last 7 Days Income & Expenses</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[350px]">
            <ChartContainer 
              config={{
                income: { color: chartColors.income },
                expense: { color: chartColors.expense }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={dailyData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  barGap={10}
                >
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--muted-foreground)" 
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="var(--muted-foreground)" 
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke={chartColors.income}
                    fontSize={12}
                    tickMargin={10}
                  />
                  <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                  <Legend wrapperStyle={{ paddingTop: 15 }} />
                  
                  {/* Bar for expenses */}
                  <Bar 
                    dataKey="expense" 
                    name="Expense" 
                    fill={chartColors.expense} 
                    radius={[4, 4, 0, 0]} 
                    yAxisId="left"
                  />
                  
                  {/* Line for income on separate axis */}
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke={chartColors.income}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    yAxisId="right"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-2 w-[300px]">
            <TabsTrigger 
              value="overview"
              className="transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary"
            >
              <LineChart className="w-4 h-4 mr-2" />
              Expense Charts
            </TabsTrigger>
            <TabsTrigger 
              value="transactions"
              className="transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary"
            >
              <BarChartIcon className="w-4 h-4 mr-2" />
              Recent Transactions
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview">
          <ExpenseCharts />
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card className="border border-border/50 hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
              <CardTitle className="text-base">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ExpenseList limit={5} compact={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-border/50 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
            <CardTitle className="text-base">Last Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ExpenseList limit={5} compact={true} />
          </CardContent>
        </Card>
        
        <Card className="border border-border/50 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
            <CardTitle className="text-base">Upcoming</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-center py-8 text-muted-foreground">
              <p>No upcoming expenses scheduled</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  formatter?: (value: number) => string;
}

const CustomTooltip = ({ active, payload, formatter }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background rounded-md border border-border p-3 shadow-lg">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 py-1">
            <div 
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">
              {formatter ? formatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default Dashboard;
