
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface LocationData {
  country: string;
  city?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  currency: string;
  timeZone?: string;
}

interface LocationContextType {
  currentLocation: LocationData | null;
  detectedLocation: LocationData | null;
  isDetecting: boolean;
  detectLocation: () => Promise<void>;
  setManualLocation: (location: LocationData) => void;
  clearLocation: () => void;
  popularLocations: LocationData[];
  getCostOfLivingIndex: (location: string) => number;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(() => {
    const saved = localStorage.getItem("currentLocation");
    return saved ? JSON.parse(saved) : null;
  });
  const [detectedLocation, setDetectedLocation] = useState<LocationData | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Save current location to localStorage
  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem("currentLocation", JSON.stringify(currentLocation));
      // We'll handle travel mode separately in components that use both contexts
    } else {
      localStorage.removeItem("currentLocation");
    }
  }, [currentLocation]);

  // Detect location using browser geolocation
  const detectLocation = async (): Promise<void> => {
    setIsDetecting(true);
    
    try {
      // This would typically call a geolocation API
      // For the demo, we'll simulate a location
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      const detected: LocationData = {
        country: "United States",
        city: "New York",
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        currency: "USD",
        timeZone: "America/New_York"
      };
      
      setDetectedLocation(detected);
      
      toast({
        title: "Location detected",
        description: `${detected.city}, ${detected.country}`
      });
    } catch (error) {
      toast({
        title: "Location detection failed",
        description: "Please enter your location manually",
        variant: "destructive"
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const setManualLocation = (location: LocationData) => {
    setCurrentLocation(location);
    
    toast({
      title: "Location updated",
      description: `Current location: ${location.city || location.country}`
    });
  };

  const clearLocation = () => {
    setCurrentLocation(null);
    
    toast({
      title: "Location cleared",
      description: "Travel mode disabled"
    });
  };

  // Get cost of living index for a location (1-10 scale, higher is more expensive)
  const getCostOfLivingIndex = (location: string): number => {
    const costIndexMap: Record<string, number> = {
      "New York": 9.5,
      "San Francisco": 9.8,
      "London": 8.9,
      "Tokyo": 8.6,
      "Sydney": 8.3,
      "Paris": 8.2,
      "Toronto": 7.8,
      "Berlin": 7.0,
      "Madrid": 6.5,
      "Bangkok": 5.0,
      "Mexico City": 5.2,
      "Mumbai": 4.3,
      "United States": 8.0,
      "United Kingdom": 7.7,
      "Japan": 7.8,
      "Australia": 7.9,
      "Canada": 7.5,
      "Germany": 7.2,
      "France": 7.6,
      "Italy": 7.0,
      "Spain": 6.8,
      "India": 4.0,
      "Thailand": 4.8,
      "Mexico": 5.0,
      "Brazil": 5.5
    };
    
    return costIndexMap[location] || 6.0; // Default value if not found
  };

  // Popular locations for cost estimation
  const popularLocations: LocationData[] = [
    { country: "United States", city: "New York", currency: "USD" },
    { country: "United States", city: "San Francisco", currency: "USD" },
    { country: "United Kingdom", city: "London", currency: "GBP" },
    { country: "Japan", city: "Tokyo", currency: "JPY" },
    { country: "Australia", city: "Sydney", currency: "AUD" },
    { country: "Canada", city: "Toronto", currency: "CAD" },
    { country: "France", city: "Paris", currency: "EUR" },
    { country: "Germany", city: "Berlin", currency: "EUR" },
    { country: "India", city: "Mumbai", currency: "INR" },
    { country: "Thailand", city: "Bangkok", currency: "THB" }
  ];

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        detectedLocation,
        isDetecting,
        detectLocation,
        setManualLocation,
        clearLocation,
        popularLocations,
        getCostOfLivingIndex
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
