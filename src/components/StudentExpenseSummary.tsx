
import { useEffect, useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useLocation } from "@/context/LocationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle, TrendingDown, TrendingUp } from "lucide-react";

// Define expense categories and estimates by country, region and study level
const expenseEstimates: Record<string, Record<string, Record<string, Record<string, number>>>> = {
  "United States": {
    "New York": {
      "bachelor": {
        "Rent": 1500,
        "Groceries": 400,
        "Transportation": 120,
        "Insurance": 150,
        "Utilities": 200,
        "Books & Supplies": 200,
        "Entertainment": 200,
        "Miscellaneous": 150
      },
      "master": {
        "Rent": 1700,
        "Groceries": 450,
        "Transportation": 120,
        "Insurance": 150,
        "Utilities": 200,
        "Books & Supplies": 250,
        "Entertainment": 250,
        "Miscellaneous": 200
      },
      "phd": {
        "Rent": 1800,
        "Groceries": 450,
        "Transportation": 120,
        "Insurance": 150,
        "Utilities": 200,
        "Books & Supplies": 200,
        "Entertainment": 200,
        "Miscellaneous": 150
      },
      "highschool": {
        "Rent": 1200,
        "Groceries": 350,
        "Transportation": 100,
        "Insurance": 150,
        "Utilities": 180,
        "Books & Supplies": 150,
        "Entertainment": 150,
        "Miscellaneous": 100
      }
    },
    "California": {
      "bachelor": {
        "Rent": 1400,
        "Groceries": 400,
        "Transportation": 150,
        "Insurance": 150,
        "Utilities": 180,
        "Books & Supplies": 200,
        "Entertainment": 200,
        "Miscellaneous": 150
      },
      "master": {
        "Rent": 1600,
        "Groceries": 450,
        "Transportation": 150,
        "Insurance": 150,
        "Utilities": 180,
        "Books & Supplies": 250,
        "Entertainment": 250,
        "Miscellaneous": 200
      },
      "phd": {
        "Rent": 1700,
        "Groceries": 450,
        "Transportation": 150,
        "Insurance": 150,
        "Utilities": 180,
        "Books & Supplies": 200,
        "Entertainment": 200,
        "Miscellaneous": 150
      },
      "highschool": {
        "Rent": 1100,
        "Groceries": 350,
        "Transportation": 120,
        "Insurance": 150,
        "Utilities": 150,
        "Books & Supplies": 150,
        "Entertainment": 150,
        "Miscellaneous": 100
      }
    },
    "Massachusetts": {
      "bachelor": {
        "Rent": 1300,
        "Groceries": 380,
        "Transportation": 100,
        "Insurance": 150,
        "Utilities": 180,
        "Books & Supplies": 200,
        "Entertainment": 180,
        "Miscellaneous": 150
      },
      "master": {
        "Rent": 1500,
        "Groceries": 430,
        "Transportation": 100,
        "Insurance": 150,
        "Utilities": 180,
        "Books & Supplies": 250,
        "Entertainment": 230,
        "Miscellaneous": 200
      },
      "phd": {
        "Rent": 1600,
        "Groceries": 430,
        "Transportation": 100,
        "Insurance": 150,
        "Utilities": 180,
        "Books & Supplies": 200,
        "Entertainment": 180,
        "Miscellaneous": 150
      },
      "highschool": {
        "Rent": 1000,
        "Groceries": 330,
        "Transportation": 80,
        "Insurance": 150,
        "Utilities": 150,
        "Books & Supplies": 150,
        "Entertainment": 130,
        "Miscellaneous": 100
      }
    },
    "Other": {
      "bachelor": {
        "Rent": 1000,
        "Groceries": 350,
        "Transportation": 100,
        "Insurance": 150,
        "Utilities": 150,
        "Books & Supplies": 200,
        "Entertainment": 150,
        "Miscellaneous": 150
      },
      "master": {
        "Rent": 1200,
        "Groceries": 400,
        "Transportation": 100,
        "Insurance": 150,
        "Utilities": 150,
        "Books & Supplies": 250,
        "Entertainment": 200,
        "Miscellaneous": 200
      },
      "phd": {
        "Rent": 1300,
        "Groceries": 400,
        "Transportation": 100,
        "Insurance": 150,
        "Utilities": 150,
        "Books & Supplies": 200,
        "Entertainment": 150,
        "Miscellaneous": 150
      },
      "highschool": {
        "Rent": 800,
        "Groceries": 300,
        "Transportation": 80,
        "Insurance": 150,
        "Utilities": 120,
        "Books & Supplies": 150,
        "Entertainment": 100,
        "Miscellaneous": 100
      }
    }
  },
  // Add more countries with similar structure
  "United Kingdom": {
    "London": {
      "bachelor": {
        "Rent": 1200,
        "Groceries": 300,
        "Transportation": 100,
        "Insurance": 100,
        "Utilities": 150,
        "Books & Supplies": 150,
        "Entertainment": 180,
        "Miscellaneous": 120
      },
      "master": {
        "Rent": 1300,
        "Groceries": 350,
        "Transportation": 100,
        "Insurance": 100,
        "Utilities": 150,
        "Books & Supplies": 200,
        "Entertainment": 200,
        "Miscellaneous": 150
      },
      "phd": {
        "Rent": 1400,
        "Groceries": 350,
        "Transportation": 100,
        "Insurance": 100,
        "Utilities": 150,
        "Books & Supplies": 150,
        "Entertainment": 180,
        "Miscellaneous": 120
      },
      "highschool": {
        "Rent": 900,
        "Groceries": 250,
        "Transportation": 80,
        "Insurance": 100,
        "Utilities": 120,
        "Books & Supplies": 120,
        "Entertainment": 120,
        "Miscellaneous": 100
      }
    },
    "Other": {
      "bachelor": {
        "Rent": 700,
        "Groceries": 250,
        "Transportation": 80,
        "Insurance": 100,
        "Utilities": 120,
        "Books & Supplies": 150,
        "Entertainment": 150,
        "Miscellaneous": 100
      },
      "master": {
        "Rent": 800,
        "Groceries": 300,
        "Transportation": 80,
        "Insurance": 100,
        "Utilities": 120,
        "Books & Supplies": 200,
        "Entertainment": 180,
        "Miscellaneous": 120
      },
      "phd": {
        "Rent": 900,
        "Groceries": 300,
        "Transportation": 80,
        "Insurance": 100,
        "Utilities": 120,
        "Books & Supplies": 150,
        "Entertainment": 150,
        "Miscellaneous": 100
      },
      "highschool": {
        "Rent": 600,
        "Groceries": 200,
        "Transportation": 60,
        "Insurance": 100,
        "Utilities": 100,
        "Books & Supplies": 120,
        "Entertainment": 100,
        "Miscellaneous": 80
      }
    }
  },
  // Default values for other countries
  "Australia": {
    "Other": {
      "bachelor": {
        "Rent": 900,
        "Groceries": 300,
        "Transportation": 90,
        "Insurance": 120,
        "Utilities": 150,
        "Books & Supplies": 150,
        "Entertainment": 150,
        "Miscellaneous": 120
      },
      "master": {
        "Rent": 1000,
        "Groceries": 350,
        "Transportation": 90,
        "Insurance": 120,
        "Utilities": 150,
        "Books & Supplies": 200,
        "Entertainment": 180,
        "Miscellaneous": 150
      },
      "phd": {
        "Rent": 1100,
        "Groceries": 350,
        "Transportation": 90,
        "Insurance": 120,
        "Utilities": 150,
        "Books & Supplies": 150,
        "Entertainment": 150,
        "Miscellaneous": 120
      },
      "highschool": {
        "Rent": 700,
        "Groceries": 250,
        "Transportation": 70,
        "Insurance": 120,
        "Utilities": 120,
        "Books & Supplies": 120,
        "Entertainment": 100,
        "Miscellaneous": 100
      }
    }
  },
  "Canada": {
    "Other": {
      "bachelor": {
        "Rent": 800,
        "Groceries": 300,
        "Transportation": 90,
        "Insurance": 100,
        "Utilities": 130,
        "Books & Supplies": 150,
        "Entertainment": 150,
        "Miscellaneous": 120
      },
      "master": {
        "Rent": 900,
        "Groceries": 350,
        "Transportation": 90,
        "Insurance": 100,
        "Utilities": 130,
        "Books & Supplies": 200,
        "Entertainment": 180,
        "Miscellaneous": 150
      },
      "phd": {
        "Rent": 1000,
        "Groceries": 350,
        "Transportation": 90,
        "Insurance": 100,
        "Utilities": 130,
        "Books & Supplies": 150,
        "Entertainment": 150,
        "Miscellaneous": 120
      },
      "highschool": {
        "Rent": 600,
        "Groceries": 250,
        "Transportation": 70,
        "Insurance": 100,
        "Utilities": 100,
        "Books & Supplies": 120,
        "Entertainment": 100,
        "Miscellaneous": 100
      }
    }
  }
};

