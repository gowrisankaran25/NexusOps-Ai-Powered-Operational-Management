import { useState, useEffect } from 'react';
import { Users, Search, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Resources() {
  const { canEditResources } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Team',
    status: 'Available',
    lat: 40.7128,
    lng: -74.0060,
    skills: 'First Aid',
    utilization: 0
  });

  const fetchResources = () => {
    fetch('https://nexusops-ai-powered-operational.onrender.com/api/resources')
      .then(res => res.json())
      .then(data => {
        setResources(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch resources", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://nexusops-ai-powered-operational.onrender.com/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({
          name: '', type: 'Team', status: 'Available', lat: 40.7128, lng: -74.0060, skills: 'First Aid', utilization: 0
        });
        fetchResources();
      }
    } catch (err) {
      console.error("Failed to add resource", err);
    }
  };

  const filtered = resources.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={24} color="var(--accent-primary)" />
          Resources
        </h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search resources..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px 12px 8px 36px', 
                background: 'var(--bg-base)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '6px',
                color: 'var(--text-primary)'
              }} 
            />
          </div>
          {canEditResources && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Add Resource
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>ID</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>NAME</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>TYPE</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>STATUS</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>UTIL.</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '16px', textAlign: 'center' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '16px', textAlign: 'center' }}>No resources found.</td></tr>
            ) : (
              filtered.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>{r.id}</td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>{r.name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{r.type}</td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge ${
                      r.status === 'Available' ? 'badge-success' : 
                      r.status === 'Assigned' ? 'badge-info' : 
                      r.status === 'Maintenance' ? 'badge-warning' : 'badge-error'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {r.utilization > 0 ? `${r.utilization}%` : '--'}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={() => setSelectedResource(r)}>
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
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Add New Resource</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Name</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
                >
                  <option value="Team">Team</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Equipment">Equipment</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Latitude</label>
                  <input 
                    type="number" step="any" required
                    value={formData.lat}
                    onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})}
                    style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Longitude</label>
                  <input 
                    type="number" step="any" required
                    value={formData.lng}
                    onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})}
                    style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Skills (comma separated)</label>
                <input 
                  type="text" required
                  value={formData.skills}
                  onChange={e => setFormData({...formData, skills: e.target.value})}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Resource Details Panel */}
      {selectedResource && (
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px',
          background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-subtle)',
          boxShadow: '-4px 0 15px rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Resource Details</h2>
            <button 
              onClick={() => setSelectedResource(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
          <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Name</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{selectedResource.name} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>({selectedResource.id})</span></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Type</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedResource.type}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status</div>
                <div style={{ fontSize: '14px', color: selectedResource.status === 'Available' ? 'var(--status-success)' : 'var(--status-warning)', fontWeight: 600 }}>{selectedResource.status}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Utilization</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedResource.utilization}%</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Nearest Incident</div>
                <div style={{ fontSize: '14px', color: 'var(--accent-primary)', fontWeight: 600 }}>{selectedResource.nearestInc || 'N/A'}</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Coordinates</div>
              <div style={{ fontSize: '14px', fontFamily: 'var(--font-mono)' }}>{selectedResource.lat}, {selectedResource.lng}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Skills</div>
              <div style={{ fontSize: '14px' }}>{selectedResource.skills}</div>
            </div>
            
            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Recent Assignments</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ borderLeft: '2px solid var(--status-success)', paddingLeft: '12px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Yesterday</div>
                  <div style={{ fontSize: '13px' }}>Resolved INC-0992 (Medical)</div>
                </div>
                <div style={{ borderLeft: '2px solid var(--status-success)', paddingLeft: '12px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Oct 12</div>
                  <div style={{ fontSize: '13px' }}>Resolved INC-0985 (Fire)</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }}>Message</button>
            <button className="btn btn-primary" style={{ flex: 1 }} disabled={selectedResource.status !== 'Available'}>Deploy</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resources;
