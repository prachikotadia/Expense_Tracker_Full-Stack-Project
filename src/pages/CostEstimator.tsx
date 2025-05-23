import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExpenses } from "@/context/ExpenseContext";
import { useLocation } from "@/context/LocationContext";
import TravelModeAlert from "@/components/TravelModeAlert";
import { Search, MapPin, Building, Home, Train, Book, Lightbulb, Zap, Smartphone, ShoppingBag, Utensils } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

interface CostCategory {
  name: string;
  icon: React.ReactNode;
  amount: number;
  description: string;
}

interface LocationCosts {
  housing: number;
  food: number;
  transportation: number;
  utilities: number;
  internet: number;
  phone: number;
  entertainment: number;
  healthcare: number;
  education: number;
  total: number;
}

interface CostTemplate {
  id: string;
  name: string;
  description: string;
}

const CostEstimator = () => {
  const { currentLocation, popularLocations, getCostOfLivingIndex, setManualLocation } = useLocation();
  const { currency, setCurrency } = useExpenses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(currentLocation?.country || "United States");
  const [selectedCity, setSelectedCity] = useState(currentLocation?.city || "New York");
  const [selectedTemplate, setSelectedTemplate] = useState("student");
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const calculateLocationCosts = (): LocationCosts => {
    const baseCosts = {
      housing: 1500,
      food: 400,
      transportation: 150,
      utilities: 200,
      internet: 60,
      phone: 50,
      entertainment: 200,
      healthcare: 300,
      education: 0,
    };
    
    const locationMultiplier = getCostOfLivingIndex(selectedCity) / 6.0;
    
    const adjustedCosts = {
      housing: Math.round(baseCosts.housing * locationMultiplier),
      food: Math.round(baseCosts.food * locationMultiplier),
      transportation: Math.round(baseCosts.transportation * locationMultiplier),
      utilities: Math.round(baseCosts.utilities * locationMultiplier),
      internet: Math.round(baseCosts.internet * locationMultiplier),
      phone: Math.round(baseCosts.phone * locationMultiplier),
      entertainment: Math.round(baseCosts.entertainment * locationMultiplier),
      healthcare: Math.round(baseCosts.healthcare * locationMultiplier),
      education: Math.round(baseCosts.education * locationMultiplier),
    };
    
    if (selectedTemplate === "student") {
      adjustedCosts.housing *= 0.7;
      adjustedCosts.food *= 0.8;
      adjustedCosts.entertainment *= 0.7;
      adjustedCosts.education = Math.round(2000 * locationMultiplier);
    } else if (selectedTemplate === "family") {
      adjustedCosts.housing *= 1.5;
      adjustedCosts.food *= 2.5;
      adjustedCosts.transportation *= 1.5;
      adjustedCosts.healthcare *= 2;
    } else if (selectedTemplate === "remote") {
      adjustedCosts.internet *= 1.5;
      adjustedCosts.housing *= 0.9;
    }
    
    const total = Object.values(adjustedCosts).reduce((sum, value) => sum + value, 0);
    
    return {
      ...adjustedCosts,
      total,
    };
  };
  
  const costs = calculateLocationCosts();
  
  const costCategories: CostCategory[] = [
    { 
      name: "Housing", 
      icon: <Home className="h-5 w-5" />, 
      amount: costs.housing,
      description: "Rent or mortgage for housing"
    },
    { 
      name: "Food", 
      icon: <Utensils className="h-5 w-5" />, 
      amount: costs.food,
      description: "Groceries and dining out"
    },
    { 
      name: "Transportation", 
      icon: <Train className="h-5 w-5" />, 
      amount: costs.transportation,
      description: "Public transit or vehicle costs"
    },
    { 
      name: "Utilities", 
      icon: <Zap className="h-5 w-5" />, 
      amount: costs.utilities,
      description: "Electricity, water, gas, etc."
    },
    { 
      name: "Internet", 
      icon: <Lightbulb className="h-5 w-5" />, 
      amount: costs.internet,
      description: "Internet service provider"
    },
    { 
      name: "Phone", 
      icon: <Smartphone className="h-5 w-5" />, 
      amount: costs.phone,
      description: "Mobile phone service"
    },
    { 
      name: "Entertainment", 
      icon: <ShoppingBag className="h-5 w-5" />, 
      amount: costs.entertainment,
      description: "Recreation and fun activities"
    },
    { 
      name: "Healthcare", 
      icon: <Building className="h-5 w-5" />, 
      amount: costs.healthcare,
      description: "Insurance and medical expenses"
    }
  ];
  
  if (costs.education > 0) {
    costCategories.push({
      name: "Education", 
      icon: <Book className="h-5 w-5" />, 
      amount: costs.education,
      description: "Tuition and learning materials"
    });
  }
  
  const chartData = costCategories.map(category => ({
    name: category.name,
    amount: category.amount
  }));
  
  const templates: CostTemplate[] = [
    {
      id: "basic",
      name: "Basic",
      description: "Standard cost of living estimate"
    },
    {
      id: "student",
      name: "Student",
      description: "Costs tailored for students"
    },
    {
      id: "family",
      name: "Family",
      description: "Costs for a family of four"
    },
    {
      id: "remote",
      name: "Remote Worker",
      description: "Optimized for remote work"
    }
  ];
  
  const cities = [
    { country: "United States", cities: ["New York", "San Francisco", "Chicago", "Miami", "Dallas"] },
    { country: "United Kingdom", cities: ["London", "Manchester", "Edinburgh", "Birmingham"] },
    { country: "Canada", cities: ["Toronto", "Vancouver", "Montreal", "Calgary"] },
    { country: "Australia", cities: ["Sydney", "Melbourne", "Brisbane", "Perth"] },
    { country: "Germany", cities: ["Berlin", "Munich", "Hamburg", "Frankfurt"] },
    { country: "France", cities: ["Paris", "Lyon", "Marseille", "Bordeaux"] },
    { country: "Japan", cities: ["Tokyo", "Osaka", "Kyoto", "Fukuoka"] },
    { country: "India", cities: ["Mumbai", "Delhi", "Bangalore", "Chennai"] }
  ];
  
  const getCitiesForCountry = (country: string) => {
    const countryData = cities.find(c => c.country === country);
    return countryData ? countryData.cities : [];
  };
  
  const handleLocationSelect = (country: string, city: string) => {
    setSelectedLocation(country);
    setSelectedCity(city);
    
    const locationObj = popularLocations.find(loc => 
      loc.country === country && (!city || loc.city === city)
    );
    
    if (locationObj?.currency) {
      setCurrency(locationObj.currency);
    }
    
    setManualLocation({
      country,
      city,
      currency: locationObj?.currency || currency
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      {currentLocation && <TravelModeAlert location={currentLocation} />}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Cost of Living Estimator</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Estimate Living Costs</CardTitle>
            <CardDescription>
              Find out the cost of living in different locations worldwide
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={selectedLocation} 
                  onValueChange={(value) => {
                    setSelectedLocation(value);
                    const countryCities = getCitiesForCountry(value);
                    if (countryCities.length > 0) {
                      setSelectedCity(countryCities[0]);
                    }
                  }}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(c => (
                      <SelectItem key={c.country} value={c.country}>
                        {c.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 space-y-2">
                <Label htmlFor="city">City</Label>
                <Select 
                  value={selectedCity} 
                  onValueChange={setSelectedCity}
                >
                  <SelectTrigger id="city">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCitiesForCountry(selectedLocation).map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 space-y-2">
                <Label htmlFor="template">Lifestyle Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Showing estimated monthly costs for {selectedCity}, {selectedLocation} with the {
                  templates.find(t => t.id === selectedTemplate)?.name
                } template.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Cost Breakdown</CardTitle>
              <CardDescription>
                Estimated costs by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costCategories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        {category.icon}
                      </div>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">{category.description}</div>
                      </div>
                    </div>
                    <div className="font-semibold">{formatCurrency(category.amount)}</div>
                  </div>
                ))}
                
                <div className="pt-2 mt-4 border-t flex justify-between items-center">
                  <div className="font-medium text-lg">Total Monthly Costs</div>
                  <div className="font-bold text-lg">{formatCurrency(costs.total)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cost Visualization</CardTitle>
              <CardDescription>
                Visual breakdown of monthly expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="amount" fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Popular Destinations</CardTitle>
            <CardDescription>
              Quickly check costs in these common locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularLocations.map((location) => (
                <Button
                  key={`${location.country}-${location.city}`}
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-center justify-center gap-1"
                  onClick={() => handleLocationSelect(location.country, location.city)}
                >
                  <MapPin className="h-4 w-4" />
                  <span className="text-center">{location.city}</span>
                  <span className="text-xs text-muted-foreground">{location.country}</span>
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Note: These estimates are approximations and actual costs may vary based on lifestyle, neighborhood, and specific circumstances.
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default CostEstimator;
