import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const ROLES = {
  ADMIN: 'System Admin',
  MANAGER: 'Operations Manager',
  OFFICER: 'Field Officer',
  ANALYST: 'Analyst',
  VIEWER: 'Viewer'
};

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(ROLES.ADMIN); // Default for demo
  const [user, setUser] = useState({ name: 'Jane Doe', id: 'U-001' });

  // Global app settings
  const [settings, setSettings] = useState({
    theme: 'dark',
    notificationsEnabled: true,
    autoDispatch: false,
    mapStyle: 'satellite',
    refreshRate: '30',
  });

  // Permissions based on user requirements
  const canDispatch = [ROLES.ADMIN, ROLES.MANAGER].includes(role);
  const canEditResources = [ROLES.ADMIN, ROLES.MANAGER].includes(role);
  const canCreateIncident = [ROLES.ADMIN, ROLES.MANAGER, ROLES.OFFICER].includes(role);

  return (
    <AuthContext.Provider value={{ 
      role, setRole, user, 
      canDispatch, canEditResources, canCreateIncident,
      settings, setSettings
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
