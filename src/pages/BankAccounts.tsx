
import { useState, useEffect } from "react";
import { useBanking, BankAccount } from "@/context/BankContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Building, 
  CreditCard, 
  LineChart, 
  Landmark, 
  Wallet, 
  Plus, 
  LinkIcon, 
  Unlink, 
  PiggyBank,
  CircleDollarSign,
  ArrowLeft,
  BarChart3,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExpenses } from "@/context/ExpenseContext";
import TravelModeAlert from "@/components/TravelModeAlert";
import { useLocation } from "@/context/LocationContext";
import { useToast } from "@/hooks/use-toast";
import AccountOverview from "@/components/AccountOverview";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const BankAccountForm = () => {
  const { connectAccount, cancelConnecting } = useBanking();
  const { currency } = useExpenses();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState<"checking" | "savings" | "credit" | "investment">("checking");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Missing account name",
        description: "Please enter an account name",
        variant: "destructive",
      });
      return;
    }
    
    const balanceValue = parseFloat(balance);
    if (isNaN(balanceValue)) {
      toast({
        title: "Invalid balance",
        description: "Please enter a valid account balance",
        variant: "destructive",
      });
      return;
    }
    
    connectAccount({
      name,
      balance: balanceValue,
      type
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="account-name">Account Name</Label>
        <Input
          id="account-name"
          placeholder="e.g. Main Checking Account"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="account-type">Account Type</Label>
        <Select value={type} onValueChange={(value) => setType(value as any)}>
          <SelectTrigger id="account-type" className="transition-all duration-200 focus:ring-2 focus:ring-primary/30">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="checking">Checking</SelectItem>
            <SelectItem value="savings">Savings</SelectItem>
            <SelectItem value="credit">Credit Card</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="account-balance">Starting Balance ({currency})</Label>
        <Input
          id="account-balance"
          placeholder="0.00"
          type="number"
          step="0.01"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={cancelConnecting} className="hover:bg-destructive/10">
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>
    </form>
  );
};

