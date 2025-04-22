
import { useState, useEffect } from "react";
import SosLogCard, { SosLog } from "@/components/SosLogCard";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const SosHistory = () => {
  const [logs, setLogs] = useState<SosLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.id) {
      fetchSosLogs(user.id);
    }
  }, [user?.id]);
  
  // Fetch user's SOS logs from database
  async function fetchSosLogs(userId: string) {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch from sos_alerts table (using the correct table name from schema)
      const { data, error } = await supabase
        .from('sos_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Map database records to SosLog format
      // Adjust field names to match actual database structure
      const formattedLogs: SosLog[] = (data?.map(log => {
        // Convert database status to one of our expected status types
        let mappedStatus: "sent" | "delivered" | "failed";
        
        if (!log.status || log.status === "sent") {
          mappedStatus = "sent";
        } else if (log.status === "delivered" || log.status === "success") {
          mappedStatus = "delivered";
        } else if (log.status === "failed" || log.status === "error") {
          mappedStatus = "failed";
        } else {
          mappedStatus = "sent"; // Default fallback
        }
        
        return {
          id: log.id,
          timestamp: new Date(log.created_at),
          location: {
            lat: log.latitude || 0,
            lng: log.longitude || 0
          },
          status: mappedStatus
        };
      }) || []);
      
      setLogs(formattedLogs);
    } catch (err) {
      console.error('Error fetching SOS logs:', err);
      setError('Failed to load SOS history. Please try again later.');
    } finally {
      setLoading(false);
    }
  }
  
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
        
        {loading ? (
          <div className="flex justify-center py-12 animate-fade-in">
            <Loader2 className="h-8 w-8 animate-spin text-raksha-blue" />
          </div>
        ) : error ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-red-500">{error}</p>
          </div>
        ) : Object.keys(groupedLogs).length === 0 ? (
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
