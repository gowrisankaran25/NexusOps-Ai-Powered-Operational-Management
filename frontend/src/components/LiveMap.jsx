import { useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import './LiveMap.css';

const socket = io('https://nexusops-ai-powered-operational.onrender.com');

// Initial Mock Data
const initialResources = [
  { id: 'R-001', name: 'Team Alpha', type: 'Personnel', status: 'Available', skills: 'Hazard Response', util: '32%', lat: 28.6128, lng: 77.2060, nearestInc: 'INC-1024', dist: '2.3 km', eta: '6 mins' },
  { id: 'V-018', name: 'Vehicle 18', type: 'Vehicle', status: 'Available', skills: 'Transport', util: '21%', lat: 28.6180, lng: 77.2100, nearestInc: 'INC-1025', dist: '4.1 km', eta: '12 mins' },
  { id: 'R-003', name: 'Team Charlie', type: 'Personnel', status: 'Maintenance', skills: 'Engineering', util: '--', lat: 28.6080, lng: 77.2150, nearestInc: 'N/A', dist: 'N/A', eta: 'N/A' },
  { id: 'R-002', name: 'Team Bravo', type: 'Personnel', status: 'Assigned', skills: 'Medical', util: '76%', lat: 28.6200, lng: 77.1950, nearestInc: 'INC-1025', dist: '1.2 km', eta: '3 mins' },
];

const mockIncidents = [
  { id: 'INC-1024', type: 'Equipment Failure', priority: 'CRITICAL', status: 'OPEN', lat: 28.6150, lng: 77.2000 },
  { id: 'INC-1025', type: 'System Failure', priority: 'HIGH', status: 'OPEN', lat: 28.6250, lng: 77.1900 },
];

const getStatusColor = (status, priority) => {
  if (priority === 'CRITICAL') return 'var(--status-error)';
  if (priority === 'HIGH') return 'var(--status-warning)';
  
  if (status === 'Available') return 'var(--status-success)';
  if (status === 'Assigned') return 'var(--status-info)';
  if (status === 'Maintenance') return 'var(--status-warning)';
  return 'var(--text-muted)';
};

function LiveMap() {
  const [resources, setResources] = useState(initialResources);
  const [popupInfo, setPopupInfo] = useState(null);
  
  useEffect(() => {
    const handleUpdate = (event) => {
      if (event.type === 'DISPATCH') {
        setResources(prev => prev.map(r => 
          r.id === event.resourceId ? { ...r, status: event.newStatus } : r
        ));
      }
    };
    socket.on('operation_update', handleUpdate);
    return () => socket.off('operation_update', handleUpdate);
  }, []);

  const { settings } = useAuth();

  // Define MapLibre style objects
  const styles = {
    'dark-matter': {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
          tileSize: 256,
          attribution: '&copy; CARTO'
        }
      },
      layers: [{ id: 'carto-dark-layer', type: 'raster', source: 'carto-dark', minzoom: 0, maxzoom: 22 }]
    },
    'streets': {
      version: 8,
      sources: {
        'osm': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors'
        }
      },
      layers: [{ id: 'osm-layer', type: 'raster', source: 'osm', minzoom: 0, maxzoom: 19 }]
    },
    'satellite': {
      version: 8,
      sources: {
        'esri-sat': {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          attribution: 'Tiles &copy; Esri'
        }
      },
      layers: [{ id: 'esri-sat-layer', type: 'raster', source: 'esri-sat', minzoom: 0, maxzoom: 19 }]
    }
  };

  const currentMapStyle = styles[settings?.mapStyle] || styles['dark-matter'];
  
  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
      <Map
        initialViewState={{
          longitude: 77.205,
          latitude: 28.615,
          zoom: 13.5,
          pitch: 60, // 3D Pitch
          bearing: -20 // Slight rotation for command center feel
        }}
        mapStyle={currentMapStyle}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="bottom-right" />

        {/* Resource Markers */}
        {resources.map(res => (
          <Marker 
            key={res.id} 
            longitude={res.lng} 
            latitude={res.lat} 
            anchor="center"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(res);
            }}
          >
            <div className="custom-div-icon" style={{
              backgroundColor: getStatusColor(res.status),
              width: '16px', height: '16px', borderRadius: '50%',
              border: '2px solid white',
              boxShadow: `0 0 12px ${getStatusColor(res.status)}`,
              cursor: 'pointer'
            }} />
          </Marker>
        ))}

        {/* Render Incidents */}
        {mockIncidents.map((inc) => (
          <Marker 
            key={inc.id} 
            longitude={inc.lng} 
            latitude={inc.lat} 
            anchor="center"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(inc);
            }}
          >
            <div className="custom-div-icon" style={{
              backgroundColor: getStatusColor(null, inc.priority),
              width: '18px', height: '18px', borderRadius: '50%',
              border: '2px solid white',
              boxShadow: `0 0 15px ${getStatusColor(null, inc.priority)}`,
              animation: 'pulse 2s infinite',
              cursor: 'pointer'
            }} />
          </Marker>
        ))}

        {/* Popups */}
        {popupInfo && (
          <Popup
            anchor="bottom"
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
            className="custom-popup"
            closeButton={false}
          >
            <div style={{ minWidth: '220px', padding: '4px' }}>
              <h3 style={{ margin: '0 0 8px 0', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', color: popupInfo.priority ? 'var(--status-error)' : 'var(--text-primary)' }}>
                {popupInfo.name || popupInfo.id}
              </h3>
              
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Status:</span> 
                  <span style={{ color: getStatusColor(popupInfo.status, popupInfo.priority) }}>
                    {popupInfo.status || popupInfo.priority}
                  </span>
                </div>
                
                {popupInfo.skills && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Skills:</span> <span>{popupInfo.skills}</span>
                  </div>
                )}
                
                {popupInfo.type && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Type:</span> <span>{popupInfo.type}</span>
                  </div>
                )}
              </div>
              
              <button className="btn btn-secondary" style={{ width: '100%', padding: '4px 8px', fontSize: '12px' }} onClick={() => setPopupInfo(null)}>
                Close Details
              </button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}

export default LiveMap;
