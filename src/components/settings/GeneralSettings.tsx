
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useExpenses } from "@/context/ExpenseContext"
import { useToast } from "@/hooks/use-toast"
import { Settings2, Mail, BellRing, LanguagesIcon } from "lucide-react"

const GeneralSettings = () => {
  const { 
    currency, 
    setCurrency, 
    availableCurrencies, 
    language, 
    setLanguage,
    notifications,
    toggleNotification 
  } = useExpenses();
  const { toast } = useToast();

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    toast({
      title: getLocalizedText('currencyUpdated'),
      description: getLocalizedText('currencyUpdatedDesc').replace('{currency}', newCurrency)
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    toast({
      title: getLocalizedText('languageUpdated'),
      description: getLocalizedText('languageUpdatedDesc').replace('{language}', getLanguageName(newLanguage))
    });
  };

  const handleToggleNotification = (type: keyof typeof notifications) => {
    toggleNotification(type);
    
    const isEnabled = !notifications[type];
    const notificationTypes: Record<string, string> = {
      'budgetAlerts': getLocalizedText('budgetAlerts'),
      'paymentReminders': getLocalizedText('paymentReminders'),
      'tipsSuggestions': getLocalizedText('tipsSuggestions'),
      'emailNotifications': getLocalizedText('emailNotifications')
    };
    
    toast({
      title: isEnabled ? getLocalizedText('notificationEnabled') : getLocalizedText('notificationDisabled'),
      description: (isEnabled ? getLocalizedText('notificationEnabledDesc') : getLocalizedText('notificationDisabledDesc'))
        .replace('{type}', notificationTypes[type])
    });
  };

  const getLanguageName = (code: string): string => {
    const languages = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      zh: "Chinese",
      ja: "Japanese",
      hi: "Hindi",
      gu: "Gujarati"
    };
    return languages[code as keyof typeof languages] || code;
  };

  const getLocalizedText = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      'generalSettings': {
        'en': 'General Settings',
        'es': 'Configuración General',
        'hi': 'सामान्य सेटिंग्स',
        'gu': 'સામાન્ય સેટિંગ્સ'
      },
      'generalDesc': {
        'en': 'Configure your account preferences and application behavior',
        'es': 'Configure las preferencias de su cuenta y el comportamiento de la aplicación',
        'hi': 'अपने खाते की प्राथमिकताएँ और एप्लिकेशन व्यवहार कॉन्फ़िगर करें',
        'gu': 'તમારા એકાઉન્ટની પસંદગીઓ અને એપ્લિકેશન વર્તણૂક કૉન્ફિગર કરો'
      },
      'defaultCurrency': {
        'en': 'Default Currency',
        'es': 'Moneda Predeterminada',
        'hi': 'डिफ़ॉल्ट मुद्रा',
        'gu': 'ડિફૉલ્ટ ચલણ'
      },
      'language': {
        'en': 'Language',
        'es': 'Idioma',
        'hi': 'भाषा',
        'gu': 'ભાષા'
      },
      'languageRefresh': {
        'en': 'Changes will apply after refreshing the app',
        'es': 'Los cambios se aplicarán después de actualizar la aplicación',
        'hi': 'ऐप को रिफ्रेश करने के बाद परिवर्तन लागू होंगे',
        'gu': 'એપ્લિકેશન રીફ્રેશ કર્યા પછી ફેરફારો લાગુ થશે'
      },
      'notifications': {
        'en': 'Notifications',
        'es': 'Notificaciones',
        'hi': 'सूचनाएं',
        'gu': 'નોટિફિકેશન'
      },
      'budgetAlerts': {
        'en': 'Budget Alerts',
        'es': 'Alertas de Presupuesto',
        'hi': 'बजट अलर्ट',
        'gu': 'બજેટ એલર્ટ્સ'
      },
      'budgetAlertsDesc': {
        'en': 'Get notified when nearing budget limits',
        'es': 'Reciba notificaciones cuando se acerque a los límites del presupuesto',
        'hi': 'बजट सीमा के करीब पहुंचने पर सूचित किया जाए',
        'gu': 'બજેટ મર્યાદાની નજીક પહોંચતા સૂચિત થાઓ'
      },
      'paymentReminders': {
        'en': 'Payment Reminders',
        'es': 'Recordatorios de Pago',
        'hi': 'भुगतान अनुस्मारक',
        'gu': 'ચુકવણી રિમાઇન્ડર્સ'
      },
      'paymentRemindersDesc': {
        'en': 'Get reminded about upcoming payments',
        'es': 'Reciba recordatorios sobre pagos próximos',
        'hi': 'आगामी भुगतानों के बारे में याद दिलाया जाए',
        'gu': 'આવનારી ચુકવણીઓ વિશે યાદ અપાવવામાં આવે'
      },
      'tipsSuggestions': {
        'en': 'Tips & Suggestions',
        'es': 'Consejos y Sugerencias',
        'hi': 'टिप्स और सुझाव',
        'gu': 'ટિપ્સ અને સૂચનો'
      },
      'tipsSuggestionsDesc': {
        'en': 'Receive money-saving tips',
        'es': 'Reciba consejos para ahorrar dinero',
        'hi': 'पैसे बचाने के टिप्स प्राप्त करें',
        'gu': 'પૈસા બચાવવાની ટિપ્સ મેળવો'
      },
      'emailNotifications': {
        'en': 'Email Notifications',
        'es': 'Notificaciones por Correo',
        'hi': 'ईमेल सूचनाएं',
        'gu': 'ઈમેલ નોટિફિકેશન'
      },
      'emailDesc': {
        'en': 'Receive financial updates via email',
        'es': 'Reciba actualizaciones financieras por correo electrónico',
        'hi': 'ईमेल के माध्यम से वित्तीय अपडेट प्राप्त करें',
        'gu': 'ઈમેલ દ્વારા નાણાકીય અપડેટ્સ મેળવો'
      },
      'weeklySummary': {
        'en': 'Weekly summary of your finances',
        'es': 'Resumen semanal de sus finanzas',
        'hi': 'आपके वित्त का साप्ताहिक सारांश',
        'gu': 'તમારા નાણાંનો સાપ્તાહિક સારાંશ'
      },
      'currencyUpdated': {
        'en': 'Currency updated',
        'es': 'Moneda actualizada',
        'hi': 'मुद्रा अपडेट की गई',
        'gu': 'ચલણ અપડેટ કરવામાં આવ્યું'
      },
      'currencyUpdatedDesc': {
        'en': 'Your default currency has been changed to {currency}',
        'es': 'Su moneda predeterminada ha sido cambiada a {currency}',
        'hi': 'आपकी डिफ़ॉल्ट मुद्रा {currency} में बदल दी गई है',
        'gu': 'તમારું ડિફૉલ્ટ ચલણ {currency}માં બદલાઈ ગયું છે'
      },
      'languageUpdated': {
        'en': 'Language updated',
        'es': 'Idioma actualizado',
        'hi': 'भाषा अपडेट की गई',
        'gu': 'ભાષા અપડેટ કરવામાં આવી'
      },
      'languageUpdatedDesc': {
        'en': 'Application language has been changed to {language}',
        'es': 'El idioma de la aplicación ha sido cambiado a {language}',
        'hi': 'एप्लिकेशन की भाषा {language} में बदल दी गई है',
        'gu': 'એપ્લિકેશનની ભાષા {language}માં બદલાઈ ગઈ છે'
      },
      'notificationEnabled': {
        'en': 'Notification Enabled',
        'es': 'Notificación Habilitada',
        'hi': 'सूचना सक्षम की गई',
        'gu': 'નોટિફિકેશન સક્ષમ કરવામાં આવ્યું'
      },
      'notificationDisabled': {
        'en': 'Notification Disabled',
        'es': 'Notificación Deshabilitada',
        'hi': 'सूचना अक्षम की गई',
        'gu': 'નોટિફિકેશન અક્ષમ કરવામાં આવ્યું'
      },
      'notificationEnabledDesc': {
        'en': '{type} notifications have been enabled',
        'es': 'Las notificaciones de {type} han sido habilitadas',
        'hi': '{type} सूचनाएं सक्षम की गई हैं',
        'gu': '{type} નોટિફિકેશન સક્ષમ કરવામાં આવ્યા છે'
      },
      'notificationDisabledDesc': {
        'en': '{type} notifications have been disabled',
        'es': 'Las notificaciones de {type} han sido deshabilitadas',
        'hi': '{type} सूचनाएं अक्षम की गई हैं',
        'gu': '{type} નોટિફિકેશન અક્ષમ કરવામાં આવ્યા છે'
      }
    };
    
    return translations[key][language] || translations[key]['en'];
  };

  return (
    <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
        <div className="flex items-center">
          <Settings2 className="mr-2 h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-bold">{getLocalizedText('generalSettings')}</CardTitle>
        </div>
        <CardDescription>
          {getLocalizedText('generalDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Currency Setting */}
        <div className="space-y-2">
          <Label htmlFor="currency" className="font-medium">{getLocalizedText('defaultCurrency')}</Label>
          <Select value={currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger id="currency" className="transition-all duration-200 focus:ring-2 focus:ring-primary/30">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="bg-card/90 backdrop-blur-sm">
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="JPY">JPY (¥)</SelectItem>
              <SelectItem value="CAD">CAD (C$)</SelectItem>
              <SelectItem value="AUD">AUD (A$)</SelectItem>
              <SelectItem value="INR">INR (₹)</SelectItem>
              <SelectItem value="CNY">CNY (¥)</SelectItem>
              <SelectItem value="MXN">MXN ($)</SelectItem>
              <SelectItem value="BRL">BRL (R$)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Separator />
        
        {/* Language Setting */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <LanguagesIcon className="h-4 w-4 text-primary" />
            <Label htmlFor="language" className="font-medium">{getLocalizedText('language')}</Label>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger id="language" className="transition-all duration-200 focus:ring-2 focus:ring-primary/30">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-card/90 backdrop-blur-sm">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="gu">Gujarati</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />
        
        {/* Notifications */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <BellRing className="h-4 w-4 text-primary" />
            <Label className="font-medium">{getLocalizedText('notifications')}</Label>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between group p-2 rounded-md hover:bg-muted/30 transition-colors duration-200">
              <div>
                <Label htmlFor="budget-alerts" className="cursor-pointer">{getLocalizedText('budgetAlerts')}</Label>
                <p className="text-xs text-muted-foreground">{getLocalizedText('budgetAlertsDesc')}</p>
              </div>
              <Switch 
                id="budget-alerts" 
                checked={notifications.budgetAlerts}
                onCheckedChange={() => handleToggleNotification('budgetAlerts')}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between group p-2 rounded-md hover:bg-muted/30 transition-colors duration-200">
              <div>
                <Label htmlFor="payment-reminders" className="cursor-pointer">{getLocalizedText('paymentReminders')}</Label>
                <p className="text-xs text-muted-foreground">{getLocalizedText('paymentRemindersDesc')}</p>
              </div>
              <Switch 
                id="payment-reminders" 
                checked={notifications.paymentReminders}
                onCheckedChange={() => handleToggleNotification('paymentReminders')}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between group p-2 rounded-md hover:bg-muted/30 transition-colors duration-200">
              <div>
                <Label htmlFor="tips-suggestions" className="cursor-pointer">{getLocalizedText('tipsSuggestions')}</Label>
                <p className="text-xs text-muted-foreground">{getLocalizedText('tipsSuggestionsDesc')}</p>
              </div>
              <Switch 
                id="tips-suggestions" 
                checked={notifications.tipsSuggestions}
                onCheckedChange={() => handleToggleNotification('tipsSuggestions')} 
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>
        
        <Separator />

        {/* Email Notifications */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <Mail className="h-4 w-4 text-primary" />
            <Label htmlFor="email-notifications" className="font-medium">{getLocalizedText('emailNotifications')}</Label>
          </div>
          <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 transition-colors duration-200">
            <div>
              <p className="text-sm">{getLocalizedText('emailDesc')}</p>
              <p className="text-xs text-muted-foreground">{getLocalizedText('weeklySummary')}</p>
            </div>
            <Switch 
              id="email-notifications"
              checked={notifications.emailNotifications}
              onCheckedChange={() => handleToggleNotification('emailNotifications')}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
