const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

let pdfContextString = "";

function setPdfContext(text) {
  pdfContextString = text;
  console.log(`[GeminiService] PDF context updated. Context length: ${text.length} chars.`);
}

/**
 * Calls Google Gemini (gemini-2.5-flash) to generate a helpful response.
 * @param {string} question The extracted question from transcribed text 
 * @returns {string} The AI answer or error message
 */
async function generateAnswer(question) {
  try {
    let instruction = "You are a knowledgeable assistant. Always answer with a short intro sentence followed by 3-5 bullet points using '•' character. Be informative and clear.";
    
    if (pdfContextString) {
      instruction += ` You have access to this document. If asked about identity/name/experience, answer AS the person in the document — never say you're an AI.\n\nDOCUMENT:\n${pdfContextString}`;
    }

    // Gemma models don't support systemInstruction via config,
    // so we prepend the instruction to the prompt
    const fullPrompt = `${instruction}\n\nQuestion: ${question}\nAnswer:`;

    const response = await ai.models.generateContent({
      model: 'gemma-3-4b-it',
      contents: fullPrompt,
      config: {
        maxOutputTokens: 400,
        temperature: 0.5,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API validation or request error:", error.message);
    return "I'm sorry, I encountered an error while trying to generate a response via Gemini. Please check the AI configuration.";
  }
}

module.exports = {
  generateAnswer,
  setPdfContext
};
