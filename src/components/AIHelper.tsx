
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, LightbulbIcon, RefreshCw, X } from "lucide-react";
import { useExpenses } from "@/context/ExpenseContext";

interface Tip {
  id: number;
  title: string;
  description: string;
  translations: {
    es: { title: string; description: string };
    hi: { title: string; description: string };
    gu: { title: string; description: string };
  };
}

const financialTips: Tip[] = [
  {
    id: 1,
    title: "Follow the 50/30/20 Rule",
    description: "Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.",
    translations: {
      es: {
        title: "Sigue la regla 50/30/20",
        description: "Asigna el 50% de tus ingresos a necesidades, el 30% a deseos y el 20% a ahorros y pago de deudas."
      },
      hi: {
        title: "50/30/20 नियम का पालन करें",
        description: "अपनी आय का 50% जरूरतों, 30% चाहतों और 20% बचत और ऋण चुकाने के लिए आवंटित करें।"
      },
      gu: {
        title: "50/30/20 નિયમનું પાલન કરો",
        description: "તમારી આવકનો 50% જરૂરિયાતો માટે, 30% ઇચ્છાઓ માટે અને 20% બચત અને દેવાની ચુકવણી માટે ફાળવો."
      }
    }
  },
  {
    id: 2,
    title: "Create a Monthly Budget",
    description: "Track your spending and create a monthly budget to help manage your finances more effectively.",
    translations: {
      es: {
        title: "Crea un presupuesto mensual",
        description: "Rastrea tus gastos y crea un presupuesto mensual para ayudar a administrar tus finanzas de manera más efectiva."
      },
      hi: {
        title: "एक मासिक बजट बनाएं",
        description: "अपने खर्चों पर नज़र रखें और अपने वित्त को अधिक प्रभावी ढंग से प्रबंधित करने में मदद के लिए एक मासिक बजट बनाएं।"
      },
      gu: {
        title: "માસિક બજેટ બનાવો",
        description: "તમારા ખર્ચને ટ્રેક કરો અને તમારા નાણાંનું વધુ અસરકારક રીતે સંચાલન કરવામાં મદદ કરવા માટે માસિક બજેટ બનાવો."
      }
    }
  },
  {
    id: 3,
    title: "Build an Emergency Fund",
    description: "Aim to save 3-6 months of living expenses for unexpected emergencies or financial setbacks.",
    translations: {
      es: {
        title: "Construye un fondo de emergencia",
        description: "Intenta ahorrar de 3 a 6 meses de gastos de subsistencia para emergencias inesperadas o contratiempos financieros."
      },
      hi: {
        title: "आपातकालीन कोष बनाएं",
        description: "अप्रत्याशित आपात स्थिति या वित्तीय झटके के लिए 3-6 महीने के जीवन यापन खर्च बचाने का लक्ष्य रखें।"
      },
      gu: {
        title: "ઇમરજન્સી ફંડ બનાવો",
        description: "અણધારી કટોકટી અથવા નાણાકીય પડકારો માટે 3-6 મહિનાના રહેઠાણ ખર્ચની બચત કરવાનો લક્ષ્ય રાખો."
      }
    }
  },
  {
    id: 4,
    title: "Automate Your Savings",
    description: "Set up automatic transfers to your savings account on payday to make saving effortless.",
    translations: {
      es: {
        title: "Automatiza tus ahorros",
        description: "Configura transferencias automáticas a tu cuenta de ahorros en el día de pago para facilitar el ahorro."
      },
      hi: {
        title: "अपनी बचत को स्वचालित करें",
        description: "बचत को आसान बनाने के लिए वेतन दिवस पर अपने बचत खाते में स्वचालित स्थानांतरण सेट करें।"
      },
      gu: {
        title: "તમારી બચતને ઓટોમેટ કરો",
        description: "બચત કરવાનું સરળ બનાવવા માટે પગારના દિવસે તમારા બચત ખાતામાં ઑટોમેટિક ટ્રાન્સફર સેટ કરો."
      }
    }
  },
  {
    id: 5,
    title: "Review Recurring Subscriptions",
    description: "Regularly review and cancel unused subscriptions to avoid wasting money on services you don't use.",
    translations: {
      es: {
        title: "Revisa suscripciones recurrentes",
        description: "Revisa y cancela regularmente las suscripciones no utilizadas para evitar desperdiciar dinero en servicios que no usas."
      },
      hi: {
        title: "आवर्ती सदस्यता की समीक्षा करें",
        description: "उन सेवाओं पर पैसा बर्बाद करने से बचने के लिए नियमित रूप से अप्रयुक्त सदस्यताओं की समीक्षा करें और उन्हें रद्द करें जिनका आप उपयोग नहीं करते हैं।"
      },
      gu: {
        title: "રિકરિંગ સબ્સ્ક્રિપ્શન્સની સમીક્ષા કરો",
        description: "તમે ઉપયોગ નથી કરતા તેવી સેવાઓ પર પૈસા બગાડવાથી બચવા માટે નિયમિતપણે વણવપરાયેલા સબ્સ્ક્રિપ્શન્સની સમીક્ષા કરો અને રદ કરો."
      }
    }
  },
  {
    id: 6,
    title: "Use the 24-Hour Rule",
    description: "Wait 24 hours before making non-essential purchases over a certain amount to avoid impulse spending.",
    translations: {
      es: {
        title: "Usa la regla de 24 horas",
        description: "Espera 24 horas antes de realizar compras no esenciales que superen cierta cantidad para evitar gastos impulsivos."
      },
      hi: {
        title: "24-घंटे के नियम का उपयोग करें",
        description: "आवेशपूर्ण खर्च से बचने के लिए एक निश्चित राशि से अधिक की गैर-जरूरी खरीद करने से पहले 24 घंटे प्रतीक्षा करें।"
      },
      gu: {
        title: "24-કલાકના નિયમનો ઉપયોગ કરો",
        description: "આવેગી ખર્ચને ટાળવા માટે ચોક્કસ રકમ કરતાં વધુની બિન-જરૂરી ખરીદીઓ કરતા પહેલા 24 કલાક રાહ જુઓ."
      }
    }
  }
];

