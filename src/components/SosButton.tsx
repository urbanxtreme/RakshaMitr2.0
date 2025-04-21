
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SosButtonProps {
  onActivate: (location: { lat: number; lng: number }) => void;
}

const SosButton = ({ onActivate }: SosButtonProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePress = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setIsActive(true);
    
    try {
      // Get current location
      if (!navigator.geolocation) {
        toast({
          variant: "destructive",
          title: "Geolocation Error",
          description: "Your browser doesn't support location services."
        });
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // In a real app, this would send the alert
          onActivate({ lat: latitude, lng: longitude });
          
          toast({
            title: "SOS Alert Sent",
            description: "Your emergency contacts have been notified of your situation.",
          });
          
          // Reset after 3 seconds
          setTimeout(() => {
            setIsActive(false);
            setIsLoading(false);
          }, 3000);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Couldn't access your location. Please try again."
          });
          setIsActive(false);
          setIsLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } catch (error) {
      console.error("SOS error:", error);
      toast({
        variant: "destructive",
        title: "Alert Error",
        description: "Failed to send SOS. Please try again."
      });
      setIsActive(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {isActive && (
        <span className="absolute inset-0 rounded-full animate-pulse-ring bg-destructive opacity-70"></span>
      )}
      <Button
        variant="destructive"
        size="lg"
        disabled={isLoading}
        onClick={handlePress}
        className={`
          h-32 w-32 rounded-full text-lg font-bold shadow-lg
          transition-all duration-200
          ${isActive ? 'bg-red-700 scale-95' : 'hover-scale hover-glow'}
        `}
      >
        <AlertCircle className="mr-2 h-6 w-6" />
        {isActive ? "SENDING..." : "SOS"}
      </Button>
    </div>
  );
};

export default SosButton;
