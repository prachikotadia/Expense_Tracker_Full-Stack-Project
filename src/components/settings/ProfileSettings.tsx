
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExpenses } from "@/context/ExpenseContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Camera, User } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const ProfileSettings = () => {
  const { profileData, updateProfileData, language } = useExpenses();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    phone: profileData.phone,
    birthdate: profileData.birthdate
  });
  const [date, setDate] = useState<Date | undefined>(
    profileData.birthdate ? new Date(profileData.birthdate) : undefined
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    const updatedData = {
      ...formData,
      birthdate: date ? format(date, 'yyyy-MM-dd') : profileData.birthdate
    };
    
    updateProfileData(updatedData);
    
    toast({
      title: language === 'en' ? "Profile Updated" : 
             language === 'es' ? "Perfil Actualizado" :
             language === 'hi' ? "प्रोफाइल अपडेट किया गया" :
             language === 'gu' ? "પ્રોફાઇલ અપડેટ કરવામાં આવી" :
             "Profile Updated",
      description: language === 'en' ? "Your profile information has been updated successfully" :
                  language === 'es' ? "Su información de perfil ha sido actualizada con éxito" :
                  language === 'hi' ? "आपकी प्रोफ़ाइल जानकारी सफलतापूर्वक अपडेट की गई है" :
                  language === 'gu' ? "તમારી પ્રોફાઇલ માહિતી સફળતાપૂર્વક અપડેટ કરવામાં આવી છે" :
                  "Your profile information has been updated successfully"
    });
  };

  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'profileTitle': {
        'en': 'Profile Information',
        'es': 'Información del Perfil',
        'hi': 'प्रोफ़ाइल जानकारी',
        'gu': 'પ્રોફાઇલ માહિતી'
      },
      'profileDesc': {
        'en': 'Update your personal information',
        'es': 'Actualice su información personal',
        'hi': 'अपनी व्यक्तिगत जानकारी अपडेट करें',
        'gu': 'તમારી વ્યક્તિગત માહિતી અપડેટ કરો'
      },
      'firstName': {
        'en': 'First Name',
        'es': 'Nombre',
        'hi': 'पहला नाम',
        'gu': 'પ્રથમ નામ'
      },
      'lastName': {
        'en': 'Last Name',
        'es': 'Apellido',
        'hi': 'उपनाम',
        'gu': 'અટક'
      },
      'email': {
        'en': 'Email Address',
        'es': 'Correo Electrónico',
        'hi': 'ईमेल पता',
        'gu': 'ઈમેલ સરનામું'
      },
      'phone': {
        'en': 'Phone Number',
        'es': 'Número de Teléfono',
        'hi': 'फ़ोन नंबर',
        'gu': 'ફોન નંબર'
      },
      'birthdate': {
        'en': 'Birthdate',
        'es': 'Fecha de Nacimiento',
        'hi': 'जन्म तिथि',
        'gu': 'જન્મ તારીખ'
      },
      'profilePhoto': {
        'en': 'Profile Photo',
        'es': 'Foto de Perfil',
        'hi': 'प्रोफाइल फोटो',
        'gu': 'પ્રોફાઇલ ફોટો'
      },
      'update': {
        'en': 'Update Profile',
        'es': 'Actualizar Perfil',
        'hi': 'प्रोफाइल अपडेट करें',
        'gu': 'પ્રોફાઇલ અપડેટ કરો'
      },
      'pickDate': {
        'en': 'Pick a date',
        'es': 'Elegir una fecha',
        'hi': 'एक तारीख़ चुनें',
        'gu': 'તારીખ પસંદ કરો'
      },
      'changePhoto': {
        'en': 'Change Photo',
        'es': 'Cambiar Foto',
        'hi': 'फोटो बदलें',
        'gu': 'ફોટો બદલો'
      }
    };

    return translations[key][language] || translations[key]['en'];
  };

  return (
    <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
        <div className="flex items-center">
          <User className="mr-2 h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-bold">{getLocalizedText('profileTitle')}</CardTitle>
        </div>
        <CardDescription>
          {getLocalizedText('profileDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Profile Photo */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden border-2 border-primary/20">
              {profileData.profileImage ? (
                <img 
                  src={profileData.profileImage} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-primary/60" />
              )}
            </div>
            <Button 
              size="icon" 
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 transition-all duration-300"
              onClick={() => toast({
                title: getLocalizedText('changePhoto'),
                description: language === 'en' ? "Profile photo upload coming soon" : "Feature coming soon"
              })}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h3 className="text-lg font-medium">{getLocalizedText('profilePhoto')}</h3>
            <p className="text-sm text-muted-foreground">JPEG, PNG or GIF, max 2MB</p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">{getLocalizedText('firstName')}</Label>
            <Input 
              id="firstName" 
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">{getLocalizedText('lastName')}</Label>
            <Input 
              id="lastName" 
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{getLocalizedText('email')}</Label>
            <Input 
              id="email" 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">{getLocalizedText('phone')}</Label>
            <Input 
              id="phone" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthdate">{getLocalizedText('birthdate')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal hover:bg-primary/10 transition-all duration-300"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : getLocalizedText('pickDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSaveProfile}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
          >
            {getLocalizedText('update')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
