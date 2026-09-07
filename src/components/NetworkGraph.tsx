import React, { useState } from 'react';
import { mockAccounts } from '../data/accounts.ts';
import { mockTransactions } from '../data/transactions.ts';
import { Account, Transaction } from '../data/types.ts';
import { Share2, AlertOctagon, ArrowUpRight, ShieldAlert, CheckCircle, Info } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  role: 'ORIGINATOR' | 'INTERMEDIARY' | 'OFFSHORE_SINK' | 'CIRCULAR_LOOP';
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  x: number;
  y: number;
}

export const NetworkGraph: React.FC<{ onInvestigateNode?: (accId: string) => void }> = ({ onInvestigateNode }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ACC-8821');

  const nodes: NetworkNode[] = [
    { id: 'ACC-8821', name: 'Apex Horizon Logistics LLC', role: 'ORIGINATOR', risk: 'CRITICAL', x: 120, y: 220 },
    { id: 'ACC-1044', name: 'Devon Keith (Student)', role: 'INTERMEDIARY', risk: 'CRITICAL', x: 420, y: 120 },
    { id: 'ACC-1045', name: 'Tanya Gomez (Retail)', role: 'INTERMEDIARY', risk: 'HIGH', x: 420, y: 320 },
    { id: 'ACC-3190', name: 'Elena Rostova Tech (Cyprus)', role: 'CIRCULAR_LOOP', risk: 'HIGH', x: 260, y: 440 },
    { id: 'ACC-1046', name: 'Nexus Crypto Gateway (Seychelles)', role: 'OFFSHORE_SINK', risk: 'CRITICAL', x: 740, y: 220 }
  ];

  const edges = [
    { from: 'ACC-8821', to: 'ACC-1044', amount: '$19,770 (2 splits)', label: 'Smurfed Tranches' },
    { from: 'ACC-8821', to: 'ACC-1045', amount: '$19,750 (2 splits)', label: 'Smurfed Tranches' },
    { from: 'ACC-8821', to: 'ACC-3190', amount: '$9,900', label: 'Offshore Transfer' },
    { from: 'ACC-1044', to: 'ACC-1046', amount: '$18,500', label: 'Crypto Onramp (<4h)' },
    { from: 'ACC-1045', to: 'ACC-1046', amount: '$19,100', label: 'Crypto Onramp (<2h)' },
    { from: 'ACC-3190', to: 'ACC-8821', amount: '$8,750', label: 'Circular Loan Sham' }
  ];

  const selectedAccount = mockAccounts.find(a => a.id === selectedNodeId);
  const selectedTransactions = mockTransactions.filter(
    t => t.sourceAccountId === selectedNodeId || t.targetAccountId === selectedNodeId
  );

  return (
    <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Share2 color="#a855f7" /> Money Mule Syndicate & Fund Flow Graph
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Directed fund lineage tracking smurfing origins, pass-through intermediary mules, and offshore virtual asset off-ramps.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '8px 14px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <span>Critical Origin / Sink</span>
          </div>
          <div className="glass-panel" style={{ padding: '8px 14px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f97316' }} />
            <span>Mule Intermediary</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '20px' }}>
        {/* Visual Graph Canvas Container */}
        <div className="glass-panel" style={{ padding: '20px', position: 'relative', minHeight: '560px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            CLICK ANY NODE TO INSPECT TRANSACTION LINEAGE & KYC PROFILE
          </div>

          <svg style={{ width: '100%', height: '520px' }}>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="28"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#38bdf8" />
              </marker>
              <marker
                id="arrowhead-red"
                markerWidth="10"
                markerHeight="7"
                refX="28"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
              </marker>
              <marker
                id="arrowhead-purple"
                markerWidth="10"
                markerHeight="7"
                refX="28"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find(n => n.id === edge.from)!;
              const toNode = nodes.find(n => n.id === edge.to)!;
              const isCircular = edge.label.includes('Circular');
              const isCrypto = edge.label.includes('Crypto');

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2 + (isCircular ? 40 : 0);

              return (
                <g key={idx}>
                  <path
                    d={isCircular 
                      ? `M ${fromNode.x} ${fromNode.y} Q ${midX} ${midY + 50} ${toNode.x} ${toNode.y}`
                      : `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`
                    }
                    stroke={isCrypto ? '#ef4444' : isCircular ? '#a855f7' : '#38bdf8'}
                    strokeWidth="2.5"
                    strokeDasharray={isCircular ? '5,5' : undefined}
                    fill="none"
                    markerEnd={isCrypto ? 'url(#arrowhead-red)' : isCircular ? 'url(#arrowhead-purple)' : 'url(#arrowhead)'}
                    opacity="0.8"
                  />
                  {/* Edge Label */}
                  <rect
                    x={midX - 55}
                    y={midY - 14}
                    width="110"
                    height="24"
                    rx="4"
                    fill="rgba(15, 23, 42, 0.85)"
                    stroke="var(--border-subtle)"
                  />
                  <text
                    x={midX}
                    y={midY + 2}
                    fill={isCrypto ? '#fca5a5' : isCircular ? '#d8b4fe' : '#93c5fd'}
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {edge.amount}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              const color = node.risk === 'CRITICAL' ? '#ef4444' : '#f97316';

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Glowing ring if selected */}
                  {isSelected && (
                    <circle
                      r="34"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      opacity="0.9"
                    />
                  )}

                  <circle
                    r="24"
                    fill={isSelected ? '#1e293b' : '#0f172a'}
                    stroke={color}
                    strokeWidth="3"
                  />

                  <text
                    y="4"
                    fill="#ffffff"
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {node.id.replace('ACC-', '')}
                  </text>

                  {/* Node Name Label */}
                  <rect
                    x="-75"
                    y="32"
                    width="150"
                    height="20"
                    rx="4"
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke={isSelected ? '#38bdf8' : 'var(--border-subtle)'}
                  />
                  <text
                    x="0"
                    y="46"
                    fill={isSelected ? '#38bdf8' : 'var(--text-primary)'}
                    fontSize="9.5"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {node.name.length > 22 ? `${node.name.slice(0, 20)}...` : node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Detail Inspector Sidebar */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column' }}>
          {selectedAccount ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span className={`badge ${selectedAccount.riskCategory === 'CRITICAL' ? 'badge-critical' : 'badge-high'}`}>
                  {selectedAccount.riskCategory} RISK
                </span>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  {selectedAccount.id}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{selectedAccount.holderName}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {selectedAccount.type} • {selectedAccount.jurisdiction}
              </p>

              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '14px',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CURRENT BALANCE</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                    ${selectedAccount.balance.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>KYC TIER</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#fca5a5' }}>
                    {selectedAccount.kycTier}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BENEFICIAL OWNER</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {selectedAccount.beneficialOwner || 'Undisclosed'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TAX ID / LEI</div>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                    {selectedAccount.taxId}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                  Active Surveillance Flags:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedAccount.flags.map((flag, i) => (
                    <span key={i} className="badge badge-critical" style={{ fontSize: '0.65rem' }}>
                      {flag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                  Associated Transactions ({selectedTransactions.length}):
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedTransactions.map(tx => (
                    <div 
                      key={tx.id}
                      style={{
                        padding: '8px 10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <span style={{ color: '#38bdf8' }}>{tx.id}</span>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>${tx.amount.toLocaleString()}</span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px', fontSize: '0.7rem' }}>
                        {tx.sourceAccountId === selectedAccount.id ? `➔ ${tx.targetAccountName}` : `⬅ from ${tx.sourceAccountName}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {onInvestigateNode && (
                <button
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
                  onClick={() => onInvestigateNode(selectedAccount.id)}
                >
                  Ask Copilot to Analyze {selectedAccount.id}
                </button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Select a node from the network graph to inspect
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
