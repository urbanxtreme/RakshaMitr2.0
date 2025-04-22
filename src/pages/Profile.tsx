
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BadgeHelp, LogOut, Shield, User } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    full_name?: string;
    email?: string;
  }>({});
  
  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    autoAlert: false,
  });

  // Fetch user profile data when component mounts
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
      fetchUserSettings(user.id);
    }
  }, [user?.id]);

  // Fetch user profile from the profiles table
  async function fetchUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (data) {
        setUserProfile({
          full_name: data.full_name,
          email: user?.email
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  // Fetch user settings from localStorage or create defaults
  // Note: In a real app, you would want to store these in the database
  // For now, we'll use localStorage as a simple solution
  async function fetchUserSettings(userId: string) {
    try {
      const savedSettings = localStorage.getItem(`user_settings_${userId}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      // If no settings found, use defaults (already set in state)
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  }

  // Save user settings to localStorage
  // In a production app, you would save to database instead
  async function saveSettings(newSettings: typeof settings) {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(newSettings));
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated."
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: "destructive",
        title: "Failed to save settings",
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  }
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen pb-20 p-4 bg-gradient-to-b from-white to-raksha-blue/10">
      <div className="max-w-md mx-auto pt-8">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings
          </p>
        </div>
        
        <div className="space-y-6">
          {/* User Info Card */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <User className="h-4 w-4 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{userProfile.full_name || 'Loading...'}</p>
                <p className="text-sm text-muted-foreground">{userProfile.email || user?.email || 'Loading...'}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Settings Card */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Safety Settings
              </CardTitle>
              <CardDescription>
                Configure your safety preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive updates about your safety alerts
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...settings, notifications: checked };
                    setSettings(newSettings);
                    saveSettings(newSettings);
                  }}
                  disabled={loading}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="location">Location Services</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow the app to access your location for SOS alerts
                  </p>
                </div>
                <Switch
                  id="location"
                  checked={settings.locationSharing}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...settings, locationSharing: checked };
                    setSettings(newSettings);
                    saveSettings(newSettings);
                  }}
                  disabled={loading}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autolert">Auto Alert (Beta)</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically send alerts if unusual activity is detected
                  </p>
                </div>
                <Switch
                  id="autoalert"
                  checked={settings.autoAlert}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...settings, autoAlert: checked };
                    setSettings(newSettings);
                    saveSettings(newSettings);
                  }}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Help Card */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BadgeHelp className="h-4 w-4 mr-2" />
                Help & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Privacy Policy
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Terms of Service
              </Button>
            </CardContent>
          </Card>
          
          {/* Logout Button */}
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 animate-fade-in"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
