import { useState, useMemo } from 'react';
import {
  ReceiptIcon,
  Trash2Icon,
  SearchIcon,
  CalendarIcon,
  FilterIcon,
} from './Icons';
import { formatINR } from '../utils/calculations';
import { EXPENSE_CATEGORIES } from '../constants/categories';

export default function ExpenseList({
  expenses,
  onDeleteExpense,
  onOpenAddExpense,
  members,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMember, setFilterMember] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Format timestamp nicely
  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  const getCategoryDetails = (catId) => {
    const found = EXPENSE_CATEGORIES.find((c) => c.id === catId);
    return found || { label: 'General', icon: '🏷️' };
  };

  // Filtered expenses based on search and member filter
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch =
        exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.paidBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMember =
        filterMember === 'ALL' || exp.paidBy === filterMember;

      const matchesCategory =
        filterCategory === 'ALL' || exp.category === filterCategory;

      return matchesSearch && matchesMember && matchesCategory;
    });
  }, [expenses, searchTerm, filterMember, filterCategory]);

  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [filteredExpenses]);

  return (
    <section className="section-card expense-list-card" id="expense-list-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-icon-badge">
            <ReceiptIcon size={20} />
          </div>
          <div>
            <h2 className="section-title">Expense History</h2>
            <p className="section-subtitle">
              {expenses.length} {expenses.length === 1 ? 'record' : 'records'} logged
              {filteredExpenses.length !== expenses.length &&
                ` (${filteredExpenses.length} matching filter)`}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onOpenAddExpense}
          disabled={members.length < 2}
        >
          Add New
        </button>
      </div>

      {/* Filter and Search Bar */}
      {expenses.length > 0 && (
        <div className="expense-filters-bar">
          <div className="search-input-wrapper">
            <SearchIcon size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by description or payer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            {/* Filter by Payer */}
            <select
              className="filter-select"
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
              aria-label="Filter by payer"
            >
              <option value="ALL">All Payers</option>
              {members.map((m) => (
                <option key={m} value={m}>
                  Paid by {m}
                </option>
              ))}
            </select>

            {/* Filter by Category */}
            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="ALL">All Categories</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Expense List or Empty State */}
      {expenses.length === 0 ? (
        <div className="empty-state-large">
          <div className="empty-state-icon-box">
            <ReceiptIcon size={44} className="empty-state-svg" />
          </div>
          <h3 className="empty-state-title">No Expenses Recorded Yet</h3>
          <p className="empty-state-desc">
            Shared dinners, road trips, groceries or stay bills? Add your first expense
            to see automatic splitting and balances in real time.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenAddExpense}
            disabled={members.length < 2}
          >
            Add Your First Expense
          </button>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="empty-state-mini">
          <FilterIcon size={24} />
          <p>No expenses match your search or filter criteria.</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchTerm('');
              setFilterMember('ALL');
              setFilterCategory('ALL');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="expenses-table-wrapper">
          <table className="expenses-table">
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Category</th>
                <th scope="col">Paid By</th>
                <th scope="col">Date</th>
                <th scope="col" className="text-right">Amount</th>
                <th scope="col" className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => {
                const cat = getCategoryDetails(exp.category);
                const isCustom =
                  Array.isArray(exp.sharedWith) &&
                  exp.sharedWith.length > 0 &&
                  exp.sharedWith.length < members.length;

                return (
                  <tr key={exp.id} className="expense-row">
                    {/* Description */}
                    <td className="expense-desc-cell">
                      <div className="expense-title-group">
                        <span className="expense-title">{exp.description}</span>
                        {isCustom ? (
                          <span
                            className="split-custom-tag"
                            title={`Shared with: ${exp.sharedWith.join(', ')}`}
                          >
                            Split ({exp.sharedWith.length} of {members.length})
                          </span>
                        ) : (
                          <span className="split-equal-tag">
                            Split with all ({members.length})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="category-pill">
                        <span className="category-emoji">{cat.icon}</span>
                        <span className="category-name">{cat.label}</span>
                      </span>
                    </td>

                    {/* Paid By */}
                    <td>
                      <div className="payer-badge">
                        <span className="payer-avatar">
                          {exp.paidBy.charAt(0).toUpperCase()}
                        </span>
                        <span className="payer-name">{exp.paidBy}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="expense-date-cell">
                      <div className="date-display">
                        <CalendarIcon size={13} />
                        <span>{formatDate(exp.date)}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="text-right expense-amount-cell">
                      <span className="expense-amount-val">
                        {formatINR(exp.amount)}
                      </span>
                    </td>

                    {/* Delete Action */}
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn-delete-expense"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete expense "${exp.description}" (${formatINR(
                                exp.amount
                              )})?`
                            )
                          ) {
                            onDeleteExpense(exp.id);
                          }
                        }}
                        title={`Delete ${exp.description}`}
                        aria-label={`Delete expense ${exp.description}`}
                      >
                        <Trash2Icon size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Table summary footer */}
          <div className="expenses-table-footer">
            <span className="footer-label">
              Showing {filteredExpenses.length} of {expenses.length} entries
            </span>
            <span className="footer-total">
              Filtered Total:{' '}
              <strong className="text-purple">
                {formatINR(totalFilteredAmount)}
              </strong>
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
