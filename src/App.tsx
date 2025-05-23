
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Budget from "./pages/Budget";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";
import BankAccounts from "./pages/BankAccounts";
import CostEstimator from "./pages/CostEstimator";
import StudentExpenseTracker from "./pages/StudentExpenseTracker";
import FamilyExpenseTracker from "./pages/FamilyExpenseTracker";
import ThemeProvider from "./context/ThemeContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import { LocationProvider } from "./context/LocationContext";
import { ForecastProvider } from "./context/ForecastContext";
import { GoalsProvider } from "./context/GoalsContext";
import { BankProvider } from "./context/BankContext";
import Categories from "./pages/Categories";
import Calendar from "./pages/Calendar";
import Upcoming from "./pages/Upcoming";
import History from "./pages/History";
import AIHelper from "./components/AIHelper";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <AuthProvider>
          <ExpenseProvider>
            <ForecastProvider>
              <LocationProvider>
                <GoalsProvider>
                  <BankProvider>
                    <BrowserRouter>
                      <Routes>
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                        <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
                        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                        <Route path="/bank-accounts" element={<ProtectedRoute><BankAccounts /></ProtectedRoute>} />
                        <Route path="/cost-estimator" element={<ProtectedRoute><CostEstimator /></ProtectedRoute>} />
                        <Route path="/student-expenses" element={<ProtectedRoute><StudentExpenseTracker /></ProtectedRoute>} />
                        <Route path="/family-expenses" element={<ProtectedRoute><FamilyExpenseTracker /></ProtectedRoute>} />
                        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                        <Route path="/upcoming" element={<ProtectedRoute><Upcoming /></ProtectedRoute>} />
                        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <AIHelper />
                    </BrowserRouter>
                  </BankProvider>
                </GoalsProvider>
              </LocationProvider>
            </ForecastProvider>
          </ExpenseProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
