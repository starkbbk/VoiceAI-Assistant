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
    let instruction = "You are a concise, helpful AI assistant. Give short, accurate answers in 3-5 sentences max.";
    
    if (pdfContextString) {
      instruction += `\n\nCRITICAL CONTEXT INSTRUCTION:\nYou have been provided with a private document below. If the user asks questions about "you" (e.g., "What is your name?", "What is your experience?", "Who are you?"), you MUST adopt the persona, name, and identity described in this document. \n\nDo NOT say you are a Google language model. Instead, answer as if you are the person described in the resume/document.\n\nDOCUMENT TEXT:\n${pdfContextString}`;
    } else {
      instruction += " If the input is not a clear question, respond with a brief helpful comment.";
    }

    // Gemma models don't support systemInstruction via config,
    // so we prepend the instruction to the prompt
    const fullPrompt = `${instruction}\n\nUser question: ${question}`;

    const response = await ai.models.generateContent({
      model: 'gemma-3-27b-it',
      contents: fullPrompt,
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
