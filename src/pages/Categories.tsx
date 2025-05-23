
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from "@/context/ExpenseContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, PlusCircle, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const { categories, addCategory } = useExpenses();
  const navigate = useNavigate();
  const [newCategory, setNewCategory] = useState("");
  
  // Define colors array before using it in getRandomColor
  const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
    "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
    "bg-orange-500", "bg-cyan-500"
  ];
  
  // Get a random color for categories
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Calculate category distribution
  const categoryDistribution = categories.reduce((acc: Record<string, number>, cat) => {
    if (!acc[cat]) {
      acc[cat] = 1;
    } else {
      acc[cat]++;
    }
    return acc;
  }, {});
  
  const handleAddCategory = () => {
    if (newCategory && newCategory.trim() !== "") {
      addCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background to-muted/30">
        <AppSidebar />
        <SidebarInset>
          <Navbar showMenuButton={true} />
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate('/dashboard')}
                  className="mr-2 transition-all duration-300 hover:bg-primary/10"
                  aria-label="Back to Dashboard"
                >
                  <ArrowLeft size={18} />
                </Button>
                <h1 className="text-2xl font-bold">Categories</h1>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/settings')}
                className="transition-all duration-300 hover:bg-primary/10"
                aria-label="Settings"
              >
                <Settings size={18} />
              </Button>
            </div>
            
            <Card className="mb-6 overflow-hidden border-border/40 shadow-sm transition-all duration-300 hover:shadow-md">
              <CardHeader className="bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
                <CardTitle className="flex items-center text-lg">Add New Category</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                    className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                  />
                  <Button 
                    onClick={handleAddCategory}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-border/40"
                >
                  <div className={`h-2 ${getRandomColor()}`}></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">{category}</h3>
                      <span className="text-xs bg-background/80 px-2 py-1 rounded-full">
                        {categoryDistribution[category] || 0} transactions
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Categories;
