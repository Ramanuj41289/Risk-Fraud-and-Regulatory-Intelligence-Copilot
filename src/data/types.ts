/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick
 * Email: ujjwalkumarbhowmick30@gmail.com
 * All rights reserved.
 */

export type RiskCategory = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type KYCTier = 'TIER_1' | 'TIER_2' | 'TIER_3_SIMPLIFIED' | 'NON_COMPLIANT';
export type AccountType = 'RETAIL_SAVINGS' | 'RETAIL_CURRENT' | 'SME_COMMERCIAL' | 'CORPORATE' | 'SHELL_COMPANY' | 'CORRESPONDENT';

export interface Account {
  id: string;
  accountNumber: string;
  holderName: string;
  type: AccountType;
  jurisdiction: string;
  kycTier: KYCTier;
  riskCategory: RiskCategory;
  balance: number;
  monthlyAverageBalance: number;
  monthlyExpectedVolume: number;
  beneficialOwner?: string;
  taxId: string;
  flags: string[];
  createdAt: string;
}

export type ChannelType = 'WIRE' | 'IMPS_RTGS' | 'ACH' | 'ATM_CASH' | 'SWIFT' | 'CRYPTO_ONRAMP' | 'INTERNAL_TRANSFER';
export type TxRiskFlag = 
  | 'STRUCTURING_SMURFING'
  | 'RAPID_PASS_THROUGH'
  | 'HIGH_RISK_JURISDICTION'
  | 'SUDDEN_VELOCITY_SPIKE'
  | 'CIRCULAR_ROUTING'
  | 'DORMANT_SUDDEN_ACTIVITY'
  | 'SANCTION_HIT';

export interface Transaction {
  id: string;
  timestamp: string;
  sourceAccountId: string;
  sourceAccountName: string;
  targetAccountId: string;
  targetAccountName: string;
  amount: number;
  currency: string;
  channel: ChannelType;
  destinationCountry: string;
  originatingIp?: string;
  riskScore: number; // 0 to 100
  flags: TxRiskFlag[];
  status: 'COMPLETED' | 'FLAGGED_HOLD' | 'BLOCKED';
  narrative?: string;
}

export interface RegulatoryPolicy {
  id: string;
  regulationName: string; // e.g. "FATF Recommendation 20", "RBI Master Direction - AML/CFT 2016", "Basel III LCR Framework"
  authority: string; // e.g. "FATF", "RBI", "FinCEN", "BCBS"
  section: string;
  title: string;
  text: string;
  threshold?: {
    singleTransaction?: number;
    aggregatePeriodDays?: number;
    aggregateAmount?: number;
    lcrMinimumPercent?: number;
    singleBorrowerExposurePercent?: number;
    reportingDeadlineHours?: number;
  };
  keywords: string[];
}

export interface RiskSignal {
  id: string;
  signalType: 'FRAUD_SMURFING' | 'FRAUD_MULE_RING' | 'FRAUD_VELOCITY' | 'LIQUIDITY_LCR_BREACH' | 'CREDIT_CONCENTRATION';
  severity: RiskCategory;
  timestamp: string;
  title: string;
  description: string;
  accountId?: string;
  entityName?: string;
  metrics: Record<string, number | string>;
  policyViolations: string[];
  suggestedAction: string;
  status: 'NEW' | 'INVESTIGATING' | 'ESCALATED' | 'STR_FILED' | 'CLEARED';
}

export interface LiquidityMetric {
  date: string;
  stockHQLA: number; // High Quality Liquid Assets (Cash + Sovereign bonds)
  totalExpectedOutflows30D: number;
  totalExpectedInflows30D: number;
  netCashOutflows30D: number;
  lcrRatio: number; // stockHQLA / netCashOutflows30D * 100 (Minimum 100%)
  status: 'COMPLIANT' | 'WARNING_BUFFER' | 'CRITICAL_BREACH';
  wholesaleRunOff: number;
  retailRunOff: number;
}

export interface CreditExposure {
  borrowerId: string;
  borrowerName: string;
  sector: string;
  totalExposure: number; // Funded + Unfunded
  tier1CapitalBase: number;
  concentrationRatio: number; // totalExposure / tier1CapitalBase * 100 (Limit typically 20%)
  eclStage: 'STAGE_1' | 'STAGE_2' | 'STAGE_3_NPA';
  provisionAmount: number;
  rating: string;
  status: 'NORMAL' | 'WARNING' | 'REGULATORY_BREACH';
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  userRole: string;
  query: string;
  actionType: 'QUERY' | 'SIGNAL_TRIAGE' | 'STR_GENERATION' | 'POLICY_CHECK';
  accountsExamined: string[];
  policiesCited: string[];
  confidenceScore: number;
  reasoningTraces: string[];
  reportGeneratedId?: string;
}

export interface SuspiciousReport {
  reportId: string;
  reportType: 'STR' | 'SAR' | 'BASEL_LCR_MEMO' | 'CREDIT_CONCENTRATION_EXC';
  generatedAt: string;
  filingEntity: {
    institutionName: string;
    institutionType: string;
    reportingOfficer: string;
    licenseNumber: string;
  };
  subjectEntity: {
    accountId: string;
    name: string;
    taxId: string;
    kycTier: string;
    riskCategory: string;
    address: string;
  };
  executiveSummary: string;
  suspicionNarrative: string;
  regulatoryCitations: {
    regulation: string;
    section: string;
    clauseQuote: string;
  }[];
  supportingEvidence: {
    totalVolume: number;
    transactionCount: number;
    windowDays: number;
    transactions: Transaction[];
  };
  indicatorsDetected: string[];
  actionTaken: string;
  recommendedNextSteps: string[];
  governanceSignature: {
    signOffStatus: 'DRAFT_CONFIRMED' | 'SUBMITTED';
    timestamp: string;
    complianceOfficer: string;
  };
}
