# Arabic RAG Chatbot - UI

This is the **frontend interface** for the Arabic RAG Chatbot project. It provides a clean, interactive web UI to communicate with a **Retrieval-Augmented Generation (RAG) chatbot** using an underlying FastAPI backend. The UI supports **Arabic text**, real-time streaming responses, and session-based chat history.

---

## Features

- **Interactive Chat:** Type your questions in Arabic and get responses from the RAG-powered assistant.  
- **Streaming Responses:** Messages appear in real-time with a "جارٍ الكتابة" typing animation.  
- **Markdown Support:** Responses from the chatbot can include formatted text rendered with Markdown.  
- **Session Management:** Each browser tab maintains a unique session ID to keep chat history separate.  
- **Clear Chat:** Reset the conversation anytime using the "مسح الدردشة" button.  
- **RTL Support:** Fully supports right-to-left Arabic text layout.

---

## Tech Stack

- **Frontend:** React (Next.js) with TypeScript  
- **Styling:** Tailwind CSS  
- **Markdown Rendering:** `react-markdown`  
- **Backend Integration:** Connects to a FastAPI backend via streaming endpoints

---

## Setup

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/arabic-rag-chatbot-ui.git
cd arabic-rag-chatbot-ui
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoint:
- Open pages/index.tsx (or the main component file)
- Replace the placeholder URL with your FastAPI backend endpoint:
```ts
const API_URL = "https://your-fastapi-backend.com";
```

4. Run the development server:
```bash
npm run dev
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
