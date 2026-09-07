/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick
 * Email: ujjwalkumarbhowmick30@gmail.com
 * All rights reserved.
 */

import { LiquidityMetric, CreditExposure } from './types.ts';

export const mockLiquidityMetrics: LiquidityMetric[] = [
  {
    date: '2026-09-01',
    stockHQLA: 420000000,
    totalExpectedOutflows30D: 380000000,
    totalExpectedInflows30D: 100000000,
    netCashOutflows30D: 280000000,
    lcrRatio: 150.0,
    status: 'COMPLIANT',
    wholesaleRunOff: 180000000,
    retailRunOff: 200000000
  },
  {
    date: '2026-09-03',
    stockHQLA: 410000000,
    totalExpectedOutflows30D: 400000000,
    totalExpectedInflows30D: 95000000,
    netCashOutflows30D: 305000000,
    lcrRatio: 134.4,
    status: 'COMPLIANT',
    wholesaleRunOff: 210000000,
    retailRunOff: 190000000
  },
  {
    date: '2026-09-05',
    stockHQLA: 375000000,
    totalExpectedOutflows30D: 460000000,
    totalExpectedInflows30D: 85000000,
    netCashOutflows30D: 375000000,
    lcrRatio: 100.0,
    status: 'WARNING_BUFFER',
    wholesaleRunOff: 280000000,
    retailRunOff: 180000000
  },
  {
    date: '2026-09-07', // Current Date
    stockHQLA: 342000000,
    totalExpectedOutflows30D: 495000000,
    totalExpectedInflows30D: 80000000,
    netCashOutflows30D: 415000000,
    lcrRatio: 82.4, // BREACH OF 100% BASEL III REQUIREMENT
    status: 'CRITICAL_BREACH',
    wholesaleRunOff: 320000000,
    retailRunOff: 175000000
  }
];

export const mockCreditExposures: CreditExposure[] = [
  {
    borrowerId: 'BOR-7741',
    borrowerName: 'Zenith Infrastructure Ltd',
    sector: 'Infrastructure & Power',
    totalExposure: 68000000,
    tier1CapitalBase: 300000000,
    concentrationRatio: 22.67, // BREACH: Exceeds 20% Single Borrower Regulatory Limit
    eclStage: 'STAGE_2',
    provisionAmount: 10200000,
    rating: 'BBB-',
    status: 'REGULATORY_BREACH'
  },
  {
    borrowerId: 'BOR-5520',
    borrowerName: 'BluePeak Real Estate Holdings Corp',
    sector: 'Commercial Real Estate',
    totalExposure: 48000000,
    tier1CapitalBase: 300000000,
    concentrationRatio: 16.0, // Within 20% limit, but above 15% internal early-warning buffer
    eclStage: 'STAGE_1',
    provisionAmount: 480000,
    rating: 'AA-',
    status: 'WARNING'
  },
  {
    borrowerId: 'BOR-9902',
    borrowerName: 'Vanguard Retail Enterprises',
    sector: 'Consumer & Retail',
    totalExposure: 18500000,
    tier1CapitalBase: 300000000,
    concentrationRatio: 6.17,
    eclStage: 'STAGE_1',
    provisionAmount: 185000,
    rating: 'A+',
    status: 'NORMAL'
  },
  {
    borrowerId: 'BOR-1102',
    borrowerName: 'Astra Biotech Therapeutics',
    sector: 'Healthcare & Pharma',
    totalExposure: 29000000,
    tier1CapitalBase: 300000000,
    concentrationRatio: 9.67,
    eclStage: 'STAGE_1',
    provisionAmount: 290000,
    rating: 'A',
    status: 'NORMAL'
  },
  {
    borrowerId: 'BOR-4491',
    borrowerName: 'Solaris Renewable Energy SPV',
    sector: 'Clean Energy',
    totalExposure: 57000000,
    tier1CapitalBase: 300000000,
    concentrationRatio: 19.0, // Near 20% ceiling
    eclStage: 'STAGE_2',
    provisionAmount: 5700000,
    rating: 'BBB',
    status: 'WARNING'
  }
];
