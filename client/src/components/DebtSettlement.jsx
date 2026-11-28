import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
} from './Icons';
import { formatINR } from '../utils/calculations';

export default function DebtSettlement({
  settlements,
  memberCount,
  totalExpenses,
}) {
  const isCalculable = memberCount >= 2;

  if (!isCalculable || totalExpenses === 0) {
    return null;
  }

  return (
    <section className="section-card debt-settlement-card" id="debt-settlement-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-icon-badge">
            <ShieldCheckIcon size={20} />
          </div>
          <div>
            <h2 className="section-title">Simplified Settlement Plan</h2>
            <p className="section-subtitle">
              Calculated minimal transfers so everyone squares up with the fewest transactions.
            </p>
          </div>
        </div>

        {settlements.length > 0 && (
          <span className="settlement-count-badge">
            {settlements.length} {settlements.length === 1 ? 'Transfer' : 'Transfers'} Needed
          </span>
        )}
      </div>

      {settlements.length === 0 ? (
        <div className="settled-state-box">
          <div className="settled-icon-circle">
            <CheckCircle2Icon size={36} className="text-emerald" />
          </div>
          <h3 className="settled-title">Everyone is Settled Up! 🎉</h3>
          <p className="settled-desc">
            All group members have equalized their payments. No money is owed between anyone!
          </p>
        </div>
      ) : (
        <div className="settlements-list">
          {settlements.map((tx, idx) => (
            <div key={`${tx.from}-${tx.to}-${idx}`} className="settlement-item">
              <div className="settlement-payer">
                <div className="member-avatar avatar-sm avatar-red">
                  {tx.from.charAt(0).toUpperCase()}
                </div>
                <div className="payer-text">
                  <span className="person-name">{tx.from}</span>
                  <span className="role-subtext text-negative">Owes / Pays</span>
                </div>
              </div>

              <div className="settlement-transfer-arrow">
                <div className="arrow-line" />
                <div className="transfer-amount-badge">
                  {formatINR(tx.amount)}
                </div>
                <ArrowRightIcon size={16} className="arrow-head" />
              </div>

              <div className="settlement-receiver">
                <div className="member-avatar avatar-sm avatar-green">
                  {tx.to.charAt(0).toUpperCase()}
                </div>
                <div className="receiver-text">
                  <span className="person-name">{tx.to}</span>
                  <span className="role-subtext text-positive">Receives</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
