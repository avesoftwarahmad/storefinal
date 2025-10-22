/**
 * Citation Validator
 * Validates citations against the knowledge base
 */

const fs = require('fs');
const path = require('path');

let knowledgeBase = [];

/**
 * Load knowledge base from ground-truth.json
 */
function loadKnowledgeBase() {
  try {
    const kbPath = path.join(__dirname, '../../../../docs/ground-truth.json');
    if (fs.existsSync(kbPath)) {
      const kbContent = fs.readFileSync(kbPath, 'utf8');
      knowledgeBase = JSON.parse(kbContent);
      console.log(`✅ Knowledge base loaded: ${knowledgeBase.length} policies`);
    } else {
      console.warn('⚠️ ground-truth.json not found');
      knowledgeBase = [];
    }
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    knowledgeBase = [];
  }
}

/**
 * Extract citations from response text
 * Looks for patterns like [PolicyID], [Policy1.1], etc.
 */
function extractCitations(responseText) {
  const citationPattern = /\[([A-Za-z]+[\w.]*)\]/g;
  const matches = responseText.match(citationPattern);
  
  if (!matches) {
    return [];
  }
  
  return matches.map(m => m.slice(1, -1)); // Remove brackets
}

/**
 * Validate citations against knowledge base
 */
function validateCitations(citations) {
  const validCitations = [];
  const invalidCitations = [];
  
  for (const citation of citations) {
    const found = knowledgeBase.find(p => p.id === citation);
    if (found) {
      validCitations.push({
        id: citation,
        policy: found
      });
    } else {
      invalidCitations.push(citation);
    }
  }
  
  return {
    isValid: invalidCitations.length === 0,
    validCitations,
    invalidCitations,
    validCount: validCitations.length,
    invalidCount: invalidCitations.length
  };
}

/**
 * Validate complete response with citations
 */
function validateResponse(responseText) {
  const extractedCitations = extractCitations(responseText);
  const validation = validateCitations(extractedCitations);
  
  return {
    extractedCitations,
    ...validation
  };
}

/**
 * Find relevant policies based on query
 */
function findRelevantPolicies(userQuery) {
  if (!knowledgeBase || knowledgeBase.length === 0) {
    return [];
  }
  
  const query = userQuery.toLowerCase();
  
  // Category keywords mapping
  const categoryKeywords = {
    'returns': ['return', 'refund', 'exchange', 'money back', 'send back'],
    'shipping': ['ship', 'delivery', 'deliver', 'arrival', 'transit', 'carrier', 'track'],
    'warranty': ['warranty', 'guarantee', 'defect', 'broken', 'repair', 'replace'],
    'privacy': ['privacy', 'data', 'personal information', 'secure', 'confidential'],
    'security': ['security', 'hack', 'password', 'protection', 'payment', 'safe'],
    'payment': ['payment', 'pay', 'credit card', 'billing', 'charge']
  };
  
  // Find matching categories
  let matchedCategories = [];
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => query.includes(kw))) {
      matchedCategories.push(category);
    }
  }
  
  // Find policies matching the categories
  let relevantPolicies = [];
  if (matchedCategories.length > 0) {
    relevantPolicies = knowledgeBase.filter(p => 
      matchedCategories.includes(p.category)
    );
  }
  
  // If no category match, try direct question matching
  if (relevantPolicies.length === 0) {
    relevantPolicies = knowledgeBase.filter(p => {
      const pQuestion = p.question.toLowerCase();
      const pAnswer = p.answer.toLowerCase();
      return query.includes(pQuestion.slice(0, 20)) || 
             pQuestion.includes(query.slice(0, 20)) ||
             pAnswer.includes(query);
    });
  }
  
  return relevantPolicies.slice(0, 3); // Return max 3 policies
}

/**
 * Get policy by ID
 */
function getPolicyById(policyId) {
  return knowledgeBase.find(p => p.id === policyId);
}

/**
 * Get all policies in a category
 */
function getPoliciesByCategory(category) {
  return knowledgeBase.filter(p => p.category === category);
}

/**
 * Get knowledge base stats
 */
function getKnowledgeBaseStats() {
  const categories = [...new Set(knowledgeBase.map(p => p.category))];
  const stats = {
    totalPolicies: knowledgeBase.length,
    categories: {},
    lastUpdated: null
  };
  
  for (const category of categories) {
    stats.categories[category] = knowledgeBase.filter(p => p.category === category).length;
  }
  
  // Find most recent update
  const dates = knowledgeBase.map(p => p.lastUpdated).filter(Boolean);
  if (dates.length > 0) {
    stats.lastUpdated = dates.sort().reverse()[0];
  }
  
  return stats;
}

// Initialize knowledge base on module load
loadKnowledgeBase();

module.exports = {
  loadKnowledgeBase,
  extractCitations,
  validateCitations,
  validateResponse,
  findRelevantPolicies,
  getPolicyById,
  getPoliciesByCategory,
  getKnowledgeBaseStats
};
