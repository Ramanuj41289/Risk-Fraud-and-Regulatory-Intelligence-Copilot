import { RegulatoryPolicy } from '../data/types.ts';
import { mockRegulatoryPolicies } from '../data/regulatoryPolicies.ts';

export interface PolicyMatch {
  policy: RegulatoryPolicy;
  score: number;
  matchedKeywords: string[];
  citationText: string;
}

/**
 * High-precision Policy RAG Retrieval Engine
 * Matches natural language queries, fraud types, and compliance concepts against regulatory circulars.
 */
export function searchRegulatoryPolicies(
  query: string,
  policies: RegulatoryPolicy[] = mockRegulatoryPolicies,
  topK: number = 3
): PolicyMatch[] {
  const normalizedQuery = query.toLowerCase();
  const queryTokens = normalizedQuery
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);

  const matches: PolicyMatch[] = policies.map(policy => {
    let score = 0;
    const matchedKeywords: string[] = [];

    // 1. Exact keyword match
    policy.keywords.forEach(kw => {
      if (normalizedQuery.includes(kw.toLowerCase())) {
        score += 3.0;
        matchedKeywords.push(kw);
      }
    });

    // 2. Token overlap in title and regulation name
    const titleLower = `${policy.regulationName} ${policy.title} ${policy.section}`.toLowerCase();
    queryTokens.forEach(token => {
      if (titleLower.includes(token)) {
        score += 1.5;
        if (!matchedKeywords.includes(token)) matchedKeywords.push(token);
      }
    });

    // 3. Token overlap in full policy text
    const textLower = policy.text.toLowerCase();
    queryTokens.forEach(token => {
      if (textLower.includes(token)) {
        score += 0.5;
      }
    });

    // Bonus for specific acronyms
    if (normalizedQuery.includes('str') && policy.id.includes('FATF-20')) score += 4;
    if (normalizedQuery.includes('sar') && policy.id.includes('FATF-20')) score += 4;
    if (normalizedQuery.includes('smurf') && policy.id.includes('STRUCTURING')) score += 5;
    if (normalizedQuery.includes('structuring') && policy.id.includes('STRUCTURING')) score += 5;
    if (normalizedQuery.includes('mule') && policy.id.includes('MULE')) score += 5;
    if ((normalizedQuery.includes('lcr') || normalizedQuery.includes('liquidity')) && policy.id.includes('BASEL')) score += 5;
    if ((normalizedQuery.includes('concentration') || normalizedQuery.includes('exposure') || normalizedQuery.includes('single borrower')) && policy.id.includes('CREDIT-LEF')) score += 5;

    const citationText = `[${policy.authority} - ${policy.regulationName} (${policy.section})]`;

    return {
      policy,
      score,
      matchedKeywords,
      citationText
    };
  });

  return matches
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/**
 * Get policy by ID
 */
export function getPolicyById(id: string): RegulatoryPolicy | undefined {
  return mockRegulatoryPolicies.find(p => p.id === id);
}
