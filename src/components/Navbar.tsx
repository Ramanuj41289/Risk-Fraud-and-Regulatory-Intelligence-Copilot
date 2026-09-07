/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick
 * Email: ujjwalkumarbhowmick30@gmail.com
 * All rights reserved.
 */

import React from 'react';
import { 
  ShieldAlert, 
  Bot, 
  Share2, 
  BarChart3, 
  FileText, 
  History, 
  Activity, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  signalCount: number;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  signalCount,
  onOpenReportModal
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        {/* Brand & System Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('copilot')}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
            }}>
              <ShieldAlert size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontWeight: 700, 
                  fontSize: '1.2rem',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(to right, #ffffff, #93c5fd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  SentinelRisk
                </span>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>COPILOT v1.0</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Banking & NBFC Regulatory Intelligence
              </p>
            </div>
          </div>

          <div style={{
            height: '24px',
            width: '1px',
            background: 'var(--border-subtle)',
            margin: '0 4px'
          }} />

          {/* Live Telemetry Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            padding: '5px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem'
          }}>
            <span className="pulse-indicator" />
            <span style={{ color: 'var(--text-secondary)' }}>Surveillance:</span>
            <span style={{ color: '#86efac', fontWeight: 600 }}>Active (500+ Tx/s)</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            id="tab-copilot"
            onClick={() => setActiveTab('copilot')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: activeTab === 'copilot' ? '#38bdf8' : 'var(--text-secondary)',
              background: activeTab === 'copilot' ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
              border: activeTab === 'copilot' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent'
            }}
          >
            <Bot size={16} />
            <span>Copilot Assistant</span>
          </button>

          <button
            id="tab-signals"
            onClick={() => setActiveTab('signals')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: activeTab === 'signals' ? '#ef4444' : 'var(--text-secondary)',
              background: activeTab === 'signals' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
              border: activeTab === 'signals' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent'
            }}
          >
            <AlertTriangle size={16} />
            <span>Risk Signals</span>
            <span className="badge badge-critical" style={{ padding: '1px 6px', fontSize: '0.7rem' }}>
              {signalCount}
            </span>
          </button>

          <button
            id="tab-mule-graph"
            onClick={() => setActiveTab('mule_graph')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: activeTab === 'mule_graph' ? '#a855f7' : 'var(--text-secondary)',
              background: activeTab === 'mule_graph' ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
              border: activeTab === 'mule_graph' ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid transparent'
            }}
          >
            <Share2 size={16} />
            <span>Mule Network Flow</span>
          </button>

          <button
            id="tab-liquidity"
            onClick={() => setActiveTab('liquidity')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: activeTab === 'liquidity' ? '#eab308' : 'var(--text-secondary)',
              background: activeTab === 'liquidity' ? 'rgba(234, 179, 8, 0.1)' : 'transparent',
              border: activeTab === 'liquidity' ? '1px solid rgba(234, 179, 8, 0.3)' : '1px solid transparent'
            }}
          >
            <BarChart3 size={16} />
            <span>Basel LCR & Credit</span>
          </button>

          <button
            id="tab-audit"
            onClick={() => setActiveTab('audit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: activeTab === 'audit' ? '#6366f1' : 'var(--text-secondary)',
              background: activeTab === 'audit' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              border: activeTab === 'audit' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
            }}
          >
            <History size={16} />
            <span>Governance Audit</span>
          </button>
        </nav>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            id="btn-generate-report"
            className="btn-primary" 
            onClick={onOpenReportModal}
            style={{ fontSize: '0.8rem', padding: '8px 14px' }}
          >
            <FileText size={15} />
            <span>Audit-Ready STR Filing</span>
          </button>
        </div>
      </div>
    </header>
  );
};
