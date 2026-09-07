/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick
 * Email: ujjwalkumarbhowmick30@gmail.com
 * All rights reserved.
 */

import React from 'react';
import { RiskSignal } from '../data/types.ts';
import { 
  AlertOctagon, 
  AlertTriangle, 
  ArrowRight, 
  FileSearch, 
  Scale, 
  ShieldAlert, 
  TrendingDown, 
  Users 
} from 'lucide-react';

interface SignalsFeedProps {
  signals: RiskSignal[];
  onInvestigate: (promptText: string) => void;
  onOpenReport: (accountId: string) => void;
}

export const SignalsFeed: React.FC<SignalsFeedProps> = ({
  signals,
  onInvestigate,
  onOpenReport
}) => {
  const getIconForType = (type: RiskSignal['signalType']) => {
    switch (type) {
      case 'FRAUD_SMURFING':
        return <AlertOctagon size={20} color="#ef4444" />;
      case 'FRAUD_MULE_RING':
        return <Users size={20} color="#a855f7" />;
      case 'LIQUIDITY_LCR_BREACH':
        return <TrendingDown size={20} color="#f97316" />;
      case 'CREDIT_CONCENTRATION':
        return <Scale size={20} color="#eab308" />;
      default:
        return <ShieldAlert size={20} color="#38bdf8" />;
    }
  };

  const getSeverityBadge = (severity: RiskSignal['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="badge badge-critical"><span className="pulse-indicator-critical" /> CRITICAL</span>;
      case 'HIGH':
        return <span className="badge badge-high">HIGH RISK</span>;
      case 'MEDIUM':
        return <span className="badge badge-warning">MEDIUM</span>;
      default:
        return <span className="badge badge-safe">LOW</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Active Risk & Fraud Signals</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time multi-pillar detection across Transaction Surveillance, Basel III Liquidity, and Credit Concentration.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Surveillance Triage:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ef4444' }}>
              {signals.length} UNRESOLVED
            </span>
          </div>
        </div>
      </div>

      {/* Signal Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(620px, 1fr))', gap: '20px' }}>
        {signals.map((signal) => (
          <div 
            key={signal.id} 
            className="glass-panel" 
            style={{
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderLeft: signal.severity === 'CRITICAL' ? '4px solid #ef4444' : '4px solid #f97316'
            }}
          >
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getIconForType(signal.signalType)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{signal.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {signal.id}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>•</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {new Date(signal.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {getSeverityBadge(signal.severity)}
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                {signal.description}
              </p>

              {/* Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px',
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)'
              }}>
                {Object.entries(signal.metrics).map(([key, val]) => (
                  <div key={key}>
                    <div style={{ 
                      fontSize: '0.7rem', 
                      color: 'var(--text-muted)', 
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)' 
                    }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div style={{ 
                      fontSize: '0.95rem', 
                      fontWeight: 600, 
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      marginTop: '2px' 
                    }}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Policy Violations */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                  Statutory Directives & Policy Breaches:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {signal.policyViolations.map((p, i) => (
                    <span 
                      key={i} 
                      style={{
                        fontSize: '0.72rem',
                        background: 'rgba(56, 189, 248, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        color: '#7dd3fc',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '14px',
              marginTop: '4px'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Status: <strong style={{ color: '#fca5a5' }}>{signal.status}</strong>
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                {signal.accountId && signal.signalType === 'FRAUD_SMURFING' && (
                  <button 
                    id={`btn-dossier-${signal.id}`}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    onClick={() => onOpenReport(signal.accountId!)}
                  >
                    <FileSearch size={14} />
                    <span>View Filing</span>
                  </button>
                )}

                <button 
                  id={`btn-investigate-${signal.id}`}
                  className="btn-primary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  onClick={() => {
                    const prompt = signal.signalType === 'FRAUD_SMURFING'
                      ? `Investigate structuring and smurfing pattern in ${signal.entityName} (${signal.accountId}) and draft an audit-ready STR.`
                      : signal.signalType === 'FRAUD_MULE_RING'
                      ? `Analyze the multi-hop money mule syndicate involving ${signal.entityName} and summarize regulatory violations.`
                      : signal.signalType === 'LIQUIDITY_LCR_BREACH'
                      ? `Analyze the Basel III LCR liquidity deficit and draft a supervisory memo for the Central Bank.`
                      : `Evaluate single borrower credit concentration breach for ${signal.entityName} under BCBS LEF.`;
                    onInvestigate(prompt);
                  }}
                >
                  <span>Ask Copilot to Investigate</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
