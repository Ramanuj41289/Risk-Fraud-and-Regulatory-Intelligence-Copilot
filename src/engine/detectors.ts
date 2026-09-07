import { Transaction, Account, RiskSignal, LiquidityMetric, CreditExposure } from '../data/types.ts';
import { mockAccounts } from '../data/accounts.ts';
import { mockTransactions } from '../data/transactions.ts';
import { mockLiquidityMetrics, mockCreditExposures } from '../data/liquidityCredit.ts';

export interface SmurfingDetectionResult {
  accountId: string;
  accountName: string;
  txCount: number;
  totalAmount: number;
  averageAmount: number;
  timeSpanHours: number;
  transactions: Transaction[];
  isSmurfingAlert: boolean;
}

export interface MuleHop {
  fromAccount: string;
  toAccount: string;
  amount: number;
  timestamp: string;
  channel: string;
}

export interface MuleRingResult {
  ringId: string;
  originatorId: string;
  intermediaries: string[];
  sinkId: string;
  totalVolume: number;
  hops: MuleHop[];
  flowRetentionPct: number;
}

/**
 * Detects Smurfing / Structuring:
 * Multiple transactions just below regulatory threshold ($10,000) within 72 hours
 */
export function detectSmurfingPatterns(
  transactions: Transaction[] = mockTransactions,
  accounts: Account[] = mockAccounts,
  thresholdMax: number = 10000,
  thresholdMin: number = 7500,
  windowHours: number = 72
): SmurfingDetectionResult[] {
  const results: SmurfingDetectionResult[] = [];
  
  // Group transactions by source account
  const txBySource = new Map<string, Transaction[]>();
  transactions.forEach(tx => {
    const list = txBySource.get(tx.sourceAccountId) || [];
    list.push(tx);
    txBySource.set(tx.sourceAccountId, list);
  });

  for (const [accountId, txs] of txBySource.entries()) {
    // Sort chronologically
    const sorted = [...txs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    // Filter transactions in the suspicious structuring corridor
    const structuredTxs = sorted.filter(t => t.amount >= thresholdMin && t.amount < thresholdMax);

    if (structuredTxs.length >= 3) {
      const totalAmount = structuredTxs.reduce((sum, t) => sum + t.amount, 0);
      const firstTxTime = new Date(structuredTxs[0].timestamp).getTime();
      const lastTxTime = new Date(structuredTxs[structuredTxs.length - 1].timestamp).getTime();
      const spanHours = (lastTxTime - firstTxTime) / (1000 * 60 * 60);

      if (spanHours <= windowHours) {
        const acc = accounts.find(a => a.id === accountId);
        results.push({
          accountId,
          accountName: acc ? acc.holderName : structuredTxs[0].sourceAccountName,
          txCount: structuredTxs.length,
          totalAmount,
          averageAmount: Math.round(totalAmount / structuredTxs.length),
          timeSpanHours: Math.round(spanHours * 10) / 10,
          transactions: structuredTxs,
          isSmurfingAlert: true
        });
      }
    }
  }

  return results;
}

/**
 * Detects Money Mule Networks / Pass-Through Chains
 */
export function detectMuleRings(
  transactions: Transaction[] = mockTransactions,
  accounts: Account[] = mockAccounts
): MuleRingResult[] {
  const rings: MuleRingResult[] = [];

  // Group inflows and outflows by account
  const inflows = new Map<string, Transaction[]>();
  const outflows = new Map<string, Transaction[]>();

  transactions.forEach(tx => {
    // Inflow to target
    const inList = inflows.get(tx.targetAccountId) || [];
    inList.push(tx);
    inflows.set(tx.targetAccountId, inList);

    // Outflow from source
    const outList = outflows.get(tx.sourceAccountId) || [];
    outList.push(tx);
    outflows.set(tx.sourceAccountId, outList);
  });

  // Find candidate intermediaries (Devon Keith, Tanya Gomez, etc.)
  for (const [accId, inTxs] of inflows.entries()) {
    const outTxs = outflows.get(accId);
    if (!outTxs || outTxs.length === 0) continue;

    const totalIn = inTxs.reduce((sum, t) => sum + t.amount, 0);
    const totalOut = outTxs.reduce((sum, t) => sum + t.amount, 0);

    // Pass-through ratio > 80%
    if (totalIn > 5000 && totalOut >= totalIn * 0.8) {
      const originators = Array.from(new Set(inTxs.map(t => t.sourceAccountId)));
      const sinks = Array.from(new Set(outTxs.map(t => t.targetAccountId)));

      const hops: MuleHop[] = [
        ...inTxs.map(t => ({
          fromAccount: t.sourceAccountId,
          toAccount: t.targetAccountId,
          amount: t.amount,
          timestamp: t.timestamp,
          channel: t.channel
        })),
        ...outTxs.map(t => ({
          fromAccount: t.sourceAccountId,
          toAccount: t.targetAccountId,
          amount: t.amount,
          timestamp: t.timestamp,
          channel: t.channel
        }))
      ];

      rings.push({
        ringId: `MULE-RING-${accId}`,
        originatorId: originators[0] || 'UNKNOWN',
        intermediaries: [accId],
        sinkId: sinks[0] || 'UNKNOWN_SINK',
        totalVolume: totalOut,
        hops,
        flowRetentionPct: Math.round(((totalIn - totalOut) / totalIn) * 100)
      });
    }
  }

  return rings;
}

/**
 * Checks Basel III Liquidity Coverage Ratio
 */
export function checkLiquidityStatus(metrics: LiquidityMetric[] = mockLiquidityMetrics) {
  const latest = metrics[metrics.length - 1];
  const requiredLcr = 100.0;
  const isBreached = latest.lcrRatio < requiredLcr;
  const deficitAmount = isBreached 
    ? Math.round(latest.netCashOutflows30D - latest.stockHQLA) 
    : 0;

  return {
    latestMetric: latest,
    requiredLcr,
    isBreached,
    deficitAmount,
    historicalTrend: metrics
  };
}

/**
 * Checks Single Borrower Credit Concentration Limit (20% of Tier 1 Capital)
 */
export function checkCreditConcentrations(exposures: CreditExposure[] = mockCreditExposures) {
  const limit = 20.0;
  const breaches = exposures.filter(e => e.concentrationRatio > limit);
  const warnings = exposures.filter(e => e.concentrationRatio >= 15.0 && e.concentrationRatio <= limit);

  return {
    limit,
    breaches,
    warnings,
    allExposures: exposures
  };
}

/**
 * Aggregates all active real-time risk and fraud signals
 */
export function generateAllActiveSignals(): RiskSignal[] {
  const signals: RiskSignal[] = [];

  // 1. Smurfing Signals
  const smurfing = detectSmurfingPatterns();
  smurfing.forEach((s, idx) => {
    signals.push({
      id: `SIG-SMURF-${idx + 1}`,
      signalType: 'FRAUD_SMURFING',
      severity: 'CRITICAL',
      timestamp: s.transactions[s.transactions.length - 1].timestamp,
      title: `Structuring / Smurfing Detected in ${s.accountName}`,
      description: `${s.txCount} transactions totaling $${s.totalAmount.toLocaleString()} split between $7,500 and $9,950 over ${s.timeSpanHours}h to evade CTR filing.`,
      accountId: s.accountId,
      entityName: s.accountName,
      metrics: {
        transactionCount: s.txCount,
        aggregateVolume: `$${s.totalAmount.toLocaleString()}`,
        timeWindow: `${s.timeSpanHours} hours`,
        averageTransaction: `$${s.averageAmount.toLocaleString()}`
      },
      policyViolations: [
        'FinCEN 31 CFR § 1010.314: Prohibition of Structuring',
        'FATF Recommendation 20: Mandatory STR Filing',
        'RBI MD-KYC Sec 23: Anti-Smurfing Rule'
      ],
      suggestedAction: 'Immediate account debit freeze, file Suspicious Transaction Report (STR) within 48h to FIU.',
      status: 'ESCALATED'
    });
  });

  // 2. Mule Ring Signals
  const muleRings = detectMuleRings();
  muleRings.forEach((m, idx) => {
    signals.push({
      id: `SIG-MULE-${idx + 1}`,
      signalType: 'FRAUD_MULE_RING',
      severity: 'CRITICAL',
      timestamp: m.hops[m.hops.length - 1]?.timestamp || new Date().toISOString(),
      title: `Active Money Mule Pass-Through Syndicate (${m.intermediaries.join(', ')})`,
      description: `Rapid funds transit ($${m.totalVolume.toLocaleString()}) through retail student/personal accounts into high-risk crypto offramp. Retention rate < 10%.`,
      accountId: m.intermediaries[0],
      entityName: `Mule Node ${m.intermediaries.join(', ')}`,
      metrics: {
        totalVolume: `$${m.totalVolume.toLocaleString()}`,
        intermediaryHops: m.hops.length,
        sinkEntity: m.sinkId,
        originator: m.originatorId
      },
      policyViolations: [
        'FATF Digital Fraud & Mule Guidance (Section IV)',
        'Suspicious Activity Reporting (SAR) Mandate'
      ],
      suggestedAction: 'Place immediate debit restrictions on intermediary nodes, trace wallet offramp, notify cyber cell.',
      status: 'NEW'
    });
  });

  // 3. Liquidity LCR Breach Signal
  const liquidity = checkLiquidityStatus();
  if (liquidity.isBreached) {
    signals.push({
      id: 'SIG-LIQ-001',
      signalType: 'LIQUIDITY_LCR_BREACH',
      severity: 'CRITICAL',
      timestamp: liquidity.latestMetric.date,
      title: `Basel III LCR Prudential Limit Breach (${liquidity.latestMetric.lcrRatio.toFixed(1)}%)`,
      description: `Current Liquidity Coverage Ratio of ${liquidity.latestMetric.lcrRatio.toFixed(1)}% is below the statutory 100% requirement. Net HQLA shortfall: $${liquidity.deficitAmount.toLocaleString()}.`,
      metrics: {
        currentLcr: `${liquidity.latestMetric.lcrRatio.toFixed(1)}%`,
        statutoryMinimum: '100.0%',
        hqlaStock: `$${liquidity.latestMetric.stockHQLA.toLocaleString()}`,
        netOutflows30D: `$${liquidity.latestMetric.netCashOutflows30D.toLocaleString()}`,
        deficit: `$${liquidity.deficitAmount.toLocaleString()}`
      },
      policyViolations: [
        'Basel III Part 2: Standard Minimum Requirements (LCR >= 100%)',
        'Central Bank Prudential Liquidity Directive'
      ],
      suggestedAction: 'Convene ALCO (Asset-Liability Committee) immediately, invoke Liquidity Contingency Plan, notify Central Bank Banking Supervision within 24h.',
      status: 'ESCALATED'
    });
  }

  // 4. Credit Concentration Breach Signal
  const credit = checkCreditConcentrations();
  credit.breaches.forEach((b, idx) => {
    signals.push({
      id: `SIG-CRED-${idx + 1}`,
      signalType: 'CREDIT_CONCENTRATION',
      severity: 'HIGH',
      timestamp: new Date().toISOString().split('T')[0],
      title: `Large Exposure Breach: ${b.borrowerName} (${b.concentrationRatio.toFixed(2)}%)`,
      description: `Single borrower funded exposure exceeds the regulatory limit of 20% Tier 1 Capital. Exposure: $${b.totalExposure.toLocaleString()} vs Max Allowed: $${(b.tier1CapitalBase * 0.2).toLocaleString()}.`,
      accountId: b.borrowerId,
      entityName: b.borrowerName,
      metrics: {
        concentrationRatio: `${b.concentrationRatio.toFixed(2)}%`,
        regulatoryLimit: '20.0%',
        totalExposure: `$${b.totalExposure.toLocaleString()}`,
        eclStage: b.eclStage,
        rating: b.rating
      },
      policyViolations: [
        'BCBS Supervisory Framework for Measuring and Controlling Large Exposures (LEF)',
        'Single Counterparty Exposure Directive Sec 16'
      ],
      suggestedAction: 'Syndicate or sell down $8M exposure, adjust Risk-Weighted Assets (RWA), submit compliance mitigation report.',
      status: 'INVESTIGATING'
    });
  });

  return signals;
}
