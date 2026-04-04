/**
 * Determines if a given text is a question.
 * @param {string} text 
 * @returns {boolean}
 */
export function isQuestion(text) {
  if (!text || typeof text !== 'string') return false;
  
  const trimmed = text.trim().toLowerCase();
  
  if (trimmed.endsWith('?')) return true;

  const keywords = [
    "what", "why", "how", "when", "where", "who", "which", 
    "explain", "tell me", "define", "describe", 
    "is it", "can you", "do you", "will", "should", "could", "would", 
    "does", "did", "are", "was", "were", "has", "have", "shall"
  ];

  const patterns = [
    "question:", "i want to know", "i need to know"
  ];

  // Check if starts with a question keyword
  for (const keyword of keywords) {
    if (trimmed.startsWith(keyword + " ") || trimmed === keyword) {
      return true;
    }
  }

  // Check if contains specific patterns
  for (const pattern of patterns) {
    if (trimmed.includes(pattern)) {
      return true;
    }
  }

  return false;
}
