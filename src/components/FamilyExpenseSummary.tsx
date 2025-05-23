
import { useEffect, useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useLocation } from "@/context/LocationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle, TrendingDown, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Define expense categories and estimates by country and region
const familyExpenseEstimates: Record<string, Record<string, Record<string, number>>> = {
  "United States": {
    "New York": {
      "Housing (Rent)": 2500,
      "Housing (Own)": 2200,
      "Groceries (per adult)": 400,
      "Groceries (per child)": 250,
      "Transportation": 500,
      "Utilities": 350,
      "Health Insurance (per person)": 300,
      "Child Care (per child)": 1200,
      "School Expenses (per child)": 200,
      "Entertainment": 400,
      "Miscellaneous": 500
    },
    "California": {
      "Housing (Rent)": 2400,
      "Housing (Own)": 2100,
      "Groceries (per adult)": 380,
      "Groceries (per child)": 230,
      "Transportation": 450,
      "Utilities": 300,
      "Health Insurance (per person)": 280,
      "Child Care (per child)": 1100,
      "School Expenses (per child)": 180,
      "Entertainment": 380,
      "Miscellaneous": 450
    },
    "Other": {
      "Housing (Rent)": 1500,
      "Housing (Own)": 1200,
      "Groceries (per adult)": 300,
      "Groceries (per child)": 200,
      "Transportation": 350,
      "Utilities": 250,
      "Health Insurance (per person)": 250,
      "Child Care (per child)": 800,
      "School Expenses (per child)": 150,
      "Entertainment": 300,
      "Miscellaneous": 400
    }
  },
  "United Kingdom": {
    "London": {
      "Housing (Rent)": 2000,
      "Housing (Own)": 1800,
      "Groceries (per adult)": 300,
      "Groceries (per child)": 200,
      "Transportation": 400,
      "Utilities": 300,
      "Health Insurance (per person)": 100,
      "Child Care (per child)": 1000,
      "School Expenses (per child)": 100,
      "Entertainment": 350,
      "Miscellaneous": 400
    },
    "Other": {
      "Housing (Rent)": 1200,
      "Housing (Own)": 1000,
      "Groceries (per adult)": 250,
      "Groceries (per child)": 150,
      "Transportation": 300,
      "Utilities": 250,
      "Health Insurance (per person)": 80,
      "Child Care (per child)": 700,
      "School Expenses (per child)": 80,
      "Entertainment": 250,
      "Miscellaneous": 300
    }
  },
  // Default values for other countries
  "Other": {
    "Other": {
      "Housing (Rent)": 1200,
      "Housing (Own)": 1000,
      "Groceries (per adult)": 250,
      "Groceries (per child)": 150,
      "Transportation": 300,
      "Utilities": 200,
      "Health Insurance (per person)": 200,
      "Child Care (per child)": 500,
      "School Expenses (per child)": 100,
      "Entertainment": 250,
      "Miscellaneous": 300
    }
  }
};

// Add more countries with similar structure
Object.assign(familyExpenseEstimates, {
  "Australia": {
    "Sydney": {
      "Housing (Rent)": 2000,
      "Housing (Own)": 1800,
      "Groceries (per adult)": 350,
      "Groceries (per child)": 200,
      "Transportation": 400,
      "Utilities": 300,
      "Health Insurance (per person)": 120,
      "Child Care (per child)": 900,
      "School Expenses (per child)": 150,
      "Entertainment": 350,
      "Miscellaneous": 400
    },
    "Other": {
      "Housing (Rent)": 1400,
      "Housing (Own)": 1200,
      "Groceries (per adult)": 300,
      "Groceries (per child)": 180,
      "Transportation": 300,
      "Utilities": 250,
      "Health Insurance (per person)": 100,
      "Child Care (per child)": 700,
      "School Expenses (per child)": 120,
      "Entertainment": 300,
      "Miscellaneous": 350
    }
  },
  "Canada": {
    "Toronto": {
      "Housing (Rent)": 1800,
      "Housing (Own)": 1600,
      "Groceries (per adult)": 300,
      "Groceries (per child)": 180,
      "Transportation": 350,
      "Utilities": 280,
      "Health Insurance (per person)": 80,
      "Child Care (per child)": 800,
      "School Expenses (per child)": 120,
      "Entertainment": 300,
      "Miscellaneous": 350
    },
    "Other": {
      "Housing (Rent)": 1200,
      "Housing (Own)": 1000,
      "Groceries (per adult)": 250,
      "Groceries (per child)": 150,
      "Transportation": 280,
      "Utilities": 220,
      "Health Insurance (per person)": 70,
      "Child Care (per child)": 600,
      "School Expenses (per child)": 100,
      "Entertainment": 250,
      "Miscellaneous": 300
    }
  }
});

interface FamilyExpenseSummaryProps {
  onReset: () => void;
}

