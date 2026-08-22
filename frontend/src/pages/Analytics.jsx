import { Activity, TrendingUp, Users, Clock, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const responseTimeData = [
  { name: 'Mon', time: 8.5 },
  { name: 'Tue', time: 7.2 },
  { name: 'Wed', time: 9.1 },
  { name: 'Thu', time: 6.8 },
  { name: 'Fri', time: 7.5 },
  { name: 'Sat', time: 10.2 },
  { name: 'Sun', time: 8.9 },
];

const utilizationData = [
  { name: 'North Zone', util: 85 },
  { name: 'South Zone', util: 72 },
  { name: 'East Zone', util: 94 },
  { name: 'West Zone', util: 65 },
  { name: 'Central', util: 88 },
];

function Analytics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={24} color="var(--accent-primary)" />
          Performance & Analytics
        </h1>
        <button className="btn btn-secondary">
          Export Report
        </button>
      </div>

      {/* Top Level KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
            <Activity size={24} color="var(--accent-primary)" />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '14px', marginBottom: '4px' }}>Resource Efficiency</div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>87%</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
            <CheckCircle2 size={24} color="var(--status-success)" />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '14px', marginBottom: '4px' }}>Incident Resolution</div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>94%</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px' }}>
            <Clock size={24} color="var(--status-warning)" />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '14px', marginBottom: '4px' }}>Avg Response Time</div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>7.2 min</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
            <Users size={24} color="var(--accent-primary)" />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '14px', marginBottom: '4px' }}>AI Match Rate</div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>91%</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Response Time Trends (Weekly)</h2>
          <div style={{ flex: 1, minHeight: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="time" stroke="var(--accent-primary)" strokeWidth={2} />
                <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}m`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--accent-primary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Resource Utilization by Zone</h2>
          <div style={{ flex: 1, minHeight: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--status-success)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="util" fill="var(--status-success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
