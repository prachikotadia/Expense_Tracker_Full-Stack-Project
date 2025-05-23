
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useExpenses } from "./ExpenseContext";

interface PredictedExpense {
  category: string;
  amount: number;
  month: string;
  confidence: number; // 0-1
}

interface ForecastContextType {
  predictedExpenses: PredictedExpense[];
  savingsTips: string[];
  generatePredictions: () => void;
  generateSavingsTips: () => void;
}

const ForecastContext = createContext<ForecastContextType | undefined>(undefined);

export const useForecast = (): ForecastContextType => {
  const context = useContext(ForecastContext);
  if (context === undefined) {
    throw new Error("useForecast must be used within a ForecastProvider");
  }
  return context;
};

interface ForecastProviderProps {
  children: ReactNode;
}

export const ForecastProvider = ({ children }: ForecastProviderProps) => {
  const { expenses, getExpensesByCategory } = useExpenses();
  const [predictedExpenses, setPredictedExpenses] = useState<PredictedExpense[]>([]);
  const [savingsTips, setSavingsTips] = useState<string[]>([]);

  // Generate predictions based on past spending
  const generatePredictions = () => {
    const categories = getExpensesByCategory();
    const currentDate = new Date();
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const nextMonth = nextMonthDate.toLocaleString('default', { month: 'long' });
    
    const predictions: PredictedExpense[] = [];
    
    // Simple prediction algorithm - just add some variance to previous month
    Object.entries(categories).forEach(([category, amount]) => {
      if (amount > 0) {
        // Add some random variance (-10% to +15%)
        const variance = 0.9 + (Math.random() * 0.25);
        const predictedAmount = amount * variance;
        
        predictions.push({
          category,
          amount: parseFloat(predictedAmount.toFixed(2)),
          month: nextMonth,
          confidence: 0.7 + (Math.random() * 0.2) // Random confidence between 0.7-0.9
        });
      }
    });
    
    setPredictedExpenses(predictions);
  };

  // Generate personalized savings tips based on spending patterns
  const generateSavingsTips = () => {
    const categories = getExpensesByCategory();
    const tips: string[] = [];
    
    // Find the highest spending category
    const entries = Object.entries(categories);
    if (entries.length > 0) {
      entries.sort((a, b) => b[1] - a[1]);
      const [highestCategory, highestAmount] = entries[0];
      
      if (highestCategory === "Food") {
        tips.push("Try meal prepping on weekends to reduce food expenses.");
        tips.push("Consider using grocery cashback apps for additional savings.");
      } else if (highestCategory === "Entertainment") {
        tips.push("Look for free community events instead of paid entertainment.");
        tips.push("Check if your subscriptions have annual payment options for discounts.");
      } else if (highestCategory === "Transportation") {
        tips.push("Consider carpooling or public transit to save on transportation costs.");
        tips.push("Batch your errands to save on fuel costs.");
      } else if (highestCategory === "Shopping") {
        tips.push("Try a 30-day waiting period for non-essential purchases.");
        tips.push("Consider buying second-hand for certain items.");
      } else {
        tips.push(`Consider ways to reduce your ${highestCategory} expenses, which is your highest category.`);
      }
    }
    
    // General tips
    tips.push("Set up automatic transfers to savings on payday.");
    tips.push("Review your subscriptions and cancel those you don't use frequently.");
    tips.push("Try the 50/30/20 budget: 50% needs, 30% wants, 20% savings.");
    
    // Shuffle array to prevent the same tips always appearing first
    const shuffledTips = [...tips].sort(() => 0.5 - Math.random()).slice(0, 5);
    setSavingsTips(shuffledTips);
  };

  // Initialize with sample data
  useEffect(() => {
    if (expenses.length > 0 && predictedExpenses.length === 0) {
      generatePredictions();
      generateSavingsTips();
    }
  }, [expenses]);

  return (
    <ForecastContext.Provider
      value={{
        predictedExpenses,
        savingsTips,
        generatePredictions,
        generateSavingsTips
      }}
    >
      {children}
    </ForecastContext.Provider>
  );
};
