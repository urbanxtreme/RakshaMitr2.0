
import { useState } from "react";
import SosLogCard, { SosLog } from "@/components/SosLogCard";
import { format } from "date-fns";

// Sample data for demo
const initialLogs: SosLog[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    location: { lat: 28.6139, lng: 77.2090 },
    status: "delivered",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    location: { lat: 28.5555, lng: 77.1855 },
    status: "delivered",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    location: { lat: 28.7041, lng: 77.1025 },
    status: "sent",
  },
];

const SosHistory = () => {
  const [logs] = useState<SosLog[]>(initialLogs);
  
  // Group logs by date
  const groupedLogs = logs.reduce((acc: Record<string, SosLog[]>, log) => {
    const dateStr = format(new Date(log.timestamp), "yyyy-MM-dd");
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(log);
    return acc;
  }, {});

  return (
    <div className="min-h-screen pb-20 p-4 bg-gradient-to-b from-white to-raksha-pink/10">
      <div className="max-w-md mx-auto pt-8">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">SOS History</h1>
          <p className="text-muted-foreground mt-1">
            Previous emergency alerts and their status
          </p>
        </div>
        
        {Object.keys(groupedLogs).length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground">No SOS alerts have been sent yet.</p>
          </div>
        ) : (
          Object.entries(groupedLogs).map(([dateStr, dayLogs]) => (
            <div key={dateStr} className="mb-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-2">
                {format(new Date(dateStr), "MMMM d, yyyy")}
              </h2>
              <div className="space-y-3">
                {dayLogs.map(log => (
                  <SosLogCard key={log.id} log={log} />
                ))}
              </div>
            </div>
          ))
        )}
        
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-border animate-fade-in">
          <h3 className="font-medium mb-2">About SOS History</h3>
          <p className="text-sm text-muted-foreground">
            This page shows a record of all SOS alerts you've sent. Each entry shows the time, 
            location, and delivery status of your emergency notifications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SosHistory;
