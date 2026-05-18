# VoiceAI Assistant

![VoiceAI Assistant UI](./voice-ai-screenshot.png) <!-- Placeholder for screenshot -->

## 1. PROJECT OVERVIEW

VoiceAI Assistant is a real-time voice listener and AI auto-responder. It uses browser speech recognition APIs to capture live voice, auto-detects when you ask a question, passes the prompt to OpenAI via our Node.js server, and speaks the answer right back to you in an amazingly fast real-time loop. 

**Key Features:**
- **🎙️ Real-time Voice Transcription**: Constantly scans your voice with the Web Speech API.
- **🤖 Automatic Question Detection**: Determines if your text is a query and auto-forwards it to the server.
- **⚡ Super-Fast Backend**: Real-time Socket.io integration to process requests and push answers.
- **🧠 OpenAI Integration**: Harnesses GPT-3.5-turbo for short, concise, specific responses.
- **🔊 Text-To-Speech (TTS)**: Listens to the response returned from OpenAI and reads it aloud in natural voice.
- **🎨 Glassmorphism Design**: Pure Dark Mode, beautifully designed UI for an elegant experience.

---

## 2. TECH STACK TABLE

| Category | Technologies |
| --- | --- |
| **Frontend** | React 18, Vite, Tailwind CSS, Autoprefixer |
| **Backend** | Node.js, Express |
| **Real-time** | Socket.io (Client & Server) |
| **AI API** | OpenAI (GPT-3.5-turbo) |
| **Browser Speech APIs** | Webkit SpeechRecognition, SpeechSynthesis API |

---

## 3. PREREQUISITES

- **Node.js**: v18+ 
- **OpenAI API key**: Required for the server
- **Modern Browser**: Google Chrome recommended (the Web Speech API is most stable in Chrome on desktop).
- *Optional*: Virtual Audio Cable for system audio capture for deep testing.

---

## 4. INSTALLATION STEPS

### 1. Clone & Set Up

```bash
git clone <repo-url>
cd voice-ai-assistant
```

### 2. Setup Backend

Open a terminal and set up the server:
```bash
cd server
npm install
# Create an environment file
cp .env.example .env
```
👉 **Very Important**: Edit the `.env` file manually to insert your actual `OPENAI_API_KEY`. The server will fail requests until this is complete.

Then start the server:
```bash
npm run dev
```

### 3. Setup Frontend

Open a **new** terminal window and install the Vite client:
```bash
cd client
npm install
npm run dev
```

Your app will be available closely on `http://localhost:5173`. Make sure the microphone permissions are granted. Press `Alt+L` to quickly start or stop the recording mode.
