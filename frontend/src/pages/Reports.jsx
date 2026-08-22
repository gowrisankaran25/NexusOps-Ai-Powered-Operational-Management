import { FileText, Download } from 'lucide-react';

function Reports() {
  const reports = [
    { id: 'LIVE-CSV', name: 'Live Incident Export (CSV)', date: 'Real-time', size: '--', type: 'live' },
    { id: 'RPT-001', name: 'Weekly Incident Summary', date: '2026-08-20', size: '2.4 MB' },
    { id: 'RPT-002', name: 'Resource Utilization Analysis', date: '2026-08-15', size: '1.8 MB' },
    { id: 'RPT-003', name: 'Monthly AI Accuracy Report', date: '2026-08-01', size: '3.1 MB' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={24} color="var(--accent-primary)" />
          Reports
        </h1>
        <button className="btn btn-primary" onClick={() => alert('Generating new report...')}>
          Generate New Report
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>ID</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>NAME</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>DATE</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>SIZE</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '13px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(rep => (
              <tr key={rep.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '16px', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>{rep.id}</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>{rep.name}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{rep.date}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{rep.size}</td>
                <td style={{ padding: '16px' }}>
                  {rep.type === 'live' ? (
                    <a href="http://localhost:5000/api/reports/incidents/csv" download className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', width: 'fit-content' }}>
                      <Download size={14} /> Download CSV
                    </a>
                  ) : (
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Download size={14} /> Download PDF
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
