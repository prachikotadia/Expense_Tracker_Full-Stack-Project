
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, User } from "lucide-react";
import Navbar from "@/components/Navbar";

// Import existing settings components
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import GeneralSettings from "@/components/settings/GeneralSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import { useExpenses } from "@/context/ExpenseContext";

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const { language } = useExpenses();
  
  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'settings': {
        'en': 'Settings',
        'es': 'Configuración',
        'hi': 'सेटिंग्स',
        'gu': 'સેટિંગ્સ'
      },
      'general': {
        'en': 'General',
        'es': 'General',
        'hi': 'सामान्य',
        'gu': 'સામાન્ય'
      },
      'profile': {
        'en': 'Profile',
        'es': 'Perfil',
        'hi': 'प्रोफ़ाइल',
        'gu': 'પ્રોફાઇલ'
      },
      'appearance': {
        'en': 'Appearance',
        'es': 'Apariencia',
        'hi': 'दिखावट',
        'gu': 'દેખાવ'
      },
      'accounts': {
        'en': 'Accounts',
        'es': 'Cuentas',
        'hi': 'खाते',
        'gu': 'ખાતાઓ'
      },
      'security': {
        'en': 'Security',
        'es': 'Seguridad',
        'hi': 'सुरक्षा',
        'gu': 'સુરક્ષા'
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
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/dashboard')}
                className="mr-2 transition-all duration-300 hover:bg-primary/10"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft size={18} />
              </Button>
              <h1 className="text-2xl font-bold">{getLocalizedText('settings')}</h1>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="grid w-full max-w-2xl grid-cols-5 bg-muted/50">
                  <TabsTrigger 
                    value="general"
                    className="transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary"
                  >
                    {getLocalizedText('general')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="profile" 
                    className="transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary"
                  >
                    {getLocalizedText('profile')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appearance" 
                    className="transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary"
                  >
                    {getLocalizedText('appearance')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="accounts" 
                    className="transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary"
                  >
                    {getLocalizedText('accounts')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary"
                  >
                    {getLocalizedText('security')}
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="general">
                <GeneralSettings />
              </TabsContent>

              <TabsContent value="profile">
                <ProfileSettings />
              </TabsContent>
              
              <TabsContent value="appearance">
                <AppearanceSettings />
              </TabsContent>
              
              <TabsContent value="accounts">
                <div className="max-w-3xl mx-auto">
                  <Button 
                    onClick={() => navigate('/bank-accounts')} 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 mb-4"
                  >
                    {language === 'en' ? "Manage Bank Accounts" :
                     language === 'es' ? "Administrar Cuentas Bancarias" :
                     language === 'hi' ? "बैंक खातों का प्रबंधन करें" :
                     language === 'gu' ? "બેંક ખાતાઓનું સંચાલન કરો" :
                     "Manage Bank Accounts"}
                  </Button>

                  <iframe 
                    src="/bank-accounts" 
                    className="w-full h-[70vh] border border-border rounded-lg"
                    title="Bank Accounts"
                  ></iframe>
                </div>
              </TabsContent>
              
              <TabsContent value="security">
                <SecuritySettings />
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
