# 🏦 Multi-Agent AI Loan Advisor - Tata Mitra

![Project Banner](https://img.shields.io/badge/Status-Production%20Ready-success) ![Tech Stack](https://img.shields.io/badge/Tech-FastAPI%20%7C%20React%20%7C%20Gemini%20AI-blue)

**Tata Mitra** is an advanced, human-centric loan advisory system powered by a **Multi-Agent AI Architecture**. It goes beyond simple eligibility checks by providing empathetic feedback, personalized credit improvement advice, and real-time analytics for bank employees.

---

## 🌟 Key Features

### 🤖 Multi-Agent System
-   **Orchestrator Agent**: Manages the entire loan application lifecycle and coordinates other agents.
-   **Eligibility Agent**: Uses a Hybrid approach (Rule-Based + ML Model) to calculate risk probabilities and eligibility scores.
-   **Credit Improvement Agent**: Deterministically identifies rejection factors and uses **Gemini 2.0 Flash** to generate personalized, RBI-compliant advice.
-   **Empathy Agent**: Crafts warm, human-like rejection or approval messages to ensure a positive customer experience.

### 💻 Modern Frontend
-   **Chat Interface**: A conversational UI for customers to check eligibility intuitively.
-   **Real-time Feedback**: Instant streaming of results and advice.
-   **Premium Design**: Glassmorphism effects, smooth animations (Framer Motion), and responsive layout.

### 📊 Employee Dashboard (New!)
-   **Secure Access**: Protected admin login for bank employees.
-   **Analytics**: Real-time visualization of:
    -   Approval vs. Rejection Rates
    -   Risk Profile Distribution
    -   Total Application Volume
-   **Tech**: Built with Recharts and React Router.

---

## 🛠️ Technology Stack

-   **Backend**: Python, FastAPI, SQLAlchemy, SQLite
-   **AI/LLM**: Google Gemini 2.0 Flash, Scikit-Learn (RandomForest)
-   **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion
-   **Visualization**: Recharts

---

## 🚀 Getting Started

### Prerequisites
-   Python 3.9+
-   Node.js 18+
-   Google Gemini API Key

### 1. Backend Setup
```bash
cd backend
# Create virtual environment (optional but recommended)
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn app.main:app --reload
```
*Server runs at: `http://127.0.0.1:8000`*

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Run the development server
npm run dev
```
*App runs at: `http://localhost:5173`*

---

## 📱 Usage Guide

### Customer Flow
1.  Open `http://localhost:5173`.
2.  Chat with the AI Advisor.
3.  Provide details: Income, EMI, Loan Amount, Tenure.
4.  Receive instant decision and personalized advice.

### Employee Dashboard
1.  Go to `http://localhost:5173`.
2.  Click **"Employee Login"** in the footer.
3.  **Credentials**:
    -   Username: `admin`
    -   Password: `admin123`
4.  View real-time analytics.

---

## 📂 Project Structure

```
multiagent-loan-advisor/
├── backend/
│   ├── app/
│   │   ├── agents/           # Agent Logic (Orchestrator, Empathy, etc.)
│   │   ├── ml/               # Machine Learning Models
│   │   ├── models/           # Database Models
│   │   └── main.py           # API Entry Point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # React Components (Chat, Dashboard, Login)
│   │   └── App.tsx           # Routing Logic
│   └── vite.config.ts        # Proxy Configuration
└── README.md
```

---

## 🛡️ License
This project is licensed under the MIT License.
