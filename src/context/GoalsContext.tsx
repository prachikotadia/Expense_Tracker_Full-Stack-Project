
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export type GoalStatus = "in_progress" | "completed" | "failed";

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date string
  status: GoalStatus;
  category?: string;
  description?: string;
  createdAt: string; // ISO date string
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string; // ISO date string
  progress?: number; // 0-100
}

interface GoalsContextType {
  goals: Goal[];
  badges: Badge[];
  addGoal: (goal: Omit<Goal, "id" | "status" | "createdAt">) => void;
  updateGoal: (id: string, goalData: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  calculateGoalProgress: (goal: Goal) => number;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const useGoals = (): GoalsContextType => {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error("useGoals must be used within a GoalsProvider");
  }
  return context;
};

interface GoalsProviderProps {
  children: ReactNode;
}

export const GoalsProvider = ({ children }: GoalsProviderProps) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem("goals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  
  const [badges, setBadges] = useState<Badge[]>(() => {
    const savedBadges = localStorage.getItem("badges");
    return savedBadges ? JSON.parse(savedBadges) : defaultBadges;
  });
  
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("badges", JSON.stringify(badges));
  }, [badges]);

  const addGoal = (goalData: Omit<Goal, "id" | "status" | "createdAt">) => {
    const newGoal: Goal = {
      ...goalData,
      id: crypto.randomUUID(),
      status: "in_progress",
      createdAt: new Date().toISOString(),
    };

    setGoals(prev => [...prev, newGoal]);
    
    toast({
      title: "Goal added",
      description: `${goalData.title} has been added to your goals.`,
    });
  };

  const updateGoal = (id: string, goalData: Partial<Goal>) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === id ? { ...goal, ...goalData } : goal
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    
    toast({
      title: "Goal deleted",
      description: "The goal has been removed.",
    });
  };

  const calculateGoalProgress = (goal: Goal): number => {
    return Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
  };

  return (
    <GoalsContext.Provider
      value={{
        goals,
        badges,
        addGoal,
        updateGoal,
        deleteGoal,
        calculateGoalProgress
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

// Default badges
const defaultBadges: Badge[] = [
  {
    id: "1",
    name: "Budget Master",
    description: "Stay under budget for 3 consecutive months",
    icon: "trophy",
    progress: 0
  },
  {
    id: "2",
    name: "Saver Extraordinaire",
    description: "Save 20% of income for 6 months",
    icon: "piggy-bank",
    progress: 0
  },
  {
    id: "3",
    name: "Debt Crusher",
    description: "Pay off a debt completely",
    icon: "trending-down",
    progress: 0
  },
  {
    id: "4",
    name: "Goal Achiever",
    description: "Complete your first savings goal",
    icon: "target",
    progress: 0
  },
  {
    id: "5",
    name: "Global Tracker",
    description: "Track expenses in 3 different currencies",
    icon: "globe",
    progress: 0
  }
];
