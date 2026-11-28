import { useState } from 'react';
import {
  UsersIcon,
  UserPlusIcon,
  Trash2Icon,
  AlertCircleIcon,
  CheckCircle2Icon,
  SparklesIcon,
  RefreshCwIcon,
  Edit3Icon,
} from './Icons';
import { formatINR } from '../utils/calculations';

// Assign vibrant, distinct avatar colors for up to 6 members
const AVATAR_COLORS = [
  { bg: '#ede9fe', text: '#6d28d9', border: '#c4b5fd' }, // Violet
  { bg: '#e0f2fe', text: '#0284c7', border: '#bae6fd' }, // Sky
  { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' }, // Emerald
  { bg: '#fef3c7', text: '#d97706', border: '#fde68a' }, // Amber
  { bg: '#fce7f3', text: '#db2777', border: '#fbcfe8' }, // Pink
  { bg: '#ffedd5', text: '#ea580c', border: '#fed7aa' }, // Orange
];

export default function GroupSetup({
  groupName,
  setGroupName,
  members,
  onAddMember,
  onRemoveMember,
  onLoadSampleGroup,
  onResetAll,
  expenses,
}) {
  const [newMemberName, setNewMemberName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempGroupName, setTempGroupName] = useState(groupName);

  // Calculate how much each member has paid so far
  const memberSpending = members.reduce((acc, m) => {
    acc[m] = expenses
      .filter((e) => e.paidBy === m)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    return acc;
  }, {});

  const handleAddMember = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmed = newMemberName.trim();

    if (!trimmed) {
      setError('Please enter a valid member name.');
      return;
    }

    if (members.length >= 6) {
      setError('Maximum limit of 6 group members reached.');
      return;
    }

    // Duplicate check (case-insensitive)
    const exists = members.some(
      (m) => m.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      setError(`"${trimmed}" is already a member of this group.`);
      return;
    }

    onAddMember(trimmed);
    setNewMemberName('');
    setSuccessMsg(`Added "${trimmed}" to the group!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleRemoveMember = (name) => {
    setError('');
    setSuccessMsg('');

    // Safety check: has this member paid any expenses?
    const hasPaid = expenses.some((e) => e.paidBy === name);
    const hasShared = expenses.some(
      (e) => Array.isArray(e.sharedWith) && e.sharedWith.includes(name)
    );

    if (hasPaid) {
      const confirmMsg = `"${name}" has recorded expenses. Removing them will also delete their expenses and recalculate balances. Are you sure you want to proceed?`;
      if (!window.confirm(confirmMsg)) {
        return;
      }
    } else if (hasShared) {
      const confirmMsg = `"${name}" is part of some shared expenses. Remove "${name}" and recalculate?`;
      if (!window.confirm(confirmMsg)) {
        return;
      }
    }

    onRemoveMember(name);
    setSuccessMsg(`Removed "${name}" from group.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveGroupName = (e) => {
    e.preventDefault();
    if (tempGroupName.trim()) {
      setGroupName(tempGroupName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <section className="section-card group-setup-section" id="group-setup">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-icon-badge">
            <UsersIcon size={20} />
          </div>
          <div>
            <h2 className="section-title">Group Management</h2>
            <p className="section-subtitle">
              Configure your group name and manage 2 to 6 participants.
            </p>
          </div>
        </div>

        <div className="group-header-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onLoadSampleGroup}
            title="Load sample group data"
          >
            <SparklesIcon size={14} />
            <span>Load Sample Group</span>
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={onResetAll}
            title="Reset group and expenses to start fresh"
          >
            <RefreshCwIcon size={14} />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Group Name Row */}
      <div className="group-name-card">
        <div className="group-name-left">
          <span className="input-field-label">Group Name</span>
          {isEditingName ? (
            <form onSubmit={handleSaveGroupName} className="inline-edit-form">
              <input
                type="text"
                className="form-input form-input-sm"
                value={tempGroupName}
                onChange={(e) => setTempGroupName(e.target.value)}
                autoFocus
                maxLength={40}
                placeholder="e.g. Weekend Trip, Flatmates"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setTempGroupName(groupName);
                  setIsEditingName(false);
                }}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="group-name-display">
              <span className="current-group-title">{groupName}</span>
              <button
                type="button"
                className="btn-icon-ghost"
                onClick={() => {
                  setTempGroupName(groupName);
                  setIsEditingName(true);
                }}
                title="Edit Group Name"
                aria-label="Edit group name"
              >
                <Edit3Icon size={16} />
              </button>
            </div>
          )}
        </div>
        <div className="group-limit-badge">
          <span>{members.length} / 6 Members</span>
          <div className="member-capacity-bar">
            <div
              className="capacity-fill"
              style={{ width: `${(members.length / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Minimum requirement warning */}
      {members.length < 2 && (
        <div className="alert alert-warning" role="alert">
          <AlertCircleIcon size={18} />
          <div>
            <strong>Minimum 2 members required:</strong> Please add at least{' '}
            {2 - members.length} more member{2 - members.length === 1 ? '' : 's'}{' '}
            to enable bill splitting and calculate balances.
          </div>
        </div>
      )}

      {/* Feedback Messages */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <AlertCircleIcon size={18} />
          <div>{error}</div>
        </div>
      )}
      {successMsg && (
        <div className="alert alert-success" role="status">
          <CheckCircle2Icon size={18} />
          <div>{successMsg}</div>
        </div>
      )}

      {/* Add Member Form */}
      <form onSubmit={handleAddMember} className="add-member-form">
        <div className="form-row">
          <div className="input-group flex-1">
            <label htmlFor="new-member-input" className="input-field-label">
              Add New Member
            </label>
            <div className="input-with-icon">
              <input
                id="new-member-input"
                type="text"
                className="form-input"
                placeholder="Enter member's name (e.g. Aman, Riya, Karan)"
                value={newMemberName}
                onChange={(e) => {
                  setNewMemberName(e.target.value);
                  if (error) setError('');
                }}
                disabled={members.length >= 6}
                maxLength={25}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary add-member-btn"
            disabled={members.length >= 6 || !newMemberName.trim()}
          >
            <UserPlusIcon size={18} />
            <span>Add Member</span>
          </button>
        </div>
        {members.length >= 6 && (
          <p className="input-helper-text text-muted">
            The group has reached the maximum capacity of 6 members.
          </p>
        )}
      </form>

      {/* Members Grid Display */}
      <div className="members-section">
        <h3 className="subheading">Current Members ({members.length})</h3>

        {members.length === 0 ? (
          <div className="empty-state-mini">
            <UsersIcon size={32} className="empty-icon" />
            <p>No members added yet. Type a name above to get started!</p>
          </div>
        ) : (
          <div className="members-grid">
            {members.map((member, index) => {
              const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
              const paidAmount = memberSpending[member] || 0;
              const hasExpenses = paidAmount > 0;

              return (
                <div key={member} className="member-card">
                  <div
                    className="member-avatar"
                    style={{
                      backgroundColor: color.bg,
                      color: color.text,
                      borderColor: color.border,
                    }}
                  >
                    {member.charAt(0).toUpperCase()}
                  </div>

                  <div className="member-details">
                    <span className="member-name" title={member}>
                      {member}
                    </span>
                    <span className="member-spent-badge">
                      Paid: {formatINR(paidAmount)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="member-remove-btn"
                    onClick={() => handleRemoveMember(member)}
                    title={
                      hasExpenses
                        ? `Remove ${member} (has paid expenses)`
                        : `Remove ${member}`
                    }
                    aria-label={`Remove ${member}`}
                  >
                    <Trash2Icon size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
