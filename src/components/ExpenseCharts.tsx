
import { useExpenses, ExpenseCategory } from "@/context/ExpenseContext";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

// Modern color palette that matches the reference images
const COLORS = [
  "#6B8AF2", // Light blue
  "#FF6370", // Coral red
  "#FFD650", // Bright yellow
  "#50D2C2", // Turquoise
  "#9E7BF6", // Purple
  "#F97D5C", // Orange
  "#6DF9D8", // Mint
  "#FFAAEA", // Pink
  "#A4F95C", // Lime
  "#8C8CFA"  // Periwinkle
];

interface ExpenseChartsProps {
  showPieOnly?: boolean;
  showBarOnly?: boolean;
}

const ExpenseCharts = ({ showPieOnly, showBarOnly }: ExpenseChartsProps) => {
  const { getExpensesByCategory, currency, language } = useExpenses();
  const expensesByCategory = getExpensesByCategory();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Prepare data for the charts
  const pieChartData = Object.entries(expensesByCategory)
    .filter(([_, value]) => value > 0)
    .map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));

  const barChartData = Object.entries(expensesByCategory)
    .filter(([_, value]) => value > 0)
    .map(([name, value], index) => ({
      name,
      amount: value,
      color: COLORS[index % COLORS.length]
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-sm p-3 rounded-md shadow-lg border border-border/50">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary font-mono">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  // Total value calculation for pie chart center
  const totalValue = pieChartData.reduce((sum, item) => sum + item.value, 0);

  if (pieChartData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-6">
            <p className="text-lg font-medium">
              {language === 'en' ? "No data to display" :
               language === 'es' ? "No hay datos para mostrar" :
               language === 'hi' ? "प्रदर्शित करने के लिए कोई डेटा नहीं है" :
               language === 'gu' ? "પ્રદર્શિત કરવા માટે કોઈ ડેટા નથી" :
               "No data to display"}
            </p>
            <p className="text-muted-foreground">
              {language === 'en' ? "Add some expenses to see your spending breakdown" :
               language === 'es' ? "Agrega algunos gastos para ver tu desglose de gastos" :
               language === 'hi' ? "अपने खर्च का विवरण देखने के लिए कुछ व्यय जोड़ें" :
               language === 'gu' ? "તમારા ખર્ચનું બ્રેકડાઉન જોવા માટે કેટલાક ખર્ચ ઉમેરો" :
               "Add some expenses to see your spending breakdown"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show only pie chart if specified
  if (showPieOnly) {
    return (
      <div className="h-full">
        <div className="relative h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 30, left: 0 }}>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={140}
                innerRadius={70}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {pieChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="transparent" 
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                formatter={(value, entry, index) => (
                  <span className="text-sm font-medium">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center total value - similar to the second reference image */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-background/20 backdrop-blur-md rounded-full p-4 w-32 h-32 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="font-bold text-lg">{formatCurrency(totalValue)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Show only bar chart if specified
  if (showBarOnly) {
    return (
      <div className="h-full">
        <div className="bg-gradient-to-br from-blue-900/95 to-blue-800 p-4 rounded-xl h-full">
          <div className="text-center mb-4">
            <h3 className="font-bold text-yellow-300 text-xl uppercase tracking-wide">PERSONAL MONTHLY</h3>
            <p className="text-white/80 text-md">Budget Allocation</p>
          </div>
          
          <ChartContainer
            config={Object.fromEntries(
              pieChartData.map((entry) => [entry.name, { color: entry.color }])
            )}
          >
            <ResponsiveContainer width="100%" height="80%">
              <BarChart
                data={barChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                barSize={40}
                barGap={8}
              >
                <XAxis 
                  type="number" 
                  tick={{ fill: 'white', fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value)} 
                  axisLine={{ stroke: '#ffffff30' }}
                  tickLine={false}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80} 
                  tick={{ fill: 'white', fontSize: 12 }}
                  axisLine={{ stroke: '#ffffff30' }}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{ 
                    backgroundColor: 'rgba(20, 30, 70, 0.9)', 
                    borderColor: '#ffffff30',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[0, 4, 4, 0]}
                  animationDuration={1000}
                >
                  {barChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity duration-300" 
                    />
                  ))}
                  <Tooltip
                    labelFormatter={(name) => name}
                    formatter={(value) => [formatCurrency(value as number), ""]}
                    labelStyle={{ color: 'white' }}
                    itemStyle={{ color: 'white' }}
                    cursor={false}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    );
  }

  // Default - show only pie chart (removed the Category Comparison section)
  return (
    <div className="space-y-6">
      <Card className="border border-border/50 bg-background/50 hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {language === 'en' ? "Expenses by Category" :
             language === 'es' ? "Gastos por Categoría" :
             language === 'hi' ? "श्रेणी के अनुसार व्यय" :
             language === 'gu' ? "શ્રેણી દ્વારા ખર્ચ" :
             "Expenses by Category"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  innerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={1}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="transparent"
                      className="hover:opacity-80 transition-opacity duration-300" 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center total value */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-background/60 backdrop-blur-sm rounded-full p-4 w-28 h-28 flex flex-col items-center justify-center shadow-md">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="font-bold text-lg">{formatCurrency(totalValue)}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieChartData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full transition-transform duration-300 hover:scale-150" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm">
                  {entry.name} ({((entry.value / totalValue) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseCharts;
