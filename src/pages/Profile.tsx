
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    autoAlert: false,
  });
  
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    navigate("/login");
  };
  
  // For demo, get user from localStorage or use a default
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Jane Doe","email":"jane@example.com"}');

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
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
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
                    setSettings(prev => ({ ...prev, notifications: checked }));
                  }}
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
                    setSettings(prev => ({ ...prev, locationSharing: checked }));
                  }}
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
                    setSettings(prev => ({ ...prev, autoAlert: checked }));
                  }}
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
