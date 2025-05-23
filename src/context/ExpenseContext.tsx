
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Define types
export type ExpenseCategory = 
  | "Food" 
  | "Transportation" 
  | "Housing" 
  | "Utilities" 
  | "Entertainment" 
  | "Healthcare"
  | "Education" 
  | "Shopping" 
  | "Travel" 
  | "Income" 
  | "Other"
  | "Groceries"
  | "Restaurants"
  | "Subscriptions"
  | "Gifts"
  | string; // Allow custom categories

export type RecurringFrequency = "Daily" | "Weekly" | "Monthly" | "Yearly";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  category: ExpenseCategory;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
  tags?: string[];
  notes?: string;
  attachments?: string[];
  isIncome?: boolean;
  paymentMethod?: string;
  location?: string;
  labels?: string[];
}

export interface DailyExpense {
  date: string;
  amount: number;
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthdate: string;
  profileImage?: string;
}

export interface ThemeSettings {
  background: "solid" | "gradient";
  accentColor: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  removeExpense: (id: string) => void;
  deleteExpense: (id: string) => void; // Alias for removeExpense
  updateExpense: (id: string, updatedExpense: Partial<Expense>) => void;
  categories: ExpenseCategory[];
  addCategory: (category: string) => void;
  getTotalExpenses: () => number;
  getTotalIncome: () => number;
  getExpensesByCategory: () => Record<string, number>;
  getExpensesByDay: (days?: number) => DailyExpense[];
  getRecentExpenses: (limit?: number) => Expense[];
  currency: string;
  setCurrency: (currency: string) => void;
  availableCurrencies: string[];
  language: string;
  setLanguage: (language: string) => void;
  profileData: ProfileData;
  updateProfileData: (data: Partial<ProfileData>) => void;
  themeSettings: ThemeSettings;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  notifications: {
    budgetAlerts: boolean;
    paymentReminders: boolean;
    tipsSuggestions: boolean;
    emailNotifications: boolean;
  };
  toggleNotification: (type: keyof ExpenseContextType['notifications']) => void;
  getMonthlyBudget: () => number;
  setMonthlyBudget: (amount: number) => void;
  setTravelMode: (active: boolean, country?: string) => void;
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

interface ExpenseProviderProps {
  children: ReactNode;
}

// Sample data
const sampleExpenses: Expense[] = [
  {
    id: "1",
    description: "Grocery Shopping",
    amount: 85.75,
    currency: "USD",
    date: "2023-06-15",
    category: "Groceries",
    isIncome: false
  },
  {
    id: "2",
    description: "Monthly Rent",
    amount: 1200,
    currency: "USD",
    date: "2023-06-01",
    category: "Housing",
    isRecurring: true,
    recurringFrequency: "Monthly",
    isIncome: false
  },
  {
    id: "3",
    description: "Gas Bill",
    amount: 45.20,
    currency: "USD",
    date: "2023-06-10",
    category: "Utilities",
    isIncome: false
  },
  {
    id: "4",
    description: "Salary",
    amount: 2800,
    currency: "USD",
    date: "2023-06-05",
    category: "Income",
    isRecurring: true,
    recurringFrequency: "Monthly",
    isIncome: true
  },
  {
    id: "5",
    description: "Movie Night",
    amount: 35.50,
    currency: "USD",
    date: "2023-06-18",
    category: "Entertainment",
    isIncome: false
  },
  {
    id: "6",
    description: "Uber Ride",
    amount: 12.75,
    currency: "USD",
    date: "2023-06-17",
    category: "Transportation",
    isIncome: false
  },
  {
    id: "7",
    description: "Phone Bill",
    amount: 65.00,
    currency: "USD",
    date: "2023-06-12",
    category: "Utilities",
    isRecurring: true,
    recurringFrequency: "Monthly",
    isIncome: false
  },
];

// Initial categories
const initialCategories: ExpenseCategory[] = [
  "Food",
  "Transportation",
  "Housing",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Education",
  "Shopping",
  "Travel",
  "Income",
  "Other",
  "Groceries",
  "Restaurants",
  "Subscriptions",
  "Gifts"
];

const defaultProfileData: ProfileData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8901",
  birthdate: "1990-01-01"
};

