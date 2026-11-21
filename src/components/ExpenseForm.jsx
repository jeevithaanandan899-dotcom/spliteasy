import { useState } from 'react';
import {
  ReceiptIcon,
  PlusIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  InfoIcon,
} from './Icons';
import { formatINR } from '../utils/calculations';
import { EXPENSE_CATEGORIES } from '../constants/categories';

export default function ExpenseForm({
  members,
  onAddExpense,
  groupName,
}) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payerInput, setPayerInput] = useState('');
  const [category, setCategory] = useState('food');

  // Stretch Goal: Custom participant splitting
  const [isCustomSplit, setIsCustomSplit] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  // Errors & success alerts
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  // Derived effective payer: If current payerInput is in members, use it; otherwise use members[0]
  const paidBy = (payerInput && members.includes(payerInput))
    ? payerInput
    : (members[0] || '');

  // Live calculation preview
  const numAmount = parseFloat(amount) || 0;
  const splitGroup = isCustomSplit
    ? selectedParticipants.filter((m) => members.includes(m))
    : members;
  const perPersonPreview =
    splitGroup.length > 0 && numAmount > 0
      ? numAmount / splitGroup.length
      : 0;

  const handleToggleParticipant = (member) => {
    const currentList = selectedParticipants.length === 0 ? [...members] : selectedParticipants;
    if (currentList.includes(member)) {
      if (currentList.length <= 1) {
        setErrors((prev) => ({
          ...prev,
          split: 'An expense must be shared with at least one member.',
        }));
        return;
      }
      setSelectedParticipants(currentList.filter((m) => m !== member));
    } else {
      setSelectedParticipants([...currentList, member]);
    }
    setErrors((prev) => ({ ...prev, split: null }));
  };

  const validate = () => {
    const errs = {};

    if (!description.trim()) {
      errs.description = 'Expense description is required.';
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      errs.amount = 'Please enter a valid amount greater than ₹0.';
    }

    if (!paidBy) {
      errs.paidBy = 'Please select who paid this expense.';
    } else if (!members.includes(paidBy)) {
      errs.paidBy = 'Selected payer is not in the group.';
    }

    if (members.length < 2) {
      errs.general = 'Add at least 2 members to your group before adding expenses.';
    }

    if (isCustomSplit && splitGroup.length === 0) {
      errs.split = 'Please select at least one person to share this expense.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!validate()) {
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(Number(amount).toFixed(2)),
      paidBy,
      category,
      date: new Date().toISOString(),
      sharedWith: isCustomSplit ? [...splitGroup] : [...members],
    };

    onAddExpense(newExpense);

    // Reset Form Fields
    setDescription('');
    setAmount('');
    setCategory('food');
    setIsCustomSplit(false);
    setSelectedParticipants([]);
    setErrors({});

    setSuccessMsg(`Expense "${newExpense.description}" of ${formatINR(newExpense.amount)} added successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <section className="section-card expense-form-card" id="add-expense-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-icon-badge">
            <ReceiptIcon size={20} />
          </div>
          <div>
            <h2 className="section-title">Add Expense</h2>
            <p className="section-subtitle">
              Record a new payment for {groupName || 'your group'}.
            </p>
          </div>
        </div>
      </div>

      {/* Minimum members check */}
      {members.length < 2 && (
        <div className="alert alert-warning" role="alert">
          <AlertCircleIcon size={18} />
          <div>
            <strong>Cannot add expense:</strong> Your group needs at least 2 members to split expenses. Please add members in the Group Setup section first.
          </div>
        </div>
      )}

      {/* Success banner */}
      {successMsg && (
        <div className="alert alert-success" role="status">
          <CheckCircle2Icon size={18} />
          <div>{successMsg}</div>
        </div>
      )}

      {errors.general && (
        <div className="alert alert-danger" role="alert">
          <AlertCircleIcon size={18} />
          <div>{errors.general}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="expense-form" noValidate>
        {/* Row 1: Description & Amount */}
        <div className="form-grid-2">
          {/* 1. Description */}
          <div className="input-group">
            <label htmlFor="expense-desc" className="input-field-label">
              Description <span className="required-star">*</span>
            </label>
            <input
              id="expense-desc"
              type="text"
              className={`form-input ${errors.description ? 'input-error' : ''}`}
              placeholder="e.g. Dinner at Bistro, Taxi, Groceries"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: null });
              }}
              disabled={members.length < 2}
              maxLength={80}
            />
            {errors.description && (
              <span className="field-error-msg">{errors.description}</span>
            )}
          </div>

          {/* 2. Amount */}
          <div className="input-group">
            <label htmlFor="expense-amount" className="input-field-label">
              Amount (₹) <span className="required-star">*</span>
            </label>
            <div className="input-currency-wrapper">
              <span className="currency-prefix">₹</span>
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                className={`form-input form-input-with-prefix ${
                  errors.amount ? 'input-error' : ''
                }`}
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors({ ...errors, amount: null });
                }}
                disabled={members.length < 2}
              />
            </div>
            {errors.amount && (
              <span className="field-error-msg">{errors.amount}</span>
            )}
          </div>
        </div>

        {/* Row 2: Paid By & Category */}
        <div className="form-grid-2">
          {/* 3. Paid by Dropdown */}
          <div className="input-group">
            <label htmlFor="paid-by-select" className="input-field-label">
              Paid By <span className="required-star">*</span>
            </label>
            <select
              id="paid-by-select"
              className={`form-select ${errors.paidBy ? 'input-error' : ''}`}
              value={paidBy}
              onChange={(e) => {
                setPayerInput(e.target.value);
                if (errors.paidBy) setErrors({ ...errors, paidBy: null });
              }}
              disabled={members.length < 2}
            >
              {members.length === 0 ? (
                <option value="">No members available</option>
              ) : (
                members.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))
              )}
            </select>
            {errors.paidBy && (
              <span className="field-error-msg">{errors.paidBy}</span>
            )}
          </div>

          {/* Category */}
          <div className="input-group">
            <label htmlFor="category-select" className="input-field-label">
              Category
            </label>
            <select
              id="category-select"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={members.length < 2}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stretch Goal: Custom split toggle */}
        <div className="stretch-goal-section">
          <div className="stretch-header">
            <div className="stretch-toggle-label">
              <span className="stretch-title">Split Configuration</span>
              <span className="stretch-badge">Equal Split by Default</span>
            </div>
            <button
              type="button"
              className={`btn-toggle-split ${isCustomSplit ? 'active' : ''}`}
              onClick={() => {
                const nextState = !isCustomSplit;
                setIsCustomSplit(nextState);
                if (nextState && selectedParticipants.length === 0) {
                  setSelectedParticipants([...members]);
                }
              }}
              disabled={members.length < 2}
            >
              {isCustomSplit ? 'Custom Split Active' : 'Customize Who Shares'}
            </button>
          </div>

          {isCustomSplit && (
            <div className="custom-split-panel">
              <span className="custom-split-instruction">
                Select which members share this specific expense:
              </span>
              <div className="custom-member-chips">
                {members.map((member) => {
                  const effectiveList = selectedParticipants.length === 0 ? members : selectedParticipants;
                  const isChecked = effectiveList.includes(member);
                  return (
                    <label
                      key={member}
                      className={`custom-member-chip ${isChecked ? 'chip-checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleParticipant(member)}
                      />
                      <span>{member}</span>
                    </label>
                  );
                })}
              </div>
              {errors.split && (
                <span className="field-error-msg">{errors.split}</span>
              )}
            </div>
          )}
        </div>

        {/* Live Calculation Preview Banner */}
        {numAmount > 0 && splitGroup.length > 0 && members.length >= 2 && (
          <div className="live-preview-box">
            <InfoIcon size={16} className="preview-icon" />
            <div className="preview-text">
              <span>
                <strong>{paidBy || 'Payer'}</strong> pays{' '}
                <strong>{formatINR(numAmount)}</strong>. Split equally among{' '}
                <strong>{splitGroup.length}</strong> {splitGroup.length === 1 ? 'person' : 'people'}:{' '}
                <span className="preview-highlight">{formatINR(perPersonPreview)} each</span>.
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="form-submit-row">
          <button
            type="submit"
            className="btn btn-primary btn-lg submit-expense-btn"
            disabled={members.length < 2}
          >
            <PlusIcon size={18} />
            <span>Add Expense</span>
          </button>
        </div>
      </form>
    </section>
  );
}