const FamilyExpenseSummary = ({ onReset }: FamilyExpenseSummaryProps) => {
  const { currency, convertCurrency } = useExpenses();
  const [familyData, setFamilyData] = useState<any>(null);
  const [expenses, setExpenses] = useState<Record<string, number>>({});
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [balance, setBalance] = useState(0);
  const [expenseBreakdown, setExpenseBreakdown] = useState<{category: string; amount: number; percentage: number}[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("familyExpenseData");
    if (data) {
      const parsedData = JSON.parse(data);
      setFamilyData(parsedData);
      
      // Calculate expenses based on the data
      calculateExpenses(parsedData);
    }
  }, []);

  const calculateExpenses = (data: any) => {
    const { country, region, numAdults, numChildren, monthlyIncome, housingType } = data;
    const income = parseFloat(monthlyIncome);
    setMonthlyIncome(income);

    // Number of family members
    const adults = parseInt(numAdults) || 1;
    const children = parseInt(numChildren) || 0;
    
    // Default to "Other" if the specific country/region doesn't exist
    const countryKey = familyExpenseEstimates[country] ? country : "Other";
    const regionKey = familyExpenseEstimates[countryKey][region] ? region : "Other";
    
    // Get the base expense estimates
    const baseEstimates = familyExpenseEstimates[countryKey][regionKey];
    
    // Calculate expenses based on family composition
    const calculatedExpenses: Record<string, number> = {};
    
    // Housing (based on type)
    const housingKey = `Housing (${housingType === 'own' ? 'Own' : 'Rent'})`;
    calculatedExpenses["Housing"] = baseEstimates[housingKey];
    
    // Groceries (scales with family size)
    calculatedExpenses["Groceries"] = 
      (baseEstimates["Groceries (per adult)"] * adults) + 
      (baseEstimates["Groceries (per child)"] * children);
    
    // Transportation
    calculatedExpenses["Transportation"] = baseEstimates["Transportation"];
    
    // Utilities
    calculatedExpenses["Utilities"] = baseEstimates["Utilities"];
    
    // Health Insurance (scales with family size)
    calculatedExpenses["Health Insurance"] = 
      baseEstimates["Health Insurance (per person)"] * (adults + children);
    
    // Child-specific expenses (only if there are children)
    if (children > 0) {
      calculatedExpenses["Child Care"] = baseEstimates["Child Care (per child)"] * children;
      calculatedExpenses["School Expenses"] = baseEstimates["School Expenses (per child)"] * children;
    }
    
    // Entertainment
    calculatedExpenses["Entertainment"] = baseEstimates["Entertainment"];
    
    // Miscellaneous
    calculatedExpenses["Miscellaneous"] = baseEstimates["Miscellaneous"];
    
    setExpenses(calculatedExpenses);
    
    // Calculate total expenses
    const total = Object.values(calculatedExpenses).reduce((sum, value) => sum + value, 0);
    setTotalExpenses(total);
    
    // Calculate balance
    setBalance(income - total);
    
    // Calculate expense breakdown with percentages
    const breakdown = Object.entries(calculatedExpenses).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / total) * 100
    })).sort((a, b) => b.amount - a.amount);
    
    setExpenseBreakdown(breakdown);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!familyData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        className="mb-6 flex items-center gap-2"
        onClick={onReset}
      >
        <ArrowLeftCircle className="h-4 w-4" />
        Back to Form
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income</CardTitle>
            <CardDescription>Your reported income</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(monthlyIncome)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>Estimated monthly expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Balance</CardTitle>
            <CardDescription>Income minus expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(balance)}
              </p>
              {balance >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-500" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Family Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Location:</span> {familyData.region}, {familyData.country}</p>
              <p><span className="font-medium">Adults:</span> {familyData.numAdults}</p>
              <p><span className="font-medium">Children:</span> {familyData.numChildren}</p>
            </div>
            <div>
              <p><span className="font-medium">Housing Type:</span> {
                familyData.housingType === 'rent' ? 'Renting' : 
                familyData.housingType === 'own' ? 'Homeowner' : 'Other'
              }</p>
              <p><span className="font-medium">Total Family Size:</span> {
                parseInt(familyData.numAdults) + parseInt(familyData.numChildren)
              }</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>
            Estimated monthly expenses for a family in {familyData.region}, {familyData.country}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {expenseBreakdown.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <span className="font-bold">{formatCurrency(item.amount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={item.percentage} className="h-2" />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {Math.round(item.percentage)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {balance < 0 && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md">
                <h3 className="font-bold">Warning: Monthly Deficit</h3>
                <p>Your family expenses exceed your income by {formatCurrency(Math.abs(balance))} per month. Consider reducing expenses or finding additional income sources.</p>
              </div>
            )}
            
            {balance >= 0 && balance < (monthlyIncome * 0.1) && (
              <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
                <h3 className="font-bold">Tight Budget</h3>
                <p>Your family has a small surplus of {formatCurrency(balance)} per month. Consider building an emergency fund with this amount.</p>
              </div>
            )}
            
            {balance >= (monthlyIncome * 0.1) && (
              <div className="p-4 bg-green-50 text-green-700 rounded-md">
                <h3 className="font-bold">Healthy Surplus</h3>
                <p>Your family has a healthy surplus of {formatCurrency(balance)} per month. Consider saving for retirement, education, or other long-term goals.</p>
              </div>
            )}
            
            <div className="p-4 bg-blue-50 text-blue-700 rounded-md">
              <h3 className="font-bold">Family Budget Tips</h3>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Create a shared family budget that everyone can participate in</li>
                <li>Look for family discounts on entertainment and activities</li>
                <li>Consider meal planning to reduce grocery expenses</li>
                <li>Explore tax benefits and credits available for families</li>
                <li>Set up automatic savings for emergency funds and future goals</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyExpenseSummary;