export const ExpenseProvider = ({ children }: ExpenseProviderProps) => {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [categories, setCategories] = useState<ExpenseCategory[]>(initialCategories);
  const [currency, setCurrency] = useState<string>("USD");
  const [language, setLanguage] = useState<string>("en");
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    background: "solid",
    accentColor: "#8B5CF6"
  });
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    paymentReminders: true,
    tipsSuggestions: false,
    emailNotifications: false
  });
  const [monthlyBudget, setMonthlyBudgetState] = useState<number>(3000); // Default budget
  const [isTravelMode, setIsTravelMode] = useState<boolean>(false);
  const [travelCountry, setTravelCountry] = useState<string>("");

  // Load data from localStorage if available
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    const savedCategories = localStorage.getItem("categories");
    const savedCurrency = localStorage.getItem("currency");
    const savedLanguage = localStorage.getItem("language");
    const savedProfileData = localStorage.getItem("profileData");
    const savedThemeSettings = localStorage.getItem("themeSettings");
    const savedNotifications = localStorage.getItem("notifications");
    const savedBudget = localStorage.getItem("monthlyBudget");

    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedProfileData) setProfileData(JSON.parse(savedProfileData));
    if (savedThemeSettings) setThemeSettings(JSON.parse(savedThemeSettings));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedBudget) setMonthlyBudgetState(JSON.parse(savedBudget));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("currency", currency);
    localStorage.setItem("language", language);
    localStorage.setItem("profileData", JSON.stringify(profileData));
    localStorage.setItem("themeSettings", JSON.stringify(themeSettings));
    localStorage.setItem("notifications", JSON.stringify(notifications));
    localStorage.setItem("monthlyBudget", JSON.stringify(monthlyBudget));
  }, [expenses, categories, currency, language, profileData, themeSettings, notifications, monthlyBudget]);

  // Apply theme settings effect
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply accent color
    if (themeSettings.accentColor) {
      root.style.setProperty('--primary-color', themeSettings.accentColor);
    }
    
    // Apply background style
    if (themeSettings.background === "gradient") {
      root.classList.add("use-gradient");
    } else {
      root.classList.remove("use-gradient");
    }
  }, [themeSettings]);

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = { 
      ...expense, 
      id: uuidv4(),
      isIncome: expense.category === "Income" || !!expense.isIncome
    };
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
  };

  const removeExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };

  // Alias for removeExpense for compatibility
  const deleteExpense = (id: string) => {
    removeExpense(id);
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    );
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prevCategories => [...prevCategories, category]);
    }
  };

  const getTotalExpenses = () => {
    return expenses
      .filter(expense => expense.category !== "Income" && !expense.isIncome)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalIncome = () => {
    return expenses
      .filter(expense => expense.category === "Income" || expense.isIncome)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByCategory = () => {
    return expenses.reduce((acc: Record<string, number>, expense) => {
      const category = expense.category;
      if (category === "Income" || expense.isIncome) return acc;

      if (!acc[category]) {
        acc[category] = expense.amount;
      } else {
        acc[category] += expense.amount;
      }
      return acc;
    }, {});
  };

  const getExpensesByDay = (days: number = 7): DailyExpense[] => {
    const today = new Date();
    const result: DailyExpense[] = [];

    // Create array of last 'days' days
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Find expenses for this day
      const dayExpenses = expenses.filter(
        expense => expense.date === dateString && expense.category !== "Income" && !expense.isIncome
      );
      
      // Calculate total amount for the day
      const amount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      result.push({ date: dateString, amount });
    }

    // Sort by date ascending
    return result.sort((a, b) => a.date.localeCompare(b.date));
  };

  const getRecentExpenses = (limit: number = 5): Expense[] => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const updateProfileData = (data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  const updateThemeSettings = (settings: Partial<ThemeSettings>) => {
    setThemeSettings(prev => ({ ...prev, ...settings }));
  };

  const toggleNotification = (type: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const getMonthlyBudget = () => {
    return monthlyBudget;
  };

  const setMonthlyBudget = (amount: number) => {
    setMonthlyBudgetState(amount);
  };

  const setTravelMode = (active: boolean, country?: string) => {
    setIsTravelMode(active);
    if (country) {
      setTravelCountry(country);
    }
  };

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
    // Simple conversion - in a real app, this would use exchange rates API
    const rates: Record<string, number> = {
      'USD': 1,
      'EUR': 0.92,
      'GBP': 0.78,
      'JPY': 150.36,
      'CAD': 1.35,
      'AUD': 1.48,
      'INR': 83.12,
      'CNY': 7.23,
      'MXN': 16.74,
      'BRL': 5.03
    };

    // Convert from source currency to USD first (if not USD)
    let valueInUSD = amount;
    if (fromCurrency !== 'USD') {
      valueInUSD = amount / (rates[fromCurrency] || 1);
    }

    // Then convert from USD to target currency
    return valueInUSD * (rates[toCurrency] || 1);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        removeExpense,
        deleteExpense,
        updateExpense,
        categories,
        addCategory,
        getTotalExpenses,
        getTotalIncome,
        getExpensesByCategory,
        getExpensesByDay,
        getRecentExpenses,
        currency,
        setCurrency,
        availableCurrencies: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR", "CNY", "MXN", "BRL"],
        language,
        setLanguage,
        profileData,
        updateProfileData,
        themeSettings,
        updateThemeSettings,
        notifications,
        toggleNotification,
        getMonthlyBudget,
        setMonthlyBudget,
        setTravelMode,
        convertCurrency
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};
