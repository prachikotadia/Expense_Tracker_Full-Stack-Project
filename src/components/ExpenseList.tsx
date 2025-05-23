import { useState } from "react";
import { useExpenses, Expense, ExpenseCategory, RecurringFrequency } from "@/context/ExpenseContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export interface ExpenseListProps {
  filterCategory?: (category: ExpenseCategory) => boolean;
  filterRecurring?: boolean;
  limit?: number;
  compact?: boolean;
}

const ExpenseList = ({ 
  filterCategory, 
  filterRecurring,
  limit,
  compact = false
}: ExpenseListProps) => {
  const { expenses, deleteExpense, updateExpense, categories, currency } = useExpenses();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof Expense>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();
  
  const [editForm, setEditForm] = useState({
    amount: "",
    category: "",
    description: "",
    isRecurring: false,
    recurringFrequency: "Monthly" as RecurringFrequency,
    isIncome: false
  });

  // Filter and sort expenses
  const filteredExpenses = [...expenses]
    .filter(expense => !filterCategory || filterCategory(expense.category))
    .filter(expense => !filterRecurring || expense.isRecurring)
    .sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  // Apply limit if provided
  const displayExpenses = limit ? filteredExpenses.slice(0, limit) : filteredExpenses;

  const handleSort = (field: keyof Expense) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditForm({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      isRecurring: expense.isRecurring || false,
      recurringFrequency: expense.recurringFrequency || "Monthly" as RecurringFrequency,
      isIncome: expense.category === "Income" || !!expense.isIncome
    });
    setIsDialogOpen(true);
  };
  
  const handleDelete = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedExpense) {
      deleteExpense(selectedExpense.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Transaction deleted",
        description: "The transaction has been deleted successfully"
      });
    }
  };
  
  const handleSaveEdit = () => {
    if (!selectedExpense) return;
    
    const updatedExpense: Partial<Expense> = {
      amount: parseFloat(editForm.amount),
      category: editForm.isIncome ? "Income" : editForm.category as ExpenseCategory,
      description: editForm.description,
      isRecurring: editForm.isRecurring,
      recurringFrequency: editForm.isRecurring ? editForm.recurringFrequency : undefined,
      isIncome: editForm.isIncome
    };
    
    updateExpense(selectedExpense.id, updatedExpense);
    setIsDialogOpen(false);
    toast({
      title: "Transaction updated",
      description: "The transaction has been updated successfully"
    });
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      Housing: "bg-blue-500",
      Food: "bg-green-500",
      Transportation: "bg-yellow-500",
      Entertainment: "bg-purple-500",
      Utilities: "bg-indigo-500",
      Healthcare: "bg-red-500",
      Education: "bg-pink-500",
      Shopping: "bg-cyan-500",
      Personal: "bg-teal-500",
      Travel: "bg-amber-500",
      Debt: "bg-rose-500",
      Savings: "bg-lime-500",
      Income: "bg-emerald-500",
      Investments: "bg-sky-500",
      Gifts: "bg-violet-500",
      Other: "bg-gray-500",
    };
    
    return categoryColors[category] || "bg-gray-500";
  };

  if (displayExpenses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">No transactions found</p>
            {filterCategory || filterRecurring ? (
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters to see more results
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                Add transactions to get started
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact view
  if (compact) {
    return (
      <div className="space-y-2">
        {displayExpenses.map(expense => (
          <div 
            key={expense.id}
            className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/20 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${getCategoryColor(expense.category)}`} />
              <div>
                <div className="font-medium">{expense.description}</div>
                <div className="text-xs text-muted-foreground">{formatDate(expense.date)}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`font-mono ${expense.category === "Income" || expense.isIncome ? "text-green-500" : "text-destructive"}`}>
                {expense.category === "Income" || expense.isIncome ? "+" : "-"}
                {formatCurrency(expense.amount, expense.currency)}
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(expense)}>
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        
        {filteredExpenses.length > displayExpenses.length && (
          <div className="text-center pt-2">
            <Button variant="link" className="text-primary text-sm">
              View all {filteredExpenses.length} transactions
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Regular view
  return (
    <div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort("date")}>
                Date {sortField === "date" && (sortDirection === "asc" ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("description")}>
                Description {sortField === "description" && (sortDirection === "asc" ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                Category {sortField === "category" && (sortDirection === "asc" ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort("amount")}>
                Amount {sortField === "amount" && (sortDirection === "asc" ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />)}
              </TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayExpenses.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>{formatDate(expense.date)}</TableCell>
                <TableCell>
                  <div>{expense.description}</div>
                  {expense.isRecurring && (
                    <Badge variant="outline" className="text-xs">Recurring</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={`${getCategoryColor(expense.category)} bg-opacity-20 text-opacity-90 border-0`}>
                    {expense.category}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right font-mono ${expense.category === "Income" || expense.isIncome ? "text-green-500" : "text-destructive"}`}>
                  {expense.category === "Income" || expense.isIncome ? "+" : "-"}
                  {formatCurrency(expense.amount, expense.currency)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(expense)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(expense)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Make changes to the transaction details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  value={editForm.amount}
                  onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={editForm.isIncome ? "income" : "expense"} 
                  onValueChange={(value) => setEditForm({...editForm, isIncome: value === "income"})}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {!editForm.isIncome && (
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={editForm.category} 
                  onValueChange={(value) => setEditForm({...editForm, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat !== "Income")
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isRecurring" 
                checked={editForm.isRecurring}
                onCheckedChange={(checked) => setEditForm({...editForm, isRecurring: !!checked})}
              />
              <Label htmlFor="isRecurring">This is a recurring transaction</Label>
            </div>
            
            {editForm.isRecurring && (
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={editForm.recurringFrequency} 
                  onValueChange={(value) => setEditForm({...editForm, recurringFrequency: value as RecurringFrequency})}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedExpense && (
            <div className="py-4">
              <div className="border rounded-lg p-3 bg-muted/20">
                <div className="font-medium">{selectedExpense.description}</div>
                <div className="text-sm">{formatDate(selectedExpense.date)} - {formatCurrency(selectedExpense.amount, selectedExpense.currency)}</div>
                <div className="text-sm">{selectedExpense.category}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseList;
