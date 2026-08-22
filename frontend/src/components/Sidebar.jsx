import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, AlertTriangle, Map, BrainCircuit, Activity, FileText, Settings } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/resources', icon: Users, label: 'Resources' },
  { path: '/incidents', icon: AlertTriangle, label: 'Incidents' },
  { path: '/analytics', icon: Activity, label: 'Analytics' },
  { path: '/reports', icon: FileText, label: 'Reports' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', background: 'var(--accent-primary)', borderRadius: '2px' }}></div>
          NEXUSOPS
        </h1>
      </div>
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '6px',
                color: isActive ? 'white' : 'var(--text-secondary)',
                background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 500 : 400,
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
              })}
            >
              <Icon size={18} color={/*isActive ? 'var(--accent-primary)' : 'currentColor'*/ 'currentColor'} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
        <NavLink
          to="/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
