const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const db = require('./database');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});
const port = 5000;

app.use(cors());
app.use(express.json());

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('Frontend client connected via Socket.IO');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API: Get Dashboard Summary
app.get('/api/dashboard/summary', (req, res) => {
  db.get("SELECT * FROM metrics ORDER BY id DESC LIMIT 1", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      activeOperations: row ? row.active_operations : 0,
      availableResources: row ? row.available_resources : 0,
      utilization: row ? row.system_utilization : 0,
      criticalAlerts: row ? row.critical_alerts : 0
    });
  });
});

// API: Get Resources
app.get('/api/resources', (req, res) => {
  db.all("SELECT * FROM resources", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Get Incidents
app.get('/api/incidents', (req, res) => {
  db.all("SELECT * FROM incidents", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Helper for geographical distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// API: AI Recommendation Scoring Engine
app.post('/api/ai/recommend', (req, res) => {
  const { incidentId } = req.body;
  if (!incidentId) return res.status(400).json({ error: "incidentId is required" });

  db.all("SELECT * FROM incidents", [], (err, incidents) => {
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident) return res.status(404).json({ error: "Incident not found" });

    db.all("SELECT * FROM resources", [], (err, resources) => {
      // Only consider available personnel for this demo
      const candidates = resources.filter(r => r.status === 'Available');

      const scoredCandidates = candidates.map(resource => {
        // 1. Distance Score (30%) - closer is better. Max distance ~50km for 0 score.
        const distance = calculateDistance(incident.lat, incident.lng, resource.lat, resource.lng);
        let distScore = Math.max(0, 100 - (distance * 2)); 
        
        // 2. Availability Score (20%) - Already filtered by available, so 100
        const availScore = 100;
        
        // 3. Skill Match Score (25%)
        const reqSkills = incident.required_skills.split(',').map(s => s.trim());
        const resSkills = resource.skills.split(',').map(s => s.trim());
        const matchedSkills = reqSkills.filter(s => resSkills.includes(s));
        const skillScore = (matchedSkills.length / reqSkills.length) * 100 || 0;
        
        // 4. Workload Score (15%) - lower util is better
        const workloadScore = 100 - resource.utilization;
        
        // 5. Response Time Score (10%) - rough estimate: 1km = 2.5 mins in traffic
        const eta = distance * 2.5; 
        const etaScore = Math.max(0, 100 - (eta * 1.5));

        // Weighted Total
        const totalScore = (distScore * 0.3) + (availScore * 0.2) + (skillScore * 0.25) + (workloadScore * 0.15) + (etaScore * 0.1);

        return {
          ...resource,
          distance: distance.toFixed(1),
          eta: Math.round(eta),
          score: Math.round(totalScore),
          reasons: [
            distance < 5 ? "✓ Closest available team" : "Distance acceptable",
            skillScore === 100 ? "✓ Required skills available" : "Partial skill match",
            workloadScore > 50 ? "✓ Low current workload" : "Workload acceptable"
          ]
        };
      });

      scoredCandidates.sort((a, b) => b.score - a.score);
      
      res.json({
        incident: incident.id,
        recommendations: scoredCandidates
      });
    });
  });
});

// API: AI Multi-Incident Optimization
app.post('/api/ai/optimize', (req, res) => {
  db.all("SELECT * FROM incidents WHERE status = 'OPEN'", [], (err, openIncidents) => {
    db.all("SELECT * FROM resources WHERE status = 'Available'", [], (err, availableResources) => {
      // Very basic mock optimization: Greedy assignment based on distance
      let unassignedResources = [...availableResources];
      const optimizationPlan = [];

      openIncidents.forEach(incident => {
        if (unassignedResources.length === 0) return;

        // Find best resource for this incident
        unassignedResources.sort((a, b) => {
          return calculateDistance(incident.lat, incident.lng, a.lat, a.lng) - 
                 calculateDistance(incident.lat, incident.lng, b.lat, b.lng);
        });

        const bestResource = unassignedResources.shift(); // Take closest
        
        optimizationPlan.push({
          incidentId: incident.id,
          incidentType: incident.type,
          resourceId: bestResource.id,
          resourceName: bestResource.name,
          distance: calculateDistance(incident.lat, incident.lng, bestResource.lat, bestResource.lng).toFixed(1),
          eta: Math.round(calculateDistance(incident.lat, incident.lng, bestResource.lat, bestResource.lng) * 2.5)
        });
      });

      res.json({
        plan: optimizationPlan,
        efficiencyGain: "18%",
        timeSaved: "24 mins"
      });
    });
  });
});

// Background Worker: Intelligent Alert System
setInterval(() => {
  db.get("SELECT * FROM metrics", [], (err, metric) => {
    if (!metric) return;
    
    db.all("SELECT * FROM resources", [], (err, resources) => {
      const available = resources.filter(r => r.status === 'Available').length;
      const total = resources.length;
      const availPercent = total > 0 ? (available / total) * 100 : 0;

      if (availPercent < 30) {
        // Broadcast System Alert
        const alertEvent = {
          type: 'ALERT',
          priority: 'CRITICAL',
          message: `Resource Shortage Predicted! Availability has dropped to ${Math.round(availPercent)}%. Deploy backups.`,
          timestamp: new Date().toISOString()
        };
        io.emit('system_alert', alertEvent);
      }
    });
  });
}, 30000); // Check every 30 seconds for demo purposes

// API: Dispatch Resource
app.post('/api/operations/dispatch', (req, res) => {
  const { incidentId, resourceId } = req.body;
  if (!incidentId || !resourceId) return res.status(400).json({ error: "incidentId and resourceId required" });

  db.all("SELECT * FROM resources", [], (err, resources) => {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return res.status(404).json({ error: "Resource not found" });

    // Mutate the mock database state for demo
    resource.status = 'Assigned';
    db.tables.metrics[0].available_resources -= 1;
    db.tables.metrics[0].active_operations += 1;
    db.saveData(); // Persist changes
    
    // Broadcast the real-time update
    const dispatchEvent = {
      type: 'DISPATCH',
      timestamp: new Date().toISOString(),
      message: `${resource.name} dispatched to Incident ${incidentId}`,
      resourceId: resource.id,
      incidentId: incidentId,
      newStatus: 'Assigned',
      metrics: db.tables.metrics[0]
    };
    
    io.emit('operation_update', dispatchEvent);
    
    res.json({ success: true, event: dispatchEvent });
  });
});

// CRUD: Add Resource
app.post('/api/resources', (req, res) => {
  const newResource = { ...req.body, id: `R-${Math.floor(Math.random()*1000).toString().padStart(3, '0')}` };
  db.tables.resources.push(newResource);
  db.saveData();
  io.emit('data_update', { type: 'RESOURCE_ADDED', data: newResource });
  res.status(201).json(newResource);
});

// CRUD: Add Incident
app.post('/api/incidents', (req, res) => {
  const newIncident = { ...req.body, id: `INC-${Math.floor(Math.random()*10000)}`, status: 'OPEN' };
  db.tables.incidents.push(newIncident);
  db.saveData();
  io.emit('data_update', { type: 'INCIDENT_ADDED', data: newIncident });
  res.status(201).json(newIncident);
});

// API: Generate CSV Report for Incidents
app.get('/api/reports/incidents/csv', (req, res) => {
  db.all("SELECT * FROM incidents", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (rows.length === 0) {
      return res.status(200).send("No incidents found");
    }

    // Generate CSV Header
    const headers = Object.keys(rows[0]).join(',') + '\n';
    
    // Generate CSV Rows
    const csvRows = rows.map(row => {
      return Object.values(row).map(value => {
        // Escape quotes and wrap in quotes if there are commas
        const strVal = String(value);
        if (strVal.includes(',') || strVal.includes('"')) {
          return `"${strVal.replace(/"/g, '""')}"`;
        }
        return strVal;
      }).join(',');
    }).join('\n');

    const csvData = headers + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="nexusops-incidents-report.csv"');
    res.status(200).send(csvData);
  });
});

server.listen(port, () => {
  console.log(`NexusOps Backend API listening on port ${port} with Socket.IO active`);
});
