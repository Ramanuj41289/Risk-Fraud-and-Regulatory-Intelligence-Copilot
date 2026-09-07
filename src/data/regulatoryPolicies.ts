/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick
 * Email: ujjwalkumarbhowmick30@gmail.com
 * All rights reserved.
 */

import { RegulatoryPolicy } from './types.ts';

export const mockRegulatoryPolicies: RegulatoryPolicy[] = [
  {
    id: 'REG-FATF-20',
    regulationName: 'FATF Recommendation 20: Suspicious Transaction Reporting',
    authority: 'Financial Action Task Force (FATF)',
    section: 'Recommendation 20 & Interpretive Note',
    title: 'Obligation to Report Suspicious Transactions (STR / SAR)',
    text: 'If a financial institution suspects or has reasonable grounds to suspect that funds are the proceeds of a criminal activity, or are related to terrorist financing, it should be required, by law, to report promptly its suspicions to the Financial Intelligence Unit (FIU). Reporting should occur irrespective of transaction threshold amounts and applies equally to attempted transactions.',
    threshold: {
      reportingDeadlineHours: 72
    },
    keywords: ['suspicious', 'str', 'sar', 'fiu', 'criminal activity', 'proceeds', 'promptly', 'fincen', 'reporting']
  },
  {
    id: 'REG-AML-STRUCTURING',
    regulationName: 'FinCEN 31 CFR § 1010.314 & RBI MD-KYC Sec 23: Anti-Structuring & Smurfing',
    authority: 'FinCEN / Reserve Bank of India',
    section: 'Sec 23.2 & 31 CFR § 1010.314',
    title: 'Prohibition of Structuring / Smurfing to Evade CTR Filing',
    text: 'No person shall for the purpose of evading the reporting requirements of Currency Transaction Reports (CTR) cause or attempt to cause a domestic financial institution to fail to file a report, or structure transactions (smurfing) in amounts just below the statutory reporting threshold ($10,000 in the US, or INR 10,00,000 equivalent) across single or multiple accounts over a short period. Multiple transactions conducted by or on behalf of the same person within 48 to 72 hours aggregating beyond the limit must be treated as a single transaction and flagged for STR.',
    threshold: {
      singleTransaction: 10000,
      aggregatePeriodDays: 3,
      aggregateAmount: 10000,
      reportingDeadlineHours: 48
    },
    keywords: ['structuring', 'smurfing', 'ctr', 'threshold', 'split', '9900', '10000', 'evade', 'currency transaction report']
  },
  {
    id: 'REG-AML-MULE',
    regulationName: 'FATF Guidance on Digital Fraud & Mule Accounts',
    authority: 'FATF / Global Banking Standards',
    section: 'Section IV: Money Mule Detection & Intermediary Accounts',
    title: 'Rapid In-and-Out Pass-Through Velocity & Layering Schemes',
    text: 'Financial institutions must implement real-time velocity monitoring on retail, student, and dormant accounts that display rapid pass-through funds where high volumes (>80% of inflow) are transferred out within 24 hours to high-risk entities or crypto-asset virtual asset service providers (VASPs). Accounts acting as digital mules must be placed on immediate debit freeze, and an emergency STR filed with complete transaction lineage.',
    threshold: {
      aggregatePeriodDays: 1,
      reportingDeadlineHours: 24
    },
    keywords: ['mule', 'mule ring', 'pass-through', 'rapid in-out', 'layering', 'crypto', 'vasp', 'student account']
  },
  {
    id: 'REG-BASEL-LCR',
    regulationName: 'Basel III: The Liquidity Coverage Ratio and Liquidity Risk Monitoring Tools',
    authority: 'Basel Committee on Banking Supervision (BCBS)',
    section: 'Part 2: Standard Minimum Requirements - LCR Formula',
    title: 'Minimum Liquidity Coverage Ratio (LCR >= 100%)',
    text: 'The Liquidity Coverage Ratio (LCR) promotes short-term resilience of a bank’s liquidity risk profile by ensuring that it has an adequate stock of unencumbered High-Quality Liquid Assets (HQLA) that can be converted easily into cash to meet its liquidity needs for a 30 calendar day liquidity stress scenario. Formula: Stock of HQLA / Total net cash outflows over 30 days >= 100%. If LCR falls below 100%, the bank must immediately notify the supervisory authority and activate the Board Liquidity Contingency Plan.',
    threshold: {
      lcrMinimumPercent: 100.0,
      reportingDeadlineHours: 24
    },
    keywords: ['basel', 'lcr', 'liquidity', 'hqla', 'outflows', '30 day', 'run-off', 'contingency plan', 'liquidity coverage ratio']
  },
  {
    id: 'REG-CREDIT-LEF',
    regulationName: 'BCBS Supervisory Framework for Measuring and Controlling Large Exposures (LEF)',
    authority: 'BCBS / Central Bank Prudential Guidelines',
    section: 'Standard on Large Exposures - Section 16 & 17',
    title: 'Single Borrower and Connected Counterparty Exposure Limit (20% Limit)',
    text: 'The sum of all exposure values of a bank to a single counterparty or a group of connected counterparties must not exceed 20% of the bank’s Tier 1 Eligible Capital Base. Any temporary spike beyond this ceiling constitutes a prudential breach, requiring risk-weighted asset capital surcharge, board escalation, and a written remediation roadmap to the regulator within 15 calendar days.',
    threshold: {
      singleBorrowerExposurePercent: 20.0,
      reportingDeadlineHours: 360
    },
    keywords: ['credit', 'exposure', 'large exposure', 'lef', 'single borrower', 'tier 1 capital', 'concentration', 'capital surcharge']
  }
];