const BankAccountCard = ({ account }: { account: BankAccount }) => {
  const { disconnectAccount } = useBanking();
  const { currency } = useExpenses();
  const [isHovered, setIsHovered] = useState(false);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  const getAccountIcon = () => {
    switch (account.type) {
      case "checking":
        return <Wallet className="h-5 w-5" />;
      case "savings":
        return <PiggyBank className="h-5 w-5" />;
      case "credit":
        return <CreditCard className="h-5 w-5" />;
      case "investment":
        return <LineChart className="h-5 w-5" />;
      default:
        return <Building className="h-5 w-5" />;
    }
  };
  
  const getAccountTypeLabel = () => {
    return account.type.charAt(0).toUpperCase() + account.type.slice(1);
  };

  const getAccountGradient = () => {
    switch (account.type) {
      case "checking":
        return "from-blue-500/10 to-blue-600/5";
      case "savings":
        return "from-green-500/10 to-green-600/5";
      case "credit":
        return "from-red-500/10 to-red-600/5";
      case "investment":
        return "from-amber-500/10 to-amber-600/5";
      default:
        return "from-gray-500/10 to-gray-600/5";
    }
  };

  return (
    <Card 
      className={`transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isHovered ? "ring-1 ring-primary/50" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className={`pb-2 bg-gradient-to-br ${getAccountGradient()} rounded-t-lg`}>
        <CardTitle className="flex items-center text-lg">
          <div className="bg-background p-2 rounded-full mr-2">
            {getAccountIcon()}
          </div>
          {account.name}
        </CardTitle>
        <CardDescription>{getAccountTypeLabel()} Account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-2xl font-bold font-mono">{formatCurrency(account.balance)}</div>
            <div className={`mt-1 flex items-center text-xs ${
              account.type === "credit" ? "text-red-500" : "text-green-500"
            }`}>
              {account.type === "credit" ? (
                <TrendingDown className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1" />
              )}
              {account.type === "credit" ? "Debt" : "Asset"}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex rounded-full bg-primary-foreground/10 px-2 py-1 text-xs">
              <LinkIcon className="h-3 w-3 mr-1" />
              Connected
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1 bg-gradient-to-t from-muted/20 to-transparent">
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-destructive w-full justify-start transition-all duration-200"
          onClick={() => disconnectAccount(account.id)}
        >
          <Unlink className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </CardFooter>
    </Card>
  );
};

const EmptyAccountsState = () => {
  const { startConnecting } = useBanking();
  
  return (
    <Card className="border-dashed bg-gradient-to-br from-background to-muted/50 transition-all duration-300 hover:shadow-md">
      <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-60">
        <CircleDollarSign className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="font-medium text-lg mb-1">No accounts connected</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Connect your bank accounts to track your balances and transactions.
        </p>
        <Button 
          onClick={startConnecting}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Connect an Account
        </Button>
      </CardContent>
    </Card>
  );
};

const AccountBalanceChart = () => {
  const { accounts } = useBanking();
  
  if (accounts.length === 0) {
    return null;
  }
  
  return (
    <Card className="col-span-full mt-6 border border-border/50 transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Account Balance Distribution
        </CardTitle>
        <CardDescription>Visual overview of your account balances</CardDescription>
      </CardHeader>
      <CardContent className="h-60 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Balance chart visualization will be displayed here</p>
          <p className="text-sm">(Implementation pending)</p>
        </div>
      </CardContent>
    </Card>
  );
};

const BankAccounts = () => {
  const { accounts, isConnecting, startConnecting } = useBanking();
  const { currentLocation } = useLocation();
  const { currency } = useExpenses();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("accounts");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background to-muted/30">
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          {currentLocation && <TravelModeAlert location={currentLocation} />}
          <main className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(-1)}
                className="mr-2 transition-all duration-300 hover:bg-primary/10"
              >
                <ArrowLeft size={18} />
              </Button>
              <h1 className="text-3xl font-bold">Bank Accounts</h1>
            </div>
            
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="accounts" className="transition-all duration-200">
                  Accounts
                </TabsTrigger>
                <TabsTrigger value="insights" className="transition-all duration-200">
                  Insights
                </TabsTrigger>
                <TabsTrigger value="transactions" className="transition-all duration-200">
                  Transactions
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="accounts" className="space-y-6">
                {accounts.length > 0 && !isConnecting && (
                  <div className="flex justify-end">
                    <Button 
                      onClick={startConnecting}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Account
                    </Button>
                  </div>
                )}
                
                {accounts.length > 0 && (
                  <AccountOverview variant="detailed" className="mb-6" />
                )}
                
                {isConnecting ? (
                  <Card className="max-w-xl mx-auto border border-border/50 shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
                      <CardTitle>Connect Bank Account</CardTitle>
                      <CardDescription>
                        Enter your account details to connect your bank account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <BankAccountForm />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.length === 0 ? (
                      <EmptyAccountsState />
                    ) : (
                      accounts.map(account => (
                        <BankAccountCard key={account.id} account={account} />
                      ))
                    )}
                  </div>
                )}
                
                {accounts.length > 0 && <AccountBalanceChart />}
              </TabsContent>
              
              <TabsContent value="insights">
                <Card className="border border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Financial Insights</CardTitle>
                    <CardDescription>Smart analysis of your financial data</CardDescription>
                  </CardHeader>
                  <CardContent className="py-6">
                    <div className="text-center py-10">
                      <LineChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Insights Coming Soon</h3>
                      <p className="text-muted-foreground">
                        We're working on building advanced financial insights based on your account data.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="transactions">
                <Card className="border border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Account Transactions</CardTitle>
                    <CardDescription>View all transactions across your accounts</CardDescription>
                  </CardHeader>
                  <CardContent className="py-6">
                    <div className="text-center py-10">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Transactions Coming Soon</h3>
                      <p className="text-muted-foreground">
                        We're building a comprehensive transaction history view for your accounts.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default BankAccounts;
