
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from "@/context/ExpenseContext";
import { useBanking } from "@/context/BankContext";
import { ArrowRight, LineChart, TrendingDown, TrendingUp, CreditCard, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface FinancialInsightsProps {
  variant?: "compact" | "detailed";
  className?: string;
}

const FinancialInsights = ({ variant = "detailed", className = "" }: FinancialInsightsProps) => {
  const { expenses, currency, getTotalExpenses } = useExpenses();
  const { accounts } = useBanking();
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const getCurrentMonth = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };
  
  const getTrendData = () => {
    // In a real app, this would compare with previous periods
    // For now, we'll return some dummy data
    return {
      spending: {
        current: getTotalExpenses(),
        previous: getTotalExpenses() * 1.15,
        change: -15, // percent
      },
      income: {
        current: 3000,
        previous: 2800,
        change: 7.1, // percent
      },
      savings: {
        current: 500,
        previous: 400,
        change: 25, // percent
      },
      biggestCategory: "Groceries",
      mostExpensiveDay: "Friday",
      mostFrequentMerchant: "Starbucks",
    };
  };
  
  const trends = getTrendData();
  const totalAssets = accounts.filter(a => a.type !== "credit").reduce((sum, a) => sum + a.balance, 0);
  const totalDebt = accounts.filter(a => a.type === "credit").reduce((sum, a) => sum + a.balance, 0);
  
  if (variant === "compact") {
    return (
      <Card className={`border border-border/50 hover:shadow-md transition-all duration-300 apple-card ${className}`}>
        <CardHeader className="bg-gradient-to-r from-card to-muted/50 rounded-t-lg pb-2">
          <CardTitle className="flex items-center text-base">
            <LineChart className="h-4 w-4 mr-2 text-primary" />
            Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Monthly spending</span>
              <div className="flex items-center">
                {formatCurrency(trends.spending.current)}
                {trends.spending.change < 0 ? (
                  <TrendingDown className="h-4 w-4 ml-1 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 ml-1 text-red-500" />
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Highest expense</span>
              <span>{trends.biggestCategory}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Savings rate</span>
              <div className="flex items-center">
                {(trends.savings.current / trends.income.current * 100).toFixed(1)}%
                <TrendingUp className="h-4 w-4 ml-1 text-green-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Define the modern color palette matching the reference images
  const CARD_COLORS = [
    { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-200", accent: "border-l-4 border-blue-500" },
    { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-200", accent: "border-l-4 border-red-500" },
    { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-800 dark:text-yellow-200", accent: "border-l-4 border-yellow-500" },
    { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-800 dark:text-green-200", accent: "border-l-4 border-green-500" },
  ];
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <Card 
        className={`transition-all duration-300 hover:shadow-md apple-card ${
          activeInsight === "spending" ? "ring-1 ring-primary/50" : ""
        } ${CARD_COLORS[0].accent}`}
        onMouseEnter={() => setActiveInsight("spending")}
        onMouseLeave={() => setActiveInsight(null)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base">Monthly Spending</CardTitle>
            <HoverCard>
              <HoverCardTrigger asChild>
                <AlertCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent side="top">
                <p className="text-xs">
                  Your spending for {getCurrentMonth()} compared to last month.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">{formatCurrency(trends.spending.current)}</div>
          <div className={`flex items-center mt-1 text-sm ${trends.spending.change < 0 ? "text-green-500" : "text-red-500"}`}>
            {trends.spending.change < 0 ? (
              <TrendingDown className="h-4 w-4 mr-1" />
            ) : (
              <TrendingUp className="h-4 w-4 mr-1" />
            )}
            <span>{Math.abs(trends.spending.change)}% {trends.spending.change < 0 ? "less than" : "more than"} last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className={`transition-all duration-300 hover:shadow-md apple-card ${
          activeInsight === "topCategory" ? "ring-1 ring-primary/50" : ""
        } ${CARD_COLORS[1].accent}`}
        onMouseEnter={() => setActiveInsight("topCategory")}
        onMouseLeave={() => setActiveInsight(null)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Top Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{trends.biggestCategory}</div>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Most frequent: {trends.mostFrequentMerchant}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className={`transition-all duration-300 hover:shadow-md apple-card ${
          activeInsight === "dayAnalysis" ? "ring-1 ring-primary/50" : ""
        } ${CARD_COLORS[2].accent}`}
        onMouseEnter={() => setActiveInsight("dayAnalysis")}
        onMouseLeave={() => setActiveInsight(null)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Day Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{trends.mostExpensiveDay}</div>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4 mr-1" />
            <span>Highest spending day</span>
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className={`transition-all duration-300 hover:shadow-md apple-card ${
          activeInsight === "savingsRate" ? "ring-1 ring-primary/50" : ""
        } ${CARD_COLORS[3].accent}`}
        onMouseEnter={() => setActiveInsight("savingsRate")}
        onMouseLeave={() => setActiveInsight(null)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Savings Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(trends.savings.current / trends.income.current * 100).toFixed(1)}%
          </div>
          <div className={`flex items-center mt-1 text-sm text-green-500`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>{trends.savings.change}% improvement</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2 lg:col-span-4 transition-all duration-300 hover:shadow-md bg-gradient-to-r from-primary/5 to-background apple-card">
        <CardContent className="py-4">
          <div className="flex justify-between items-center flex-wrap md:flex-nowrap gap-3">
            <div>
              <h3 className="font-medium">Need more insights?</h3>
              <p className="text-sm text-muted-foreground">Connect more accounts to get a complete financial picture</p>
            </div>
            <Button variant="outline" className="hover:bg-primary/10 group shrink-0">
              View Analytics
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialInsights;
