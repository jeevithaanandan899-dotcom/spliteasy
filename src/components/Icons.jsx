export function IconWrapper({ children, size = 20, className = '', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function WalletIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </IconWrapper>
  );
}

export function UsersIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconWrapper>
  );
}

export function UserPlusIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </IconWrapper>
  );
}

export function ReceiptIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 6v12" />
    </IconWrapper>
  );
}

export function IndianRupeeIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5 8" />
      <path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </IconWrapper>
  );
}

export function PlusIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </IconWrapper>
  );
}

export function Trash2Icon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </IconWrapper>
  );
}

export function ArrowRightIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </IconWrapper>
  );
}

export function ArrowUpRightIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </IconWrapper>
  );
}

export function ArrowDownLeftIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M17 7 7 17" />
      <path d="M17 17H7V7" />
    </IconWrapper>
  );
}

export function CheckCircle2Icon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </IconWrapper>
  );
}

export function AlertCircleIcon(props) {
  return (
    <IconWrapper {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </IconWrapper>
  );
}

export function RefreshCwIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </IconWrapper>
  );
}

export function SparklesIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </IconWrapper>
  );
}

export function PieChartIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </IconWrapper>
  );
}

export function LayoutDashboardIcon(props) {
  return (
    <IconWrapper {...props}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </IconWrapper>
  );
}

export function ShieldCheckIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </IconWrapper>
  );
}

export function SearchIcon(props) {
  return (
    <IconWrapper {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </IconWrapper>
  );
}

export function FilterIcon(props) {
  return (
    <IconWrapper {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </IconWrapper>
  );
}

export function MenuIcon(props) {
  return (
    <IconWrapper {...props}>
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </IconWrapper>
  );
}

export function XIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </IconWrapper>
  );
}

export function Edit3Icon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </IconWrapper>
  );
}

export function InfoIcon(props) {
  return (
    <IconWrapper {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </IconWrapper>
  );
}

export function CalendarIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </IconWrapper>
  );
}
