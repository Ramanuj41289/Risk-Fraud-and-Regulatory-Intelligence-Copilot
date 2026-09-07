import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { CopilotChat } from './components/CopilotChat.tsx';
import { SignalsFeed } from './components/SignalsFeed.tsx';
import { NetworkGraph } from './components/NetworkGraph.tsx';
import { LiquidityCreditView } from './components/LiquidityCreditView.tsx';
import { AuditTrailView } from './components/AuditTrailView.tsx';
import { RegulatoryReportModal } from './components/RegulatoryReportModal.tsx';
import { generateAllActiveSignals } from './engine/detectors.ts';
import { generateSTRReport, generateBaselLiquidityMemo } from './engine/reportGenerator.ts';
import { auditTrail } from './engine/copilotEngine.ts';
import { SuspiciousReport } from './data/types.ts';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('copilot');
  const [activePrompt, setActivePrompt] = useState<string>('');
  const [activeReport, setActiveReport] = useState<SuspiciousReport | null>(null);

  const activeSignals = generateAllActiveSignals();

  const handleInvestigateFromFeed = (promptText: string) => {
    setActivePrompt(promptText);
    setActiveTab('copilot');
  };

  const handleOpenReportForAccount = (accountId: string) => {
    const report = generateSTRReport(accountId);
    setActiveReport(report);
  };

  const handleOpenReportDirect = (report: SuspiciousReport) => {
    setActiveReport(report);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        signalCount={activeSignals.length}
        onOpenReportModal={() => handleOpenReportForAccount('ACC-8821')}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'copilot' && (
          <CopilotChat
            initialPrompt={activePrompt}
            onOpenReport={handleOpenReportDirect}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'signals' && (
          <SignalsFeed
            signals={activeSignals}
            onInvestigate={handleInvestigateFromFeed}
            onOpenReport={handleOpenReportForAccount}
          />
        )}

        {activeTab === 'mule_graph' && (
          <NetworkGraph
            onInvestigateNode={(accId) => {
              handleInvestigateFromFeed(`Investigate transaction flow and mule patterns for account ${accId}`);
            }}
          />
        )}

        {activeTab === 'liquidity' && (
          <LiquidityCreditView
            onGenerateMemo={() => {
              const memo = generateBaselLiquidityMemo();
              setActiveReport(memo);
            }}
            onInvestigateCredit={(borrowerId) => {
              handleInvestigateFromFeed(`Analyze single borrower credit concentration limit breach for borrower ${borrowerId} under BCBS LEF.`);
            }}
          />
        )}

        {activeTab === 'audit' && (
          <AuditTrailView auditRecords={auditTrail} />
        )}
      </main>

      {/* Regulatory Report Modal */}
      <RegulatoryReportModal
        report={activeReport}
        onClose={() => setActiveReport(null)}
      />
    </div>
  );
};

export default App;
