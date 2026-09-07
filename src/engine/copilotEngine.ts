/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick
 * Email: ujjwalkumarbhowmick30@gmail.com
 * All rights reserved.
 */

import { mockAccounts } from '../data/accounts.ts';
import { mockTransactions } from '../data/transactions.ts';
import { mockRegulatoryPolicies } from '../data/regulatoryPolicies.ts';
import { 
  detectSmurfingPatterns, 
  detectMuleRings, 
  checkLiquidityStatus, 
  checkCreditConcentrations,
  generateAllActiveSignals
} from './detectors.ts';
import { searchRegulatoryPolicies, PolicyMatch } from './policyRag.ts';
import { generateSTRReport, generateBaselLiquidityMemo, generateCreditConcentrationDossier } from './reportGenerator.ts';
import { AuditRecord, SuspiciousReport, Transaction } from '../data/types.ts';

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  timestamp: string;
  content: string;
  reasoningSteps?: string[];
  citations?: PolicyMatch[];
  evidenceData?: {
    type: 'TRANSACTIONS' | 'MULE_GRAPH' | 'LIQUIDITY' | 'CREDIT' | 'SIGNALS';
    data: any;
  };
  confidenceScore?: number;
  suggestedActions?: { label: string; action: string; payload?: any }[];
  reportDraft?: SuspiciousReport;
}

// In-memory audit trail of all queries and regulatory actions
export const auditTrail: AuditRecord[] = [
  {
    id: 'AUDIT-INIT-001',
    timestamp: '2026-09-07T08:00:00Z',
    userRole: 'Compliance Officer (Lead)',
    query: 'System Initialized: Real-time fraud and regulatory surveillance feed active',
    actionType: 'SIGNAL_TRIAGE',
    accountsExamined: ['ACC-8821', 'ACC-1044', 'ACC-1045', 'ACC-1046'],
    policiesCited: ['FinCEN 31 CFR § 1010.314', 'FATF Recommendation 20', 'Basel III LCR'],
    confidenceScore: 99,
    reasoningTraces: [
      'Loaded 500+ transactional records into surveillance ledger',
      'Indexed regulatory master directions and circulars',
      'Computed LCR and large exposure ratios'
    ]
  }
];

export function addAuditRecord(record: Omit<AuditRecord, 'id' | 'timestamp'>) {
  const newRecord: AuditRecord = {
    id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ...record
  };
  auditTrail.unshift(newRecord);
  return newRecord;
}

/**
 * Process a natural language question through the Copilot Intelligence Engine
 */
