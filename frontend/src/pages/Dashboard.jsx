import { MapPin, AlertTriangle, Zap, CheckCircle2, Navigation, Send, Users, BrainCircuit, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import LiveMap from '../components/LiveMap';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const socket = io('https://nexusops-ai-powered-operational.onrender.com');

function Dashboard() {
  const { canDispatch } = useAuth();
  const [chatInput, setChatInput] = useState('');
  const [summary, setSummary] = useState({
    activeOperations: 0,
    availableResources: 0,
    utilization: 0,
    criticalAlerts: 0
  });
  const [loading, setLoading] = useState(true);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [optimizationPlan, setOptimizationPlan] = useState(null);
  const [isScoring, setIsScoring] = useState(false);
  const [timeline, setTimeline] = useState([
    { time: '09:42', msg: '🚨 Incident INC-1024 created' },
  ]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleChatSubmit = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', content: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "I'm sorry, I don't understand that command.";
      const lowerInput = userMsg.content.toLowerCase();
      
      if (lowerInput.includes('status') || lowerInput.includes('summary')) {
        aiResponse = `System is operating at ${summary.utilization}% utilization. There are ${summary.activeOperations} active operations and ${summary.availableResources} resources available.`;
      } else if (lowerInput.includes('critical')) {
        aiResponse = `There are currently ${summary.criticalAlerts} critical alerts. INC-1024 (Equipment Failure) requires immediate attention.`;
      } else if (lowerInput.includes('team alpha')) {
        aiResponse = `Team Alpha is currently Available. They are 2.3 km away from the nearest incident (INC-1024).`;
      }

      setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  const fetchOptimization = async () => {
    setIsScoring(true);
    try {
      const res = await fetch('https://nexusops-ai-powered-operational.onrender.com/api/ai/optimize', { method: 'POST' });
      const data = await res.json();
      setOptimizationPlan(data);
      setAiRecommendation(null);
    } catch (err) {
      console.error(err);
    }
    setIsScoring(false);
  };

  useEffect(() => {
    socket.on('operation_update', (event) => {
      // Update summary KPI
      if (event.metrics) {
        setSummary(event.metrics);
      }
      // Add to timeline
      const timeStr = new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      setTimeline(prev => [...prev, { time: timeStr, msg: `✓ ${event.message}` }]);
    });
    
    return () => socket.off('operation_update');
  }, []);

  const fetchAiRecommendation = async () => {
    setIsScoring(true);
    try {
      const res = await fetch('https://nexusops-ai-powered-operational.onrender.com/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId: 'INC-1024' })
      });
      const data = await res.json();
      if (data.recommendations && data.recommendations.length > 0) {
        setAiRecommendation(data.recommendations[0]); // Pick the top recommended resource
      }
    } catch (err) {
      console.error("AI engine failure", err);
    }
    setIsScoring(false);
  };

  useEffect(() => {
    fetch('https://nexusops-ai-powered-operational.onrender.com/api/dashboard/summary')
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard summary", err);
        setLoading(false);
      });
  }, []);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
            <Navigation size={24} color="var(--status-info)" />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '14px', marginBottom: '4px' }}>Active Operations</div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>{loading ? '...' : summary.activeOperations}</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
            <Users size={24} color="var(--accent-primary)" />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '14px', marginBottom: '4px' }}>Available Resources</div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>{loading ? '...' : summary.availableResources}</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
            <Zap size={24} color="var(--status-success)" />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '14px', marginBottom: '4px' }}>System Utilization</div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>{loading ? '...' : summary.utilization}%</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
            <AlertTriangle size={24} color="var(--status-error)" />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '14px', marginBottom: '4px' }}>Critical Alerts</div>
            <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--status-error)' }}>{loading ? '...' : String(summary.criticalAlerts).padStart(2, '0')}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Live Map Placeholder */}
        <div className="card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--text-secondary)" />
              Live Operational Map
            </h2>
            <div className="badge badge-success">Live Updates Active</div>
          </div>
          <div style={{ 
            flex: 1, 
            background: 'var(--bg-base)', 
            borderRadius: '8px', 
            minHeight: '400px',
            border: '1px solid var(--border-subtle)',
            position: 'relative'
          }}>
            <LiveMap />
          </div>
        </div>

        {/* AI Insights & Assistant */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* AI Insights */}
          <div className="card">
            <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Zap size={18} color="var(--accent-primary)" />
              AI Insights
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-base)', borderRadius: '8px', borderLeft: '3px solid var(--status-warning)' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--status-warning)', marginBottom: '4px' }}>Resource Shortage Predicted</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Vehicle availability predicted to fall below 30% in Zone 3 within 4 hours.</div>
              </div>
              <div style={{ padding: '12px', background: 'var(--bg-base)', borderRadius: '8px', borderLeft: '3px solid var(--status-success)' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--status-success)', marginBottom: '4px' }}>Allocation Optimized</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Successfully re-routed Team C to handle Incident #892. Saved 12 mins.</div>
              </div>
            </div>
          </div>

          {/* AI Command Assistant / Decision Support */}
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <BrainCircuit size={18} color="var(--accent-primary)" />
              AI Decision Support
            </h2>
            <div style={{ flex: 1, background: 'var(--bg-base)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px', overflowY: 'auto' }}>
              
              {!aiRecommendation && !optimizationPlan ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                  <BrainCircuit size={32} style={{ opacity: 0.5 }} />
                  <p style={{ fontSize: '13px' }}>Analyze an incident to get AI recommendations.</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={fetchAiRecommendation}
                    disabled={isScoring}
                    style={{ marginTop: '8px', padding: '6px 12px', fontSize: '12px', width: '80%' }}
                  >
                    {isScoring ? 'Analyzing...' : 'Analyze Single Incident (INC-1024)'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={fetchOptimization}
                    disabled={isScoring}
                    style={{ marginTop: '4px', padding: '6px 12px', fontSize: '12px', width: '80%' }}
                  >
                    {isScoring ? 'Optimizing...' : 'Optimize Multi-Incident Allocation'}
                  </button>
                </div>
              ) : optimizationPlan ? (
                <div style={{ alignSelf: 'flex-start', background: 'var(--bg-surface-hover)', padding: '12px', borderRadius: '8px', width: '100%', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-primary)' }}>Global Resource Optimization Plan</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    AI predicts a <strong>{optimizationPlan.efficiencyGain}</strong> gain in efficiency saving <strong>{optimizationPlan.timeSaved}</strong> in total response time by reallocating current resources.
                  </div>
                  
                  {optimizationPlan.plan.map((p, i) => (
                    <div key={i} style={{ padding: '8px', background: 'var(--bg-base)', borderRadius: '6px', marginBottom: '8px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600 }}>{p.incidentId}</span>
                        <span style={{ color: 'var(--status-success)' }}>{p.resourceName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span>{p.incidentType}</span>
                        <span>{p.distance} km • {p.eta} min</span>
                      </div>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '12px', padding: '6px' }} onClick={() => setOptimizationPlan(null)}>CANCEL</button>
                    <button className="btn btn-primary" style={{ flex: 1, fontSize: '12px', padding: '6px' }} disabled={!canDispatch} onClick={() => alert('Multi-dispatch executed!')}>EXECUTE ALL</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ alignSelf: 'flex-start', background: 'var(--bg-surface-hover)', padding: '12px', borderRadius: '8px', width: '100%', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Recommended Action</div>
                    <div style={{ fontSize: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Assign <strong>{aiRecommendation.name}</strong> to <strong>INC-1024</strong>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Confidence Score</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-primary)' }}>{aiRecommendation.score}%</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estimated Response</div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{aiRecommendation.eta} min ({aiRecommendation.distance} km)</div>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>AI Reasoning</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {aiRecommendation.reasons.map((r, idx) => (
                        <div key={idx}><CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px', color: r.includes('✓') ? 'var(--status-success)' : 'inherit' }}/>{r}</div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <button className="btn btn-secondary" style={{ flex: 1, fontSize: '12px', padding: '6px' }} onClick={() => setAiRecommendation(null)}>REJECT</button>
                      <button 
                        className="btn btn-primary" 
                        style={{ flex: 1, fontSize: '12px', padding: '6px' }} 
                        disabled={!canDispatch}
                        title={!canDispatch ? "You do not have permission to dispatch" : ""}
                        onClick={() => {
                        fetch('https://nexusops-ai-powered-operational.onrender.com/api/operations/dispatch', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ incidentId: 'INC-1024', resourceId: aiRecommendation.id })
                        });
                        setAiRecommendation(null);
                      }}>APPROVE</button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Chat History */}
            {chatHistory.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {chatHistory.map((msg, idx) => (
                  <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-surface)', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', maxWidth: '85%' }}>
                    {msg.content}
                  </div>
                ))}
                {isTyping && (
                  <div style={{ alignSelf: 'flex-start', background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '12px', fontSize: '12px' }}>
                    NexusOps is typing...
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask NexusOps (e.g. 'Show critical incidents')" 
                style={{ 
                  flex: 1, 
                  padding: '8px 12px', 
                  background: 'var(--bg-base)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }} 
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '8px' }} disabled={!chatInput.trim()}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Recent Operations Timeline */}
      <div className="card" style={{ marginTop: '0px' }}>
        <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Activity size={18} color="var(--accent-primary)" />
          Live Operations Timeline
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {timeline.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px', background: 'var(--bg-base)', borderRadius: '6px', borderLeft: '3px solid var(--accent-primary)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', width: '50px' }}>{item.time}</div>
              <div style={{ fontSize: '14px' }}>{item.msg}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
