
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useExpenses } from "@/context/ExpenseContext";
import { useLocation } from "@/context/LocationContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus } from "lucide-react";

// Define family expense schema
const familyExpenseSchema = z.object({
  country: z.string().min(1, "Please select a country"),
  region: z.string().min(1, "Please select a region"),
  numAdults: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Number of adults must be at least 1",
  }),
  numChildren: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Number of children must be a positive number",
  }),
  monthlyIncome: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Income must be a positive number",
  }),
  housingType: z.enum(["rent", "own", "other"]),
});

type FamilyExpenseFormValues = z.infer<typeof familyExpenseSchema>;

// Define regions for different countries
const regionOptions: Record<string, string[]> = {
  "United States": ["New York", "California", "Texas", "Florida", "Illinois", "Other"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Edinburgh", "Other"],
  "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia", "Other"],
  "Canada": ["Ontario", "British Columbia", "Quebec", "Alberta", "Other"],
  "Germany": ["Berlin", "Bavaria", "North Rhine-Westphalia", "Other"],
  "France": ["Paris Region", "Provence", "Other"],
  "Japan": ["Tokyo", "Osaka", "Other"],
  "Other": ["Other"]
};

interface FamilyExpenseFormProps {
  onComplete: () => void;
}

const FamilyExpenseForm = ({ onComplete }: FamilyExpenseFormProps) => {
  const { toast } = useToast();
  const { setCurrency } = useExpenses();
  const [selectedCountry, setSelectedCountry] = useState("");
  
  const form = useForm<FamilyExpenseFormValues>({
    resolver: zodResolver(familyExpenseSchema),
    defaultValues: {
      country: "",
      region: "",
      numAdults: "2",
      numChildren: "0",
      monthlyIncome: "",
      housingType: "rent",
    },
  });

  // Set currency based on selected country
  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    form.setValue("region", "");
    
    // Set the currency based on country
    const countryCurrencyMap: Record<string, string> = {
      "United States": "USD",
      "United Kingdom": "GBP",
      "Australia": "AUD",
      "Canada": "CAD",
      "Germany": "EUR",
      "France": "EUR",
      "Japan": "JPY",
      "Other": "USD",
    };
    
    if (countryCurrencyMap[value]) {
      setCurrency(countryCurrencyMap[value]);
    }
  };

  const onSubmit = (data: FamilyExpenseFormValues) => {
    // Store the form data in localStorage
    localStorage.setItem("familyExpenseData", JSON.stringify(data));
    
    toast({
      title: "Information Submitted",
      description: "Your family expense details have been saved.",
    });
    
    onComplete();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCountryChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedCountry && (
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region/State</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regionOptions[selectedCountry].map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Separator className="my-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="numAdults"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Adults</FormLabel>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 w-10"
                    onClick={() => {
                      const currentValue = parseInt(field.value || "0");
                      if (currentValue > 1) {
                        field.onChange((currentValue - 1).toString());
                      }
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      className="mx-2 text-center"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 w-10"
                    onClick={() => {
                      const currentValue = parseInt(field.value || "0");
                      field.onChange((currentValue + 1).toString());
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <FormDescription>Adults in the household (18+ years)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numChildren"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Children</FormLabel>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 w-10"
                    onClick={() => {
                      const currentValue = parseInt(field.value || "0");
                      if (currentValue > 0) {
                        field.onChange((currentValue - 1).toString());
                      }
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      className="mx-2 text-center"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 w-10"
                    onClick={() => {
                      const currentValue = parseInt(field.value || "0");
                      field.onChange((currentValue + 1).toString());
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <FormDescription>Children under 18 years old</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-4" />

        <FormField
          control={form.control}
          name="monthlyIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Monthly Income</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.01" {...field} />
              </FormControl>
              <FormDescription>
                Combined household income (after taxes)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="housingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Housing Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select housing type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="rent">Renting</SelectItem>
                  <SelectItem value="own">Homeowner</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Calculate Family Expenses</Button>
      </form>
    </Form>
  );
};

export default FamilyExpenseForm;
