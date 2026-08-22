import { Search, Bell, Settings } from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://nexusops-ai-powered-operational.onrender.com');

function Topbar() {
  const { role, setRole, user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    socket.on('system_alert', (event) => {
      setAlerts(prev => [event, ...prev]);
    });
    return () => socket.off('system_alert');
  }, []);

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 32px',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '400px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search resources, incidents, teams..." 
            style={{ 
              width: '100%', 
              padding: '10px 16px 10px 40px', 
              background: 'var(--bg-base)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '14px'
            }} 
          />
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Bell size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} onClick={() => setShowDropdown(!showDropdown)} />
          {alerts.length > 0 && (
            <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--status-error)', color: 'white', fontSize: '10px', width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {alerts.length}
            </div>
          )}
          {showDropdown && alerts.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '12px',
              width: '320px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 16px', background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', fontWeight: 600 }}>System Alerts</div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {alerts.map((alert, idx) => (
                  <div key={idx} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--status-error)', fontWeight: 600, marginBottom: '4px' }}>🔴 {alert.priority}</div>
                    <div style={{ fontSize: '13px' }}>{alert.message}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{new Date(alert.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Settings size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '24px', borderLeft: '1px solid var(--border-subtle)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{user.name}</div>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ 
                fontSize: '12px', 
                color: 'var(--accent-primary)', 
                background: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                padding: 0
              }}
            >
              {Object.values(ROLES).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
