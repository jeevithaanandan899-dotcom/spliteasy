/* global process */
import {
  formatINR,
  calculateTotalExpenses,
  calculateEqualShare,
  calculateMemberBalances,
  calculateSettlements,
} from './src/utils/calculations.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(`✅ [PASS] ${message}`);
  } else {
    console.error(`❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

console.log('====================================================');
console.log('SPLITEASY AUTOMATED TEST SUITE');
console.log('====================================================\n');

// 1. Mandatory Internship Test Case
console.log('--- TEST 1: Internship Example (Aman, Riya, Karan) ---');
const members1 = ['Aman', 'Riya', 'Karan'];
const expenses1 = [
  { id: '1', description: 'Dinner', amount: 900, paidBy: 'Aman' },
  { id: '2', description: 'Snacks', amount: 300, paidBy: 'Riya' },
];

const total1 = calculateTotalExpenses(expenses1);
const share1 = calculateEqualShare(total1, members1.length);
const balances1 = calculateMemberBalances(members1, expenses1);
const settlements1 = calculateSettlements(balances1);

assert(total1 === 1200, `Total expenses is ₹1,200 (actual: ₹${total1})`);
assert(share1 === 400, `Equal share is ₹400 (actual: ₹${share1})`);

const aman1 = balances1.find((b) => b.member === 'Aman');
const riya1 = balances1.find((b) => b.member === 'Riya');
const karan1 = balances1.find((b) => b.member === 'Karan');

assert(aman1?.totalPaid === 900, `Aman total paid is ₹900`);
assert(aman1?.balance === 500, `Aman balance is +₹500 (actual: ${aman1?.balance})`);
assert(aman1?.status === 'owed', `Aman status is 'owed'`);

assert(riya1?.totalPaid === 300, `Riya total paid is ₹300`);
assert(riya1?.balance === -100, `Riya balance is -₹100 (actual: ${riya1?.balance})`);
assert(riya1?.status === 'owes', `Riya status is 'owes'`);

assert(karan1?.totalPaid === 0, `Karan total paid is ₹0`);
assert(karan1?.balance === -400, `Karan balance is -₹400 (actual: ${karan1?.balance})`);
assert(karan1?.status === 'owes', `Karan status is 'owes'`);

assert(settlements1.length === 2, `Exactly 2 settlement transfers needed`);
assert(
  settlements1.some((s) => s.from === 'Karan' && s.to === 'Aman' && s.amount === 400),
  `Karan pays Aman ₹400`
);
assert(
  settlements1.some((s) => s.from === 'Riya' && s.to === 'Aman' && s.amount === 100),
  `Riya pays Aman ₹100`
);

// 2. Add New Expense Test
console.log('\n--- TEST 2: Adding a New Expense (Karan pays ₹600) ---');
const expenses2 = [
  ...expenses1,
  { id: '3', description: 'Dessert', amount: 600, paidBy: 'Karan' },
];
const total2 = calculateTotalExpenses(expenses2);
const share2 = calculateEqualShare(total2, members1.length);
const balances2 = calculateMemberBalances(members1, expenses2);
const settlements2 = calculateSettlements(balances2);

assert(total2 === 1800, `Total expenses updated to ₹1,800`);
assert(share2 === 600, `Equal share updated to ₹600`);
const karan2 = balances2.find((b) => b.member === 'Karan');
assert(karan2?.balance === 0, `Karan balance is ₹0 (Settled)`);
assert(karan2?.status === 'settled', `Karan status is 'settled'`);
assert(settlements2.length === 1, `Only 1 transfer needed now (Riya to Aman ₹300)`);
assert(settlements2[0]?.from === 'Riya' && settlements2[0]?.to === 'Aman' && settlements2[0]?.amount === 300, `Riya pays Aman ₹300`);

// 3. Deleting an Expense Test
console.log('\n--- TEST 3: Deleting an Expense (Remove Riya Snacks ₹300) ---');
const expenses3 = expenses1.filter((e) => e.description !== 'Snacks');
const total3 = calculateTotalExpenses(expenses3);
const share3 = calculateEqualShare(total3, members1.length);
const balances3 = calculateMemberBalances(members1, expenses3);
assert(total3 === 900, `Total is ₹900 after deleting snacks`);
assert(share3 === 300, `Equal share is ₹300`);
const riya3 = balances3.find((b) => b.member === 'Riya');
assert(riya3?.balance === -300, `Riya balance is now -₹300`);

// 4. Adding 4th Member Test
console.log('\n--- TEST 4: Adding 4th Member (Sneha) ---');
const members4 = ['Aman', 'Riya', 'Karan', 'Sneha'];
const total4 = calculateTotalExpenses(expenses1);
const share4 = calculateEqualShare(total4, members4.length);
const balances4 = calculateMemberBalances(members4, expenses1);
assert(share4 === 300, `Equal share is ₹300 (₹1,200 / 4)`);
const sneha4 = balances4.find((b) => b.member === 'Sneha');
assert(sneha4?.balance === -300, `Sneha owes ₹300`);
const riya4 = balances4.find((b) => b.member === 'Riya');
assert(riya4?.balance === 0, `Riya is now settled (paid 300, share 300)`);

// 5. Empty State Test
console.log('\n--- TEST 5: Empty Expenses List ---');
const total5 = calculateTotalExpenses([]);
const share5 = calculateEqualShare(total5, 3);
const balances5 = calculateMemberBalances(members1, []);
const settlements5 = calculateSettlements(balances5);
assert(total5 === 0, `Empty expenses total is 0`);
assert(share5 === 0, `Empty expenses share is 0`);
assert(balances5.every((b) => b.balance === 0), `All balances 0 on empty list`);
assert(settlements5.length === 0, `No settlements needed on empty list`);

// 6. Currency Formatting Test
console.log('\n--- TEST 6: Currency Formatting ---');
assert(formatINR(1200) === '₹1,200.00', `Format INR 1200 => ₹1,200.00`);
assert(formatINR(500, true) === '+₹500.00', `Format INR +500 => +₹500.00`);
assert(formatINR(-100) === '-₹100.00', `Format INR -100 => -₹100.00`);

console.log(`\n====================================================`);
console.log(`RESULT: ${passed} / ${total} tests PASSED`);
console.log(`====================================================\n`);
