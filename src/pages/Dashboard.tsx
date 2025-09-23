import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/Sidebar";
import { MapContainer } from "@/components/MapContainer";
import { Settings, Bell, User } from "lucide-react";
import { toast } from "sonner";

export type LayerType = 'prediction' | 'damage' | 'reports' | null;

const Dashboard = () => {
  const [activeLayer, setActiveLayer] = useState<LayerType>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Load user location from localStorage
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
    } else {
      // Default to a central location if no user location
      setUserLocation({ lat: 40.7128, lng: -74.0060 }); // NYC
    }
  }, []);

  const handleLayerChange = (layer: LayerType) => {
    setActiveLayer(layer);
    if (layer) {
      toast.success(`${layer.charAt(0).toUpperCase() + layer.slice(1)} layer activated`);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        activeLayer={activeLayer}
        onLayerChange={handleLayerChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-16'}`}>
        {/* Header */}
        <header className="bg-card border-b border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-primary">Disaster Management Dashboard</h1>
              {activeLayer && (
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  {activeLayer.charAt(0).toUpperCase() + activeLayer.slice(1)} Layer Active
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Map Area */}
        <main className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">3</div>
                <p className="text-xs text-muted-foreground">2 flood, 1 landslide</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Risk Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">Moderate</div>
                <p className="text-xs text-muted-foreground">Your area</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Reports Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">12</div>
                <p className="text-xs text-muted-foreground">Community submitted</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">8 min</div>
                <p className="text-xs text-muted-foreground">Average</p>
              </CardContent>
            </Card>
          </div>

          {/* Map Container */}
          <Card className="map-container border-primary/20 h-[600px]">
            <CardContent className="p-0 h-full">
              {userLocation && (
                <MapContainer 
                  center={userLocation}
                  activeLayer={activeLayer}
                />
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          {!activeLayer && (
            <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-transparent">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-accent mb-2">Getting Started</h3>
                <p className="text-muted-foreground mb-4">
                  Use the sidebar to activate different map layers and explore real-time disaster information:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• <strong>Prediction Layer:</strong> View AI-powered risk assessments and forecasts</li>
                  <li>• <strong>Damage Assessment:</strong> See real-time damage reports and affected areas</li>
                  <li>• <strong>Community Reports:</strong> Browse user-submitted reports and images</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;