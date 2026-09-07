import { SuspiciousReport, Transaction, Account } from '../data/types.ts';
import { mockAccounts } from '../data/accounts.ts';
import { mockTransactions } from '../data/transactions.ts';
import { detectSmurfingPatterns, checkLiquidityStatus, checkCreditConcentrations } from './detectors.ts';
import { searchRegulatoryPolicies } from './policyRag.ts';

export function generateSTRReport(
  accountId: string,
  officerName: string = 'Sarah Jenkins (Chief AML Officer)'
): SuspiciousReport {
  const account = mockAccounts.find(a => a.id === accountId) || mockAccounts[0];
  const smurfingResults = detectSmurfingPatterns();
  const smurfingMatch = smurfingResults.find(s => s.accountId === accountId);
  
  const relevantTxs: Transaction[] = smurfingMatch 
    ? smurfingMatch.transactions 
    : mockTransactions.filter(t => t.sourceAccountId === accountId || t.targetAccountId === accountId);

  const totalVol = relevantTxs.reduce((sum, t) => sum + t.amount, 0);

  const policyMatches = searchRegulatoryPolicies('structuring smurfing str ctr evade');

  const reportId = `STR-${new Date().getFullYear()}-${account.id}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    reportId,
    reportType: 'STR',
    generatedAt: new Date().toISOString(),
    filingEntity: {
      institutionName: 'Apex First Commercial Bank N.A.',
      institutionType: 'Scheduled Commercial Bank / NBFC Category A',
      reportingOfficer: officerName,
      licenseNumber: 'REG-BNK-9812-US'
    },
    subjectEntity: {
      accountId: account.id,
      name: account.holderName,
      taxId: account.taxId,
      kycTier: account.kycTier,
      riskCategory: account.riskCategory,
      address: 'Suite 400, Commerce Tower, Financial District'
    },
    executiveSummary: `Suspicious Transaction Report filed pursuant to statutory Anti-Money Laundering requirements. The subject account (${account.holderName}, ${account.accountNumber}) engaged in structured deposits deliberately engineered below the $10,000 threshold within a 48-hour window, totaling $${totalVol.toLocaleString()} across ${relevantTxs.length} rapid transactions.`,
    suspicionNarrative: `Between September 5 and September 7, 2026, automated transaction surveillance flagged Account ${account.id} for anomalous velocity and structuring patterns. The account received and transferred ${relevantTxs.length} separate tranches between $9,800 and $9,950—amounts directly approximating the mandatory Currency Transaction Reporting (CTR) ceiling. Transactions were routed via multiple internal and external channels (IMPS, RTGS, Wire) to rapid pass-through intermediary student accounts and offshore entities, showing zero legitimate economic or commercial rationale corresponding to the stated line of business.`,
    regulatoryCitations: policyMatches.map(p => ({
      regulation: p.policy.regulationName,
      section: p.policy.section,
      clauseQuote: p.policy.text
    })),
    supportingEvidence: {
      totalVolume: totalVol,
      transactionCount: relevantTxs.length,
      windowDays: 2,
      transactions: relevantTxs
    },
    indicatorsDetected: [
      'Deliberate sub-threshold transaction structuring ($9,800 - $9,950 corridor)',
      'High velocity relative to historical average account balance ($12,000 baseline)',
      'Pass-through routing to retail student nominee accounts',
      'Cross-border high-risk jurisdiction off-ramp linkage'
    ],
    actionTaken: 'Account placed under immediate debit restraint; internal risk score elevated to 98/100; notification issued to FIU investigative desk.',
    recommendedNextSteps: [
      'Maintain continuous 24/7 monitoring of affiliated counterparties',
      'Request complete source of wealth documentation under enhanced due diligence (EDD)',
      'Coordinate with FIU liaison for potential freezing of linked crypto-onramp recipient addresses'
    ],
    governanceSignature: {
      signOffStatus: 'DRAFT_CONFIRMED',
      timestamp: new Date().toISOString(),
      complianceOfficer: officerName
    }
  };
}

export function generateBaselLiquidityMemo(
  officerName: string = 'David Sterling (Head of Treasury & ALM)'
): SuspiciousReport {
  const liquidity = checkLiquidityStatus();
  const policies = searchRegulatoryPolicies('basel lcr liquidity hqla');

  return {
    reportId: `MEMO-LCR-${new Date().getFullYear()}-09`,
    reportType: 'BASEL_LCR_MEMO',
    generatedAt: new Date().toISOString(),
    filingEntity: {
      institutionName: 'Apex First Commercial Bank N.A.',
      institutionType: 'Scheduled Commercial Bank',
      reportingOfficer: officerName,
      licenseNumber: 'REG-BNK-9812-US'
    },
    subjectEntity: {
      accountId: 'TREASURY-GLOBAL-ALM',
      name: 'Global Balance Sheet & Liquidity Risk Division',
      taxId: 'US-EIN-1102948',
      kycTier: 'TIER_1',
      riskCategory: 'CRITICAL',
      address: 'Executive Tower, Treasury Floor 18'
    },
    executiveSummary: `Supervisory Regulatory Filing: Breach of Basel III Minimum Liquidity Coverage Ratio (LCR). Current institution LCR stands at ${liquidity.latestMetric.lcrRatio.toFixed(1)}%, falling below the mandatory 100.0% statutory floor by ${(100.0 - liquidity.latestMetric.lcrRatio).toFixed(1)} percentage points, with a net liquidity deficit of $${liquidity.deficitAmount.toLocaleString()}.`,
    suspicionNarrative: `During the 30-day forward liquidity stress assessment conducted as of September 7, 2026, wholesale uncommitted deposit run-off surged to $${liquidity.latestMetric.wholesaleRunOff.toLocaleString()}, while unencumbered Level 1 High-Quality Liquid Assets (HQLA) depleted to $${liquidity.latestMetric.stockHQLA.toLocaleString()}. Net cash outflows over the 30 calendar day stress horizon are calculated at $${liquidity.latestMetric.netCashOutflows30D.toLocaleString()}, inducing a statutory breach under BCBS LCR rules.`,
    regulatoryCitations: policies.map(p => ({
      regulation: p.policy.regulationName,
      section: p.policy.section,
      clauseQuote: p.policy.text
    })),
    supportingEvidence: {
      totalVolume: liquidity.deficitAmount,
      transactionCount: liquidity.historicalTrend.length,
      windowDays: 30,
      transactions: []
    },
    indicatorsDetected: [
      `LCR Ratio: ${liquidity.latestMetric.lcrRatio.toFixed(1)}% (Statutory Floor: 100.0%)`,
      `Net Cash Outflows (30D): $${liquidity.latestMetric.netCashOutflows30D.toLocaleString()}`,
      `Unencumbered HQLA Stock: $${liquidity.latestMetric.stockHQLA.toLocaleString()}`,
      `Shortfall to Statutory Minimum: $${liquidity.deficitAmount.toLocaleString()}`
    ],
    actionTaken: 'Triggered Green Alert on ALCO Dashboard; activated Secondary Liquidity Facility; scheduled Emergency ALCO Meeting.',
    recommendedNextSteps: [
      'Draw down $120M from Central Bank Standing Liquidity Facility (SLF) against sovereign collateral',
      'Curtail short-term interbank wholesale lending placements',
      'Submit Form LCR-B1 to Central Bank Banking Supervision Division within statutory 24-hour notification window'
    ],
    governanceSignature: {
      signOffStatus: 'DRAFT_CONFIRMED',
      timestamp: new Date().toISOString(),
      complianceOfficer: officerName
    }
  };
}

export function generateCreditConcentrationDossier(
  officerName: string = 'Marcus Vance (Chief Risk Officer)'
): SuspiciousReport {
  const credit = checkCreditConcentrations();
  const breach = credit.breaches[0];
  const policies = searchRegulatoryPolicies('credit concentration large exposure single borrower');

  return {
    reportId: `DOSSIER-LEF-${new Date().getFullYear()}-001`,
    reportType: 'CREDIT_CONCENTRATION_EXC',
    generatedAt: new Date().toISOString(),
    filingEntity: {
      institutionName: 'Apex First Commercial Bank N.A.',
      institutionType: 'Scheduled Commercial Bank',
      reportingOfficer: officerName,
      licenseNumber: 'REG-BNK-9812-US'
    },
    subjectEntity: {
      accountId: breach ? breach.borrowerId : 'BOR-7741',
      name: breach ? breach.borrowerName : 'Zenith Infrastructure Ltd',
      taxId: 'IND-GST-07AAACZ1122',
      kycTier: 'TIER_1',
      riskCategory: 'HIGH',
      address: 'Industrial Corridor Sector 9'
    },
    executiveSummary: `Prudential Exception Report: Breach of BCBS Large Exposure Framework (LEF). Counterparty exposure to ${breach?.borrowerName} has reached ${breach?.concentrationRatio.toFixed(2)}% of Tier 1 Capital Base, exceeding the statutory 20.00% single-borrower regulatory ceiling.`,
    suspicionNarrative: `Credit risk review identified that aggregate funded and non-funded exposure to ${breach?.borrowerName} stands at $${breach?.totalExposure.toLocaleString()} against Tier 1 Eligible Capital of $${breach?.tier1CapitalBase.toLocaleString()}. The exposure is compounded by an internal rating migration to ${breach?.rating} and classification under ECL Stage 2, requiring immediate remediation.`,
    regulatoryCitations: policies.map(p => ({
      regulation: p.policy.regulationName,
      section: p.policy.section,
      clauseQuote: p.policy.text
    })),
    supportingEvidence: {
      totalVolume: breach?.totalExposure || 68000000,
      transactionCount: 1,
      windowDays: 90,
      transactions: []
    },
    indicatorsDetected: [
      `Single Counterparty Exposure: ${breach?.concentrationRatio.toFixed(2)}% (Max Limit: 20.00%)`,
      `ECL Staging: ${breach?.eclStage} with $${breach?.provisionAmount.toLocaleString()} loan impairment reserve`,
      'Sector Concentration: Infrastructure & Power'
    ],
    actionTaken: 'Credit line frozen for further drawdown; syndication mandate issued to institutional partners.',
    recommendedNextSteps: [
      'Sell down $12M of funded debt via loan syndication market within 30 days',
      'Require additional first-charge collateral security on operating energy assets',
      'Submit Large Exposure Rectification Undertaking to the Central Bank'
    ],
    governanceSignature: {
      signOffStatus: 'DRAFT_CONFIRMED',
      timestamp: new Date().toISOString(),
      complianceOfficer: officerName
    }
  };
}
