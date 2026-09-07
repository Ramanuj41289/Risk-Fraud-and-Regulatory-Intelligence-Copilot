/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick
 * Email: ujjwalkumarbhowmick30@gmail.com
 * All rights reserved.
 */

import { processCopilotQuery } from './engine/copilotEngine.ts';
import { generateAllActiveSignals } from './engine/detectors.ts';

async function runCli() {
  console.log('================================================================');
  console.log('🛡️  SENTINEL RISK: RISK, FRAUD & REGULATORY INTELLIGENCE COPILOT');
  console.log('================================================================');
  console.log('Enterprise Copilot initialized with real-time banking telemetry:');
  console.log('- Structured Ledgers: Accounts, Transactions, Basel III Liquidity, Credit Exposures');
  console.log('- Unstructured RAG: FATF Rec 20, FinCEN 31 CFR § 1010.314, BCBS LCR & LEF\n');

  console.log('--- Active Real-Time Risk Signals ---');
  const signals = generateAllActiveSignals();
  signals.forEach(s => {
    console.log(`[${s.severity}] ${s.id}: ${s.title}`);
    console.log(`   Description: ${s.description}`);
    console.log(`   Action: ${s.suggestedAction}\n`);
  });

  console.log('----------------------------------------------------------------');
  console.log('Executing Sample Compliance Query:');
  const query = 'Investigate suspicious smurfing in account ACC-8821 and draft an audit-ready STR report';
  console.log(`Query: "${query}"\n`);

  const response = await processCopilotQuery(query);

  console.log('--- Reasoning Traces ---');
  response.reasoningSteps?.forEach((step, i) => {
    console.log(`Step ${i + 1}: ${step}`);
  });

  console.log('\n--- Copilot Response ---');
  console.log(response.content);

  if (response.reportDraft) {
    console.log('\n--- Generated Regulatory Report ---');
    console.log(`Report ID: ${response.reportDraft.reportId}`);
    console.log(`Type: ${response.reportDraft.reportType}`);
    console.log(`Subject: ${response.reportDraft.subjectEntity.name}`);
    console.log(`Summary: ${response.reportDraft.executiveSummary}`);
    console.log(`Total Flagged Volume: $${response.reportDraft.supportingEvidence.totalVolume.toLocaleString()}`);
    console.log('Regulatory Citations:');
    response.reportDraft.regulatoryCitations.forEach(c => {
      console.log(` - ${c.regulation} (${c.section})`);
    });
  }

  console.log('\n================================================================');
  console.log('✅ Prototype Node execution complete.');
  console.log('================================================================');
}

runCli().catch(err => {
  console.error('Error running CLI:', err);
  process.exit(1);
});
