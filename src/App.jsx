import { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import GroupSetup from './components/GroupSetup';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import BalanceView from './components/BalanceView';
import DebtSettlement from './components/DebtSettlement';
import InternshipVerificationModal from './components/InternshipVerificationModal';
import {
  calculateTotalExpenses,
  calculateEqualShare,
  calculateMemberBalances,
  calculateSettlements,
} from './utils/calculations';
import {
  LayoutDashboardIcon,
  ReceiptIcon,
  UsersIcon,
  PieChartIcon,
  SparklesIcon,
} from './components/Icons';
import './App.css';

// Storage keys for persistent state
const STORAGE_KEYS = {
  GROUP_NAME: 'spliteasy_group_name_v1',
  MEMBERS: 'spliteasy_members_v1',
  EXPENSES: 'spliteasy_expenses_v1',
};

// Default internship test case initial data
const DEFAULT_MEMBERS = ['Aman', 'Riya', 'Karan'];
const DEFAULT_GROUP_NAME = 'Weekend Trip';
const DEFAULT_EXPENSES = [
  {
    id: 'exp-1',
    description: 'Dinner',
    amount: 900,
    paidBy: 'Aman',
    category: 'food',
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    sharedWith: ['Aman', 'Riya', 'Karan'],
  },
  {
    id: 'exp-2',
    description: 'Snacks',
    amount: 300,
    paidBy: 'Riya',
    category: 'food',
    date: new Date(Date.now() - 3600000).toISOString(),
    sharedWith: ['Aman', 'Riya', 'Karan'],
  },
];

export default function App() {
  // Navigation active tab: 'dashboard' | 'expenses' | 'group' | 'balances'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Group State with LocalStorage Initialization
  const [groupName, setGroupName] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GROUP_NAME);
      return saved ? JSON.parse(saved) : DEFAULT_GROUP_NAME;
    } catch {
      return DEFAULT_GROUP_NAME;
    }
  });

  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return saved ? JSON.parse(saved) : DEFAULT_MEMBERS;
    } catch {
      return DEFAULT_MEMBERS;
    }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : DEFAULT_EXPENSES;
    } catch {
      return DEFAULT_EXPENSES;
    }
  });

  // LocalStorage Persistence via useEffect
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GROUP_NAME, JSON.stringify(groupName));
    } catch (e) {
      console.error('Failed to save group name to localStorage', e);
    }
  }, [groupName]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    } catch (e) {
      console.error('Failed to save members to localStorage', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses to localStorage', e);
    }
  }, [expenses]);

  // Derived calculations (Section 6: Pure derived state, not stored separately)
  const totalExpenses = useMemo(() => {
    return calculateTotalExpenses(expenses);
  }, [expenses]);

  const equalShare = useMemo(() => {
    return calculateEqualShare(totalExpenses, members.length);
  }, [totalExpenses, members.length]);

  const balances = useMemo(() => {
    return calculateMemberBalances(members, expenses);
  }, [members, expenses]);

  const settlements = useMemo(() => {
    return calculateSettlements(balances);
  }, [balances]);

  // Member Handlers
  const handleAddMember = (name) => {
    if (!members.includes(name) && members.length < 6) {
      setMembers((prev) => [...prev, name]);
    }
  };

  const handleRemoveMember = (name) => {
    setMembers((prev) => prev.filter((m) => m !== name));
    // Also remove expenses paid by this member or sanitize sharedWith
    setExpenses((prev) =>
      prev
        .filter((e) => e.paidBy !== name)
        .map((e) => ({
          ...e,
          sharedWith: Array.isArray(e.sharedWith)
            ? e.sharedWith.filter((m) => m !== name)
            : members.filter((m) => m !== name),
        }))
    );
  };

  // Expense Handlers
  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // 1-Click Load Sample Group
  const handleLoadSampleGroup = () => {
    setGroupName(DEFAULT_GROUP_NAME);
    setMembers([...DEFAULT_MEMBERS]);
    setExpenses([
      {
        id: `exp-${Date.now()}-1`,
        description: 'Dinner',
        amount: 900,
        paidBy: 'Aman',
        category: 'food',
        date: new Date().toISOString(),
        sharedWith: ['Aman', 'Riya', 'Karan'],
      },
      {
        id: `exp-${Date.now()}-2`,
        description: 'Snacks',
        amount: 300,
        paidBy: 'Riya',
        category: 'food',
        date: new Date().toISOString(),
        sharedWith: ['Aman', 'Riya', 'Karan'],
      },
    ]);
  };

  // Reset Everything
  const handleResetAll = () => {
    if (window.confirm('Reset all group data and clear all recorded expenses?')) {
      setGroupName('Weekend Trip');
      setMembers(['Aman', 'Riya']);
      setExpenses([]);
    }
  };

  return (
    <div className="spliteasy-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        memberCount={members.length}
        expenseCount={expenses.length}
        onLoadSampleGroup={handleLoadSampleGroup}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main App Content Area */}
      <div className="main-viewport">
        {/* Top Header */}
        <Header
          groupName={groupName}
          members={members}
          onOpenAddExpense={() => setActiveTab('expenses')}
          onLoadSampleGroup={handleLoadSampleGroup}
          setMobileOpen={setMobileOpen}
        />

        {/* Tab Navigation Pill Bar on Mobile/Tablet */}
        <div className="mobile-nav-pills">
          <button
            type="button"
            className={`pill-btn ${activeTab === 'dashboard' ? 'pill-active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboardIcon size={16} />
            <span>Overview</span>
          </button>
          <button
            type="button"
            className={`pill-btn ${activeTab === 'expenses' ? 'pill-active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            <ReceiptIcon size={16} />
            <span>Expenses</span>
          </button>
          <button
            type="button"
            className={`pill-btn ${activeTab === 'group' ? 'pill-active' : ''}`}
            onClick={() => setActiveTab('group')}
          >
            <UsersIcon size={16} />
            <span>Group ({members.length})</span>
          </button>
          <button
            type="button"
            className={`pill-btn ${activeTab === 'balances' ? 'pill-active' : ''}`}
            onClick={() => setActiveTab('balances')}
          >
            <PieChartIcon size={16} />
            <span>Balances</span>
          </button>
        </div>

        {/* Verification Callout Ribbon */}
        <div className="verification-ribbon">
          <div className="ribbon-content">
            <SparklesIcon size={16} className="text-purple" />
            <span className="ribbon-text">
              <strong>Calculation Preview:</strong> Aman ₹900, Riya ₹300, Karan ₹0 → Total ₹1,200 | Share ₹400 | Aman +₹500 | Riya -₹100 | Karan -₹400.
            </span>
          </div>
          <button
            type="button"
            className="btn-ribbon-action"
            onClick={() => setIsVerificationModalOpen(true)}
          >
            View Calculation Details
          </button>
        </div>

        {/* Scrollable Main Content */}
        <main className="dashboard-content">
          {/* Always show summary cards at top of dashboard */}
          {(activeTab === 'dashboard' || activeTab === 'balances') && (
            <SummaryCards
              totalExpenses={totalExpenses}
              equalShare={equalShare}
              memberCount={members.length}
              expenseCount={expenses.length}
              settlementsCount={settlements.length}
              members={members}
            />
          )}

          {/* TAB 1: DASHBOARD (Unified SaaS View) */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-grid-layout">
              <div className="dashboard-main-col">
                <BalanceView
                  balances={balances}
                  memberCount={members.length}
                  totalExpenses={totalExpenses}
                  equalShare={equalShare}
                />
                <DebtSettlement
                  settlements={settlements}
                  memberCount={members.length}
                  totalExpenses={totalExpenses}
                />
              </div>

              <div className="dashboard-side-col">
                <GroupSetup
                  groupName={groupName}
                  setGroupName={setGroupName}
                  members={members}
                  onAddMember={handleAddMember}
                  onRemoveMember={handleRemoveMember}
                  onLoadSampleGroup={handleLoadSampleGroup}
                  onResetAll={handleResetAll}
                  expenses={expenses}
                />
                <ExpenseForm
                  members={members}
                  onAddExpense={handleAddExpense}
                  groupName={groupName}
                />
              </div>

              <div className="dashboard-full-col">
                <ExpenseList
                  expenses={expenses}
                  onDeleteExpense={handleDeleteExpense}
                  onOpenAddExpense={() => {
                    const el = document.getElementById('add-expense-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  members={members}
                />
              </div>
            </div>
          )}

          {/* TAB 2: EXPENSES (Add Form + Complete History) */}
          {activeTab === 'expenses' && (
            <div className="tab-pane-expenses">
              <ExpenseForm
                members={members}
                onAddExpense={handleAddExpense}
                groupName={groupName}
              />
              <ExpenseList
                expenses={expenses}
                onDeleteExpense={handleDeleteExpense}
                onOpenAddExpense={() => {
                  const el = document.getElementById('add-expense-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                members={members}
              />
            </div>
          )}

          {/* TAB 3: GROUP SETUP */}
          {activeTab === 'group' && (
            <div className="tab-pane-group">
              <GroupSetup
                groupName={groupName}
                setGroupName={setGroupName}
                members={members}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
                onLoadSampleGroup={handleLoadSampleGroup}
                onResetAll={handleResetAll}
                expenses={expenses}
              />
            </div>
          )}

          {/* TAB 4: BALANCES & SETTLEMENT */}
          {activeTab === 'balances' && (
            <div className="tab-pane-balances">
              <BalanceView
                balances={balances}
                memberCount={members.length}
                totalExpenses={totalExpenses}
                equalShare={equalShare}
              />
              <DebtSettlement
                settlements={settlements}
                memberCount={members.length}
                totalExpenses={totalExpenses}
              />
            </div>
          )}
        </main>
      </div>

      {/* Calculation Verification Modal */}
      <InternshipVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onLoadSampleGroup={handleLoadSampleGroup}
        members={members}
        balances={balances}
        totalExpenses={totalExpenses}
        equalShare={equalShare}
      />
    </div>
  );
}
