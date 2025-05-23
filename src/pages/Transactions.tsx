
import ThemeProvider from "@/context/ThemeContext";
import { ExpenseProvider } from "@/context/ExpenseContext";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseList from "@/components/ExpenseList";
import ExpenseForm from "@/components/ExpenseForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, UploadCloud, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TravelModeAlert from "@/components/TravelModeAlert";
import { useLocation } from "@/context/LocationContext";
import TransactionImporter from "@/components/TransactionImporter";
import TransactionFilters from "@/components/TransactionFilters";
import ExportOptions from "@/components/ExportOptions";
import BackButton from "@/components/BackButton";
import { useIsMobile } from "@/hooks/use-mobile";

const Transactions = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const { toast } = useToast();
  const { currentLocation } = useLocation();
  const isMobile = useIsMobile();

  return (
    <ThemeProvider>
      <ExpenseProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <Navbar />
          {currentLocation && <TravelModeAlert location={currentLocation} />}
          <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-[100vw] overflow-x-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center">
                <BackButton to="/dashboard" className="mr-2" />
                <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
              </div>
              
              {/* Action buttons - responsive layout */}
              {isMobile ? (
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center"
                    size="sm"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  
                  <Button
                    onClick={() => setShowExpenseForm(true)}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary flex items-center justify-center"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setShowImporter(true)}
                    className="flex items-center justify-center"
                    size="sm"
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setShowExport(true)}
                    className="flex items-center justify-center"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" onClick={() => setShowExport(true)}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" onClick={() => setShowImporter(true)}>
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <Button 
                    onClick={() => setShowExpenseForm(true)}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Transaction
                  </Button>
                </div>
              )}
            </div>

            {showFilters && (
              <Card className="mb-6 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg">Filter Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionFilters onClose={() => setShowFilters(false)} />
                </CardContent>
              </Card>
            )}

            {showImporter && (
              <Card className="mb-6 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg">Import Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionImporter onClose={() => setShowImporter(false)} />
                </CardContent>
              </Card>
            )}

            {showExport && (
              <Card className="mb-6 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg">Export Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExportOptions onClose={() => setShowExport(false)} />
                </CardContent>
              </Card>
            )}

            {showExpenseForm && (
              <Card className="mb-6 animate-fade-in">
                <CardHeader>
                  <CardTitle>Add New Transaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpenseForm onClose={() => setShowExpenseForm(false)} />
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="w-full max-w-md mx-auto flex justify-between mb-4 overflow-x-auto">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="expenses" className="flex-1">Expenses</TabsTrigger>
                <TabsTrigger value="income" className="flex-1">Income</TabsTrigger>
                <TabsTrigger value="recurring" className="flex-1">Recurring</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <ExpenseList />
              </TabsContent>
              
              <TabsContent value="expenses">
                <ExpenseList filterCategory={(category) => category !== "Income"} />
              </TabsContent>
              
              <TabsContent value="income">
                <ExpenseList filterCategory={(category) => category === "Income"} />
              </TabsContent>
              
              <TabsContent value="recurring">
                <ExpenseList filterRecurring={true} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </ExpenseProvider>
    </ThemeProvider>
  );
};

export default Transactions;
