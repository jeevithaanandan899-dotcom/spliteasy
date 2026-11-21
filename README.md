# SplitEasy — Smart Group Expense Tracker & Settlement

A modern, SaaS-grade expense-splitting financial dashboard built with **React**, **Vite**, and **JavaScript**. Designed for friends, roommates, and travel groups to effortlessly split bills, track shared expenses, and calculate who owes whom with minimal transactions.

> **Author:** Jeevitha A  
> **Status:** Production Ready  

---

## 🌟 Key Features

### 1. Dashboard & Financial Overview
- **Real-Time Summary Cards:**
  - **Total Expenses:** Instant sum of all recorded group expenses.
  - **Per Person Share:** Exact equal share computed as `Total Expenses ÷ Group Members`.
  - **Group Members:** Live member count and dynamic avatar roster (supports 2 to 6 participants).
  - **Settlement Status:** Live indicator showing pending debt transfers or full settlement.
- **Dynamic Greeting & Time Banner:** Custom greeting based on the user's local time (`Good morning`, `Good afternoon`, `Good evening`).

### 2. Group Management (2 to 6 Members)
- Customizable group name (e.g., *"Weekend Trip"*).
- Member validation:
  - Minimum 2 members required to compute balances and split costs.
  - Maximum 6 members enforced with capacity progress indicator.
  - Duplicate prevention (case-insensitive) and empty name validation.
  - Safe member removal with warnings if a member has recorded expenses.
- **1-Click Quick Demo:** Instantly loads a sample group with Aman, Riya, and Karan for fast demonstration and testing.

### 3. Smart Expense Recording
- Form fields:
  - **Description:** Mandatory item or activity title.
  - **Amount (₹):** Validated positive number with currency indicator.
  - **Paid By:** Dynamically populated select dropdown from active members.
  - **Category:** Tag expenses with icons (🍔 Food & Dining, 🚕 Travel, 🏨 Hotel & Stay, 🛒 Groceries, 🍿 Entertainment, 🏷️ Other).
  - **Live Preview:** Displays real-time breakdown of per-person cost before submitting.
- **Custom Splitting Feature:**
  - Default: Splits equally among all group members.
  - Optional custom mode: Toggle specific participants to split a targeted bill.

### 4. Expense History & Management
- Search filter by description or payer name.
- Filter by payer and category.
- Expense details include description, category tag, payer avatar, date/time, split mode, and amount.
- Individual expense deletion with instant recalculation.
- Clean SaaS empty state illustration when no expenses exist.

### 5. Mathematical Balance Overview & Calculation Engine
For every member, the dashboard computes:
- **Total Amount Paid:** Sum of expenses paid by that person.
- **Equal Share:** Person's fair share of the group spending.
- **Net Balance:** `Total Paid - Equal Share`
  - **Positive Balance (+):** Member is owed money (highlighted in Green).
  - **Negative Balance (-):** Member owes money (highlighted in Red).
  - **Zero Balance (0):** Member is completely squared up (Neutral Gray).

### 6. Simplified Settlement Plan ("Who Pays Whom")
- Implements a greedy debt-settlement algorithm that pairs maximum debtors with maximum creditors.
- Calculates the absolute minimum number of financial transfers required to square all group debts.

---

## 🧮 Mathematical Verification & Sample Calculation

SplitEasy includes built-in verification of the standard expense-sharing model:

### Sample Group Input:
- **Group Members (3):** Aman, Riya, Karan
- **Expenses:**
  - **Aman:** Paid ₹900 (Dinner)
  - **Riya:** Paid ₹300 (Snacks)
  - **Karan:** Paid ₹0

### Verification Results:

$$\text{Total Expenses} = ₹900 + ₹300 + ₹0 = ₹1,200.00$$

$$\text{Equal Share per Person} = \frac{₹1,200}{3} = ₹400.00$$

