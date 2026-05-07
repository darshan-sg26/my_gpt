# 🚀 Jarvis AI

> A futuristic full-stack AI SaaS platform inspired by ChatGPT and Perplexity.

Jarvis AI is a modern AI-powered web application that provides:

* 💬 AI Chatbot
* 📝 AI Text Summarizer
* 🎨 AI Image Generation
* 🔐 Secure Authentication
* 📊 Personalized Dashboard
* ☁️ Cloud-ready Deployment Architecture

Built using **React + FastAPI + PostgreSQL** with a scalable and production-ready architecture.

---

# ✨ Features

## 🤖 AI Chatbot

* Real-time conversational AI interface
* Chat history persistence
* Modern streaming-like chat UI
* Sidebar chat navigation
* Markdown & code block support
* Gemini API integration

## 📝 AI Text Summarizer

* Summarize large text instantly
* Upload documents (PDF/TXT/DOC)
* Save summary history
* Reopen previous summaries

## 🎨 AI Image Generation

* Prompt-based AI image generation
* Image gallery/grid layout
* Download generated images
* Save prompts and image history

## 🔐 Authentication System

* Email/Password Login
* Google OAuth Login
* JWT Authentication
* Secure password hashing
* Persistent sessions

## 📊 User Dashboard

* Personalized user dashboard
* Recent chats
* Recent summaries
* Generated images
* Usage statistics

---

# 🛠️ Tech Stack

## Frontend

* React + Vite
* Tailwind CSS
* React Router
* Axios
* Framer Motion
* Zustand / Context API

## Backend

* FastAPI
* SQLAlchemy
* PostgreSQL / Supabase
* JWT Authentication
* OAuth2 Google Login
* Pydantic Validation

## AI APIs

* Gemini API
* Image Generation API

---

# 📁 Project Structure

```bash
project/
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── store/
│   │   ├── utils/
│   │   └── App.jsx
│
├── Backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│
├── README.md
```

---

# ⚡ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/jarvis-ai.git
cd jarvis-ai
```

---

# 🖥️ Frontend Setup

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

# ⚙️ Backend Setup

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

# 🔑 Environment Variables

Create `.env` files inside both `Frontend` and `Backend`.

## Backend `.env`

```env
DATABASE_URL=your_database_url

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

GEMINI_API_KEY=your_gemini_api_key
```

## Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

# 🗄️ Database Schema

## Tables

* users
* chats
* messages
* summaries
* generated_images
* user_settings

All records are linked using relational `user_id` relationships.

---

# 🔒 Security Features

* JWT Authentication
* Secure password hashing
* Protected API routes
* Environment variable protection
* Secure CORS configuration
* Input validation
* Upload sanitization

---

# 🎨 UI/UX Highlights

* Futuristic AI-inspired interface
* Dark mode default
* Responsive mobile-first design
* Smooth animations
* Skeleton loaders
* Glassmorphism effects
* Modern sidebar navigation

---

# ☁️ Deployment

## Frontend

Deploy easily on:

* Vercel

## Backend

Deploy easily on:

* Render
* Railway

---

# 📌 Future Improvements

* Voice Assistant Integration
* AI Agents
* Real-time streaming responses
* Team workspaces
* Subscription billing system
* Multi-model AI support
* Vector database memory
* AI workflow automation

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

Built with ☕, debugging tears, and questionable sleep schedules by Darshan.

> “The best way to predict the future is to build it.”
