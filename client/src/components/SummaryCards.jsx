import {
  IndianRupeeIcon,
  PieChartIcon,
  UsersIcon,
  ShieldCheckIcon,
  ReceiptIcon,
} from './Icons';
import { formatINR } from '../utils/calculations';

export default function SummaryCards({
  totalExpenses,
  equalShare,
  memberCount,
  expenseCount,
  settlementsCount,
  members,
}) {
  const isCalculable = memberCount >= 2;

  return (
    <div className="summary-cards-grid">
      {/* 1. Total Expenses */}
      <div className="summary-card card-purple">
        <div className="card-top">
          <div className="card-icon-wrapper icon-purple">
            <IndianRupeeIcon size={22} />
          </div>
          <span className="card-badge badge-purple">
            <ReceiptIcon size={12} /> {expenseCount} {expenseCount === 1 ? 'Expense' : 'Expenses'}
          </span>
        </div>
        <div className="card-content">
          <span className="card-label">Total Expenses</span>
          <div className="card-value">{formatINR(totalExpenses)}</div>
          <div className="card-subtext">
            <span>Overall spending for this group</span>
          </div>
        </div>
      </div>

      {/* 2. Per Person Share */}
      <div className="summary-card card-violet">
        <div className="card-top">
          <div className="card-icon-wrapper icon-violet">
            <PieChartIcon size={22} />
          </div>
          <span className="card-badge badge-violet">
            {isCalculable ? 'Equal Split' : 'Need ≥2 Members'}
          </span>
        </div>
        <div className="card-content">
          <span className="card-label">Per Person Share</span>
          <div className="card-value">
            {isCalculable ? formatINR(equalShare) : '—'}
          </div>
          <div className="card-subtext">
            {isCalculable ? (
              <span>
                {formatINR(totalExpenses)} ÷ {memberCount} members
              </span>
            ) : (
              <span className="text-warning">
                Add at least 2 members to calculate
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Group Members */}
      <div className="summary-card card-indigo">
        <div className="card-top">
          <div className="card-icon-wrapper icon-indigo">
            <UsersIcon size={22} />
          </div>
          <span className="card-badge badge-indigo">
            {memberCount}/6 Members
          </span>
        </div>
        <div className="card-content">
          <span className="card-label">Group Members</span>
          <div className="card-value">
            {memberCount} {memberCount === 1 ? 'Person' : 'People'}
          </div>
          <div className="card-subtext member-avatars-preview">
            {members.length > 0 ? (
              <div className="avatar-chip-list">
                {members.slice(0, 4).map((name) => (
                  <span key={name} className="avatar-chip" title={name}>
                    {name.charAt(0).toUpperCase()}
                  </span>
                ))}
                {members.length > 4 && (
                  <span className="avatar-chip more-chip">
                    +{members.length - 4}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-warning">No members added yet</span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Settlement Status */}
      <div className="summary-card card-emerald">
        <div className="card-top">
          <div className="card-icon-wrapper icon-emerald">
            <ShieldCheckIcon size={22} />
          </div>
          <span className={`card-badge ${settlementsCount === 0 && totalExpenses > 0 ? 'badge-emerald' : 'badge-slate'}`}>
            {settlementsCount === 0 && totalExpenses > 0 ? 'Fully Settled' : 'Pending'}
          </span>
        </div>
        <div className="card-content">
          <span className="card-label">Settlement Status</span>
          <div className="card-value text-balance">
            {totalExpenses === 0
              ? 'No Dues'
              : settlementsCount === 0
              ? 'All Settled!'
              : `${settlementsCount} Transfer${settlementsCount > 1 ? 's' : ''} Needed`}
          </div>
          <div className="card-subtext">
            <span>
              {totalExpenses === 0
                ? 'Add expenses to see settlement plan'
                : settlementsCount === 0
                ? 'Everyone is even 🎉'
                : 'Minimal transactions calculated'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