const AIHelper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { language } = useExpenses();

  useEffect(() => {
    // Show a random tip when first opened
    if (isOpen && !currentTip) {
      getRandomTip();
    }
  }, [isOpen, currentTip]);

  const getRandomTip = () => {
    setIsAnimating(true);
    const randomIndex = Math.floor(Math.random() * financialTips.length);
    
    // Simulate AI thinking
    setTimeout(() => {
      setCurrentTip(financialTips[randomIndex]);
      setIsAnimating(false);
    }, 1500);
  };

  const getTipContent = (tip: Tip) => {
    if (language === 'es') return tip.translations.es;
    if (language === 'hi') return tip.translations.hi;
    if (language === 'gu') return tip.translations.gu;
    return { title: tip.title, description: tip.description };
  };

  return (
    <>
      {/* Floating button */}
      <Button 
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <BrainCircuit className="h-6 w-6" />
        )}
      </Button>
      
      {/* AI Helper Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 transition-all duration-300 animate-fade-in">
          <Card className="border-border/40 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/80 to-primary text-white p-4">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="h-5 w-5" />
                  <span>
                    {language === 'en' ? "AI Financial Assistant" :
                     language === 'es' ? "Asistente Financiero IA" :
                     language === 'hi' ? "AI वित्तीय सहायक" :
                     language === 'gu' ? "AI નાણાકીય સહાયક" :
                     "AI Financial Assistant"}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 min-h-[280px] flex flex-col justify-between">
              {isAnimating ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-muted-foreground">
                    {language === 'en' ? "Thinking..." :
                     language === 'es' ? "Pensando..." :
                     language === 'hi' ? "विचार कर रहा है..." :
                     language === 'gu' ? "વિચારી રહ્યું છે..." :
                     "Thinking..."}
                  </p>
                </div>
              ) : currentTip ? (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 rounded-full p-2 mt-1">
                      <LightbulbIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{getTipContent(currentTip).title}</h3>
                      <p className="text-muted-foreground">{getTipContent(currentTip).description}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  {language === 'en' ? "No tips available" :
                   language === 'es' ? "No hay consejos disponibles" :
                   language === 'hi' ? "कोई सुझाव उपलब्ध नहीं है" :
                   language === 'gu' ? "કોઈ ટિપ્સ ઉપલબ્ધ નથી" :
                   "No tips available"}
                </div>
              )}
              
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={getRandomTip} 
                  variant="outline" 
                  className="hover:bg-primary/10 transition-all duration-300"
                  disabled={isAnimating}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isAnimating ? 'animate-spin' : ''}`} />
                  {language === 'en' ? "Another Tip" :
                   language === 'es' ? "Otro Consejo" :
                   language === 'hi' ? "एक और सुझाव" :
                   language === 'gu' ? "બીજી ટિપ" :
                   "Another Tip"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default AIHelper;
