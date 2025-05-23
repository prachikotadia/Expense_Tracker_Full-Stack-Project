
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useExpenses, ExpenseCategory, RecurringFrequency } from "@/context/ExpenseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "@/context/LocationContext";

interface ExpenseFormProps {
  onClose: () => void;
  expense?: any; // The existing expense to edit
}

interface FormValues {
  amount: string;
  category: ExpenseCategory;
  description: string;
  date: string;
  currency: string;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  paymentMethod?: string;
  location?: string;
  labels?: string;
}

const ExpenseForm = ({ onClose, expense }: ExpenseFormProps) => {
  const { addExpense, updateExpense, categories, currency: defaultCurrency, availableCurrencies } = useExpenses();
  const { toast } = useToast();
  const { currentLocation } = useLocation();
  const [activeTab, setActiveTab] = useState("basic");
  
  const defaultValues: Partial<FormValues> = {
    amount: "",
    category: "Other",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    currency: defaultCurrency,
    isRecurring: false,
    recurringFrequency: "Monthly",
    paymentMethod: "",
    location: currentLocation?.city || "",
    labels: ""
  };
  
  // If expense is provided, use it for default values (editing mode)
  useEffect(() => {
    if (expense) {
      reset({
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description,
        date: expense.date.slice(0, 10),
        currency: expense.currency,
        isRecurring: expense.isRecurring || false,
        recurringFrequency: expense.recurringFrequency || "Monthly",
        paymentMethod: expense.paymentMethod || "",
        location: expense.location || "",
        labels: expense.labels ? expense.labels.join(", ") : ""
      });
    }
  }, [expense]);
  
  const form = useForm<FormValues>({
    defaultValues: expense ? undefined : defaultValues
  });
  
  const { reset } = form;

  const onSubmit = (data: FormValues) => {
    const amount = parseFloat(data.amount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    // Process labels if provided
    const labels = data.labels ? 
      data.labels.split(",").map(label => label.trim()).filter(Boolean) : 
      undefined;

    const expenseData = {
      amount,
      category: data.category,
      description: data.description,
      date: data.date,
      currency: data.currency,
      isRecurring: data.isRecurring,
      recurringFrequency: data.isRecurring ? data.recurringFrequency : undefined,
      paymentMethod: data.paymentMethod || undefined,
      location: data.location || undefined,
      labels
    };

    if (expense) {
      // Edit mode
      updateExpense(expense.id, expenseData);
      toast({
        title: "Transaction updated",
        description: "Your transaction has been updated successfully",
      });
    } else {
      // Add mode
      addExpense(expenseData);
      toast({
        title: "Transaction added",
        description: "Your transaction has been added successfully",
      });
    }

    form.reset();
    onClose();
  };

  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "Mobile Payment",
    "Check",
    "Other"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCurrencies.map((curr) => (
                          <SelectItem key={curr} value={curr}>
                            {curr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Transaction description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Recurring Transaction</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {form.watch("isRecurring") && (
              <FormField
                control={form.control}
                name="recurringFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Where was this transaction made?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="labels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Labels (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="vacation, essentials, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {expense ? "Update Transaction" : "Add Transaction"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExpenseForm;
