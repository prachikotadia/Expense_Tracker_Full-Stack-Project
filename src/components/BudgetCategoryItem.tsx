
import { Progress } from "@/components/ui/progress";

interface BudgetCategoryItemProps {
  category: string;
  amount: number;
  percentage: number;
  currency: string;
  color?: string; // Added color prop as optional
}

const BudgetCategoryItem = ({ category, amount, percentage, currency, color }: BudgetCategoryItemProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      Housing: "bg-blue-500",
      Food: "bg-green-500",
      Transportation: "bg-purple-500",
      Entertainment: "bg-pink-500",
      Utilities: "bg-yellow-500",
      Healthcare: "bg-red-500",
      Education: "bg-indigo-500",
      Shopping: "bg-orange-500",
      Travel: "bg-teal-500",
      Income: "bg-emerald-500",
      Debt: "bg-rose-500",
      Savings: "bg-cyan-500",
      Investments: "bg-violet-500",
      Personal: "bg-slate-500"
    };
    
    return categoryColors[category] || "bg-gray-500";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="font-medium">{category}</div>
        <div className="text-sm">{formatCurrency(amount)}</div>
      </div>
      <div className="relative pt-1">
        <Progress
          value={percentage}
          className={`h-2 ${color ? "" : getCategoryColor(category)}`}
          style={{ 
            backgroundColor: "var(--muted)",
            ...(color && { backgroundColor: color }) 
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{percentage.toFixed(1)}% of total</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCategoryItem;
