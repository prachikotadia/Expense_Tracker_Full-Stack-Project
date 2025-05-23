
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useExpenses } from "@/context/ExpenseContext";
import { Progress } from "@/components/ui/progress";
import { InfoIcon } from "lucide-react";

interface TransactionImporterProps {
  onClose: () => void;
}

const TransactionImporter = ({ onClose }: TransactionImporterProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { addExpense } = useExpenses();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import",
        variant: "destructive",
      });
      return;
    }

    // Start the import process
    setImporting(true);
    setProgress(0);

    // Simulate import progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Simulate adding some expenses
          setTimeout(() => {
            // Add sample imported expenses
            const sampleImports = [
              {
                amount: 45.99,
                category: "Food" as const,
                description: "Grocery Store",
                date: new Date().toISOString(),
                currency: "USD",
                paymentMethod: "Credit Card",
                location: "Local Supermarket"
              },
              {
                amount: 12.50,
                category: "Transportation" as const,
                description: "Taxi Ride",
                date: new Date().toISOString(),
                currency: "USD",
                paymentMethod: "Credit Card",
                location: "Downtown"
              },
              {
                amount: 8.75,
                category: "Food" as const,
                description: "Coffee Shop",
                date: new Date().toISOString(),
                currency: "USD",
                paymentMethod: "Credit Card",
                location: "Main Street Cafe"
              }
            ];
            
            sampleImports.forEach(expense => addExpense(expense));
            
            setImporting(false);
            toast({
              title: "Import complete",
              description: `Successfully imported ${sampleImports.length} transactions`,
            });
            onClose();
          }, 500);
        }
        return newProgress;
      });
    }, 300);
  };

  return (
    <div className="space-y-4 w-full max-w-full">
      <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3 text-sm">
        <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium mb-1">Import your transactions from a CSV file</p>
          <p className="text-muted-foreground">
            Your file should include columns for date, description, amount, category, and optionally payment method and location.
            Download our <Button variant="link" className="h-auto p-0">template file</Button> for the correct format.
          </p>
        </div>
      </div>
      
      <div className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center">
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={importing}
        />
        <label 
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <div className="mb-2">
            <svg
              className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-wrap justify-center text-sm text-muted-foreground">
            <span className="relative rounded-md font-medium text-primary">
              Upload a file
            </span>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-muted-foreground">CSV files up to 10MB</p>
        </label>
        
        {file && (
          <div className="mt-4 flex items-center gap-2 justify-center text-sm">
            <span className="font-medium">Selected file:</span>
            <span className="text-muted-foreground text-ellipsis overflow-hidden">{file.name}</span>
          </div>
        )}
      </div>
      
      {importing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Importing transactions...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}
      
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={importing} size="sm">
          Cancel
        </Button>
        <Button onClick={handleImport} disabled={!file || importing} size="sm">
          {importing ? "Importing..." : "Import Transactions"}
        </Button>
      </div>
    </div>
  );
};

export default TransactionImporter;
