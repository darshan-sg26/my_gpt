MyGPT is a modern AI-powered web application that provides:

* 💬 AI Chatbot
* 📝 AI Text Summarizer
* 🎨 AI Image Generation (Under developing stage)
* 🔐 Secure Authentication
* 📊 Personalized Dashboard
* ☁️ Cloud-ready Deployment Architecture

Built using **React + FastAPI + MongoDB** with a scalable and production-ready architecture.

---
Features:

## AI Chatbot

* Real-time conversational AI interface
* Chat history persistence
* Modern streaming-like chat UI
* Sidebar chat navigation
* Markdown & code block support
* Gemini API integration

## AI Text Summarizer

* Summarize large text instantly
* Save summary history
* Reopen previous summaries


## Authentication System

* Email/Password Login
* JWT Authentication
* Secure password hashing
* Persistent sessions

## User Dashboard

* Personalized user dashboard
* Recent chats
* Recent summaries
* Usage statistics

---

# Tech Stack

## Frontend

* React + Vite
* Tailwind CSS
* React Router
* Axios
* Framer Motion

## Backend

* FastAPI
* SQLAlchemy
* MongoDB
* JWT Authentication

## AI APIs

* Gemini API

---


# ⚡ Installation

## Clone Repository

```bash
git clone https://github.com/darshan-sg26/my_gpt.git
cd MyGPT
```

---

# Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Backend Setup

```bash
cd Backend

python -m venv venv
```

Activate virtual environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run server:

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```bash
http://localhost:8000
```

---

# Environment Variables

Create `.env` files inside both `Frontend` and `Backend`(At root also works)

## Backend `.env`

```env
MONGODB_URL=your_database_url

JWT_SECRET_KEY=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

## Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

# Deployment

## Frontend

Deploy easily on:

* Vercel

## Backend

Deploy easily on:

* Render

---

# Future Improvements

* Voice Assistant Integration
* AI Agents
* Real-time streaming responses
* Team workspaces
* Multi-model AI support
* Vector database memory
* AI workflow automation

---

# Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

---
