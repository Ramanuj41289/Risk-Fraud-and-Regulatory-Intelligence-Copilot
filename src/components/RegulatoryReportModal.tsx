/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick
 * Email: ujjwalkumarbhowmick30@gmail.com
 * All rights reserved.
 */

import React from 'react';
import { SuspiciousReport } from '../data/types.ts';
import { Printer, Download, X, ShieldCheck, FileCheck, AlertCircle } from 'lucide-react';

interface RegulatoryReportModalProps {
  report: SuspiciousReport | null;
  onClose: () => void;
}

export const RegulatoryReportModal: React.FC<RegulatoryReportModalProps> = ({
  report,
  onClose
}) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${report.reportId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '24px'
    }}>
      <div className="glass-panel" style={{
        width: '1000px',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: '#0c1220',
        border: '1px solid var(--border-active)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Controls Top Bar (Hidden in print) */}
        <div className="no-print" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(15, 23, 42, 0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck color="#38bdf8" size={20} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              Official Regulatory Filing Dossier (Form {report.reportType})
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }} onClick={handleDownloadJSON}>
              <Download size={14} />
              <span>Download JSON</span>
            </button>
            <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }} onClick={handlePrint}>
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button 
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-secondary)'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Official Printable Report Content */}
        <div style={{ padding: '36px', color: 'var(--text-primary)' }}>
          {/* Official Document Header */}
          <div style={{
            borderBottom: '2px solid var(--border-subtle)',
            paddingBottom: '20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                CONFIDENTIAL • STATUTORY SUPERVISORY REPORT
              </div>
              <h1 style={{ fontSize: '1.6rem', marginTop: '4px', letterSpacing: '-0.02em' }}>
                {report.reportType === 'STR' 
                  ? 'SUSPICIOUS TRANSACTION REPORT (STR / SAR)' 
                  : report.reportType === 'BASEL_LCR_MEMO'
                  ? 'BASEL III LIQUIDITY COVERAGE SUPERVISORY MEMO'
                  : 'CREDIT LARGE EXPOSURE RECTIFICATION DOSSIER'}
              </h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Reporting Institution: <strong>{report.filingEntity.institutionName}</strong> ({report.filingEntity.institutionType})
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid var(--border-active)',
                padding: '6px 14px',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#38bdf8'
              }}>
                {report.reportId}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Filing Date: {new Date(report.generatedAt).toUTCString()}
              </div>
            </div>
          </div>

          {/* Subject Entity Profile */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '18px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid var(--border-subtle)'
          }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Part I: Subject Profile & Account Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Entity / Account Name:</span>
                <div style={{ fontWeight: 600 }}>{report.subjectEntity.name}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Internal Account ID:</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{report.subjectEntity.accountId}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Tax Identification / EIN:</span>
                <div style={{ fontFamily: 'var(--font-mono)' }}>{report.subjectEntity.taxId}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Assessed Risk Category:</span>
                <div><span className="badge badge-critical">{report.subjectEntity.riskCategory}</span></div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Part II: Executive Findings & Grounded Summary
            </h4>
            <div style={{
              background: 'rgba(239, 68, 68, 0.05)',
              borderLeft: '3px solid #ef4444',
              padding: '14px',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)'
            }}>
              {report.executiveSummary}
            </div>
          </div>

          {/* Suspicion Narrative */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Part III: Detailed Surveillance Narrative & Modus Operandi
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {report.suspicionNarrative}
            </p>
          </div>

          {/* Supporting Evidence Table */}
          {report.supportingEvidence.transactions.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Part IV: Chronological Transaction Lineage & Evidence ({report.supportingEvidence.transactionCount} Records)
              </h4>
              <table className="compliance-table" style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', overflow: 'hidden' }}>
                <thead>
                  <tr>
                    <th>Tx ID</th>
                    <th>Timestamp (UTC)</th>
                    <th>Channel</th>
                    <th>Beneficiary / Counterparty</th>
                    <th>Amount</th>
                    <th>Risk Flags</th>
                  </tr>
                </thead>
                <tbody>
                  {report.supportingEvidence.transactions.map(tx => (
                    <tr key={tx.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>{tx.id}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{tx.timestamp.replace('T', ' ').replace('Z', '')}</td>
                      <td><span className="badge" style={{ background: 'rgba(255,255,255,0.06)' }}>{tx.channel}</span></td>
                      <td>{tx.targetAccountName}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ef4444' }}>${tx.amount.toLocaleString()}</td>
                      <td>
                        <span className="badge badge-critical" style={{ fontSize: '0.65rem' }}>{tx.flags[0] || 'SMURFING'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Statutory Citations */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Part V: Applicable Statutory Mandates & Regulatory Citing
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {report.regulatoryCitations.map((cite, i) => (
                <div key={i} style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  padding: '12px 16px',
                  borderRadius: '6px'
                }}>
                  <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.85rem' }}>
                    {cite.regulation} — {cite.section}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '4px' }}>
                    "{cite.clauseQuote}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Governance Digital Sign-off */}
          <div style={{
            borderTop: '2px solid var(--border-subtle)',
            paddingTop: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PRESCRIBED REMEDIATION:</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {report.actionTaken}
              </p>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#86efac', fontWeight: 600, fontSize: '0.85rem' }}>
                <ShieldCheck size={18} />
                <span>GOVERNANCE ATTESTATION</span>
              </div>
              <div style={{ fontSize: '0.8rem', marginTop: '6px' }}>
                Certified By: <strong>{report.governanceSignature.complianceOfficer}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Digital Hash Timestamp: {new Date(report.governanceSignature.timestamp).toUTCString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
