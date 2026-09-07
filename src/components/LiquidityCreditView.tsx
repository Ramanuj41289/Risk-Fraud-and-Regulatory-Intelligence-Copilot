/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick
 * Email: ujjwalkumarbhowmick30@gmail.com
 * All rights reserved.
 */

import React from 'react';
import { mockLiquidityMetrics, mockCreditExposures } from '../data/liquidityCredit.ts';
import { BarChart3, TrendingDown, AlertTriangle, ShieldCheck, FileSpreadsheet, ArrowUpRight } from 'lucide-react';

interface LiquidityCreditViewProps {
  onGenerateMemo: () => void;
  onInvestigateCredit: (borrowerId: string) => void;
}

export const LiquidityCreditView: React.FC<LiquidityCreditViewProps> = ({
  onGenerateMemo,
  onInvestigateCredit
}) => {
  const latestMetric = mockLiquidityMetrics[mockLiquidityMetrics.length - 1];
  const requiredLcr = 100.0;
  const isBreached = latestMetric.lcrRatio < requiredLcr;
  const deficit = latestMetric.netCashOutflows30D - latestMetric.stockHQLA;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 color="#eab308" /> Basel III Liquidity (LCR) & Credit Concentration
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Supervisory monitoring under Basel Committee on Banking Supervision (BCBS) standards and Central Bank directives.
          </p>
        </div>

        <button className="btn-primary" onClick={onGenerateMemo}>
          <FileSpreadsheet size={15} />
          <span>Draft Basel LCR Supervisory Memo</span>
        </button>
      </div>

      {/* Basel III LCR Hero Section */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', borderLeft: isBreached ? '4px solid #ef4444' : '4px solid #10b981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-critical">SUPERVISORY PRUDENTIAL BREACH</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>As of {latestMetric.date}</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', marginTop: '6px' }}>
              Basel III Liquidity Coverage Ratio: <span style={{ color: '#ef4444', fontFamily: 'var(--font-mono)' }}>{latestMetric.lcrRatio.toFixed(1)}%</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Statutory Floor: <strong>100.0%</strong>. The institution is experiencing a 30-day liquidity deficit driven by uncommitted wholesale deposit run-offs.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NET LIQUIDITY SHORTFALL</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>
              ${deficit.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '12px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STOCK OF HQLA (Level 1 + 2)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#38bdf8', marginTop: '4px' }}>
              ${(latestMetric.stockHQLA / 1000000).toFixed(1)}M
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Unencumbered Sovereign Debt & Cash
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>30D TOTAL OUTFLOWS</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#fca5a5', marginTop: '4px' }}>
              ${(latestMetric.totalExpectedOutflows30D / 1000000).toFixed(1)}M
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Wholesale: ${(latestMetric.wholesaleRunOff / 1000000).toFixed(1)}M | Retail: ${(latestMetric.retailRunOff / 1000000).toFixed(1)}M
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>30D TOTAL INFLOWS</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#86efac', marginTop: '4px' }}>
              ${(latestMetric.totalExpectedInflows30D / 1000000).toFixed(1)}M
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Subject to 75% regulatory inflow cap
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>30D NET CASH OUTFLOWS</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#fdba74', marginTop: '4px' }}>
              ${(latestMetric.netCashOutflows30D / 1000000).toFixed(1)}M
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Denominator in statutory ratio
            </div>
          </div>
        </div>

        {/* 7-Day Historical Trend Bar */}
        <div style={{ marginTop: '20px', background: 'rgba(15, 23, 42, 0.4)', padding: '14px', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 600 }}>
            Historical 7-Day LCR Trajectory:
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '90px' }}>
            {mockLiquidityMetrics.map((m, idx) => {
              const heightPct = Math.min(100, (m.lcrRatio / 160) * 100);
              const isBelow = m.lcrRatio < 100.0;
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: isBelow ? '#ef4444' : '#38bdf8' }}>
                    {m.lcrRatio.toFixed(1)}%
                  </span>
                  <div style={{
                    width: '100%',
                    height: `${heightPct}%`,
                    background: isBelow ? 'linear-gradient(to top, #dc2626, #ef4444)' : 'linear-gradient(to top, #0284c7, #38bdf8)',
                    borderRadius: '4px 4px 0 0'
                  }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Credit Concentration & Large Exposure Framework (LEF) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Large Exposure Framework (LEF) Surveillance</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              BCBS Standard: Single borrower exposure limit is capped at <strong>20.00% of Tier 1 Capital Base ($300,000,000)</strong>.
            </p>
          </div>
        </div>

        <table className="compliance-table">
          <thead>
            <tr>
              <th>Borrower / Counterparty</th>
              <th>Sector</th>
              <th>Total Exposure</th>
              <th>Concentration Ratio</th>
              <th>Limit (20%)</th>
              <th>ECL Stage</th>
              <th>Rating</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockCreditExposures.map((borrower) => {
              const isBreach = borrower.concentrationRatio > 20.0;
              const isWarn = borrower.concentrationRatio >= 15.0 && !isBreach;

              return (
                <tr key={borrower.borrowerId}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{borrower.borrowerName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {borrower.borrowerId}
                    </div>
                  </td>
                  <td>{borrower.sector}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    ${borrower.totalExposure.toLocaleString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, (borrower.concentrationRatio / 25) * 100)}%`,
                          height: '100%',
                          background: isBreach ? '#ef4444' : isWarn ? '#eab308' : '#10b981'
                        }} />
                      </div>
                      <span style={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontWeight: 700,
                        color: isBreach ? '#ef4444' : isWarn ? '#fde047' : 'var(--text-primary)'
                      }}>
                        {borrower.concentrationRatio.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>20.00%</td>
                  <td>
                    <span className={`badge ${borrower.eclStage === 'STAGE_2' ? 'badge-warning' : 'badge-safe'}`}>
                      {borrower.eclStage}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{borrower.rating}</td>
                  <td>
                    {isBreach ? (
                      <button 
                        className="btn-danger" 
                        style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                        onClick={() => onInvestigateCredit(borrower.borrowerId)}
                      >
                        BREACH (Remediate)
                      </button>
                    ) : isWarn ? (
                      <span className="badge badge-warning">BUFFER ALERT</span>
                    ) : (
                      <span className="badge badge-safe">COMPLIANT</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
