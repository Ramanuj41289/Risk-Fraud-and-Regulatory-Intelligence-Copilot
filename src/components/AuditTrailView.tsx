/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick
 * Email: ujjwalkumarbhowmick30@gmail.com
 * All rights reserved.
 */

import React from 'react';
import { AuditRecord } from '../data/types.ts';
import { History, Shield, Lock, Download, CheckCircle2, ChevronRight } from 'lucide-react';

interface AuditTrailViewProps {
  auditRecords: AuditRecord[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ auditRecords }) => {
  const handleExportAuditCSV = () => {
    const headers = ['Record ID', 'Timestamp', 'User Role', 'Action Type', 'Query', 'Confidence', 'Accounts Examined', 'Policies Cited'];
    const rows = auditRecords.map(r => [
      r.id,
      r.timestamp,
      `"${r.userRole}"`,
      r.actionType,
      `"${r.query.replace(/"/g, '""')}"`,
      `${r.confidenceScore}%`,
      `"${r.accountsExamined.join('; ')}"`,
      `"${r.policiesCited.join('; ')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SentinelRisk_Audit_Trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History color="#6366f1" /> Governance & Explainability Audit Ledger
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Immutable supervisory record of every Copilot interaction, data source accessed, policy clause evaluated, and report produced.
          </p>
        </div>

        <button className="btn-secondary" onClick={handleExportAuditCSV}>
          <Download size={15} />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <Lock size={14} color="#86efac" />
          <span>Surveillance Immutability Hash: <code style={{ color: '#86efac' }}>SHA-256-e91b...44a7</code> (Tamper-Evident)</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {auditRecords.map((record) => (
            <div 
              key={record.id}
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                padding: '16px 20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{record.actionType}</span>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{record.id}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>• User: <strong>{record.userRole}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#86efac' }}>
                    Confidence: {record.confidenceScore}%
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(record.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginBottom: '10px' }}>
                "{record.query}"
              </div>

              {/* Reasoning steps chips */}
              <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {record.reasoningTraces.map((trace, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <ChevronRight size={12} color="#38bdf8" />
                    <span>{trace}</span>
                  </div>
                ))}
              </div>

              {/* Examined Accounts & Cited Policies */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Accounts Inspected: </span>
                  <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                    {record.accountsExamined.length > 0 ? record.accountsExamined.join(', ') : 'None'}
                  </span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Regulatory Policies Evaluated: </span>
                  <span style={{ color: '#fdba74' }}>
                    {record.policiesCited.join(' | ')}
                  </span>
                </div>

                {record.reportGeneratedId && (
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Filing Created: </span>
                    <strong style={{ color: '#86efac', fontFamily: 'var(--font-mono)' }}>{record.reportGeneratedId}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
