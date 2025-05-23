
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plane, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExpenses } from "@/context/ExpenseContext";
import { useLocation } from "@/context/LocationContext";
import { useEffect } from "react";

interface TravelModeAlertProps {
  location: {
    country: string;
    city?: string;
    currency: string;
  };
}

const TravelModeAlert = ({ location }: TravelModeAlertProps) => {
  const { currency, setCurrency, setTravelMode } = useExpenses();
  const { clearLocation } = useLocation();

  // Set travel mode when location changes
  useEffect(() => {
    setTravelMode(true, location.country);
  }, [location, setTravelMode]);

  return (
    <Alert className="mb-4 bg-primary/10 border-primary">
      <Plane className="h-4 w-4 text-primary" />
      <AlertTitle className="flex items-center">
        Travel Mode Active
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto h-6 w-6" 
          onClick={clearLocation}
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mt-1">
          <MapPin className="h-4 w-4" />
          <span>
            {location.city ? `${location.city}, ${location.country}` : location.country}
          </span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Currency set to {currency}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default TravelModeAlert;
