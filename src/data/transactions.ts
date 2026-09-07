/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick
 * Email: ujjwalkumarbhowmick30@gmail.com
 * All rights reserved.
 */

import { Transaction } from './types.ts';

export const mockTransactions: Transaction[] = [
  // --- SMURFING / STRUCTURING CLUSTER (Account ACC-8821: Apex Horizon Logistics LLC) ---
  // Deliberately kept just below the $10,000 / INR 10 Lakh FinCEN / RBI CTR threshold within 48 hours
  {
    id: 'TXN-8821-001',
    timestamp: '2026-09-05T09:14:22Z',
    sourceAccountId: 'ACC-8821',
    sourceAccountName: 'Apex Horizon Logistics LLC',
    targetAccountId: 'ACC-1044',
    targetAccountName: 'Devon Keith (Retail Student Account)',
    amount: 9850,
    currency: 'USD',
    channel: 'IMPS_RTGS',
    destinationCountry: 'US',
    riskScore: 92,
    flags: ['STRUCTURING_SMURFING', 'SUDDEN_VELOCITY_SPIKE'],
    status: 'FLAGGED_HOLD',
    narrative: 'Split transfer 1 of 5 below $10,000 reporting threshold within 24h window'
  },
  {
    id: 'TXN-8821-002',
    timestamp: '2026-09-05T11:42:05Z',
    sourceAccountId: 'ACC-8821',
    sourceAccountName: 'Apex Horizon Logistics LLC',
    targetAccountId: 'ACC-1044',
    targetAccountName: 'Devon Keith (Retail Student Account)',
    amount: 9920,
    currency: 'USD',
    channel: 'IMPS_RTGS',
    destinationCountry: 'US',
    riskScore: 95,
    flags: ['STRUCTURING_SMURFING'],
    status: 'FLAGGED_HOLD',
    narrative: 'Split transfer 2 of 5 below $10,000 reporting threshold'
  },
  {
    id: 'TXN-8821-003',
    timestamp: '2026-09-05T14:18:30Z',
    sourceAccountId: 'ACC-8821',
    sourceAccountName: 'Apex Horizon Logistics LLC',
    targetAccountId: 'ACC-1045',
    targetAccountName: 'Tanya Gomez (Retail Personal)',
    amount: 9800,
    currency: 'USD',
    channel: 'WIRE',
    destinationCountry: 'US',
    riskScore: 91,
    flags: ['STRUCTURING_SMURFING', 'MULE_INTERMEDIARY' as any],
    status: 'FLAGGED_HOLD',
    narrative: 'Split transfer 3 of 5 routed to secondary retail personal account'
  },
  {
    id: 'TXN-8821-004',
    timestamp: '2026-09-06T08:05:12Z',
    sourceAccountId: 'ACC-8821',
    sourceAccountName: 'Apex Horizon Logistics LLC',
    targetAccountId: 'ACC-1045',
    targetAccountName: 'Tanya Gomez (Retail Personal)',
    amount: 9950,
    currency: 'USD',
    channel: 'WIRE',
    destinationCountry: 'US',
    riskScore: 96,
    flags: ['STRUCTURING_SMURFING'],
    status: 'FLAGGED_HOLD',
    narrative: 'Split transfer 4 of 5 within 48h structuring window'
  },
  {
    id: 'TXN-8821-005',
    timestamp: '2026-09-06T13:20:45Z',
    sourceAccountId: 'ACC-8821',
    sourceAccountName: 'Apex Horizon Logistics LLC',
    targetAccountId: 'ACC-3190',
    targetAccountName: 'Elena Rostova Tech Consultants',
    amount: 9900,
    currency: 'USD',
    channel: 'SWIFT',
    destinationCountry: 'CY',
    riskScore: 98,
    flags: ['STRUCTURING_SMURFING', 'HIGH_RISK_JURISDICTION'],
    status: 'FLAGGED_HOLD',
    narrative: 'Split transfer 5 of 5 offshore remittance to Cyprus entity'
  },

  // --- MONEY MULE LAYER 2 & 3: PASS-THROUGH TO OFFRAMP / CASH DRAIN ---
  {
    id: 'TXN-1044-001',
    timestamp: '2026-09-05T15:30:10Z',
    sourceAccountId: 'ACC-1044',
    sourceAccountName: 'Devon Keith (Retail Student Account)',
    targetAccountId: 'ACC-1046',
    targetAccountName: 'Nexus Global Crypto Gateway',
    amount: 18500,
    currency: 'USD',
    channel: 'CRYPTO_ONRAMP',
    destinationCountry: 'SC',
    riskScore: 99,
    flags: ['RAPID_PASS_THROUGH', 'HIGH_RISK_JURISDICTION'],
    status: 'BLOCKED',
    narrative: 'Immediate pass-through of structured deposits into high-risk offshore crypto gateway within 4 hours'
  },
  {
    id: 'TXN-1044-002',
    timestamp: '2026-09-05T16:05:00Z',
    sourceAccountId: 'ACC-1044',
    sourceAccountName: 'Devon Keith (Retail Student Account)',
    targetAccountId: 'ACC-ATM-EXT',
    targetAccountName: 'ATM Cash Withdrawal Terminal #994',
    amount: 1000,
    currency: 'USD',
    channel: 'ATM_CASH',
    destinationCountry: 'US',
    riskScore: 84,
    flags: ['SUDDEN_VELOCITY_SPIKE'],
    status: 'COMPLETED',
    narrative: 'Mule commission cash-out at localized ATM'
  },
  {
    id: 'TXN-1045-001',
    timestamp: '2026-09-06T14:45:00Z',
    sourceAccountId: 'ACC-1045',
    sourceAccountName: 'Tanya Gomez (Retail Personal)',
    targetAccountId: 'ACC-1046',
    targetAccountName: 'Nexus Global Crypto Gateway',
    amount: 19100,
    currency: 'USD',
    channel: 'CRYPTO_ONRAMP',
    destinationCountry: 'SC',
    riskScore: 99,
    flags: ['RAPID_PASS_THROUGH', 'CIRCULAR_ROUTING'],
    status: 'BLOCKED',
    narrative: 'Layering 2nd leg: 96.7% of aggregated smurfed funds transferred outward within 90 minutes'
  },

  // --- CIRCULAR ROUTING / MONEY LAUNDERING LOOP ---
  {
    id: 'TXN-3190-001',
    timestamp: '2026-09-06T18:10:00Z',
    sourceAccountId: 'ACC-3190',
    sourceAccountName: 'Elena Rostova Tech Consultants',
    targetAccountId: 'ACC-8821',
    targetAccountName: 'Apex Horizon Logistics LLC',
    amount: 8750,
    currency: 'USD',
    channel: 'SWIFT',
    destinationCountry: 'US',
    riskScore: 94,
    flags: ['CIRCULAR_ROUTING'],
    status: 'FLAGGED_HOLD',
    narrative: 'Circular loan repayment / invoice sham return route detected back to original originator'
  },

  // --- LEGITIMATE BENCHMARK TRANSACTIONS ---
  {
    id: 'TXN-5520-001',
    timestamp: '2026-09-04T10:00:00Z',
    sourceAccountId: 'ACC-5520',
    sourceAccountName: 'BluePeak Real Estate Holdings Corp',
    targetAccountId: 'ACC-9902',
    targetAccountName: 'Vanguard Retail Enterprises',
    amount: 250000,
    currency: 'USD',
    channel: 'WIRE',
    destinationCountry: 'US',
    riskScore: 12,
    flags: [],
    status: 'COMPLETED',
    narrative: 'Routine commercial property lease settlement'
  },
  {
    id: 'TXN-9902-001',
    timestamp: '2026-09-04T14:22:00Z',
    sourceAccountId: 'ACC-9902',
    sourceAccountName: 'Vanguard Retail Enterprises',
    targetAccountId: 'ACC-SUPPLIER-01',
    targetAccountName: 'Pacific Logistics Supply Inc',
    amount: 68000,
    currency: 'USD',
    channel: 'ACH',
    destinationCountry: 'US',
    riskScore: 8,
    flags: [],
    status: 'COMPLETED',
    narrative: 'Payroll and vendor inventory fulfillment'
  },
  {
    id: 'TXN-7741-001',
    timestamp: '2026-09-05T12:00:00Z',
    sourceAccountId: 'ACC-7741',
    sourceAccountName: 'Zenith Infrastructure Ltd',
    targetAccountId: 'ACC-GOV-TAX',
    targetAccountName: 'Federal Treasury Tax Reserve',
    amount: 1450000,
    currency: 'USD',
    channel: 'RTGS' as any,
    destinationCountry: 'US',
    riskScore: 18,
    flags: [],
    status: 'COMPLETED',
    narrative: 'Quarterly statutory advance tax deposit'
  }
];
