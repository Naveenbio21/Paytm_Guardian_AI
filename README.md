# 🛡️ Guardian AI

### Intelligent Middleware for Resilient & Secure UPI Transactions

Guardian AI is an advanced middleware solution positioned between the UPI switch and payment applications. By leveraging machine learning and real-time behavioral biometrics, it predicts bank-side failures and intercepts fraudulent transactions—such as vishing attempts—before they occur.

🔗 **[Live Prototype](https://guardianai-71b78.web.app/)**

---

## 🚀 Key Features

| Feature | Impact |
| --- | --- |
| **Predictive Routing** | ML-driven analysis of bank API health to ensure high success rates. |
| **Vishing Protection** | Behavioral biometrics to detect malicious active-call fraud. |
| **Auto-Reversal** | Real-time reconciliation to instantly reverse failed transactions. |
| **Gemini AI Insights** | Personalized financial coaching powered by generative AI. |

## 📐 Architecture & Workflow

Guardian AI processes transactions through a multi-layered verification stack:

1. **Risk Assessment:** Evaluates bank API health and device security status in real-time.
2. **Smart Routing:** AI determines the most resilient path for successful transaction completion.
3. **Secure Auth:** Replaces high-friction OTPs with biometrics/Passkeys (12s faster checkout).
4. **Reconciliation:** Ensures every transaction is either finalized or auto-reversed.

---

## 🛠️ Local Development

### Prerequisites

* [Node.js (v18+)](https://nodejs.org/)
* VS Code

### Setup

1. **Clone & Install:**
```bash
git clone https://github.com/your-username/Paytm_GuardianAi.git
cd Paytm_GuardianAi
npm install

```


2. **Environment Configuration:**
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_api_key_here

```


3. **Run Locally:**
```bash
npm run dev

```


*Access the app at `http://localhost:5173*`

---

## 🌐 Deployment

Deploy the latest build to Firebase:

```bash
npm run build
firebase deploy

```

---

## 👨‍💻 Developed by

**Naveenkumar C.** | *3rd Year Biomedical Engineering Student*

*Building for the StartupTN & TANSEED Ecosystem*

---

### A few tips for further improvement:

* **Visuals:** Add a **screenshot or a GIF** of the UI in action right under the header. Nothing builds credibility faster than a visual demo.
* **Tech Stack Badge:** Add icons or a small section listing your tech stack (React, Vite, Firebase, Gemini API, TensorFlow.js) using [Shields.io](https://shields.io/) to make the README look industry-standard.
* **Security Notice:** Since your repository will be public, make sure to add `.env` to your `.gitignore` file immediately so your API key isn't leaked!
