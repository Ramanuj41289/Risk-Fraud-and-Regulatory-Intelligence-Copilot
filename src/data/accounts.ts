/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick
 * Email: ujjwalkumarbhowmick30@gmail.com
 * All rights reserved.
 */

import { Account } from './types.ts';

export const mockAccounts: Account[] = [
  {
    id: 'ACC-8821',
    accountNumber: '4091-8821-9011',
    holderName: 'Apex Horizon Logistics LLC',
    type: 'CORPORATE',
    jurisdiction: 'Domestic - Commercial Zone B',
    kycTier: 'TIER_1',
    riskCategory: 'CRITICAL',
    balance: 142500,
    monthlyAverageBalance: 12000,
    monthlyExpectedVolume: 50000,
    beneficialOwner: 'Marcus Vance (Nominee / Shell Director)',
    taxId: 'US-EIN-8819204',
    flags: ['STRUCTURING_SUSPECT', 'HIGH_TURNOVER_VELOCITY', 'PASSTHROUGH_VOLUME'],
    createdAt: '2023-04-12'
  },
  {
    id: 'ACC-3190',
    accountNumber: '2109-3190-7722',
    holderName: 'Elena Rostova Tech Consultants',
    type: 'SME_COMMERCIAL',
    jurisdiction: 'Cyprus / Offshore Corridors',
    kycTier: 'TIER_2',
    riskCategory: 'HIGH',
    balance: 89300,
    monthlyAverageBalance: 9500,
    monthlyExpectedVolume: 35000,
    beneficialOwner: 'Elena Rostova',
    taxId: 'CY-VAT-902341',
    flags: ['CROSS_BORDER_HIGH_RISK', 'LAYERED_TRANSFERS'],
    createdAt: '2023-08-20'
  },
  {
    id: 'ACC-1044',
    accountNumber: '1004-1044-8841',
    holderName: 'Devon Keith (Retail Student Account)',
    type: 'RETAIL_SAVINGS',
    jurisdiction: 'Domestic - Metro Branch',
    kycTier: 'TIER_3_SIMPLIFIED',
    riskCategory: 'CRITICAL',
    balance: 4200,
    monthlyAverageBalance: 500,
    monthlyExpectedVolume: 2000,
    beneficialOwner: 'Devon Keith',
    taxId: 'US-SSN-***-**-4192',
    flags: ['MONEY_MULE_SUSPECT', 'RAPID_IN_OUT', 'ATM_CASH_DRAIN'],
    createdAt: '2024-01-15'
  },
  {
    id: 'ACC-1045',
    accountNumber: '1004-1045-8842',
    holderName: 'Tanya Gomez (Retail Personal)',
    type: 'RETAIL_SAVINGS',
    jurisdiction: 'Domestic - West Branch',
    kycTier: 'TIER_2',
    riskCategory: 'HIGH',
    balance: 6100,
    monthlyAverageBalance: 1200,
    monthlyExpectedVolume: 4000,
    beneficialOwner: 'Tanya Gomez',
    taxId: 'US-SSN-***-**-8219',
    flags: ['MULE_INTERMEDIARY', 'PASS_THROUGH_ROUTING'],
    createdAt: '2023-11-05'
  },
  {
    id: 'ACC-1046',
    accountNumber: '1004-1046-8843',
    holderName: 'Nexus Global Crypto Gateway',
    type: 'CORRESPONDENT',
    jurisdiction: 'Seychelles / Virtual Asset Provider',
    kycTier: 'TIER_1',
    riskCategory: 'CRITICAL',
    balance: 3840000,
    monthlyAverageBalance: 2500000,
    monthlyExpectedVolume: 15000000,
    beneficialOwner: 'K. S. Holdings Ltd',
    taxId: 'SC-REG-991200',
    flags: ['CRYPTO_OFFRAMP_SINK', 'SANCTION_MONITORED'],
    createdAt: '2022-02-10'
  },
  {
    id: 'ACC-5520',
    accountNumber: '3310-5520-1120',
    holderName: 'BluePeak Real Estate Holdings Corp',
    type: 'CORPORATE',
    jurisdiction: 'Domestic - Prime Commercial',
    kycTier: 'TIER_1',
    riskCategory: 'LOW',
    balance: 14500000,
    monthlyAverageBalance: 13800000,
    monthlyExpectedVolume: 4000000,
    beneficialOwner: 'Arthur Sterling & Board',
    taxId: 'US-EIN-1102948',
    flags: [],
    createdAt: '2019-06-18'
  },
  {
    id: 'ACC-7741',
    accountNumber: '9901-7741-2311',
    holderName: 'Zenith Infrastructure Ltd',
    type: 'CORPORATE',
    jurisdiction: 'Domestic - Heavy Industrial',
    kycTier: 'TIER_1',
    riskCategory: 'HIGH',
    balance: 52000000,
    monthlyAverageBalance: 48000000,
    monthlyExpectedVolume: 20000000,
    beneficialOwner: 'R. K. Industrial Trust',
    taxId: 'IND-GST-07AAACZ1122',
    flags: ['SINGLE_BORROWER_CONCENTRATION_WARN', 'STAGE_2_LOAN_STRESS'],
    createdAt: '2018-03-22'
  },
  {
    id: 'ACC-9902',
    accountNumber: '7721-9902-3344',
    holderName: 'Vanguard Retail Enterprises',
    type: 'SME_COMMERCIAL',
    jurisdiction: 'Domestic - Urban North',
    kycTier: 'TIER_1',
    riskCategory: 'LOW',
    balance: 850000,
    monthlyAverageBalance: 790000,
    monthlyExpectedVolume: 1200000,
    taxId: 'US-EIN-5544332',
    flags: [],
    createdAt: '2021-09-14'
  }
];
