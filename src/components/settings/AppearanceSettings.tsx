
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ColorPicker } from "@/components/ui/color-picker"
import { useTheme } from "@/context/ThemeContext"
import { Moon, Sun } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useExpenses } from "@/context/ExpenseContext"
import { useToast } from "@/hooks/use-toast"

const primaryColors = [
  "#8B5CF6", // Purple
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
  "#0EA5E9", // Sky blue
  "#000000", // Black
];

const backgroundStyles = [
  "solid",
  "gradient",
];

const AppearanceSettings = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { language, themeSettings, updateThemeSettings } = useExpenses();
  const [primaryColor, setPrimaryColor] = useState<string>(themeSettings.accentColor || primaryColors[0]);
  const [backgroundStyle, setBackgroundStyle] = useState<string>(themeSettings.background || "solid");
  const [autoTheme, setAutoTheme] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Sync state with context
    setPrimaryColor(themeSettings.accentColor);
    setBackgroundStyle(themeSettings.background);

    // Apply styles
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    
    if (backgroundStyle === "gradient") {
      document.documentElement.classList.add("use-gradient");
    } else {
      document.documentElement.classList.remove("use-gradient");
    }
  }, [themeSettings.accentColor, themeSettings.background, primaryColor, backgroundStyle]);

  const handlePrimaryColorChange = (color: string) => {
    setPrimaryColor(color);
    updateThemeSettings({ accentColor: color });
    toast({
      title: language === 'en' ? "Accent Color Updated" :
             language === 'es' ? "Color de Acento Actualizado" :
             language === 'hi' ? "एक्सेंट कलर अपडेट किया गया" :
             language === 'gu' ? "એક્સેન્ટ કલર અપડેટ કરવામાં આવ્યું" :
             "Accent Color Updated",
      description: language === 'en' ? "Your accent color has been updated" :
                   language === 'es' ? "Su color de acento ha sido actualizado" :
                   language === 'hi' ? "आपका एक्सेंट कलर अपडेट किया गया है" :
                   language === 'gu' ? "તમારો એક્સેન્ટ કલર અપડેટ કરવામાં આવ્યો છે" :
                   "Your accent color has been updated"
    });
  };

  const handleBackgroundStyleChange = (style: string) => {
    setBackgroundStyle(style);
    updateThemeSettings({ background: style as "solid" | "gradient" });
    toast({
      title: language === 'en' ? "Background Style Updated" :
             language === 'es' ? "Estilo de Fondo Actualizado" :
             language === 'hi' ? "पृष्ठभूमि शैली अपडेट की गई" :
             language === 'gu' ? "બેકગ્રાઉન્ડ સ્ટાઇલ અપડેટ કરવામાં આવી" :
             "Background Style Updated"
    });
  };

  const handleSystemThemeChange = (checked: boolean) => {
    setAutoTheme(checked);
    if (checked) {
      // Check system preference and set theme accordingly
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? "dark" : "light");
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  };

  return (
    <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
        <CardTitle className="text-xl font-bold">
          {language === 'en' ? "Appearance" :
           language === 'es' ? "Apariencia" :
           language === 'hi' ? "दिखावट" :
           language === 'gu' ? "દેખાવ" :
           "Appearance"}
        </CardTitle>
        <CardDescription>
          {language === 'en' ? "Customize how ExpensiMate looks and feels" :
           language === 'es' ? "Personalice el aspecto y la sensación de ExpensiMate" :
           language === 'hi' ? "एक्सपेंसीमेट कैसा दिखे और महसूस करे, इसे अनुकूलित करें" :
           language === 'gu' ? "ExpensiMate કેવું દેખાય અને લાગે છે તે કસ્ટમાઇઝ કરો" :
           "Customize how ExpensiMate looks and feels"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selector */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">
            {language === 'en' ? "Theme" :
             language === 'es' ? "Tema" :
             language === 'hi' ? "थीम" :
             language === 'gu' ? "થીમ" :
             "Theme"}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="theme-toggle">
                {language === 'en' ? "Toggle Theme" :
                 language === 'es' ? "Cambiar Tema" :
                 language === 'hi' ? "थीम टॉगल करें" :
                 language === 'gu' ? "થીમ ટૉગલ કરો" :
                 "Toggle Theme"}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="theme-toggle" 
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-primary"
              />
              <Moon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Auto theme based on system */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-theme" className="font-medium">
              {language === 'en' ? "Use system theme" :
               language === 'es' ? "Usar tema del sistema" :
               language === 'hi' ? "सिस्टम थीम का उपयोग करें" :
               language === 'gu' ? "સિસ્ટમ થીમનો ઉપયોગ કરો" :
               "Use system theme"}
            </Label>
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? "Automatically switch theme based on your device settings" :
               language === 'es' ? "Cambiar automáticamente el tema según la configuración de su dispositivo" :
               language === 'hi' ? "आपके डिवाइस सेटिंग्स के आधार पर स्वचालित रूप से थीम बदलें" :
               language === 'gu' ? "તમારા ઉપકરણની સેટિંગ્સ પર આધારિત આપમેળે થીમ સ્વિચ કરો" :
               "Automatically switch theme based on your device settings"}
            </p>
          </div>
          <Switch 
            id="auto-theme" 
            checked={autoTheme}
            onCheckedChange={handleSystemThemeChange}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        
        <Separator />
        
        {/* Primary Color Selection */}
        <div className="space-y-3">
          <Label className="font-medium">
            {language === 'en' ? "Accent Color" :
             language === 'es' ? "Color de Acento" :
             language === 'hi' ? "एक्सेंट कलर" :
             language === 'gu' ? "એક્સેન્ટ કલર" :
             "Accent Color"}
          </Label>
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? "Choose the primary color for buttons and highlights" :
             language === 'es' ? "Elija el color primario para botones y destacados" :
             language === 'hi' ? "बटन और हाइलाइट्स के लिए प्राथमिक रंग चुनें" :
             language === 'gu' ? "બટન અને હાઇલાઇટ્સ માટે પ્રાથમિક રંગ પસંદ કરો" :
             "Choose the primary color for buttons and highlights"}
          </p>
          <ColorPicker 
            colors={primaryColors} 
            selectedColor={primaryColor}
            onColorSelect={handlePrimaryColorChange}
          />
        </div>
        
        <Separator />
        
        {/* Background Style */}
        <div className="space-y-3">
          <Label className="font-medium">
            {language === 'en' ? "Background Style" :
             language === 'es' ? "Estilo de Fondo" :
             language === 'hi' ? "पृष्ठभूमि शैली" :
             language === 'gu' ? "બેકગ્રાઉન્ડ સ્ટાઈલ" :
             "Background Style"}
          </Label>
          <RadioGroup 
            value={backgroundStyle} 
            onValueChange={handleBackgroundStyleChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="solid" id="solid" />
              <Label htmlFor="solid">
                {language === 'en' ? "Solid Color" :
                 language === 'es' ? "Color Sólido" :
                 language === 'hi' ? "ठोस रंग" :
                 language === 'gu' ? "સોલિડ કલર" :
                 "Solid Color"}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gradient" id="gradient" />
              <Label htmlFor="gradient">
                {language === 'en' ? "Subtle Gradient" :
                 language === 'es' ? "Gradiente Sutil" :
                 language === 'hi' ? "सूक्ष्म ग्रेडिएंट" :
                 language === 'gu' ? "સૂક્ષ્મ ગ્રેડિયન્ટ" :
                 "Subtle Gradient"}
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
