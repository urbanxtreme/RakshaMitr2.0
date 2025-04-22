
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
          
          // First call onActivate to ensure local functionality works
          onActivate(location);
          
          // Check if user exists and has an id before proceeding
          if (!user || !user.id) {
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: "You must be logged in to send emergency alerts."
            });
            setIsActive(false);
            setIsLoading(false);
            return;
          }
          
          let alertSent = false;
          try {
            // Send SMS alerts via edge function with better error handling
            console.log("Calling edge function with location:", location);
            const { data, error } = await supabase.functions.invoke('send-sos-sms', {
              body: {
                location,
                userId: user.id
              }
            });

            console.log("Edge function response:", { data, error });

            // Handle errors from edge function directly
            if (error) {
              console.error("Edge function error:", error);
              toast({
                variant: "destructive",
                title: "Alert Error",
                description: error.message || "Failed to send emergency alerts"
              });
              return;
            }

            // Handle case when no contacts are found
            if (data.message === "No emergency contacts found") {
              toast({
                variant: "destructive",
                title: "No Contacts Found",
                description: "Please add emergency contacts before sending alerts."
              });
              return;
            }

            // Handle API failure with detailed error information
            if (!data.success) {
              console.error("API reported failure:", data);
              
              // Extract detailed error message if available
              let errorMessage = "Failed to send emergency alerts";
              
              if (data.detailedMessage) {
                errorMessage = data.detailedMessage;
              } else if (data.results && data.results.length > 0) {
                const failedResults = data.results.filter(result => !result.success);
                if (failedResults.length > 0 && failedResults[0].error) {
                  errorMessage = `SMS error: ${failedResults[0].error}`;
                }
              }
              
              toast({
                variant: "destructive",
                title: "Alert Error",
                description: errorMessage
              });
              return;
            }

            // Success case
            alertSent = true;
            toast({
              title: "SOS Alert Sent",
              description: "Emergency contacts have been notified with your location.",
            });
            
          } catch (error) {
            console.error("Error sending SOS alerts:", error);
            
            let errorMessage = error.message || "Failed to send emergency alerts. Please try again.";
            
            // Check if error has details about Twilio issues
            if (error.details && typeof error.details === 'string' && error.details.includes('Twilio')) {
              errorMessage = `SMS service error: ${errorMessage}`;
            }
            
            // Log detailed debug information
            console.log("Complete error context:", {
              errorObject: error,
              errorMessage
            });
            
            toast({
              variant: "destructive",
              title: "Alert Error",
              description: errorMessage
            });
          } finally {
            // If we didn't successfully send an alert, provide additional guidance
            if (!alertSent) {
              console.log("Alert was not successfully sent");
            }
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
