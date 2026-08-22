const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, 'db.json');

class MockDB {
  constructor() {
    this.tables = this.loadData();
    console.log('Connected to File-based JSON Database.');
  }

  loadData() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
      } catch (err) {
        console.error("Error reading db.json, using default seed.", err);
      }
    }
    // Seed Data
    const initialData = {
      resources: [
        { id: 'R-001', name: 'Team Alpha', type: 'Personnel', status: 'Available', skills: 'Hazard Response, Medical', utilization: 32, lat: 28.6128, lng: 77.2060 },
        { id: 'R-002', name: 'Team Bravo', type: 'Personnel', status: 'Assigned', skills: 'Medical', utilization: 76, lat: 28.6200, lng: 77.1950 },
        { id: 'R-003', name: 'Team Charlie', type: 'Personnel', status: 'Maintenance', skills: 'Engineering', utilization: 0, lat: 28.6080, lng: 77.2150 },
        { id: 'V-018', name: 'Vehicle 18', type: 'Vehicle', status: 'Available', skills: 'Transport', utilization: 21, lat: 28.6180, lng: 77.2100 },
        { id: 'E-031', name: 'Equipment 31', type: 'Equipment', status: 'Available', skills: 'Heavy Lifting', utilization: 15, lat: 28.6300, lng: 77.1900 }
      ],
      incidents: [
        { id: 'INC-1024', type: 'Equipment Failure', priority: 'CRITICAL', status: 'OPEN', lat: 28.6150, lng: 77.2000, required_personnel: 2, required_vehicles: 1, required_skills: 'Hazard Response' },
        { id: 'INC-1025', type: 'System Failure', priority: 'HIGH', status: 'OPEN', lat: 28.6250, lng: 77.1900, required_personnel: 1, required_vehicles: 0, required_skills: 'Engineering' }
      ],
      metrics: [
        { id: 1, active_operations: 24, available_resources: 184, system_utilization: 82, critical_alerts: 7 }
      ]
    };
    this.saveData(initialData);
    return initialData;
  }

  saveData(data = this.tables) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  }

  all(query, params, callback) {
    if (typeof params === 'function') callback = params;
    setTimeout(() => {
      if (query.includes('FROM resources')) callback(null, this.tables.resources);
      else if (query.includes('FROM incidents')) callback(null, this.tables.incidents);
      else if (query.includes('FROM metrics')) callback(null, this.tables.metrics);
      else callback(new Error("Table not found"), []);
    }, 10);
  }

  get(query, params, callback) {
    if (typeof params === 'function') callback = params;
    setTimeout(() => {
      if (query.includes('FROM metrics')) callback(null, this.tables.metrics[0]);
      else callback(new Error("Table not found"), null);
    }, 10);
  }

  run(query, params, callback) {
    if (typeof params === 'function') callback = params;
    setTimeout(() => {
      if (callback) callback(null);
    }, 10);
  }
}

const db = new MockDB();
module.exports = db;
