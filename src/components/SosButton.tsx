
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SosButtonProps {
  onActivate: (location: { lat: number; lng: number }) => void;
}

const SosButton = ({ onActivate }: SosButtonProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
        setIsActive(false);
        setIsLoading(false);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          const location = { lat, lng };
          
          try {
            // First call onActivate to ensure local functionality works
            onActivate(location);
            
            // Send SMS alerts via edge function with better error handling
            const { data, error } = await supabase.functions.invoke('send-sos-sms', {
              body: {
                location,
                userId: user?.id
              }
            });

            if (error) {
              console.error("Edge function error:", error);
              throw new Error(error.message || "Failed to send emergency alerts");
            }

            // Handle response from edge function
            if (!data.success) {
              if (data.message === "No emergency contacts found") {
                toast({
                  variant: "destructive",  // Changed from "warning" to "destructive"
                  title: "No Contacts Found",
                  description: "Please add emergency contacts before sending alerts."
                });
              } else {
                throw new Error(data.message || "Failed to send emergency alerts");
              }
            } else {
              toast({
                title: "SOS Alert Sent",
                description: "Emergency contacts have been notified with your location.",
              });
            }
            
          } catch (error) {
            console.error("Error sending SOS alerts:", error);
            toast({
              variant: "destructive",
              title: "Alert Error",
              description: error.message || "Failed to send emergency alerts. Please try again."
            });
          }
          
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
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
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
