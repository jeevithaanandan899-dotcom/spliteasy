import {
  PieChartIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  InfoIcon,
} from './Icons';
import { formatINR } from '../utils/calculations';

export default function BalanceView({
  balances,
  memberCount,
  totalExpenses,
  equalShare,
}) {
  const isCalculable = memberCount >= 2;

  // Find highest spender and highest debtor for insights
  const highestPayer = [...balances].sort((a, b) => b.totalPaid - a.totalPaid)[0];
  const maxOwed = [...balances].sort((a, b) => b.balance - a.balance)[0];

  return (
    <section className="section-card balance-overview-card" id="balance-overview-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-icon-badge">
            <PieChartIcon size={20} />
          </div>
          <div>
            <h2 className="section-title">Balance Overview</h2>
            <p className="section-subtitle">
              Summary of each person's total paid, share of expenses, and net balance.
            </p>
          </div>
        </div>

        {isCalculable && (
          <div className="share-formula-pill">
            <InfoIcon size={14} />
            <span>Equal Share: {formatINR(equalShare)} per person</span>
          </div>
        )}
      </div>

      {!isCalculable ? (
        <div className="alert alert-warning" role="alert">
          <AlertCircleIcon size={18} />
          <div>
            <strong>Calculation Paused:</strong> A minimum of 2 group members is
            required to calculate balances and per-person equal shares.
          </div>
        </div>
      ) : balances.length === 0 ? (
        <div className="empty-state-mini">
          <PieChartIcon size={32} />
          <p>No member data available to calculate balances.</p>
        </div>
      ) : (
        <>
          {/* Formula Explanation Banner */}
          <div className="formula-banner">
            <div className="formula-item">
              <span className="formula-label">Total Spent:</span>
              <span className="formula-val">{formatINR(totalExpenses)}</span>
            </div>
            <div className="formula-sep">÷</div>
            <div className="formula-item">
              <span className="formula-label">Members:</span>
              <span className="formula-val">{memberCount}</span>
            </div>
            <div className="formula-sep">=</div>
            <div className="formula-item formula-highlight">
              <span className="formula-label">Equal Share:</span>
              <span className="formula-val">{formatINR(equalShare)}</span>
            </div>
          </div>

          {/* Member Balance Cards Grid */}
          <div className="balance-cards-grid">
            {balances.map((item) => {
              const { member, totalPaid, totalOwedShare, balance, status } = item;
              const isPositive = status === 'owed';
              const isNegative = status === 'owes';
              const isZero = status === 'settled';

              let statusClass = 'status-settled';
              let statusLabel = 'Settled Up';
              let badgeBg = 'badge-slate';

              if (isPositive) {
                statusClass = 'status-positive';
                statusLabel = `Owed ${formatINR(Math.abs(balance))}`;
                badgeBg = 'badge-positive';
              } else if (isNegative) {
                statusClass = 'status-negative';
                statusLabel = `Owes ${formatINR(Math.abs(balance))}`;
                badgeBg = 'badge-negative';
              }

              return (
                <div
                  key={member}
                  className={`balance-card ${statusClass}`}
                  data-status={status}
                >
                  <div className="balance-card-header">
                    <div className="balance-card-member">
                      <div className="member-avatar avatar-sm">
                        {member.charAt(0).toUpperCase()}
                      </div>
                      <span className="balance-member-name">{member}</span>
                    </div>

                    <span className={`balance-badge ${badgeBg}`}>
                      {isPositive && <ArrowUpRightIcon size={14} />}
                      {isNegative && <ArrowDownLeftIcon size={14} />}
                      {isZero && <CheckCircle2Icon size={14} />}
                      <span>{statusLabel}</span>
                    </span>
                  </div>

                  {/* Math Breakdown */}
                  <div className="balance-breakdown">
                    <div className="breakdown-row">
                      <span className="breakdown-label">Total Paid:</span>
                      <span className="breakdown-val font-semibold">
                        {formatINR(totalPaid)}
                      </span>
                    </div>
                    <div className="breakdown-row">
                      <span className="breakdown-label">Equal Share:</span>
                      <span className="breakdown-val text-muted">
                        -{formatINR(totalOwedShare)}
                      </span>
                    </div>
                    <div className="breakdown-divider" />
                    <div className="breakdown-row net-balance-row">
                      <span className="breakdown-label font-bold">
                        Net Balance:
                      </span>
                      <span className={`net-balance-val ${statusClass}`}>
                        {formatINR(balance, true)}
                      </span>
                    </div>
                  </div>

                  {/* Interpretation Note */}
                  <div className="balance-card-footer">
                    {isPositive && (
                      <span className="interpretation-text text-positive">
                        Gets back {formatINR(Math.abs(balance))} from others
                      </span>
                    )}
                    {isNegative && (
                      <span className="interpretation-text text-negative">
                        Needs to pay {formatINR(Math.abs(balance))} to settle up
                      </span>
                    )}
                    {isZero && (
                      <span className="interpretation-text text-muted">
                        All squared up! No balance owed.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Balance Insights */}
          <div className="balance-insights-bar">
            {highestPayer && highestPayer.totalPaid > 0 && (
              <div className="insight-pill">
                <span className="insight-emoji">👑</span>
                <span>
                  Top contributor:{' '}
                  <strong>{highestPayer.member}</strong> ({formatINR(highestPayer.totalPaid)})
                </span>
              </div>
            )}
            {maxOwed && maxOwed.balance > 0 && (
              <div className="insight-pill">
                <span className="insight-emoji">💰</span>
                <span>
                  Highest receiver:{' '}
                  <strong>{maxOwed.member}</strong> (owed {formatINR(maxOwed.balance)})
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
