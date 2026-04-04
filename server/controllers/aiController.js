const { generateAnswer } = require('../services/geminiService');

/**
 * POST /api/ask handler. Provide REST fallback for socket queries.
 */
async function handleQuestion(req, res) {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ success: false, message: 'Question parameter is required and must be a string.' });
    }

    const answer = await generateAnswer(question);
    
    res.json({ success: true, answer });
  } catch (error) {
    console.error('Error handling question in controller:', error);
    res.status(500).json({ success: false, message: 'Server fell into an error while handling the question' });
  }
}

module.exports = {
  handleQuestion
};
