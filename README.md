# NexusOps – AI-Powered Operational Management & Decision

NexusOps is a comprehensive, real-time command center application designed for operational management, incident tracking, and resource allocation. It features live data updates via WebSockets and integrates AI-driven decision support to optimize operational efficiency.

## 🚀 Key Features

* **Real-Time Dashboard**: Live KPIs tracking active operations, available resources, system utilization, and critical alerts.
* **Interactive Live Map**: A situational map (using MapLibre) that plots incidents and resources with real-time status updates and dynamic styling (Dark Matter, Streets, Satellite).
* **AI Decision Support Engine**: Simulated AI logic that evaluates resource distance, skills, and workload to recommend optimal dispatch allocations for incidents.
* **Smart Chat Assistant**: An interactive "Ask NexusOps" chat interface to quickly query system status and incident data.
* **Role-Based Access Control (RBAC)**: Enforced UI permissions based on user roles (e.g., System Admin vs. Viewer), determining who can dispatch resources or create incidents.
* **Comprehensive Resource & Incident Management**: Full CRUD capabilities with detailed slide-out inspection panels for deep dives into resource utilization and incident timelines.
* **Live CSV Export**: Backend endpoint that dynamically generates and streams downloadable CSV reports of current incident data.
* **Customizable Settings**: Global state management allowing users to toggle themes, map styles, and automation preferences.

## 🛠️ Tech Stack

### Frontend
* **Framework**: React (Vite)
* **Routing**: React Router v6
* **Icons**: Lucide-React
* **Mapping**: React-Map-GL (MapLibre)
* **Real-time**: Socket.IO-Client
* **Charts**: Recharts

### Backend
* **Framework**: Node.js + Express
* **Real-time**: Socket.IO
* **Database**: File-based mock JSON database (`db.json`) for persistence

## 📦 Getting Started

### Prerequisites
* Node.js (v16+ recommended)
* npm

### 1. Start the Backend
The backend runs an Express server on port `5000` and handles Socket.IO connections.

```bash
cd backend
npm install
npm start
```
*Note: The backend must be running for the frontend to function correctly, as it relies on the API and WebSocket connections.*

### 2. Start the Frontend
The frontend is a Vite application running on port `3001`.

```bash
cd frontend
npm install
npm run dev
```
*Note: If you run into path resolution issues with `npm run dev` on Windows, you can start Vite directly using `node node_modules/vite/bin/vite.js`.*

### 3. Open the Application
Navigate to `http://localhost:3001` in your browser.

## 👥 Roles and Permissions
To test the RBAC features, use the dropdown in the top-right corner of the application (under your profile name) to switch between roles:
* **System Admin / Operations Manager**: Full access. Can dispatch resources, create incidents, and approve AI recommendations.
* **Viewer**: Read-only access. The "Approve" and "Dispatch" actions will be disabled.

## 🚧 Future Roadmap
* **Database Migration**: Replace the mock `db.json` with PostgreSQL or MongoDB.
* **True Auth**: Implement JWT-based login authentication instead of the UI role switcher.
* **LLM Integration**: Wire the Smart Chat Assistant up to a real Large Language Model (like Gemini) for natural language querying of the database.
