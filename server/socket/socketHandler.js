const { generateAnswer } = require('../services/geminiService');

/**
 * Initializes and binds socket events.
 * @param {import('socket.io').Server} io - The socket io server instance. 
 */
function initializeSocket(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for transcription uploads
    socket.on('transcription', async (data) => {
      const { text, isQuestion } = data;

      // If text is marked as a question, we process it against OpenAI
      if (isQuestion) {
        // Broadcast processing status
        socket.emit('status', 'processing');

        // Fetch answer using the AI service
        const result = await generateAnswer(text);

        // Send back the response
        socket.emit('ai-response', {
          question: text,
          answer: result,
          timestamp: new Date().toISOString()
        });

        // Resolve status to answered
        socket.emit('status', 'answered');
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

module.exports = {
  initializeSocket
};
