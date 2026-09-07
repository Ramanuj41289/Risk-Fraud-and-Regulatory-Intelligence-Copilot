import React, { useState, useRef, useEffect } from 'react';
import { CopilotMessage, processCopilotQuery } from '../engine/copilotEngine.ts';
import { SuspiciousReport, Transaction } from '../data/types.ts';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ShieldAlert, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  CheckCircle2,
  Share2,
  BarChart3,
  Flame
} from 'lucide-react';

interface CopilotChatProps {
  initialPrompt?: string;
  onOpenReport: (report: SuspiciousReport) => void;
  onNavigateTab: (tab: string) => void;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({
  initialPrompt,
  onOpenReport,
  onNavigateTab
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init-msg',
      sender: 'copilot',
      timestamp: new Date().toISOString(),
      content: `### Welcome to SentinelRisk Intelligence Copilot\n\nI am your governed, evidence-backed regulatory assistant. I continuously monitor:\n- **Real-Time Transaction Surveillance**: Smurfing/structuring, pass-through mules, rapid velocity spikes\n- **Prudential Liquidity (Basel III)**: 30-day LCR monitoring, unencumbered HQLA deficits\n- **Credit Concentration**: BCBS Large Exposure Framework (LEF) limits and ECL staging\n- **Statutory Reporting**: Audit-ready STR / SAR dossiers and supervisory memorandums.\n\nSelect a preset inquiry below or ask any question in plain English.`,
      confidenceScore: 100,
      suggestedActions: [
        { label: 'Investigate Smurfing in ACC-8821', action: 'PROMPT', payload: 'Investigate suspicious smurfing in account ACC-8821 and cite AML policy' },
        { label: 'Check Basel III LCR Deficit', action: 'PROMPT', payload: 'What is our current LCR ratio and are we compliant with Basel III?' },
        { label: 'Trace Mule Syndicate Flow', action: 'PROMPT', payload: 'Trace money mule fund flow and circular routing for active syndicates' },
        { label: 'Draft Audit-Ready STR Report', action: 'PROMPT', payload: 'Draft an audit-ready STR report for Account ACC-8821' }
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendQuery(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await processCopilotQuery(queryText);
      setMessages(prev => [...prev, response]);
      // Auto expand reasoning for fresh response
      setExpandedReasoning(prev => ({ ...prev, [response.id]: true }));
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'copilot',
          timestamp: new Date().toISOString(),
          content: 'An error occurred while querying the regulatory knowledge fabric.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleReasoning = (id: string) => {
    setExpandedReasoning(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleActionClick = (action: { label: string; action: string; payload?: any }) => {
    if (action.action === 'PROMPT') {
      handleSendQuery(action.payload);
    } else if (action.action === 'OPEN_REPORT_MODAL' || action.action === 'EXPORT_REPORT') {
      onOpenReport(action.payload);
    } else if (action.action === 'NAVIGATE_TAB') {
      onNavigateTab(action.payload);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      height: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px'
    }}>
      {/* Messages Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {messages.map((msg) => (
          <div 
            key={msg.id}
            style={{
              display: 'flex',
              gap: '14px',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: msg.sender === 'user' ? '70%' : '88%'
            }}
          >
            {/* Avatar */}
            {msg.sender === 'copilot' ? (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '4px'
              }}>
                <Bot size={20} color="#ffffff" />
              </div>
            ) : (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '4px'
              }}>
                <User size={18} color="#f8fafc" />
              </div>
            )}

            {/* Content Card */}
            <div className="glass-panel" style={{
              padding: '20px',
              background: msg.sender === 'user' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(17, 24, 39, 0.85)',
              border: msg.sender === 'user' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid var(--border-subtle)'
            }}>
              {/* Message Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: msg.sender === 'user' ? '#38bdf8' : '#7dd3fc' }}>
                  {msg.sender === 'user' ? 'Compliance Officer' : 'SentinelRisk Intelligence Core'}
                </span>
                {msg.confidenceScore && (
                  <span className="badge badge-safe" style={{ fontSize: '0.65rem' }}>
                    <CheckCircle2 size={12} /> {msg.confidenceScore}% GROUNDED CONFIDENCE
                  </span>
                )}
              </div>

              {/* Reasoning Steps Accordion (for Copilot) */}
              {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                <div style={{
                  marginBottom: '16px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden'
                }}>
                  <div 
                    onClick={() => toggleReasoning(msg.id)}
                    style={{
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={13} color="#38bdf8" />
                      <span>Audit-Ready Reasoning Process ({msg.reasoningSteps.length} Steps)</span>
                    </div>
                    {expandedReasoning[msg.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>

                  {expandedReasoning[msg.id] && (
                    <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {msg.reasoningSteps.map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>0{i + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Markdown Content */}
              <div style={{ fontSize: '0.9rem', lineHeight: 1.65, whiteSpace: 'pre-line', color: 'var(--text-primary)' }}>
                {msg.content}
              </div>

              {/* Evidence Preview (Transactions / Citations) */}
              {msg.evidenceData && msg.evidenceData.type === 'TRANSACTIONS' && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Structured Transaction Evidence:
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="compliance-table" style={{ fontSize: '0.75rem' }}>
                      <thead>
                        <tr>
                          <th>Tx ID</th>
                          <th>Amount</th>
                          <th>Counterparty</th>
                          <th>Channel</th>
                          <th>Flag</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(msg.evidenceData.data as Transaction[]).map(t => (
                          <tr key={t.id}>
                            <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{t.id}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#ef4444' }}>${t.amount.toLocaleString()}</td>
                            <td>{t.targetAccountName}</td>
                            <td>{t.channel}</td>
                            <td><span className="badge badge-critical" style={{ fontSize: '0.6rem' }}>{t.flags[0]}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Regulatory Citations Box */}
              {msg.citations && msg.citations.length > 0 && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Regulatory Authority Citations (Grounding):
                  </div>
                  {msg.citations.map((cite, i) => (
                    <div key={i} style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      borderLeft: '3px solid #38bdf8',
                      fontSize: '0.78rem'
                    }}>
                      <div style={{ fontWeight: 600, color: '#7dd3fc' }}>{cite.citationText}</div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px', fontStyle: 'italic' }}>
                        "{cite.policy.text.slice(0, 180)}..."
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  {msg.suggestedActions.map((act, i) => (
                    <button
                      key={i}
                      className={act.action.includes('REPORT') ? 'btn-primary' : 'btn-secondary'}
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                      onClick={() => handleActionClick(act)}
                    >
                      {act.action.includes('REPORT') && <FileText size={13} />}
                      {act.action === 'NAVIGATE_TAB' && <Share2 size={13} />}
                      <span>{act.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={20} color="#ffffff" />
            </div>
            <div className="glass-panel" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="pulse-indicator" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Consulting transaction ledger and querying regulatory circulars...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts Bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '6px 0',
        marginBottom: '10px'
      }}>
        <button
          className="btn-secondary"
          style={{ fontSize: '0.75rem', padding: '5px 10px', whiteSpace: 'nowrap' }}
          onClick={() => handleSendQuery('Investigate smurfing in account ACC-8821 and cite FinCEN 31 CFR')}
        >
          🔍 Investigate Smurfing (ACC-8821)
        </button>
        <button
          className="btn-secondary"
          style={{ fontSize: '0.75rem', padding: '5px 10px', whiteSpace: 'nowrap' }}
          onClick={() => handleSendQuery('What is our current LCR ratio and are we compliant with Basel III?')}
        >
          📉 Basel III LCR Check
        </button>
        <button
          className="btn-secondary"
          style={{ fontSize: '0.75rem', padding: '5px 10px', whiteSpace: 'nowrap' }}
          onClick={() => handleSendQuery('Trace circular routing and money mule pass-throughs')}
        >
          🕸️ Trace Mule Syndicate
        </button>
        <button
          className="btn-secondary"
          style={{ fontSize: '0.75rem', padding: '5px 10px', whiteSpace: 'nowrap' }}
          onClick={() => handleSendQuery('Draft an official Suspicious Transaction Report (STR) for Account ACC-8821')}
        >
          📋 Draft Audit-Ready STR
        </button>
      </div>

      {/* Query Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery(input);
        }}
        style={{
          display: 'flex',
          gap: '10px',
          background: 'var(--bg-input)',
          padding: '8px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
        }}
      >
        <input
          id="copilot-query-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Copilot about fraud signals, LCR breaches, credit exposures, or regulatory filings..."
          disabled={loading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            padding: '8px 12px',
            fontFamily: 'var(--font-body)'
          }}
        />
        <button
          id="btn-send-query"
          type="submit"
          className="btn-primary"
          disabled={loading || !input.trim()}
          style={{ padding: '8px 18px' }}
        >
          <Send size={16} />
          <span>Ask Copilot</span>
        </button>
      </form>
    </div>
  );
};
