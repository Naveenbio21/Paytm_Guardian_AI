<div align="center">
<img width="1200" height="475" alt="GuardianAI_Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🛡️ Guardian AI: Intelligent Middleware for Resilient UPI

Guardian AI is an advanced **Intelligent Middleware** solution positioned between the UPI switch and payment applications. It leverages machine learning and real-time behavioral biometrics to predict bank-side failures and prevent fraudulent transactions before they occur.

🔗 **Live Prototype:** [https://guardianai-71b78.web.app/](https://guardianai-71b78.web.app/)

## 🚀 Key Features

* **Predictive Fail-Safe Routing:** ML-based analysis of bank API health to avoid congestion and route transactions through stable channels.
* **Adaptive Behavioral Biometrics:** Real-time vishing protection that detects active calls and anomalous user behavior during payments.
* **Automated Reconciliation:** High-speed detection and auto-reversal of "debited-not-credited" failures to ensure financial certainty.
* **AI Coach & Voice Assistant:** Gemini-powered financial insights and hands-free, voice-activated payment processing.

## 📐 System Workflow



1.  **Risk Assessment:** The system evaluates bank API health and device security state (e.g., active call status).
2.  **Smart Routing:** AI determines the most resilient path for transaction success.
3.  **Secure Auth:** Fingerprint/Passkey verification replaces high-friction OTPs for a 12s faster checkout.
4.  **Real-Time Monitoring:** The reconciliation engine ensures the transaction is either successful or instantly reversed.

## 💻 Local Development (VS Code)

**Prerequisites:** Node.js (v18+) & VS Code

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-username/Paytm_GuardianAi.git](https://github.com/your-username/Paytm_GuardianAi.git)
    cd Paytm_GuardianAi
    ```

2.  **Install Dependencies:**
    Open the VS Code terminal (`Ctrl + ` `) and run:
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a file named `.env` in the root directory and add your Gemini API Key:
    ```env
    VITE_GEMINI_API_KEY=your_actual_key_here
    ```

4.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    *The app will be available at `http://localhost:5173`*

## 🌐 Deployment

To push updates to the live Firebase URL:
1.  **Build:** `npm run build`
2.  **Deploy:** `firebase deploy`

---
**Developed by Naveenkumar C.** | *3rd Year Biomedical Engineering Student*
*Optimized for the StartupTN & TANSEED Ecosystem*
