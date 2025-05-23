
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExpenses } from "@/context/ExpenseContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface TransactionFiltersProps {
  onClose: () => void;
}

const TransactionFilters = ({ onClose }: TransactionFiltersProps) => {
  const { categories } = useExpenses();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePaymentMethodToggle = (method: string) => {
    setPaymentMethods(prev => 
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const handleApply = () => {
    // In a real app, this would apply filters to a parent component
    // For now, we just close the filter panel
    onClose();
  };

  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setAmountMin("");
    setAmountMax("");
    setSelectedCategories([]);
    setPaymentMethods([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date-from">Date From</Label>
          <Input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date-to">Date To</Label>
          <Input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount-min">Minimum Amount</Label>
          <Input
            id="amount-min"
            type="number"
            placeholder="0.00"
            value={amountMin}
            onChange={(e) => setAmountMin(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount-max">Maximum Amount</Label>
          <Input
            id="amount-max"
            type="number"
            placeholder="No limit"
            value={amountMax}
            onChange={(e) => setAmountMax(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div>
        <Label className="block mb-2">Categories</Label>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm font-normal truncate"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="block mb-2">Payment Methods</Label>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
          {["Credit Card", "Debit Card", "Cash", "Bank Transfer", "Mobile Payment"].map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={`method-${method}`}
                checked={paymentMethods.includes(method)}
                onCheckedChange={() => handlePaymentMethodToggle(method)}
              />
              <Label
                htmlFor={`method-${method}`}
                className="text-sm font-normal truncate"
              >
                {method}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-end">
        <Button variant="outline" onClick={handleReset} size="sm">
          Reset
        </Button>
        <Button variant="secondary" onClick={onClose} size="sm">
          Cancel
        </Button>
        <Button onClick={handleApply} size="sm">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilters;
