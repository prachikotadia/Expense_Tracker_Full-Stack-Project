
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ExpenseCharts from "@/components/ExpenseCharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart, PieChart } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExpenses } from "@/context/ExpenseContext";
import BackButton from "@/components/BackButton";

const Analytics = () => {
  const [activeChart, setActiveChart] = useState("pie");
  const { language } = useExpenses();

  const getLocalizedText = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      'analytics': {
        'en': 'Analytics',
        'es': 'Análisis',
        'hi': 'विश्लेषण',
        'gu': 'એનાલિટિક્સ'
      },
      'spendingTrends': {
        'en': 'Spending Trends',
        'es': 'Tendencias de Gastos',
        'hi': 'खर्च के रुझान',
        'gu': 'ખર્ચના વલણો'
      },
      'monthlyAnalysis': {
        'en': 'Monthly analysis of your expenses',
        'es': 'Análisis mensual de tus gastos',
        'hi': 'आपके व्यय का मासिक विश्लेषण',
        'gu': 'તમારા ખર્ચનું માસિક વિશ્લેષણ'
      },
      'budgetVsActual': {
        'en': 'Budget vs Actual',
        'es': 'Presupuesto vs Real',
        'hi': 'बजट बनाम वास्तविक',
        'gu': 'બજેટ વિરુદ્ધ વાસ્તવિક'
      },
      'budgetComparison': {
        'en': 'Compare your spending against budget',
        'es': 'Compara tu gasto contra el presupuesto',
        'hi': 'अपने खर्च की तुलना बजट से करें',
        'gu': 'તમારા ખર્ચની સરખામણી બજેટ સાથે કરો'
      },
      'pieChart': {
        'en': 'Pie Chart',
        'es': 'Gráfico circular',
        'hi': 'पाई चार्ट',
        'gu': 'પાઇ ચાર્ટ'
      },
      'barChart': {
        'en': 'Bar Chart',
        'es': 'Gráfico de barras',
        'hi': 'बार चार्ट',
        'gu': 'બાર ચાર્ટ'
      },
      'lineChart': {
        'en': 'Line Chart',
        'es': 'Gráfico de líneas',
        'hi': 'रेखा चार्ट',
        'gu': 'લાઇન ચાર્ટ'
      },
      'availableSoon': {
        'en': 'will be available soon',
        'es': 'estará disponible pronto',
        'hi': 'जल्द ही उपलब्ध होगा',
        'gu': 'ટૂંક સમયમાં ઉપલબ્ધ થશે'
      }
    };
    
    return translations[key][language] || translations[key]['en'];
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background to-muted/30">
        <AppSidebar />
        <SidebarInset>
          <Navbar showMenuButton={true} />
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-4">
              <BackButton to="/dashboard" className="mr-2" />
              <h1 className="text-2xl font-bold">{getLocalizedText('analytics')}</h1>
            </div>
            
            <Tabs defaultValue="categories" className="space-y-6">
              <TabsList className="grid w-full md:w-[400px] grid-cols-3 mb-6">
                <TabsTrigger 
                  value="categories" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary transition-all duration-300"
                >
                  <PieChart className="h-4 w-4 mr-2" />
                  {getLocalizedText('pieChart')}
                </TabsTrigger>
                <TabsTrigger 
                  value="comparison" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary transition-all duration-300"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {getLocalizedText('barChart')}
                </TabsTrigger>
                <TabsTrigger 
                  value="trends" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary transition-all duration-300"
                >
                  <LineChart className="h-4 w-4 mr-2" />
                  {getLocalizedText('lineChart')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="categories" className="space-y-6">
                <Card className="shadow-md overflow-hidden border-border/40">
                  <CardHeader className="bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
                    <CardTitle>{getLocalizedText('pieChart')}</CardTitle>
                    <CardDescription>Category breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-[400px]">
                      <ExpenseCharts showPieOnly={true} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison" className="space-y-6">
                <Card className="shadow-md overflow-hidden border-border/40">
                  <CardHeader className="bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
                    <CardTitle>{getLocalizedText('barChart')}</CardTitle>
                    <CardDescription>Budget Allocation</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-[400px]">
                      <ExpenseCharts showBarOnly={true} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <Card className="shadow-md overflow-hidden border-border/40">
                  <CardHeader className="bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
                    <CardTitle>{getLocalizedText('spendingTrends')}</CardTitle>
                    <CardDescription>{getLocalizedText('monthlyAnalysis')}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-[300px] flex items-center justify-center">
                      <p className="text-muted-foreground">{getLocalizedText('lineChart')} {getLocalizedText('availableSoon')}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="shadow-md overflow-hidden border-border/40 hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
                  <CardTitle>{getLocalizedText('spendingTrends')}</CardTitle>
                  <CardDescription>{getLocalizedText('monthlyAnalysis')}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">{getLocalizedText('spendingTrends')} {getLocalizedText('availableSoon')}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md overflow-hidden border-border/40 hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
                  <CardTitle>{getLocalizedText('budgetVsActual')}</CardTitle>
                  <CardDescription>{getLocalizedText('budgetComparison')}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">{getLocalizedText('budgetComparison')} {getLocalizedText('availableSoon')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