export async function processCopilotQuery(query: string): Promise<CopilotMessage> {
  const qLower = query.toLowerCase();
  const reasoningSteps: string[] = [];
  const accountsExamined: string[] = [];
  const policiesCited: string[] = [];
  let confidenceScore = 96;

  reasoningSteps.push('Parsed natural language query intent, extracting risk entities, timeframe, and regulatory scope.');

  // 1. Check if user wants to generate or draft a report (STR / SAR / Basel Memo)
  if (qLower.includes('draft') || qLower.includes('report') || qLower.includes('str') || qLower.includes('sar') || qLower.includes('memo') || qLower.includes('dossier')) {
    reasoningSteps.push('Identified regulatory report drafting intent.');

    if (qLower.includes('lcr') || qLower.includes('liquidity') || qLower.includes('basel')) {
      reasoningSteps.push('Retrieving Basel III Liquidity Coverage data and ALM stress calculations...');
      reasoningSteps.push('Validating shortfall against 100% statutory floor...');
      
      const memo = generateBaselLiquidityMemo();
      policiesCited.push('Basel III Part 2: LCR Framework');
      
      addAuditRecord({
        userRole: 'Senior Risk & Regulatory Analyst',
        query,
        actionType: 'STR_GENERATION',
        accountsExamined: ['TREASURY-GLOBAL-ALM'],
        policiesCited,
        confidenceScore: 99,
        reasoningTraces: reasoningSteps,
        reportGeneratedId: memo.reportId
      });

      return {
        id: `MSG-${Date.now()}`,
        sender: 'copilot',
        timestamp: new Date().toISOString(),
        content: `### 📋 Audit-Ready Regulatory Memo Prepared\n\nI have generated a formal supervisory memo for the **Basel III Liquidity Coverage Ratio (LCR) Breach**.\n\n- **Document ID**: \`${memo.reportId}\`\n- **Current LCR**: **82.4%** *(Statutory Floor: 100.0%)*\n- **Net Deficit**: **$73,000,000**\n- **Reporting Obligation**: 24-Hour Mandatory Notice to Central Bank Banking Supervision Division.\n\nYou can inspect the complete evidence table, legal narrative, and compliance sign-off below.`,
        reasoningSteps,
        confidenceScore: 99,
        reportDraft: memo,
        suggestedActions: [
          { label: 'Print / Export Memo', action: 'EXPORT_REPORT', payload: memo },
          { label: 'Review Treasury Liquidity Tab', action: 'NAVIGATE_TAB', payload: 'liquidity' }
        ]
      };
    }

    // Default to STR report for Account ACC-8821 or specified account
    const targetAccountId = qLower.includes('acc-') 
      ? query.match(/acc-\d+/i)?.[0].toUpperCase() || 'ACC-8821'
      : 'ACC-8821';

    accountsExamined.push(targetAccountId);
    reasoningSteps.push(`Gathering chronological transaction evidence for target account ${targetAccountId}...`);
    reasoningSteps.push('Cross-referencing FinCEN 31 CFR § 1010.314 & FATF Recommendation 20 structuring thresholds...');
    reasoningSteps.push('Synthesizing structured suspicion narrative and regulatory indicators...');

    const strReport = generateSTRReport(targetAccountId);
    policiesCited.push('FinCEN 31 CFR § 1010.314', 'FATF Recommendation 20');

    addAuditRecord({
      userRole: 'Compliance Officer',
      query,
      actionType: 'STR_GENERATION',
      accountsExamined,
      policiesCited,
      confidenceScore: 98,
      reasoningTraces: reasoningSteps,
      reportGeneratedId: strReport.reportId
    });

    return {
      id: `MSG-${Date.now()}`,
      sender: 'copilot',
      timestamp: new Date().toISOString(),
      content: `### 🛡️ Audit-Ready Suspicious Transaction Report (STR) Generated\n\nI have prepared a complete, legally governed **Suspicious Transaction Report** for **${strReport.subjectEntity.name} (${strReport.subjectEntity.accountId})** ready for submission to the Financial Intelligence Unit (FIU).\n\n- **Report Filing ID**: \`${strReport.reportId}\`\n- **Pattern Detected**: Deliberate sub-threshold smurfing ($9,800 - $9,950 corridor)\n- **Aggregated Value**: **$${strReport.supportingEvidence.totalVolume.toLocaleString()}** across **${strReport.supportingEvidence.transactionCount} transactions** in 48 hours\n- **Governing Law**: FinCEN 31 CFR § 1010.314 & FATF Rec 20\n\nThe full filing dossier with transaction lineage and regulatory clauses is attached below.`,
      reasoningSteps,
      confidenceScore: 98,
      reportDraft: strReport,
      suggestedActions: [
        { label: 'View Audit-Ready Report Dossier', action: 'OPEN_REPORT_MODAL', payload: strReport },
        { label: 'View Network Graph', action: 'NAVIGATE_TAB', payload: 'mule_graph' }
      ]
    };
  }

  // 2. Mule Network / Graph Inquiry
  if (qLower.includes('mule') || qLower.includes('syndicate') || qLower.includes('ring') || qLower.includes('circular') || qLower.includes('flow')) {
    reasoningSteps.push('Graph surveillance activated: tracing multi-hop directed fund transfers...');
    reasoningSteps.push('Analyzing pass-through velocity and fund retention percentages...');
    
    const muleRings = detectMuleRings();
    const activeRing = muleRings[0];
    const citations = searchRegulatoryPolicies('mule layering pass through rapid velocity');

    citations.forEach(c => policiesCited.push(c.citationText));
    accountsExamined.push('ACC-8821', 'ACC-1044', 'ACC-1045', 'ACC-1046');

    addAuditRecord({
      userRole: 'Fraud Investigator',
      query,
      actionType: 'QUERY',
      accountsExamined,
      policiesCited,
      confidenceScore: 97,
      reasoningTraces: reasoningSteps
    });

    return {
      id: `MSG-${Date.now()}`,
      sender: 'copilot',
      timestamp: new Date().toISOString(),
      content: `### 🕸️ Money Mule Syndicate & Layering Ring Detected\n\nGraph analysis identified an active **3-tier money mule syndicate** routing illicit funds from commercial shell **Apex Horizon Logistics (ACC-8821)** into offshore crypto gateways:\n\n1. **Tier 1 (Placement/Structuring)**: ACC-8821 splits $49,420 into 5 sub-$10k transfers.\n2. **Tier 2 (Intermediary Mules)**: Retail accounts **Devon Keith (ACC-1044)** and **Tanya Gomez (ACC-1045)** receive funds and retain less than 4% as commissions.\n3. **Tier 3 (Off-Ramp)**: Within 4 hours, **$37,600** is rapidly transferred into **Nexus Global Crypto Gateway (ACC-1046)** in Seychelles.\n4. **Circular Hop**: Secondary channel from **Elena Rostova (ACC-3190)** loops $8,750 back to the originator as a sham loan repayment.\n\n> **Regulatory Citation**: ${citations[0]?.citationText}\n> *"Financial institutions must implement real-time velocity monitoring on accounts that display rapid pass-through funds (>80% outflow within 24h)..."*\n\nRecommended Action: Execute immediate debit freeze on intermediate nodes ACC-1044 and ACC-1045.`,
      reasoningSteps,
      citations,
      confidenceScore: 97,
      evidenceData: {
        type: 'MULE_GRAPH',
        data: activeRing
      },
      suggestedActions: [
        { label: 'Inspect Visual Network Graph', action: 'NAVIGATE_TAB', payload: 'mule_graph' },
        { label: 'Draft STR Report for Mule Ring', action: 'PROMPT', payload: 'Draft an STR report for Account ACC-8821' }
      ]
    };
  }

  // 3. Liquidity Risk & Basel III LCR Inquiry
  if (qLower.includes('liquidity') || qLower.includes('lcr') || qLower.includes('basel') || qLower.includes('hqla') || qLower.includes('run-off')) {
    reasoningSteps.push('Executing Basel III Liquidity Engine: Aggregating unencumbered HQLA and 30-day net outflows...');
    reasoningSteps.push('Evaluating compliance with BCBS 100% minimum LCR prudential mandate...');

    const liquidity = checkLiquidityStatus();
    const citations = searchRegulatoryPolicies('basel iii lcr liquidity coverage ratio hqla');
    citations.forEach(c => policiesCited.push(c.citationText));
    accountsExamined.push('TREASURY-GLOBAL-ALM');

    addAuditRecord({
      userRole: 'Treasury / ALM Manager',
      query,
      actionType: 'POLICY_CHECK',
      accountsExamined,
      policiesCited,
      confidenceScore: 99,
      reasoningTraces: reasoningSteps
    });

    return {
      id: `MSG-${Date.now()}`,
      sender: 'copilot',
      timestamp: new Date().toISOString(),
      content: `### ⚠️ Basel III Liquidity Coverage Ratio (LCR) Alert\n\n**Prudential Breach Identified**: The bank's current Liquidity Coverage Ratio has fallen to **${liquidity.latestMetric.lcrRatio.toFixed(1)}%**, below the statutory Basel III minimum threshold of **100.0%**.\n\n#### Key Position Metrics (as of ${liquidity.latestMetric.date}):\n- **Stock of High-Quality Liquid Assets (HQLA)**: **$${liquidity.latestMetric.stockHQLA.toLocaleString()}** *(Down $78M over 7 days)*\n- **30-Day Stressed Expected Outflows**: **$${liquidity.latestMetric.totalExpectedOutflows30D.toLocaleString()}** *(Wholesale deposit run-off: $${liquidity.latestMetric.wholesaleRunOff.toLocaleString()})*\n- **Net 30-Day Cash Outflows**: **$${liquidity.latestMetric.netCashOutflows30D.toLocaleString()}**\n- **Net Liquidity Shortfall**: **$${liquidity.deficitAmount.toLocaleString()}**\n\n> **Regulatory Clause Cited**: ${citations[0]?.citationText}\n> *"Formula: Stock of HQLA / Total net cash outflows over 30 days >= 100%. If LCR falls below 100%, the bank must immediately notify the supervisory authority and activate the Board Liquidity Contingency Plan."*\n\n**Governance Directives**:\n1. Convene an Extraordinary ALCO Meeting within 4 hours.\n2. Tap $120M from Central Bank Standing Liquidity Facility.\n3. Prepare statutory Central Bank notice.`,
      reasoningSteps,
      citations,
      confidenceScore: 99,
      evidenceData: {
        type: 'LIQUIDITY',
        data: liquidity
      },
      suggestedActions: [
        { label: 'Generate Basel III LCR Memo', action: 'PROMPT', payload: 'Generate Basel III LCR Memo' },
        { label: 'View Liquidity & Credit Dashboard', action: 'NAVIGATE_TAB', payload: 'liquidity' }
      ]
    };
  }

  // 4. Credit Concentration & Large Exposure Framework (LEF)
  if (qLower.includes('credit') || qLower.includes('concentration') || qLower.includes('single borrower') || qLower.includes('exposure') || qLower.includes('npa') || qLower.includes('ecl')) {
    reasoningSteps.push('Interrogating Commercial Credit Ledger and Tier 1 Capital Base...');
    reasoningSteps.push('Evaluating single borrower ratios against BCBS 20.00% ceiling...');

    const credit = checkCreditConcentrations();
    const breach = credit.breaches[0];
    const citations = searchRegulatoryPolicies('credit concentration large exposure single borrower');
    citations.forEach(c => policiesCited.push(c.citationText));
    accountsExamined.push(breach?.borrowerId || 'BOR-7741');

    addAuditRecord({
      userRole: 'Chief Credit Officer',
      query,
      actionType: 'POLICY_CHECK',
      accountsExamined,
      policiesCited,
      confidenceScore: 98,
      reasoningTraces: reasoningSteps
    });

    return {
      id: `MSG-${Date.now()}`,
      sender: 'copilot',
      timestamp: new Date().toISOString(),
      content: `### 🚨 Large Exposure Regulatory Breach Detected\n\nSurveillance identified an exposure ceiling violation under the **BCBS Large Exposure Framework (LEF)**:\n\n- **Borrower**: **${breach?.borrowerName}** (\`${breach?.borrowerId}\`)\n- **Sector**: ${breach?.sector}\n- **Funded + Non-Funded Exposure**: **$${breach?.totalExposure.toLocaleString()}**\n- **Tier 1 Capital Base**: **$${breach?.tier1CapitalBase.toLocaleString()}**\n- **Current Concentration Ratio**: **${breach?.concentrationRatio.toFixed(2)}%** *(Regulatory Limit: 20.00%)*\n- **ECL Staging / Credit Health**: **${breach?.eclStage}** (Impairment reserve: $${breach?.provisionAmount.toLocaleString()}, Rating: ${breach?.rating})\n\n> **Regulatory Clause Cited**: ${citations[0]?.citationText}\n> *"The sum of all exposure values of a bank to a single counterparty... must not exceed 20% of the bank’s Tier 1 Capital Base. Temporary breaches require risk-weighted asset capital surcharge and formal remediation roadmap."*\n\n**Remediation Steps**:\n- Sell down $8M via loan syndication.\n- Restrict additional loan drawdowns.\n- File Large Exposure Exception Dossier.`,
      reasoningSteps,
      citations,
      confidenceScore: 98,
      evidenceData: {
        type: 'CREDIT',
        data: credit
      },
      suggestedActions: [
        { label: 'Generate Large Exposure Dossier', action: 'PROMPT', payload: 'Generate credit concentration exception dossier' },
        { label: 'View Credit Registry', action: 'NAVIGATE_TAB', payload: 'liquidity' }
      ]
    };
  }

  // 5. Fraud Smurfing / Structuring specific inquiry
  if (qLower.includes('smurf') || qLower.includes('structur') || qLower.includes('acc-8821') || qLower.includes('apex') || qLower.includes('evade') || qLower.includes('ctr')) {
    reasoningSteps.push('Executing transaction structuring detector: filtering transactions between $7,500 and $9,999...');
    reasoningSteps.push('Aggregating 48-hour velocity and counterparty links for Account ACC-8821...');
    reasoningSteps.push('Grounded against FinCEN 31 CFR § 1010.314 & FATF Recommendation 20...');

    const smurfing = detectSmurfingPatterns();
    const match = smurfing[0];
    const citations = searchRegulatoryPolicies('structuring smurfing ctr evade 10000');
    citations.forEach(c => policiesCited.push(c.citationText));
    accountsExamined.push('ACC-8821');

    addAuditRecord({
      userRole: 'Senior AML Investigator',
      query,
      actionType: 'QUERY',
      accountsExamined,
      policiesCited,
      confidenceScore: 99,
      reasoningTraces: reasoningSteps
    });

    return {
      id: `MSG-${Date.now()}`,
      sender: 'copilot',
      timestamp: new Date().toISOString(),
      content: `### 🚨 Structuring / Smurfing Pattern Confirmed in Account ACC-8821\n\nAnalysis of **${match.accountName} (ACC-8821)** reveals intentional transaction structuring designed to evade the **$10,000 Currency Transaction Report (CTR)** filing threshold:\n\n- **Identified Transactions**: **${match.txCount} transactions** totaling **$${match.totalAmount.toLocaleString()}**\n- **Average Transaction**: **$${match.averageAmount.toLocaleString()}** *(All within 98% to 99.5% of the $10,000 ceiling)*\n- **Time Window**: **${match.timeSpanHours} hours** (Sept 5 – Sept 6, 2026)\n- **Routing Pattern**: Split outward payments to personal student accounts (Devon Keith, Tanya Gomez) followed by immediate crypto-onramp egress.\n\n> **Governing Regulatory Standard**: ${citations[0]?.citationText}\n> *\"No person shall for the purpose of evading reporting requirements structure transactions in amounts just below the statutory reporting threshold... Multiple transactions within 48 to 72 hours aggregating beyond the limit must be treated as a single transaction and flagged for STR.\"*\n\n**Audit-Ready Finding**: The transactions fulfill all criteria for mandatory Suspicious Transaction Reporting (STR) under FATF Recommendation 20.`,
      reasoningSteps,
      citations,
      confidenceScore: 99,
      evidenceData: {
        type: 'TRANSACTIONS',
        data: match.transactions
      },
      suggestedActions: [
        { label: 'Draft STR Regulatory Filing', action: 'PROMPT', payload: 'Draft an STR report for Account ACC-8821' },
        { label: 'Trace Fund Flow in Mule Graph', action: 'NAVIGATE_TAB', payload: 'mule_graph' }
      ]
    };
  }

  // 6. General Overview / Active Signals Inquiry
  reasoningSteps.push('Executing comprehensive multi-pillar risk scan across Fraud, Liquidity, and Credit...');
  reasoningSteps.push('Benchmarking against active regulatory circulars...');

  const activeSignals = generateAllActiveSignals();
  const citations = searchRegulatoryPolicies(query);
  citations.forEach(c => policiesCited.push(c.citationText));

  addAuditRecord({
    userRole: 'Compliance Officer',
    query,
    actionType: 'SIGNAL_TRIAGE',
    accountsExamined: ['ACC-8821', 'ACC-1044', 'BOR-7741'],
    policiesCited,
    confidenceScore: 95,
    reasoningTraces: reasoningSteps
  });

  return {
    id: `MSG-${Date.now()}`,
    sender: 'copilot',
    timestamp: new Date().toISOString(),
    content: `### 🛡️ Enterprise Risk & Regulatory Intelligence Briefing\n\nI have scanned all transactional feeds, prudential ledgers, and regulatory circulars. Here are the top critical signals requiring supervisory intervention:\n\n1. **🚨 Fraud / Smurfing**: **Apex Horizon Logistics (ACC-8821)** executed **5 structured payments ($49,420)** just under the $10k threshold in 48 hours to evade CTR.\n2. **🕸️ Mule Syndicate**: Inward funds to student account **Devon Keith (ACC-1044)** rapidly forwarded to **Nexus Crypto Gateway (ACC-1046)** with 96% pass-through velocity.\n3. **📉 Liquidity Risk**: **Basel III LCR dropped to 82.4%** (Statutory Floor: 100%), creating a **$73M liquidity deficit** due to wholesale run-offs.\n4. **⚖️ Credit Concentration**: **Zenith Infrastructure (BOR-7741)** exposure stands at **22.67% of Tier 1 Capital**, breaching the 20% single borrower ceiling.\n\nAll signals are fully grounded with raw transaction evidence and exact statutory clauses. How would you like to proceed?`,
    reasoningSteps,
    citations,
    confidenceScore: 95,
    evidenceData: {
      type: 'SIGNALS',
      data: activeSignals
    },
    suggestedActions: [
      { label: 'Investigate Smurfing in ACC-8821', action: 'PROMPT', payload: 'Investigate smurfing in account ACC-8821' },
      { label: 'Check Basel III LCR Deficit', action: 'PROMPT', payload: 'What is our current LCR ratio and liquidity deficit?' },
      { label: 'Draft STR for Account ACC-8821', action: 'PROMPT', payload: 'Draft an STR report for Account ACC-8821' }
    ]
  };
}
