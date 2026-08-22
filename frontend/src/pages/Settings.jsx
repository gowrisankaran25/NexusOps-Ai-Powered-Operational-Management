import { Settings as SettingsIcon, Save, Monitor, Bell, Map, Activity, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Settings() {
  const { settings, setSettings } = useAuth();

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate save to backend
    alert('Settings saved successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SettingsIcon size={28} color="var(--accent-primary)" />
          System Settings
        </h1>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Monitor size={18} color="var(--text-secondary)" /> Appearance & View
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', alignItems: 'center', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, display: 'block' }}>Theme</label>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Select the application color scheme</span>
              </div>
              <select 
                value={settings.theme}
                onChange={e => setSettings({...settings, theme: e.target.value})}
                style={{ width: '100%', maxWidth: '300px', padding: '10px 12px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', cursor: 'pointer' }}
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
                <option value="system">System Default</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', alignItems: 'center', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, display: 'block' }}>Map Style</label>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Base layer for the Situational Map</span>
              </div>
              <select 
                value={settings.mapStyle}
                onChange={e => setSettings({...settings, mapStyle: e.target.value})}
                style={{ width: '100%', maxWidth: '300px', padding: '10px 12px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', cursor: 'pointer' }}
              >
                <option value="dark-matter">Dark Matter (Default)</option>
                <option value="satellite">Satellite</option>
                <option value="streets">Streets</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--text-secondary)" /> Automation & Data
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', alignItems: 'center', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, display: 'block' }}>Data Refresh Rate</label>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>How often metrics auto-update</span>
              </div>
              <select 
                value={settings.refreshRate}
                onChange={e => setSettings({...settings, refreshRate: e.target.value})}
                style={{ width: '100%', maxWidth: '300px', padding: '10px 12px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', cursor: 'pointer' }}
              >
                <option value="15">Every 15 Seconds</option>
                <option value="30">Every 30 Seconds</option>
                <option value="60">Every 1 Minute</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bell size={14} /> Desktop Notifications
                </label>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Alerts for critical incidents</span>
              </div>
              <label className="switch" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={settings.notificationsEnabled}
                  onChange={e => setSettings({...settings, notificationsEnabled: e.target.checked})}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: settings.notificationsEnabled ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {settings.notificationsEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} /> AI Auto-Dispatch
                </label>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>For LOW priority incidents</span>
              </div>
              <label className="switch" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={settings.autoDispatch}
                  onChange={e => setSettings({...settings, autoDispatch: e.target.checked})}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: settings.autoDispatch ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {settings.autoDispatch ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: 600 }}>
              <Save size={18} /> Save Settings
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default Settings;
