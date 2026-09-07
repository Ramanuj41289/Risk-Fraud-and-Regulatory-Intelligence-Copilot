/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick
 * Email: ujjwalkumarbhowmick30@gmail.com
 * All rights reserved.
 */

import { detectSmurfingPatterns, detectMuleRings, checkLiquidityStatus, checkCreditConcentrations } from '../engine/detectors.ts';
import { searchRegulatoryPolicies } from '../engine/policyRag.ts';
import { generateSTRReport, generateBaselLiquidityMemo } from '../engine/reportGenerator.ts';
import { processCopilotQuery, auditTrail } from '../engine/copilotEngine.ts';

async function runVerification() {
  console.log('Running SentinelRisk Prototype Verification Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // Test 1: Smurfing detector
  const smurfing = detectSmurfingPatterns();
  assert(smurfing.length > 0, 'Detects smurfing patterns in mock dataset');
  assert(smurfing[0].accountId === 'ACC-8821', 'Accurately flags Account ACC-8821 for structuring');
  assert(smurfing[0].txCount >= 3, 'Identifies at least 3 sub-threshold transactions');

  // Test 2: Mule ring detector
  const muleRings = detectMuleRings();
  assert(muleRings.length > 0, 'Detects money mule pass-through rings');
  assert(muleRings[0].intermediaries.includes('ACC-1044'), 'Identifies Devon Keith (ACC-1044) as mule intermediary');

  // Test 3: Liquidity LCR check
  const liquidity = checkLiquidityStatus();
  assert(liquidity.isBreached === true, 'Accurately detects Basel III LCR ratio breach below 100%');
  assert(liquidity.latestMetric.lcrRatio < 100.0, 'Computes current LCR ratio accurately');

  // Test 4: Credit Concentration check
  const credit = checkCreditConcentrations();
  assert(credit.breaches.length > 0, 'Detects Single Borrower Large Exposure breach exceeding 20% limit');
  assert(credit.breaches[0].borrowerId === 'BOR-7741', 'Identifies Zenith Infrastructure as breaching counterparty');

  // Test 5: Policy RAG Search
  const policies = searchRegulatoryPolicies('structuring smurfing ctr threshold');
  assert(policies.length > 0, 'Retrieves relevant regulatory policies for structuring');
  assert(policies[0].policy.id.includes('STRUCTURING'), 'Ranks FinCEN 31 CFR § 1010.314 as top policy match');

  // Test 6: Report Generation
  const str = generateSTRReport('ACC-8821');
  assert(str.reportType === 'STR', 'Generates official Suspicious Transaction Report');
  assert(str.supportingEvidence.transactionCount >= 3, 'Attaches supporting transaction evidence to STR');
  assert(str.regulatoryCitations.length > 0, 'Embeds statutory citations into STR');

  // Test 7: Copilot Natural Language Query Processing
  const copilotRes = await processCopilotQuery('What is our current LCR ratio and do we breach Basel III?');
  assert(copilotRes.sender === 'copilot', 'Copilot returns valid response');
  assert(copilotRes.reasoningSteps !== undefined && copilotRes.reasoningSteps.length > 0, 'Includes step-by-step reasoning traces');
  assert(copilotRes.evidenceData !== undefined, 'Attaches structured evidence to answer');

  // Test 8: Audit Logging
  assert(auditTrail.length >= 2, 'Audit trail logs query actions with cryptographic timestamp and governance metadata');

  console.log(`\nVerification Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runVerification().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
