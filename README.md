# 🛡️ Guardian AI: Intelligent Middleware for Resilient UPI

[cite_start]Guardian AI is an advanced **Intelligent Middleware** solution positioned between the UPI switch and payment applications[cite: 13]. [cite_start]It leverages machine learning and real-time behavioral biometrics to predict bank-side failures and prevent fraudulent transactions before they occur[cite: 14, 15, 17].

🔗 **Live Prototype:** [https://guardianai-71b78.web.app/](https://guardianai-71b78.web.app/)

---

## 🚀 Project Status
| Feature | Status | Description |
| :--- | :--- | :--- |
| **Predictive Routing** | ✅ Active | [cite_start]ML-based bank health analysis[cite: 16]. |
| **Behavioral Biometrics** | ✅ Active | [cite_start]Active call detection (Vishing protection)[cite: 17]. |
| **Auto-Reversal** | ✅ Active | [cite_start]Real-time monitoring and failure detection[cite: 19, 20]. |
| **AI Insights** | ✅ Active | Gemini-powered financial coaching. |

---

## 📐 System Workflow

[cite_start]The Guardian AI engine processes transactions through a multi-layer verification stack[cite: 28]:

1.  [cite_start]**Risk Assessment:** Evaluates bank API health and device security state (e.g., active call status)[cite: 16, 27].
2.  [cite_start]**Smart Routing:** AI determines the most resilient path for transaction success[cite: 27].
3.  [cite_start]**Secure Auth:** Fingerprint/Passkey verification replaces high-friction OTPs for a 12s faster checkout[cite: 18, 41].
4.  [cite_start]**Real-Time Monitoring:** The reconciliation engine ensures the transaction is either successful or instantly reversed[cite: 35, 36].


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

To push updates to your live Firebase URL:
1.  **Build:** `npm run build`
2.  **Deploy:** `firebase deploy`

---
**Developed by Naveenkumar C.** | *3rd Year Biomedical Engineering Student*
*Optimized for the StartupTN & TANSEED Ecosystem*
