import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const GetStarted = () => {
  const [locationGranted, setLocationGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestLocation = async () => {
    setLoading(true);
    
    try {
      const permission = await navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationGranted(true);
          setLoading(false);
          toast.success("Location access granted successfully!");
          // Store coordinates for later use
          localStorage.setItem('userLocation', JSON.stringify({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
        },
        (error) => {
          setLoading(false);
          toast.error("Location access denied. You can still use the system with manual location selection.");
          console.error("Location error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } catch (error) {
      setLoading(false);
      toast.error("Location services not available in this browser.");
    }
  };

  const continueToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-map flex items-center justify-center p-6">

      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Welcome to ADMS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get real-time disaster predictions, damage assessments, and contribute to community safety
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Feature Cards */}
          <Card className="border-primary/20 shadow-lg hover:shadow-primary transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">AI Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Advanced ML models predict disaster risks in your area with high accuracy
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-lg hover:shadow-primary transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Damage Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Real-time mapping of affected areas and infrastructure damage
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-lg hover:shadow-primary transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Community Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Submit and view real-time reports from affected communities
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Location Access Section */}
        <Card className="max-w-2xl mx-auto shadow-accent border-accent/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Enable Location Services</CardTitle>
            <p className="text-muted-foreground">
              {locationGranted 
                ? "Great! Your location has been detected. You're ready to use the full system."
                : "We need your location to provide personalized disaster alerts and accurate risk assessments for your area."
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {!locationGranted ? (
              <Button
                onClick={requestLocation}
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg font-semibold rounded-xl shadow-accent transition-all duration-300 hover:scale-105"
              >
                <MapPin className="w-5 h-5 mr-2" />
                {loading ? "Requesting Location..." : "Grant Location Access"}
              </Button>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <MapPin className="w-8 h-8 text-success-foreground" />
                </div>
                <p className="text-success font-semibold">Location Access Granted!</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={continueToDashboard}
                className="flex-1 border-primary/30 text-primary hover:bg-primary/10 py-4"
              >
                {locationGranted ? "Continue to Dashboard" : "Skip for Now"}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center space-y-2">
              <p>• Your location data is kept secure and private</p>
              <p>• Used only for disaster predictions and alerts</p>
              <p>• You can disable this anytime in settings</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GetStarted;