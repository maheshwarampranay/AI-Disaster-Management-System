import { useEffect, useRef } from "react";
import { LayerType } from "@/pages/Dashboard";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapContainerProps {
  center: { lat: number; lng: number };
  activeLayer: LayerType;
}

export function MapContainer({ center, activeLayer }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{ [key: string]: L.LayerGroup }>({});

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([center.lat, center.lng], 13);

    // Add base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create layer groups
    layersRef.current = {
      prediction: L.layerGroup(),
      damage: L.layerGroup(),
      reports: L.layerGroup()
    };

    // Add sample data for each layer
    addPredictionData(layersRef.current.prediction, center);
    addDamageData(layersRef.current.damage, center);
    addReportsData(layersRef.current.reports, center);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove all layers first
    Object.values(layersRef.current).forEach(layer => {
      mapInstanceRef.current!.removeLayer(layer);
    });

    // Add active layer if any
    if (activeLayer && layersRef.current[activeLayer]) {
      mapInstanceRef.current.addLayer(layersRef.current[activeLayer]);
    }
  }, [activeLayer]);

  // Update map center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng], 13);
    }
  }, [center]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-xl"
      style={{ minHeight: '400px' }}
    />
  );
}

// Sample data generators
function addPredictionData(layer: L.LayerGroup, center: { lat: number; lng: number }) {
  // High risk area (red)
  const highRiskArea = L.circle([center.lat + 0.01, center.lng + 0.01], {
    color: '#ef4444',
    fillColor: '#ef4444',
    fillOpacity: 0.3,
    radius: 500
  }).bindPopup(`
    <div class="p-2">
      <h3 class="font-bold text-red-600">High Risk Area</h3>
      <p class="text-sm">Flood probability: 85%</p>
      <p class="text-sm">Predicted impact: Severe</p>
      <p class="text-sm">Time window: Next 6 hours</p>
    </div>
  `);

  // Medium risk area (yellow)
  const mediumRiskArea = L.circle([center.lat - 0.015, center.lng + 0.02], {
    color: '#eab308',
    fillColor: '#eab308',
    fillOpacity: 0.2,
    radius: 800
  }).bindPopup(`
    <div class="p-2">
      <h3 class="font-bold text-yellow-600">Medium Risk Area</h3>
      <p class="text-sm">Landslide probability: 45%</p>
      <p class="text-sm">Predicted impact: Moderate</p>
      <p class="text-sm">Time window: Next 12 hours</p>
    </div>
  `);

  layer.addLayer(highRiskArea);
  layer.addLayer(mediumRiskArea);
}

function addDamageData(layer: L.LayerGroup, center: { lat: number; lng: number }) {
  // Damaged infrastructure markers
  const damages = [
    {
      pos: [center.lat + 0.005, center.lng - 0.01],
      type: 'Bridge Damage',
      severity: 'Critical',
      color: '#dc2626'
    },
    {
      pos: [center.lat - 0.01, center.lng - 0.005],
      type: 'Road Blockage',
      severity: 'Major',
      color: '#ea580c'
    },
    {
      pos: [center.lat + 0.02, center.lng + 0.015],
      type: 'Building Collapse',
      severity: 'Critical',
      color: '#dc2626'
    }
  ];

  damages.forEach(damage => {
    const marker = L.marker([damage.pos[0], damage.pos[1]] as [number, number], {
      icon: L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background-color: ${damage.color}; 
            width: 20px; 
            height: 20px; 
            border-radius: 50%; 
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
    }).bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-red-600">${damage.type}</h3>
        <p class="text-sm">Severity: ${damage.severity}</p>
        <p class="text-sm">Status: Under Assessment</p>
        <p class="text-sm">Reported: 2 hours ago</p>
      </div>
    `);

    layer.addLayer(marker);
  });
}

function addReportsData(layer: L.LayerGroup, center: { lat: number; lng: number }) {
  // Community reports
  const reports = [
    {
      pos: [center.lat + 0.008, center.lng + 0.005],
      title: 'Flooding on Main Street',
      reporter: 'Sarah M.',
      time: '15 min ago'
    },
    {
      pos: [center.lat - 0.012, center.lng + 0.018],
      title: 'Fallen Tree Blocking Road',
      reporter: 'John D.',
      time: '32 min ago'
    },
    {
      pos: [center.lat + 0.015, center.lng - 0.008],
      title: 'Power Lines Down',
      reporter: 'Emergency Team',
      time: '1 hour ago'
    }
  ];

  reports.forEach(report => {
    const marker = L.marker([report.pos[0], report.pos[1]] as [number, number], {
      icon: L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background-color: #a27b5c; 
            width: 16px; 
            height: 16px; 
            border-radius: 50%; 
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })
    }).bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-amber-600">${report.title}</h3>
        <p class="text-sm">Reporter: ${report.reporter}</p>
        <p class="text-sm">Time: ${report.time}</p>
        <div class="mt-2 pt-2 border-t">
          <button class="text-xs bg-blue-500 text-white px-2 py-1 rounded mr-1">Verify</button>
          <button class="text-xs bg-green-500 text-white px-2 py-1 rounded">Mark Solved</button>
        </div>
      </div>
    `);

    layer.addLayer(marker);
  });
}