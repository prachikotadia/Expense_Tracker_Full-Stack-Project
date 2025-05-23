
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBanking, BankAccount } from "@/context/BankContext";
import { CircleDollarSign, CreditCard, Landmark, TrendingDown, TrendingUp } from "lucide-react";
import { useExpenses } from "@/context/ExpenseContext";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useState } from "react";

interface AccountOverviewProps {
  variant?: "dashboard" | "detailed";
  className?: string;
}

const AccountOverview = ({ variant = "dashboard", className = "" }: AccountOverviewProps) => {
  const { accounts } = useBanking();
  const { currency } = useExpenses();
  const [activeCard, setActiveCard] = useState<string | null>(null);
  
  const getTotalBalance = () => {
    const assets = accounts
      .filter(account => account.type !== "credit")
      .reduce((sum, account) => sum + account.balance, 0);
    
    const debts = accounts
      .filter(account => account.type === "credit")
      .reduce((sum, account) => sum + account.balance, 0);
    
    return {
      assets,
      debts,
      netWorth: assets - debts
    };
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const { assets, debts, netWorth } = getTotalBalance();
  
  return (
    <div className={`grid grid-cols-1 ${variant === "detailed" ? "md:grid-cols-3" : "md:grid-cols-3"} gap-4 ${className}`}>
      <Card 
        className={`transition-all duration-300 border border-border/50 hover:shadow-md ${
          activeCard === "assets" ? "ring-1 ring-primary/50" : ""
        }`}
        onMouseEnter={() => setActiveCard("assets")}
        onMouseLeave={() => setActiveCard(null)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <div className="bg-green-500/10 p-2 rounded-full mr-2">
              <Landmark className="h-5 w-5 text-green-500" />
            </div>
            Total Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="font-mono text-2xl font-bold cursor-help">
                {formatCurrency(assets)}
              </div>
            </HoverCardTrigger>
            <HoverCardContent side="bottom" align="start" className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Your Asset Accounts</h4>
                <div className="space-y-1">
                  {accounts.filter(account => account.type !== "credit").length > 0 ? (
                    accounts
                      .filter(account => account.type !== "credit")
                      .map(account => (
                        <div key={account.id} className="flex justify-between text-sm">
                          <span>{account.name}</span>
                          <span className="font-mono">{formatCurrency(account.balance)}</span>
                        </div>
                      ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No asset accounts found</p>
                  )}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <div className="mt-1 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs text-muted-foreground">From {accounts.filter(a => a.type !== "credit").length} accounts</span>
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className={`transition-all duration-300 border border-border/50 hover:shadow-md ${
          activeCard === "debts" ? "ring-1 ring-primary/50" : ""
        }`}
        onMouseEnter={() => setActiveCard("debts")}
        onMouseLeave={() => setActiveCard(null)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <div className="bg-red-500/10 p-2 rounded-full mr-2">
              <CreditCard className="h-5 w-5 text-red-500" />
            </div>
            Total Debt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="font-mono text-2xl font-bold cursor-help">
                {formatCurrency(debts)}
              </div>
            </HoverCardTrigger>
            <HoverCardContent side="bottom" align="start" className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Your Credit Accounts</h4>
                <div className="space-y-1">
                  {accounts.filter(account => account.type === "credit").length > 0 ? (
                    accounts
                      .filter(account => account.type === "credit")
                      .map(account => (
                        <div key={account.id} className="flex justify-between text-sm">
                          <span>{account.name}</span>
                          <span className="font-mono">{formatCurrency(account.balance)}</span>
                        </div>
                      ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No credit accounts found</p>
                  )}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <div className="mt-1 flex items-center">
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-xs text-muted-foreground">From {accounts.filter(a => a.type === "credit").length} accounts</span>
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className={`transition-all duration-300 border border-border/50 hover:shadow-md ${
          activeCard === "netWorth" ? "ring-1 ring-primary/50" : ""
        }`}
        onMouseEnter={() => setActiveCard("netWorth")}
        onMouseLeave={() => setActiveCard(null)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <div className={`${netWorth >= 0 ? "bg-primary/10" : "bg-amber-500/10"} p-2 rounded-full mr-2`}>
              <CircleDollarSign className={`h-5 w-5 ${netWorth >= 0 ? "text-primary" : "text-amber-500"}`} />
            </div>
            Net Worth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`font-mono text-2xl font-bold ${netWorth < 0 ? "text-red-500" : ""}`}>
            {formatCurrency(netWorth)}
          </div>
          <div className="mt-1 flex items-center">
            {netWorth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className="text-xs text-muted-foreground">
              {accounts.length > 0 
                ? `From ${accounts.length} total accounts` 
                : "No accounts connected"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountOverview;
