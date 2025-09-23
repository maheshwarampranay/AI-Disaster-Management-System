import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayerType } from "@/pages/Dashboard";
import { 
  Brain, 
  AlertTriangle, 
  Users, 
  Menu, 
  X, 
  MapPin, 
  Camera,
  Shield,
  BarChart3,
  Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  activeLayer: LayerType;
  onLayerChange: (layer: LayerType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ activeLayer, onLayerChange, isOpen, onToggle }: SidebarProps) {
  const navigate = useNavigate();

  const layers = [
    {
      id: 'prediction' as LayerType,
      title: 'Prediction Layer',
      description: 'AI-powered risk assessments and disaster forecasts',
      icon: Brain,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      id: 'damage' as LayerType,
      title: 'Damage Assessment',
      description: 'Real-time damage reports and affected infrastructure',
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20'
    },
    {
      id: 'reports' as LayerType,
      title: 'Community Reports',
      description: 'User-submitted reports with photos and descriptions',
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen bg-card border-r border-border shadow-lg
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-80' : 'w-16'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              {isOpen && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="font-bold text-primary">ADMS</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="hover:bg-muted"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Quick Navigation */}
            {isOpen && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Navigation
                </h3>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => navigate("/")}
                  >
                    <Home className="w-4 h-4 mr-3" />
                    Home
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => navigate("/admin-login")}
                  >
                    <Shield className="w-4 h-4 mr-3" />
                    Admin Portal
                  </Button>
                </div>
              </div>
            )}

            {/* Map Layers */}
            <div className="space-y-3">
              {isOpen && (
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Map Layers
                  </h3>
                  {activeLayer && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLayerChange(null)}
                      className="text-xs hover:bg-muted"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {layers.map((layer) => {
                  const Icon = layer.icon;
                  const isActive = activeLayer === layer.id;
                  
                  return (
                    <Card
                      key={layer.id}
                      className={`
                        cursor-pointer transition-all duration-200 hover:shadow-md
                        ${isActive 
                          ? `${layer.borderColor} ${layer.bgColor} shadow-md` 
                          : 'border-border hover:border-primary/20'
                        }
                        ${!isOpen ? 'aspect-square' : ''}
                      `}
                      onClick={() => onLayerChange(isActive ? null : layer.id)}
                    >
                      <CardContent className={`p-3 ${!isOpen ? 'flex items-center justify-center' : ''}`}>
                        <div className={`flex items-start gap-3 ${!isOpen ? 'flex-col items-center' : ''}`}>
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                            ${isActive ? layer.bgColor : 'bg-muted'}
                          `}>
                            <Icon className={`w-5 h-5 ${isActive ? layer.color : 'text-muted-foreground'}`} />
                          </div>
                          
                          {isOpen && (
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className={`font-medium text-sm ${isActive ? layer.color : 'text-foreground'}`}>
                                  {layer.title}
                                </h4>
                                {isActive && (
                                  <Badge variant="secondary" className="text-xs">
                                    Active
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {layer.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            {isOpen && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-accent/20 text-accent hover:bg-accent/10"
                  >
                    <Camera className="w-4 h-4 mr-3" />
                    Submit Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <BarChart3 className="w-4 h-4 mr-3" />
                    View Analytics
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {isOpen && (
            <div className="p-4 border-t border-border">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>🟢 System Status: Online</p>
                <p>📡 Last Updated: Just now</p>
                <p>🌍 Monitoring: Global</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}