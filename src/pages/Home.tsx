
import { useState } from "react";
import SosButton from "@/components/SosButton";
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const [lastSosTime, setLastSosTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleSosActivate = (location: { lat: number; lng: number }) => {
    // In real app, this would send API request to backend
    console.log("SOS activated at location:", location);
    setLastSosTime(new Date());
    
    // Simulated API call
    setTimeout(() => {
      toast({
        title: "SOS Alert Sent Successfully",
        description: "Your emergency contacts have been notified with your current location.",
      });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen pb-16 px-4 flex flex-col bg-gradient-to-b from-white to-raksha-pink/10">
      {/* Header */}
      <div className="text-center pt-8 pb-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-raksha-dark">RakshaMitr</h1>
        <p className="text-muted-foreground mt-2">Your personal safety companion</p>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center gap-8">
        {/* SOS Button */}
        <div className="animate-fade-in text-center">
          <p className="mb-6 text-sm text-muted-foreground">Press the button below in case of emergency</p>
          <SosButton onActivate={handleSosActivate} />
          
          {lastSosTime && (
            <p className="mt-4 text-xs text-muted-foreground animate-fade-in">
              Last alert sent: {lastSosTime.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        {/* Safety Tips */}
        <div className="mt-12 w-full max-w-md animate-slide-up">
          <h2 className="text-lg font-semibold mb-3 text-center">Safety Tips</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <ul className="space-y-2 text-sm">
              <li className="pl-4 border-l-2 border-raksha-purple">Stay in well-lit areas when walking at night</li>
              <li className="pl-4 border-l-2 border-raksha-purple">Share your live location with friends when traveling</li>
              <li className="pl-4 border-l-2 border-raksha-purple">Keep emergency contacts updated</li>
              <li className="pl-4 border-l-2 border-raksha-purple">Trust your instincts in uncomfortable situations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
