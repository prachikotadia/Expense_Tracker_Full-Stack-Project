
import { useState } from "react";
import { useGoals, Goal } from "@/context/GoalsContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useExpenses } from "@/context/ExpenseContext";
import TravelModeAlert from "@/components/TravelModeAlert";
import { useLocation } from "@/context/LocationContext";
import { useToast } from "@/hooks/use-toast";
import {
  Target,
  Plus,
  Trash2,
  EditIcon,
  Trophy,
  Calendar,
  Coins,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  BadgeCheck,
  Plus as PlusIcon,
  ArrowRight,
  StarIcon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface GoalItemProps {
  goal: Goal;
  onDelete: (id: string) => void;
  onEdit: (goal: Goal) => void;
}

const GoalItem = ({ goal, onDelete, onEdit }: GoalItemProps) => {
  const { calculateGoalProgress } = useGoals();
  const { currency } = useExpenses();
  
  const progress = calculateGoalProgress(goal);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getStatusColor = () => {
    if (goal.status === "completed") return "text-green-500";
    if (goal.status === "failed") return "text-red-500";
    if (new Date(goal.deadline) < new Date()) return "text-amber-500";
    return "text-blue-500";
  };
  
  const getStatusText = () => {
    if (goal.status === "completed") return "Completed";
    if (goal.status === "failed") return "Failed";
    if (new Date(goal.deadline) < new Date()) return "Overdue";
    return "In Progress";
  };
  
  const getStatusIcon = () => {
    if (goal.status === "completed") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (goal.status === "failed") return <XCircle className="h-4 w-4 text-red-500" />;
    if (new Date(goal.deadline) < new Date()) return <Clock className="h-4 w-4 text-amber-500" />;
    return <TrendingUp className="h-4 w-4 text-blue-500" />;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center text-lg">
              <div className="bg-primary/10 p-2 rounded-full mr-2">
                <Target className="h-5 w-5" />
              </div>
              {goal.title}
            </CardTitle>
            <CardDescription>{goal.description}</CardDescription>
          </div>
          <div className="flex items-center">
            {getStatusIcon()}
            <span className={`text-sm ml-1 ${getStatusColor()}`}>{getStatusText()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Coins className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Target:</span>
            <span className="ml-1 font-medium">{formatCurrency(goal.targetAmount)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm">{formatDate(goal.deadline)}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-right text-xs text-muted-foreground">
            {progress}% complete
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex justify-end gap-2 w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(goal.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(goal)}
          >
            <EditIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const GoalForm = ({ 
  onSave, 
  onCancel,
  editingGoal = null
}: { 
  onSave: (goalData: any) => void;
  onCancel: () => void;
  editingGoal?: Goal | null;
}) => {
  const { categories } = useExpenses();
  const { currency } = useExpenses();
  
  const [title, setTitle] = useState(editingGoal?.title || "");
  const [description, setDescription] = useState(editingGoal?.description || "");
  const [targetAmount, setTargetAmount] = useState(
    editingGoal ? editingGoal.targetAmount.toString() : ""
  );
  const [currentAmount, setCurrentAmount] = useState(
    editingGoal ? editingGoal.currentAmount.toString() : "0"
  );
  const [category, setCategory] = useState<string>(editingGoal?.category || "");
  const [deadline, setDeadline] = useState(
    editingGoal?.deadline 
      ? new Date(editingGoal.deadline).toISOString().slice(0, 10)
      : ""
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      title,
      description,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount || "0"),
      deadline,
      category: category || undefined
    };
    
    onSave(editingGoal ? { ...goalData, id: editingGoal.id } : goalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="goal-title">Goal Title</Label>
        <Input
          id="goal-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. New Car, Emergency Fund"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="goal-description">Description (Optional)</Label>
        <Input
          id="goal-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your financial goal"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="target-amount">Target Amount ({currency})</Label>
          <Input
            id="target-amount"
            type="number"
            step="0.01"
            min="0"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="current-amount">Current Amount ({currency})</Label>
          <Input
            id="current-amount"
            type="number"
            step="0.01"
            min="0"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="goal-category">Category (Optional)</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="goal-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No category</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="goal-deadline">Target Date</Label>
          <Input
            id="goal-deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {editingGoal ? "Update Goal" : "Create Goal"}
        </Button>
      </div>
    </form>
  );
};

const BadgeCard = ({ badge }) => {
  return (
    <Card className={badge.earnedAt ? "" : "opacity-60"}>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className={`rounded-full p-3 mb-3 ${badge.earnedAt ? "bg-primary/20" : "bg-muted"}`}>
          <div className="h-10 w-10 flex items-center justify-center">
            {badge.earnedAt ? (
              <BadgeCheck className="h-10 w-10 text-primary" />
            ) : (
              <Trophy className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
        </div>
        <h3 className="font-medium mb-1">{badge.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
        {badge.earnedAt ? (
          <Badge variant="outline" className="bg-primary/10 text-primary">
            <StarIcon className="h-3 w-3 mr-1" />
            Earned on {new Date(badge.earnedAt).toLocaleDateString()}
          </Badge>
        ) : (
          <Progress value={badge.progress || 0} className="h-1.5 w-3/4" />
        )}
      </CardContent>
    </Card>
  );
};

const Goals = () => {
  const { 
    goals, 
    badges,
    addGoal, 
    updateGoal, 
    deleteGoal,
    calculateGoalProgress
  } = useGoals();
  const { currentLocation } = useLocation();
  const { toast } = useToast();
  
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  
  const handleAddGoal = (goalData: any) => {
    addGoal(goalData);
    setShowGoalForm(false);
    
    toast({
      title: "Goal created",
      description: `"${goalData.title}" has been added to your financial goals`
    });
  };
  
  const handleUpdateGoal = (goalData: any) => {
    updateGoal(goalData.id, goalData);
    setEditingGoal(null);
    
    toast({
      title: "Goal updated",
      description: `"${goalData.title}" has been updated successfully`
    });
  };
  
  const handleDeleteGoal = (id: string) => {
    deleteGoal(id);
  };
  
  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
  };
  
  const activeGoals = goals.filter(goal => goal.status === "in_progress");
  const completedGoals = goals.filter(goal => goal.status === "completed");
  const failedGoals = goals.filter(goal => goal.status === "failed");
  
  const calculateOverallProgress = () => {
    if (activeGoals.length === 0) return 0;
    
    const totalProgress = activeGoals.reduce((sum, goal) => {
      return sum + calculateGoalProgress(goal);
    }, 0);
    
    return totalProgress / activeGoals.length;
  };
  
  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      {currentLocation && <TravelModeAlert location={currentLocation} />}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Financial Goals</h1>
          <Button onClick={() => {
            setEditingGoal(null);
            setShowGoalForm(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
        
        {showGoalForm && !editingGoal && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create a New Goal</CardTitle>
              <CardDescription>
                Set a financial goal to track your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoalForm 
                onSave={handleAddGoal} 
                onCancel={() => setShowGoalForm(false)} 
              />
            </CardContent>
          </Card>
        )}
        
        {editingGoal && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Edit Goal</CardTitle>
              <CardDescription>
                Update your financial goal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoalForm 
                onSave={handleUpdateGoal} 
                onCancel={() => setEditingGoal(null)} 
                editingGoal={editingGoal}
              />
            </CardContent>
          </Card>
        )}
        
        {activeGoals.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>
                Your progress across all active goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <Progress value={overallProgress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{activeGoals.length} Active Goals</span>
                  <span>{Math.round(overallProgress)}% Complete</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">
              Active Goals
              {activeGoals.length > 0 && (
                <Badge variant="outline" className="ml-2">{activeGoals.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              {completedGoals.length > 0 && (
                <Badge variant="outline" className="ml-2">{completedGoals.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed
              {failedGoals.length > 0 && (
                <Badge variant="outline" className="ml-2">{failedGoals.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="achievements">
              Achievements
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeGoals.length === 0 ? (
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-muted rounded-full p-4 mb-4">
                    <Target className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No active goals</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first financial goal to start tracking your progress
                  </p>
                  <Button onClick={() => {
                    setEditingGoal(null);
                    setShowGoalForm(true);
                  }}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create a Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeGoals.map(goal => (
                  <GoalItem 
                    key={goal.id} 
                    goal={goal} 
                    onDelete={handleDeleteGoal}
                    onEdit={handleEditGoal}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedGoals.length === 0 ? (
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-muted rounded-full p-4 mb-4">
                    <CheckCircle className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No completed goals yet</h3>
                  <p className="text-muted-foreground">
                    When you achieve your financial goals, they'll appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedGoals.map(goal => (
                  <GoalItem 
                    key={goal.id} 
                    goal={goal} 
                    onDelete={handleDeleteGoal}
                    onEdit={handleEditGoal}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="failed">
            {failedGoals.length === 0 ? (
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-muted rounded-full p-4 mb-4">
                    <XCircle className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No failed goals</h3>
                  <p className="text-muted-foreground">
                    Goals that miss their deadlines will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {failedGoals.map(goal => (
                  <GoalItem 
                    key={goal.id} 
                    goal={goal} 
                    onDelete={handleDeleteGoal}
                    onEdit={handleEditGoal}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="achievements">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>
                    Badges and awards you've earned on your financial journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {badges.map(badge => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Goals;