| Member | Total Paid | Equal Share | Net Balance Formula | Balance | Status | Verified Result |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Aman** | ₹900.00 | ₹400.00 | ₹900 − ₹400 | **+₹500.00** | **Owed ₹500.00** | ✅ **MATCH** |
| **Riya** | ₹300.00 | ₹400.00 | ₹300 − ₹400 | **−₹100.00** | **Owes ₹100.00** | ✅ **MATCH** |
| **Karan** | ₹0.00 | ₹400.00 | ₹0 − ₹400 | **−₹400.00** | **Owes ₹400.00** | ✅ **MATCH** |

### Minimal Settlement Transfers:
1. **Karan** pays **Aman** ₹400.00
2. **Riya** pays **Aman** ₹100.00  
*Net result: Aman receives ₹500, all three members are at ₹0 balance.*

---

## 📁 Project Architecture

```
First Task/
├── public/
│   └── favicon.svg               # SplitEasy SVG brand favicon
├── src/
│   ├── assets/                   # Static imagery
│   ├── components/
│   │   ├── BalanceView.jsx       # Member balance cards & math formulas
│   │   ├── DebtSettlement.jsx    # "Who Pays Whom" simplified settlements
│   │   ├── ExpenseForm.jsx       # New expense form with live preview
│   │   ├── ExpenseList.jsx       # Filterable expense history table
│   │   ├── GroupSetup.jsx        # Group name & 2-6 member management
│   │   ├── Header.jsx            # Top navbar with greeting & quick actions
│   │   ├── Icons.jsx             # Accessible Lucide-style SVG icons
│   │   ├── InternshipVerificationModal.jsx # Calculation details dialog
│   │   ├── Sidebar.jsx           # Responsive desktop/mobile navigation
│   │   └── SummaryCards.jsx      # Top metric cards (Total, Share, Members)
│   ├── constants/
│   │   └── categories.js         # Expense categories & icons
│   ├── utils/
│   │   └── calculations.js       # Pure mathematical calculation functions
│   ├── App.css                   # Complete SaaS styling & responsive queries
│   ├── App.jsx                   # Main application state & LocalStorage sync
│   ├── index.css                 # Base resets, typography, and design tokens
│   └── main.jsx                  # React application entry point
├── test-all-scenarios.js         # Automated mathematical verification test runner
├── index.html                    # HTML root with Inter font & metadata
├── package.json                  # Dependencies & scripts
└── vite.config.js                # Vite build configuration
```

---

## 💾 State Management & Persistence

- **Derived State:** No redundant values (e.g., total expenses, equal shares, member balances, settlements) are stored separately; they are computed dynamically using React `useMemo` hooks directly from `expenses` and `members`.
- **LocalStorage Sync:** Application state (`groupName`, `members`, and `expenses`) is persisted automatically to the browser's `localStorage` via `useEffect`. Refreshing the page preserves all changes seamlessly.
- **Pure Client-Side:** Frontend-only application requiring zero backend, database, or external auth servers.

---

## 🚀 Running the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Automated Tests
```bash
node test-all-scenarios.js
```
Executes all 33 mathematical assertions.

### 4. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

### 5. Run Linter
```bash
npm run lint
```
Verifies code hygiene and rules compliance (passes with 0 errors).

---

## 🌐 Deployment Instructions

### Preparing for GitHub:
1. Initialize git and commit files:
   ```bash
   git init
   git add .
   git commit -m "feat: complete SplitEasy expense management dashboard"
   ```
2. Create a new repository on GitHub (e.g., `spliteasy-expense-tracker`).
3. Push code to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/spliteasy-expense-tracker.git
   git branch -M main
   git push -u origin main
   ```

### Deploying to Vercel (1-Click or CLI):

#### Option A: Via Vercel Web Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New Project"** and select your `spliteasy-expense-tracker` repository.
3. Vercel automatically detects **Vite**:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. Your app will be live within seconds on a free `*.vercel.app` domain!

#### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the interactive prompts to deploy.
