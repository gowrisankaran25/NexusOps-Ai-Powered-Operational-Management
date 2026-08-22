import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Incidents from './pages/Incidents';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css'; // You can delete App.css later or keep it empty

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            {/* Add more routes here */}
            <Route path="*" element={
              <div className="card">
                <h2>Page Not Found</h2>
                <p className="text-muted">The requested page is under construction or does not exist.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App;
