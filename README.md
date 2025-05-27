# ScoreBloc

**Comprehensive Blockchain Wallet Risk Analysis & Visualization Tool**

ScoreBloc is a web-based platform that allows users to input any Blockchain wallet address and receive a detailed risk assessment. It analyzes smart contract interactions, transaction activity, token holdings, and more — all presented through beautiful, interactive visualizations.

---

## Demo Preview

![Wallet Risk Analyzer Screenshot](./preview.png) <!-- In Progress -->

---

## Features

- **Risk Scoring**: Calculates a wallet's risk score (0–100) based on multiple on-chain metrics.
-  **Visual Dashboards**:
  - Line chart of transaction count and volume over time
  - Radar chart of key risk components
  - Pie chart of token holdings
- 🛡 **Security Warnings**: Flags suspicious behavior like contract approvals or interaction with known scam addresses.
-  **Demo Mode**: Use mock data without querying a real wallet.
-  **Responsive UI**: Fully responsive and mobile-friendly with modern design using Tailwind CSS.

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React.js** | Frontend framework |
| **Tailwind CSS** | Styling and layout |
| **Recharts** | Interactive charts and visualizations |
| **Lucide Icons** | Iconography |
| **Python / FastAPI**  | Backend wallet analysis logic (Extraction and Analysis of wallet's historical data) |

---

## 🧰 Project Structure

