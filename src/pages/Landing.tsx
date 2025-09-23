import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger title animation
    const titleTimer = setTimeout(() => setShowTitle(true), 300);
    const contentTimer = setTimeout(() => setShowContent(true), 1500);
    
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const handleGetStarted = () => {
    navigate("/get-started");
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-warning rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-success rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="text-center z-10 px-6 max-w-4xl">
        {/* Animated Title */}
        <h1 
          className={`text-6xl md:text-8xl font-bold text-primary-foreground mb-8 transition-all duration-1000 ${
            showTitle ? 'animate-title-slide' : 'opacity-0 translate-y-8'
          }`}
        >
          AI Disaster
          <br />
          <span className="bg-gradient-accent bg-clip-text text-transparent">
            Management
          </span>
          <br />
          System
        </h1>

        {/* Content that appears after title */}
        <div className={`transition-all duration-800 ${showContent ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 leading-relaxed">
            Harness the power of AI to predict, assess, and respond to natural disasters
            with real-time mapping and community-driven reporting.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-accent transition-all duration-300 hover:scale-105 animate-pulse-glow"
            >
              Get Started
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/admin-login")}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              Admin Access
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;