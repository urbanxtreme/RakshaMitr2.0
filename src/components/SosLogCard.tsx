
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Clock, CheckCircle, XCircle } from "lucide-react";

export interface SosLog {
  id: string;
  timestamp: Date;
  location: {
    lat: number;
    lng: number;
  };
  status: "sent" | "delivered" | "failed";
}

interface SosLogCardProps {
  log: SosLog;
}

const SosLogCard = ({ log }: SosLogCardProps) => {
  const getStatusIcon = () => {
    switch (log.status) {
      case "sent":
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (log.status) {
      case "sent":
        return "Alert Sent";
      case "delivered":
        return "Alert Delivered";
      case "failed":
        return "Alert Failed";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="overflow-hidden hover-scale animate-fade-in">
      <CardHeader className="bg-raksha-blue bg-opacity-30 p-3 flex flex-row justify-between items-center">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {format(new Date(log.timestamp), "MMM d, yyyy - h:mm a")}
          </span>
        </div>
        <div className="flex items-center">
          {getStatusIcon()}
          <span className="ml-1 text-sm">{getStatusText()}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-3">
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2 text-raksha-purple" />
          <span>
            {log.location.lat.toFixed(6)}, {log.location.lng.toFixed(6)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SosLogCard;
