import { useState, useEffect } from 'react';
import { AlertTriangle, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Incidents() {
  const { canCreateIncident } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Medical',
    priority: 'MEDIUM',
    lat: 40.7128,
    lng: -74.0060,
    required_skills: 'First Aid'
  });

  const fetchIncidents = () => {
    fetch('https://nexusops-ai-powered-operational.onrender.com/api/incidents')
      .then(res => res.json())
      .then(data => {
        setIncidents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch incidents", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://nexusops-ai-powered-operational.onrender.com/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchIncidents();
      }
    } catch (err) {
      console.error("Failed to create incident", err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={24} color="var(--status-error)" />
          Incidents
        </h1>
        {canCreateIncident && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Create Incident
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>ID</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>TYPE</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>PRIORITY</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>STATUS</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '16px', textAlign: 'center' }}>Loading...</td></tr>
            ) : incidents.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '16px', textAlign: 'center' }}>No incidents found.</td></tr>
            ) : (
              incidents.map(inc => (
                <tr key={inc.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>{inc.id}</td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>{inc.type}</td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge ${
                      inc.priority === 'CRITICAL' ? 'badge-error' : 
                      inc.priority === 'HIGH' ? 'badge-warning' : 
                      inc.priority === 'MEDIUM' ? 'badge-info' : 'badge-success'
                    }`}>
                      {inc.priority === 'CRITICAL' && <span style={{marginRight: '4px'}}>🔴</span>}
                      {inc.priority === 'HIGH' && <span style={{marginRight: '4px'}}>🟠</span>}
                      {inc.priority}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {inc.status}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={() => setSelectedIncident(inc)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px', padding: '24px', position: 'relative' }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Create New Incident</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
                >
                  <option value="Medical">Medical</option>
                  <option value="Fire">Fire</option>
                  <option value="Security">Security</option>
                  <option value="Traffic">Traffic</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Priority</label>
                <select 
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value})}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Latitude</label>
                <input 
                  type="number" step="any"
                  value={formData.lat}
                  onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Longitude</label>
                <input 
                  type="number" step="any"
                  value={formData.lng}
                  onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Required Skills (comma separated)</label>
                <input 
                  type="text"
                  value={formData.required_skills}
                  onChange={e => setFormData({...formData, required_skills: e.target.value})}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Incident Details Panel */}
      {selectedIncident && (
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px',
          background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-subtle)',
          boxShadow: '-4px 0 15px rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Incident {selectedIncident.id}</h2>
            <button 
              onClick={() => setSelectedIncident(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
          <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Type</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{selectedIncident.type}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Priority</div>
                <div style={{ fontSize: '14px', color: 'var(--status-error)', fontWeight: 600 }}>{selectedIncident.priority}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status</div>
                <div style={{ fontSize: '14px', color: 'var(--status-warning)', fontWeight: 600 }}>{selectedIncident.status}</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Coordinates</div>
              <div style={{ fontSize: '14px', fontFamily: 'var(--font-mono)' }}>{selectedIncident.lat}, {selectedIncident.lng}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Required Skills</div>
              <div style={{ fontSize: '14px' }}>{selectedIncident.required_skills}</div>
            </div>
            
            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Event Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ borderLeft: '2px solid var(--accent-primary)', paddingLeft: '12px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Today, 09:42</div>
                  <div style={{ fontSize: '13px' }}>Incident Created</div>
                </div>
                <div style={{ borderLeft: '2px solid var(--accent-primary)', paddingLeft: '12px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Today, 09:45</div>
                  <div style={{ fontSize: '13px' }}>AI Assessment Completed</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <button className="btn btn-primary" style={{ width: '100%' }}>Dispatch Resources</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Incidents;