interface StudentExpenseSummaryProps {
  onReset: () => void;
}

const StudentExpenseSummary = ({ onReset }: StudentExpenseSummaryProps) => {
  const { currency, convertCurrency } = useExpenses();
  const { popularLocations } = useLocation();
  const [studentData, setStudentData] = useState<any>(null);
  const [expenses, setExpenses] = useState<Record<string, number>>({});
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("studentExpenseData");
    if (data) {
      const parsedData = JSON.parse(data);
      setStudentData(parsedData);
      
      // Calculate expenses based on the data
      calculateExpenses(parsedData);
    }
  }, []);

  const calculateExpenses = (data: any) => {
    const { country, region, studyLevel, monthlyIncome } = data;
    const income = parseFloat(monthlyIncome);
    setMonthlyIncome(income);

    // Default to "Other" if the specific region doesn't exist
    const regionKey = expenseEstimates[country][region] ? region : "Other";
    
    // Get the expense estimates for the given parameters
    const estimatedExpenses = expenseEstimates[country][regionKey][studyLevel] || {};
    
    setExpenses(estimatedExpenses);
    
    // Calculate total expenses
    const total = Object.values(estimatedExpenses).reduce((sum, value) => sum + value, 0);
    setTotalExpenses(total);
    
    // Calculate balance
    setBalance(income - total);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!studentData) {
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
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>
            Estimated monthly expenses for a {studentData.studyLevel} student in {studentData.region}, {studentData.country}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(expenses).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="font-medium">{category}</span>
                <span className="font-bold">{formatCurrency(amount)}</span>
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
                <p>Your expenses exceed your income by {formatCurrency(Math.abs(balance))} per month. Consider reducing expenses or finding additional income sources.</p>
              </div>
            )}
            
            {balance >= 0 && (
              <div className="p-4 bg-green-50 text-green-700 rounded-md">
                <h3 className="font-bold">Surplus Budget</h3>
                <p>You have a positive balance of {formatCurrency(balance)} per month. Consider saving or investing this surplus.</p>
              </div>
            )}
            
            <div className="p-4 bg-blue-50 text-blue-700 rounded-md">
              <h3 className="font-bold">Money-Saving Tips</h3>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Look for student discounts on transportation and entertainment</li>
                <li>Consider sharing accommodations to reduce rent</li>
                <li>Buy used textbooks or use library resources</li>
                <li>Cook at home instead of eating out</li>
                <li>Use student banking services to avoid fees</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentExpenseSummary;
