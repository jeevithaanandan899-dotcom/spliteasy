/**
 * SplitEasy Calculation Utilities
 * Pure functions for expense sharing and balance calculations.
 */

/**
 * Format an amount in Indian Rupees (INR)
 * @param {number} amount
 * @param {boolean} showSign - whether to prefix + for positive numbers
 * @returns {string} e.g. "₹400.00" or "+₹500.00"
 */
export function formatINR(amount, showSign = false) {
  const num = Number(amount) || 0;
  const absFormatted = Math.abs(num).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (showSign && num > 0) {
    return `+₹${absFormatted}`;
  }
  if (num < 0) {
    return `-₹${absFormatted}`;
  }
  return `₹${absFormatted}`;
}

/**
 * Calculate total spent from an array of expenses
 * @param {Array<{ amount: number }>} expenses
 * @returns {number}
 */
export function calculateTotalExpenses(expenses = []) {
  return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
}

/**
 * Calculate per person equal share
 * @param {number} totalExpenses
 * @param {number} memberCount
 * @returns {number}
 */
export function calculateEqualShare(totalExpenses, memberCount) {
  if (!memberCount || memberCount <= 0) return 0;
  return totalExpenses / memberCount;
}

/**
 * Calculate detailed balances for every member in the group.
 * Follows the standard equal split formula:
 * Equal Share = Total Spent / Number of Group Members
 * Balance = Total Paid By Member - Equal Share
 * 
 * Supports both:
 * 1. Default equal split (all members share each expense)
 * 2. Custom sharing (stretch goal: expense split among selected sharedWith members)
 * 
 * @param {Array<string>} members - List of member names
 * @param {Array<{ id: string, description: string, amount: number, paidBy: string, sharedWith?: string[] }>} expenses
 * @returns {Array<{ member: string, totalPaid: number, totalOwedShare: number, balance: number, status: 'owed' | 'owes' | 'settled' }>}
 */
export function calculateMemberBalances(members = [], expenses = []) {
  if (!members || members.length === 0) return [];

  // Map to accumulate paid amounts
  const paidMap = {};
  // Map to accumulate owed share
  const owedShareMap = {};

  members.forEach((m) => {
    paidMap[m] = 0;
    owedShareMap[m] = 0;
  });

  const totalSpent = calculateTotalExpenses(expenses);
  const memberCount = members.length;
  const defaultEqualShare = calculateEqualShare(totalSpent, memberCount);

  // Check if any expenses have custom sharedWith specified
  const hasCustomSplits = expenses.some(
    (exp) => Array.isArray(exp.sharedWith) && exp.sharedWith.length > 0 && exp.sharedWith.length < memberCount
  );

  if (!hasCustomSplits) {
    // Pure equal split: each member's share is exactly equalShare
    expenses.forEach((exp) => {
      const amount = Number(exp.amount) || 0;
      if (paidMap[exp.paidBy] !== undefined) {
        paidMap[exp.paidBy] += amount;
      }
    });

    return members.map((member) => {
      const totalPaid = paidMap[member] || 0;
      const totalOwedShare = memberCount >= 2 ? defaultEqualShare : 0;
      const balance = memberCount >= 2 ? totalPaid - totalOwedShare : 0;

      // Rounded to 2 decimals to prevent floating point imprecision (-0.00)
      const roundedBalance = Math.round(balance * 100) / 100;

      let status = 'settled';
      if (roundedBalance > 0.009) {
        status = 'owed';
      } else if (roundedBalance < -0.009) {
        status = 'owes';
      }

      return {
        member,
        totalPaid: Math.round(totalPaid * 100) / 100,
        totalOwedShare: Math.round(totalOwedShare * 100) / 100,
        balance: roundedBalance,
        status,
      };
    });
  }

  // Handle custom splits per expense if present
  expenses.forEach((exp) => {
    const amount = Number(exp.amount) || 0;
    if (paidMap[exp.paidBy] !== undefined) {
      paidMap[exp.paidBy] += amount;
    }

    const participants = (Array.isArray(exp.sharedWith) && exp.sharedWith.length > 0)
      ? exp.sharedWith.filter((p) => members.includes(p))
      : members;

    const count = participants.length > 0 ? participants.length : members.length;
    const splitAmount = amount / count;

    participants.forEach((p) => {
      if (owedShareMap[p] !== undefined) {
        owedShareMap[p] += splitAmount;
      }
    });
  });

  return members.map((member) => {
    const totalPaid = paidMap[member] || 0;
    const totalOwedShare = memberCount >= 2 ? (owedShareMap[member] || 0) : 0;
    const balance = memberCount >= 2 ? totalPaid - totalOwedShare : 0;

    const roundedBalance = Math.round(balance * 100) / 100;
    let status = 'settled';
    if (roundedBalance > 0.009) {
      status = 'owed';
    } else if (roundedBalance < -0.009) {
      status = 'owes';
    }

    return {
      member,
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalOwedShare: Math.round(totalOwedShare * 100) / 100,
      balance: roundedBalance,
      status,
    };
  });
}

/**
 * Calculate the simplest "Who pays whom" settlement transactions.
 * Uses a greedy matching algorithm: largest debtor pays largest creditor.
 * 
 * @param {Array<{ member: string, balance: number }>} balances
 * @returns {Array<{ from: string, to: string, amount: number }>}
 */
export function calculateSettlements(balances = []) {
  // Separate into debtors (< 0) and creditors (> 0)
  const debtors = [];
  const creditors = [];

  balances.forEach(({ member, balance }) => {
    const rounded = Math.round(balance * 100) / 100;
    if (rounded < -0.009) {
      debtors.push({ member, amount: -rounded });
    } else if (rounded > 0.009) {
      creditors.push({ member, amount: rounded });
    }
  });

  // Sort descending by amount
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let dIndex = 0;
  let cIndex = 0;

  while (dIndex < debtors.length && cIndex < creditors.length) {
    const debtor = debtors[dIndex];
    const creditor = creditors[cIndex];

    const settleAmount = Math.min(debtor.amount, creditor.amount);
    if (settleAmount > 0.009) {
      transactions.push({
        from: debtor.member,
        to: creditor.member,
        amount: Math.round(settleAmount * 100) / 100,
      });
    }

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (debtor.amount <= 0.009) {
      dIndex++;
    }
    if (creditor.amount <= 0.009) {
      cIndex++;
    }
  }

  return transactions;
}
