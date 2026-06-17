import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = {
  primary: "#6366F1",
  primaryDark: "#4F46E5",
  primaryLight: "#EEF2FF",
  secondary: "#06B6D4",
  secondaryLight: "#ECFEFF",
  success: "#22C55E",
  successLight: "#F0FDF4",
  warning: "#F59E0B",
  warningLight: "#FFFBEB",
  danger: "#EF4444",
  dangerLight: "#FEF2F2",
  dark: "#0F172A",
  darkCard: "#1E293B",
  darkBorder: "#334155",
  darkMuted: "#94A3B8",
  light: "#F8FAFC",
  lightCard: "#FFFFFF",
  lightBorder: "#E2E8F0",
  lightMuted: "#64748B",
  textDark: "#1E293B",
  textLight: "#F1F5F9",
};

const CATEGORIES = ["Productivity","Entertainment","Development","Design","Marketing","Finance","Health","Education","Communication","Storage","Security","Other"];
const BILLING_CYCLES = ["Monthly","Quarterly","Yearly","Weekly","Bi-yearly"];
const PAYMENT_METHODS = ["Credit Card","Debit Card","PayPal","Bank Transfer","Crypto","Other"];

const SAMPLE_SUBS = [
  { id: 1, name: "Netflix", category: "Entertainment", cost: 15.99, billing: "Monthly", renewal: "2025-07-15", payment: "Credit Card", notes: "Family plan", status: "active", logo: "N", color: "#E50914" },
  { id: 2, name: "GitHub Pro", category: "Development", cost: 4, billing: "Monthly", renewal: "2025-07-08", payment: "Credit Card", notes: "Dev tools", status: "active", logo: "G", color: "#24292e" },
  { id: 3, name: "Figma", category: "Design", cost: 12, billing: "Monthly", renewal: "2025-07-20", payment: "Credit Card", notes: "Design work", status: "active", logo: "F", color: "#A259FF" },
  { id: 4, name: "Notion", category: "Productivity", cost: 8, billing: "Monthly", renewal: "2025-07-25", payment: "PayPal", notes: "Notes & docs", status: "active", logo: "N", color: "#000000" },
  { id: 5, name: "Spotify", category: "Entertainment", cost: 9.99, billing: "Monthly", renewal: "2025-07-10", payment: "Debit Card", notes: "Music", status: "active", logo: "S", color: "#1DB954" },
  { id: 6, name: "AWS", category: "Development", cost: 47.50, billing: "Monthly", renewal: "2025-07-01", payment: "Credit Card", notes: "Cloud infra", status: "active", logo: "A", color: "#FF9900" },
  { id: 7, name: "Adobe CC", category: "Design", cost: 54.99, billing: "Monthly", renewal: "2025-07-30", payment: "Credit Card", notes: "Creative suite", status: "active", logo: "A", color: "#FF0000" },
  { id: 8, name: "Slack", category: "Communication", cost: 7.25, billing: "Monthly", renewal: "2025-08-05", payment: "Credit Card", notes: "Team chat", status: "trial", logo: "S", color: "#4A154B" },
  { id: 9, name: "Dropbox", category: "Storage", cost: 9.99, billing: "Monthly", renewal: "2025-08-12", payment: "PayPal", notes: "File backup", status: "active", logo: "D", color: "#0061FF" },
  { id: 10, name: "Zoom", category: "Communication", cost: 14.99, billing: "Monthly", renewal: "2025-08-18", payment: "Credit Card", notes: "Video calls", status: "active", logo: "Z", color: "#2D8CFF" },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Software Engineer", text: "SubSense AI saved me $340/year by detecting 3 subscriptions I had completely forgotten about. The AI insights are incredibly accurate.", avatar: "SC", rating: 5 },
  { name: "Marcus Johnson", role: "Freelance Designer", text: "The renewal calendar is a game-changer. No more surprise charges. The spending analytics helped me cut my SaaS bill by 40%.", avatar: "MJ", rating: 5 },
  { name: "Priya Patel", role: "Product Manager", text: "Managing 25+ work subscriptions was a nightmare. SubSense AI organizes everything beautifully and the AI recommendations are spot-on.", avatar: "PP", rating: 5 },
  { name: "Alex Rivera", role: "Startup Founder", text: "The ROI tracking feature alone is worth it. I now know exactly which tools are driving value for my business.", avatar: "AR", rating: 5 },
];

const PRICING = [
  { name: "Free", price: 0, period: "forever", features: ["Up to 10 subscriptions","Basic analytics","Email reminders","Mobile app"], color: COLORS.lightMuted, popular: false },
  { name: "Pro", price: 9, period: "month", features: ["Unlimited subscriptions","AI-powered insights","Advanced analytics","Priority support","Export reports","Budget planner","Calendar sync"], color: COLORS.primary, popular: true },
  { name: "Business", price: 29, period: "month", features: ["Everything in Pro","Team management","Admin dashboard","API access","Custom integrations","Dedicated support","White-label reports"], color: COLORS.secondary, popular: false },
];

function Icon({ name, size = 18, style = {} }) {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    creditcard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    brain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={style}><polyline points="20,6 9,17 4,12"/></svg>,
    moon: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    trending: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>,
    dollar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    download: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeoff: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/></svg>,
    arrowright: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1} style={style}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    activity: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>,
    package: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    chevrondown: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><polyline points="6,9 12,15 18,9"/></svg>,
    refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    pie: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    sparkle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  };
  return icons[name] || null;
}

function useTheme() {
  const [dark, setDark] = useState(false);
  return { dark, toggleDark: () => setDark(d => !d) };
}

function Toast({ toasts, remove }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "success" ? COLORS.success : t.type === "error" ? COLORS.danger : COLORS.primary,
          color: "#fff", padding: "12px 18px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10,
          fontSize: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", minWidth: 240, animation: "slideIn .3s ease"
        }}>
          <Icon name={t.type === "success" ? "check" : t.type === "error" ? "x" : "info"} size={16} />
          {t.msg}
          <button onClick={() => remove(t.id)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
            <Icon name="x" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);
  return { toasts, add, remove };
}

// ─── MINI CHART COMPONENTS ───────────────────────────────────────────────────
function SparkLine({ data, color, width = 120, height = 40 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / (max - min || 1)) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <polyline points={`0,${height} ${pts} ${width},${height}`} fill={color} fillOpacity={0.1} stroke="none" />
    </svg>
  );
}

function DonutChart({ data, size = 120 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const r = 42, cx = 60, cy = 60;
  const slices = data.map(d => {
    const pct = d.value / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
    const large = pct > 0.5 ? 1 : 0;
    return { path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`, color: d.color };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
      <circle cx={cx} cy={cy} r={28} fill="transparent" />
    </svg>
  );
}

function BarChart({ data, dark, height = 120 }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%", background: d.highlight ? COLORS.primary : (dark ? "#334155" : "#E2E8F0"),
            borderRadius: "4px 4px 0 0", height: `${(d.value / max) * (height - 24)}px`,
            transition: "height .3s ease"
          }} />
          <span style={{ fontSize: 10, color: dark ? COLORS.darkMuted : COLORS.lightMuted }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ dark, setPage }) {
  const bg = dark ? COLORS.dark : "#F8FAFC";
  const cardBg = dark ? COLORS.darkCard : "#fff";
  const border = dark ? COLORS.darkBorder : COLORS.lightBorder;
  const text = dark ? COLORS.textLight : COLORS.textDark;
  const muted = dark ? COLORS.darkMuted : COLORS.lightMuted;

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Nav */}
      <nav style={{ padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${border}`, position: "sticky", top: 0, background: dark ? "rgba(15,23,42,0.95)" : "rgba(248,250,252,0.95)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="sparkle" size={16} style={{ color: "#fff" }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>SubSense <span style={{ color: COLORS.primary }}>AI</span></span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setPage("login")} style={{ padding: "8px 18px", border: `1px solid ${border}`, borderRadius: 8, background: "transparent", color: text, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>Sign in</button>
          <button onClick={() => setPage("register")} style={{ padding: "8px 18px", borderRadius: 8, background: COLORS.primary, color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Get started free</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "80px 24px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: dark ? "#1E293B" : COLORS.primaryLight, border: `1px solid ${dark ? COLORS.darkBorder : "#C7D2FE"}`, borderRadius: 100, padding: "6px 16px", marginBottom: 28, fontSize: 13, color: COLORS.primary, fontWeight: 600 }}>
          <Icon name="sparkle" size={13} />
          AI-Powered Subscription Intelligence
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20 }}>
          Stop paying for subscriptions<br />
          <span style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            you don't need
          </span>
        </h1>
        <p style={{ fontSize: 18, color: muted, maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>
          SubSense AI tracks all your recurring subscriptions, detects waste, and uses AI to save you money. Average user saves $340/year.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("register")} style={{ padding: "14px 28px", borderRadius: 10, background: COLORS.primary, color: "#fff", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            Start saving for free <Icon name="arrowright" size={16} />
          </button>
          <button onClick={() => setPage("dashboard")} style={{ padding: "14px 28px", borderRadius: 10, background: "transparent", border: `1px solid ${border}`, color: text, cursor: "pointer", fontSize: 15, fontWeight: 500 }}>
            View live demo →
          </button>
        </div>
        <p style={{ marginTop: 14, fontSize: 13, color: muted }}>No credit card required • Free forever plan</p>
      </div>

      {/* Dashboard Preview */}
      <div style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ background: dark ? COLORS.darkCard : "#fff", borderRadius: 20, border: `1px solid ${border}`, padding: 24, boxShadow: "0 24px 80px rgba(0,0,0,0.12)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
            {[
              { label: "Monthly Spend", value: "$184.70", trend: "+2.3%", color: COLORS.primary },
              { label: "Active Subs", value: "10", trend: "+1", color: COLORS.secondary },
              { label: "Potential Savings", value: "$47/mo", trend: "AI detected", color: COLORS.success },
              { label: "Health Score", value: "82/100", trend: "Good", color: COLORS.warning },
            ].map((s, i) => (
              <div key={i} style={{ background: dark ? "#0F172A" : "#F8FAFC", borderRadius: 12, padding: "14px 16px", border: `1px solid ${border}` }}>
                <p style={{ fontSize: 12, color: muted, margin: "0 0 6px" }}>{s.label}</p>
                <p style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: s.color }}>{s.value}</p>
                <p style={{ fontSize: 11, color: muted, margin: 0 }}>{s.trend}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
            <div style={{ background: dark ? "#0F172A" : "#F8FAFC", borderRadius: 12, padding: 16, border: `1px solid ${border}` }}>
              <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 14px", color: text }}>Monthly Spending Trend</p>
              <BarChart data={[
                {value:140,label:"Jan"},{value:155,label:"Feb"},{value:148,label:"Mar"},{value:162,label:"Apr"},{value:171,label:"May"},{value:184,label:"Jun",highlight:true}
              ]} dark={dark} height={100} />
            </div>
            <div style={{ background: dark ? "#0F172A" : "#F8FAFC", borderRadius: 12, padding: 16, border: `1px solid ${border}` }}>
              <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 14px", color: text }}>By Category</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <DonutChart data={[
                  {value:55,color:COLORS.primary},{value:25,color:COLORS.secondary},{value:15,color:COLORS.warning},{value:5,color:COLORS.success}
                ]} size={80} />
                <div style={{ fontSize: 11, display: "flex", flexDirection: "column", gap: 5 }}>
                  {[["Design",COLORS.primary,"55%"],["Dev",COLORS.secondary,"25%"],["Ent.",COLORS.warning,"15%"],["Other",COLORS.success,"5%"]].map(([l,c,p]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                      <span style={{ color: muted }}>{l} {p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>Everything you need to manage subscriptions</h2>
          <p style={{ color: muted, fontSize: 16 }}>Powerful AI tools designed for the way you actually spend money</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[
            { icon: "brain", title: "AI Insights", desc: "Detect unused subscriptions, identify duplicates, and get personalized saving recommendations powered by Claude AI.", color: COLORS.primary },
            { icon: "trending", title: "Spending Analytics", desc: "Beautiful charts showing your spending trends, category breakdowns, and year-over-year comparisons.", color: COLORS.secondary },
            { icon: "calendar", title: "Renewal Calendar", desc: "Never miss a renewal date. Color-coded calendar with smart reminders sent before charges hit.", color: COLORS.success },
            { icon: "zap", title: "Smart Alerts", desc: "Real-time notifications for upcoming renewals, price increases, and trial expirations.", color: COLORS.warning },
            { icon: "dollar", title: "Budget Planner", desc: "Set spending limits per category and get warned before you exceed them.", color: COLORS.danger },
            { icon: "download", title: "Export Reports", desc: "Generate PDF or Excel reports for expense tracking, tax purposes, or team reviews.", color: "#8B5CF6" },
          ].map((f, i) => (
            <div key={i} style={{ background: cardBg, borderRadius: 16, padding: 24, border: `1px solid ${border}`, transition: "transform .2s" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon name={f.icon} size={22} style={{ color: f.color }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ background: dark ? "#0F172A" : COLORS.primaryLight, padding: "60px 24px", marginBottom: 60 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Loved by thousands</h2>
            <p style={{ color: muted }}>Join 50,000+ people saving money with SubSense AI</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: cardBg, borderRadius: 16, padding: 24, border: `1px solid ${border}` }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                  {[...Array(t.rating)].map((_, j) => <Icon key={j} name="star" size={14} style={{ color: COLORS.warning }} />)}
                </div>
                <p style={{ fontSize: 14, color: muted, lineHeight: 1.7, marginBottom: 16 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>{t.avatar}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{t.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: muted }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ maxWidth: 900, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Simple, transparent pricing</h2>
          <p style={{ color: muted }}>Start free. Upgrade when you're ready.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {PRICING.map((plan, i) => (
            <div key={i} style={{ background: plan.popular ? COLORS.primary : cardBg, borderRadius: 20, padding: 28, border: plan.popular ? "none" : `1px solid ${border}`, position: "relative" }}>
              {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: COLORS.warning, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 100 }}>MOST POPULAR</div>}
              <h3 style={{ fontSize: 18, fontWeight: 700, color: plan.popular ? "#fff" : text, marginBottom: 4 }}>{plan.name}</h3>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: plan.popular ? "#fff" : text }}>${plan.price}</span>
                <span style={{ color: plan.popular ? "rgba(255,255,255,0.7)" : muted, fontSize: 14 }}>/{plan.period}</span>
              </div>
              <ul style={{ listStyle: "none", margin: "0 0 24px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: plan.popular ? "rgba(255,255,255,0.9)" : text }}>
                    <Icon name="check" size={14} style={{ color: plan.popular ? "#fff" : COLORS.success, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => setPage("register")} style={{ width: "100%", padding: "12px", borderRadius: 10, background: plan.popular ? "#fff" : COLORS.primary, color: plan.popular ? COLORS.primary : "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                {plan.price === 0 ? "Get started free" : "Start free trial"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, padding: "60px 24px", textAlign: "center", color: "#fff" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Ready to take control of your subscriptions?</h2>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 28 }}>Join 50,000+ users saving an average of $340/year</p>
        <button onClick={() => setPage("register")} style={{ padding: "14px 32px", borderRadius: 10, background: "#fff", color: COLORS.primary, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700 }}>
          Start for free — no credit card needed
        </button>
      </div>
    </div>
  );
}

// ─── AUTH PAGES ───────────────────────────────────────────────────────────────
function AuthPage({ dark, page, setPage, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "", name: "", confirm: "" });
  const [show, setShow] = useState(false);
  const bg = dark ? COLORS.dark : "#F8FAFC";
  const cardBg = dark ? COLORS.darkCard : "#fff";
  const border = dark ? COLORS.darkBorder : COLORS.lightBorder;
  const text = dark ? COLORS.textLight : COLORS.textDark;
  const muted = dark ? COLORS.darkMuted : COLORS.lightMuted;
  const input = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${border}`, background: dark ? "#0F172A" : "#F8FAFC", color: text, fontSize: 14, outline: "none", boxSizing: "border-box" };

  const titles = { login: "Welcome back", register: "Create your account", forgot: "Reset password", reset: "New password" };
  const subs = { login: "Sign in to your SubSense AI dashboard", register: "Start saving money on subscriptions today", forgot: "We'll send you a reset link", reset: "Enter your new password below" };

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="sparkle" size={18} style={{ color: "#fff" }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, color: text }}>SubSense <span style={{ color: COLORS.primary }}>AI</span></span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: text, marginBottom: 6 }}>{titles[page]}</h1>
          <p style={{ color: muted, fontSize: 14 }}>{subs[page]}</p>
        </div>
        <div style={{ background: cardBg, borderRadius: 16, padding: 28, border: `1px solid ${border}` }}>
          {page === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: text, marginBottom: 6 }}>Full name</label>
              <input style={input} placeholder="John Smith" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
          )}
          {page !== "reset" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: text, marginBottom: 6 }}>Email address</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...input, paddingLeft: 36 }} placeholder="you@example.com" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <Icon name="mail" size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: muted }} />
              </div>
            </div>
          )}
          {(page === "login" || page === "register" || page === "reset") && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: text, marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...input, paddingLeft: 36, paddingRight: 40 }} placeholder="••••••••" type={show ? "text" : "password"} value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <Icon name="lock" size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: muted }} />
                <button onClick={() => setShow(!show)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: muted }}>
                  <Icon name={show ? "eyeoff" : "eye"} size={15} />
                </button>
              </div>
            </div>
          )}
          {(page === "register" || page === "reset") && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: text, marginBottom: 6 }}>Confirm password</label>
              <input style={{ ...input, paddingLeft: 14 }} placeholder="••••••••" type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} />
            </div>
          )}
          {page === "login" && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button onClick={() => setPage("forgot")} style={{ background: "none", border: "none", color: COLORS.primary, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Forgot password?</button>
            </div>
          )}
          <button onClick={onLogin} style={{ width: "100%", padding: "12px", borderRadius: 10, background: COLORS.primary, color: "#fff", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            {page === "login" ? "Sign in" : page === "register" ? "Create account" : page === "forgot" ? "Send reset link" : "Reset password"}
          </button>
          <div style={{ textAlign: "center", fontSize: 13, color: muted }}>
            {page === "login" ? <>Don't have an account? <button onClick={() => setPage("register")} style={{ background: "none", border: "none", color: COLORS.primary, cursor: "pointer", fontWeight: 600 }}>Sign up free</button></> :
             page === "register" ? <>Already have an account? <button onClick={() => setPage("login")} style={{ background: "none", border: "none", color: COLORS.primary, cursor: "pointer", fontWeight: 600 }}>Sign in</button></> :
             <button onClick={() => setPage("login")} style={{ background: "none", border: "none", color: COLORS.primary, cursor: "pointer", fontWeight: 600 }}>← Back to sign in</button>}
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: muted, marginTop: 20 }}>By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
function AppShell({ dark, toggleDark, page, setPage, children, addToast }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bg = dark ? COLORS.dark : "#F8FAFC";
  const sidebarBg = dark ? COLORS.darkCard : "#fff";
  const border = dark ? COLORS.darkBorder : COLORS.lightBorder;
  const text = dark ? COLORS.textLight : COLORS.textDark;
  const muted = dark ? COLORS.darkMuted : COLORS.lightMuted;

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "subscriptions", label: "Subscriptions", icon: "creditcard" },
    { id: "ai-insights", label: "AI Insights", icon: "brain" },
    { id: "calendar", label: "Calendar", icon: "calendar" },
    { id: "analytics", label: "Analytics", icon: "chart" },
    { id: "notifications", label: "Notifications", icon: "bell" },
    { id: "profile", label: "Profile", icon: "user" },
    { id: "admin", label: "Admin", icon: "shield" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? 240 : 64, background: sidebarBg, borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column", transition: "width .25s ease", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "16px 16px 8px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${border}`, height: 60, boxSizing: "border-box" }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="sparkle" size={16} style={{ color: "#fff" }} />
          </div>
          {sidebarOpen && <span style={{ fontWeight: 700, fontSize: 15, color: text, whiteSpace: "nowrap" }}>SubSense <span style={{ color: COLORS.primary }}>AI</span></span>}
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "9px 10px", borderRadius: 10, border: "none",
              background: page === n.id ? `${COLORS.primary}18` : "transparent", color: page === n.id ? COLORS.primary : muted,
              cursor: "pointer", fontSize: 13, fontWeight: page === n.id ? 600 : 400, marginBottom: 2, textAlign: "left", transition: "all .15s"
            }}>
              <Icon name={n.icon} size={18} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{n.label}</span>}
              {sidebarOpen && n.id === "notifications" && <span style={{ marginLeft: "auto", background: COLORS.danger, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 100, padding: "2px 6px" }}>3</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: "8px", borderTop: `1px solid ${border}` }}>
          <button onClick={toggleDark} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "9px 10px", borderRadius: 10, border: "none", background: "transparent", color: muted, cursor: "pointer", fontSize: 13 }}>
            <Icon name={dark ? "sun" : "moon"} size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && (dark ? "Light mode" : "Dark mode")}
          </button>
          <button onClick={() => setPage("landing")} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "9px 10px", borderRadius: 10, border: "none", background: "transparent", color: muted, cursor: "pointer", fontSize: 13 }}>
            <Icon name="logout" size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && "Sign out"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <header style={{ height: 60, background: sidebarBg, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, position: "sticky", top: 0, zIndex: 10 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: muted, padding: 4 }}>
            <Icon name="menu" size={20} />
          </button>
          <div style={{ flex: 1, maxWidth: 360, position: "relative" }}>
            <Icon name="search" size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: muted }} />
            <input placeholder="Search subscriptions..." style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: 10, border: `1px solid ${border}`, background: dark ? "#0F172A" : "#F8FAFC", color: text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setPage("notifications")} style={{ background: "none", border: "none", cursor: "pointer", color: muted, position: "relative" }}>
              <Icon name="bell" size={20} />
              <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, background: COLORS.danger, borderRadius: "50%", border: `2px solid ${sidebarBg}` }} />
            </button>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }} onClick={() => setPage("profile")}>JD</div>
          </div>
        </header>
        <main style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ dark, subs, setPage }) {
  const border = dark ? COLORS.darkBorder : COLORS.lightBorder;
  const cardBg = dark ? COLORS.darkCard : "#fff";
  const text = dark ? COLORS.textLight : COLORS.textDark;
  const muted = dark ? COLORS.darkMuted : COLORS.lightMuted;

  const monthly = subs.reduce((s, x) => s + (x.billing === "Yearly" ? x.cost / 12 : x.billing === "Quarterly" ? x.cost / 3 : x.cost), 0);
  const active = subs.filter(x => x.status === "active").length;
  const trials = subs.filter(x => x.status === "trial").length;
  const upcoming = subs.filter(x => {
    const d = new Date(x.renewal), now = new Date();
    return (d - now) / 86400000 <= 7;
  }).length;

  const healthScore = Math.min(100, Math.max(0, 100 - (monthly > 200 ? 20 : 0) - (trials * 5) - (upcoming * 3)));

  const spendByMonth = [128, 142, 155, 148, 168, monthly];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const catTotals = {};
  subs.forEach(s => { catTotals[s.category] = (catTotals[s.category] || 0) + s.cost; });
  const catColors = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning, COLORS.danger, "#8B5CF6"];
  const topCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const stats = [
    { label: "Monthly Spend", value: `$${monthly.toFixed(2)}`, icon: "dollar", color: COLORS.primary, spark: [140, 155, 148, 162, 171, monthly] },
    { label: "Yearly Estimate", value: `$${(monthly * 12).toFixed(0)}`, icon: "trending", color: COLORS.secondary, spark: [1680, 1860, 1776, 1944, 2052, monthly * 12] },
    { label: "Active Subscriptions", value: active, icon: "package", color: COLORS.success, spark: [7, 8, 8, 9, 9, active] },
    { label: "Upcoming Renewals", value: upcoming, icon: "calendar", color: COLORS.warning, spark: [1, 2, 3, 2, 1, upcoming] },
    { label: "Trial Subscriptions", value: trials, icon: "zap", color: COLORS.danger, spark: [0, 1, 1, 2, 1, trials] },
    { label: "Health Score", value: `${healthScore}/100`, icon: "activity", color: healthScore > 70 ? COLORS.success : COLORS.warning, spark: [75, 78, 80, 77, 82, healthScore] },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: text, margin: "0 0 4px" }}>Good morning, John 👋</h1>
        <p style={{ color: muted, fontSize: 14, margin: 0 }}>Here's your subscription overview for today</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: cardBg, borderRadius: 14, padding: "18px 20px", border: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: 12, color: muted, margin: "0 0 8px" }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: s.color, margin: "0 0 4px" }}>{s.value}</p>
              <p style={{ fontSize: 11, color: muted, margin: 0 }}>vs last month</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.icon} size={18} style={{ color: s.color }} />
              </div>
              <SparkLine data={s.spark} color={s.color} width={80} height={32} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Spending Trend */}
        <div style={{ background: cardBg, borderRadius: 14, padding: 20, border: `1px solid ${border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: text, margin: "0 0 2px" }}>Spending Trend</h3>
              <p style={{ fontSize: 12, color: muted, margin: 0 }}>Monthly spend over 6 months</p>
            </div>
            <span style={{ fontSize: 11, background: `${COLORS.success}18`, color: COLORS.success, padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>+8.2%</span>
          </div>
          <BarChart data={spendByMonth.map((v, i) => ({ value: v, label: monthLabels[i], highlight: i === 5 }))} dark={dark} height={140} />
        </div>

        {/* Category Breakdown */}
        <div style={{ background: cardBg, borderRadius: 14, padding: 20, border: `1px solid ${border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: text, margin: "0 0 16px" }}>By Category</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topCats.map(([cat, amt], i) => (
              <div key={cat}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: text, marginBottom: 4 }}>
                  <span>{cat}</span>
                  <span style={{ fontWeight: 600 }}>${amt.toFixed(0)}</span>
                </div>
                <div style={{ height: 6, background: dark ? "#334155" : "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(amt / monthly) * 100}%`, background: catColors[i], borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* AI Recommendations Widget */}
        <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}10)`, borderRadius: 14, padding: 20, border: `1px solid ${COLORS.primary}30` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="brain" size={16} style={{ color: "#fff" }} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: text, margin: 0 }}>AI Recommendations</h3>
              <p style={{ fontSize: 11, color: muted, margin: 0 }}>3 insights ready</p>
            </div>
          </div>
          {[
            { text: "Adobe CC & Figma overlap in design tools. Consider consolidating.", saving: "$43/mo" },
            { text: "Slack usage dropped 80% this month. Cancel or downgrade.", saving: "$7/mo" },
            { text: "AWS costs spiked 22% vs last month. Review usage.", saving: "Review" },
          ].map((r, i) => (
            <div key={i} style={{ background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.7)", borderRadius: 10, padding: "10px 12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 12, color: text, margin: 0, flex: 1, lineHeight: 1.5 }}>{r.text}</p>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.success, marginLeft: 10, whiteSpace: "nowrap" }}>{r.saving}</span>
            </div>
          ))}
          <button onClick={() => setPage("ai-insights")} style={{ width: "100%", padding: "10px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, marginTop: 4 }}>
            View all AI insights →
          </button>
        </div>

        {/* Upcoming Renewals */}
        <div style={{ background: cardBg, borderRadius: 14, padding: 20, border: `1px solid ${border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: text, margin: 0 }}>Upcoming Renewals</h3>
            <button onClick={() => setPage("calendar")} style={{ fontSize: 12, color: COLORS.primary, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>View calendar →</button>
          </div>
          {subs.slice(0, 5).map(s => {
            const days = Math.ceil((new Date(s.renewal) - new Date()) / 86400000);
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{s.logo}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: text, margin: 0 }}>{s.name}</p>
                  <p style={{ fontSize: 11, color: muted, margin: 0 }}>{days <= 0 ? "Overdue" : `In ${days} days`}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: days <= 3 ? COLORS.danger : days <= 7 ? COLORS.warning : text }}>${s.cost}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── SUBSCRIPTIONS PAGE ───────────────────────────────────────────────────────
function SubscriptionsPage({ dark, subs, setSubs, addToast }) {
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [form, setForm] = useState({ name: "", category: "Productivity", cost: "", billing: "Monthly", renewal: "", payment: "Credit Card", notes: "", status: "active" });

  const border = dark ? COLORS.darkBorder : COLORS.lightBorder;
  const cardBg = dark ? COLORS.darkCard : "#fff";
  const text = dark ? COLORS.textLight : COLORS.textDark;
  const muted = dark ? COLORS.darkMuted : COLORS.lightMuted;
  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${border}`, background: dark ? "#0F172A" : "#F8FAFC", color: text, fontSize: 13, outline: "none", boxSizing: "border-box" };

  const filtered = subs.filter(s =>
    (filterCat === "All" || s.category === filterCat) &&
    (filterStatus === "All" || s.status === filterStatus) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => sortBy === "cost" ? b.cost - a.cost : a.name.localeCompare(b.name));

  const openAdd = () => { setForm({ name: "", category: "Productivity", cost: "", billing: "Monthly", renewal: "", payment: "Credit Card", notes: "", status: "active" }); setModal("add"); };
  const openEdit = (s) => { setForm({ ...s, cost: String(s.cost) }); setModal("edit"); };

  const save = () => {
    if (!form.name || !form.cost) { addToast("Please fill required fields", "error"); return; }
    if (modal === "add") {
      setSubs(p => [...p, { ...form, id: Date.now(), cost: parseFloat(form.cost), logo: form.name[0].toUpperCase(), color: COLORS.primary }]);
      addToast(`${form.name} added successfully`);
    } else {
      setSubs(p => p.map(s => s.id === form.id ? { ...form, cost: parseFloat(form.cost), logo: form.name[0].toUpperCase() } : s));
      addToast(`${form.name} updated`);
    }
    setModal(null);
  };

  const del = (id, name) => { setSubs(p => p.filter(s => s.id !== id)); addToast(`${name} deleted`, "error"); };

  const statusColor = { active: COLORS.success, trial: COLORS.warning, cancelled: COLORS.danger, paused: COLORS.lightMuted };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: text, margin: "0 0 2px" }}>Subscriptions</h1>
          <p style={{ color: muted, fontSize: 13, margin: 0 }}>{subs.length} subscriptions · ${subs.reduce((s, x) => s + x.cost, 0).toFixed(2)}/mo total</p>
        </div>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
          <Icon name="plus" size={16} /> Add subscription
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Icon name="search" size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: muted }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscriptions..." style={{ ...inputStyle, paddingLeft: 30 }} />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
          <option>All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
          <option>All</option>
          <option>active</option>
          <option>trial</option>
          <option>paused</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
          <option value="name">Sort: Name</option>
          <option value="cost">Sort: Cost</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {["Service", "Category", "Cost", "Billing", "Renewal", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: muted, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const days = Math.ceil((new Date(s.renewal) - new Date()) / 86400000);
              return (
                <tr key={s.id} style={{ borderBottom: `1px solid ${border}`, transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = dark ? "#334155" : "#F8FAFC"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{s.logo}</div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: text, margin: 0 }}>{s.name}</p>
                        <p style={{ fontSize: 11, color: muted, margin: 0 }}>{s.payment}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: muted }}>{s.category}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: text }}>${s.cost.toFixed(2)}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: muted }}>{s.billing}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: days <= 3 ? COLORS.danger : days <= 7 ? COLORS.warning : muted, fontWeight: days <= 7 ? 600 : 400 }}>
                    {s.renewal} {days <= 7 && days > 0 && `(${days}d)`}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: `${statusColor[s.status]}18`, color: statusColor[s.status], textTransform: "capitalize" }}>{s.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(s)} style={{ padding: "6px", background: `${COLORS.primary}15`, border: "none", borderRadius: 6, cursor: "pointer", color: COLORS.primary }}>
                        <Icon name="edit" size={14} />
                      </button>
                      <button onClick={() => del(s.id, s.name)} style={{ padding: "6px", background: `${COLORS.danger}15`, border: "none", borderRadius: 6, cursor: "pointer", color: COLORS.danger }}>
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: muted }}>
            <Icon name="package" size={32} style={{ opacity: 0.4, marginBottom: 12 }} />
            <p style={{ margin: 0 }}>No subscriptions found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: cardBg, borderRadius: 20, padding: 28, width: "100%", maxWidth: 500, border: `1px solid ${border}`, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: text, margin: 0 }}>{modal === "add" ? "Add Subscription" : "Edit Subscription"}</h2>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: muted }}><Icon name="x" size={20} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { label: "Name *", key: "name", type: "text", span: 2 },
                { label: "Category", key: "category", type: "select", options: CATEGORIES },
                { label: "Cost ($)", key: "cost", type: "number" },
                { label: "Billing Cycle", key: "billing", type: "select", options: BILLING_CYCLES },
                { label: "Renewal Date", key: "renewal", type: "date" },
                { label: "Payment Method", key: "payment", type: "select", options: PAYMENT_METHODS },
                { label: "Status", key: "status", type: "select", options: ["active", "trial", "paused", "cancelled"] },
                { label: "Notes", key: "notes", type: "text", span: 2 },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: f.span === 2 ? "1/-1" : "auto" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: text, marginBottom: 5 }}>{f.label}</label>
                  {f.type === "select"
                    ? <select value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle}>{f.options.map(o => <option key={o}>{o}</option>)}</select>
                    : <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle} />
                  }
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: "10px", background: "transparent", border: `1px solid ${border}`, borderRadius: 10, color: text, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>Cancel</button>
              <button onClick={save} style={{ flex: 1, padding: "10px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                {modal === "add" ? "Add subscription" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI INSIGHTS PAGE ─────────────────────────────────────────────────────────
function AIInsightsPage({ dark, subs }) {
  const border = dark ? COLORS.darkBorder : COLORS.lightBorder;
  const cardBg = dark ? COLORS.darkCard : "#fff";
  const text = dark ? COLORS.textLight : COLORS.textDark;
  const muted = dark ? COLORS.darkMuted : COLORS.lightMuted;

  const monthly = subs.reduce((s, x) => s + (x.billing === "Yearly" ? x.cost / 12 : x.billing === "Quarterly" ? x.cost / 3 : x.cost), 0);
  const mostExpensive = [...subs].sort((a, b) => b.cost - a.cost)[0];
  const trials = subs.filter(x => x.status === "trial");
  const designSubs = subs.filter(s => s.category === "Design");
  const commSubs = subs.filter(s => s.category === "Communication");

  const aiCards = [
    { title: "Potential Monthly Savings", value: `$${(monthly * 0.18).toFixed(2)}`, subtitle: "Based on usage patterns", icon: "dollar", color: COLORS.success, bg: `${COLORS.success}15` },
    { title: "Most Expensive", value: mostExpensive?.name || "N/A", subtitle: `$${mostExpensive?.cost?.toFixed(2)}/mo`, icon: "alert", color: COLORS.danger, bg: `${COLORS.danger}15` },
    { title: "Predicted Next Month", value: `$${(monthly * 1.05).toFixed(2)}`, subtitle: "+5% based on trends", icon: "trending", color: COLORS.warning, bg: `${COLORS.warning}15` },
    { title: "Subscription Score", value: "82/100", subtitle: "Above average", icon: "sparkle", color: COLORS.primary, bg: `${COLORS.primary}15` },
  ];

  const insights = [
    { type: "duplicate", severity: "high", title: "Duplicate Design Tools Detected", desc: `You're paying for both ${designSubs.map(s => s.name).join(" and ")}. These tools have overlapping features. Consider picking one.`, saving: `$${designSubs.slice(1).reduce((s, x) => s + x.cost, 0).toFixed(2)}/mo`, icon: "alert", color: COLORS.danger },
    { type: "unused", severity: "medium", title: "Low Usage: Communication Tools", desc: `${commSubs.map(s => s.name).join(", ")} show low engagement. You might be overpaying for seats.`, saving: "$7/mo", icon: "zap", color: COLORS.warning },
    { type: "trial", severity: "medium", title: "Trials Converting to Paid Soon", desc: `${trials.length} trial subscription${trials.length > 1 ? "s" : ""} (${trials.map(t => t.name).join(", ")}) will start charging soon. Review if you need them.`, saving: `$${trials.reduce((s, t) => s + t.cost, 0).toFixed(2)}/mo`, icon: "calendar", color: COLORS.warning },
    { type: "optimize", severity: "low", title: "Switch to Annual Plans", desc: "Switching AWS, GitHub, and Notion to annual billing could save you up to 20% on each.", saving: "$18/mo", icon: "refresh", color: COLORS.primary },
    { type: "budget", severity: "low", title: "Spending Growth Alert", desc: "Your subscription spending has grown 18% in the last 6 months. Consider setting a monthly budget cap.", saving: "Awareness", icon: "trending", color: COLORS.secondary },
  ];

  const sevColor = { high: COLORS.danger, medium: COLORS.warning, low: COLORS.secondary };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="brain" size={16} style={{ color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: text, margin: 0 }}>AI Insights</h1>
        </div>
        <p style={{ color: muted, fontSize: 13, margin: 0 }}>Personalized recommendations powered by AI · Last updated just now</p>
      </div>

      {/* AI Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {aiCards.map((c, i) => (
          <div key={i} style={{ background: c.bg, borderRadius: 14, padding: 18, border: `1px solid ${c.color}30` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <Icon name={c.icon} size={20} style={{ color: c.color }} />
              <span style={{ fontSize: 10, fontWeight: 700, background: `${c.color}20`, color: c.color, padding: "2px 8px", borderRadius: 100 }}>AI</span>
            </div>
            <p style={{ fontSize: 11, color: muted, margin: "0 0 4px" }}>{c.title}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: c.color, margin: "0 0 2px" }}>{c.value}</p>
            <p style={{ fontSize: 11, color: muted, margin: 0 }}>{c.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Insights List */}
      <h2 style={{ fontSize: 16, fontWeight: 700, color: text, marginBottom: 14 }}>Smart Recommendations</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {insights.map((ins, i) => (
          <div key={i} style={{ background: cardBg, borderRadius: 14, padding: 20, border: `1px solid ${border}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${ins.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={ins.icon} size={20} style={{ color: ins.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: text, margin: 0 }}>{ins.title}</h3>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: `${sevColor[ins.severity]}18`, color: sevColor[ins.severity], textTransform: "uppercase" }}>{ins.severity}</span>
              </div>
              <p style={{ fontSize: 13, color: muted, margin: "0 0 10px", lineHeight: 1.6 }}>{ins.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.success }}>Potential saving: {ins.saving}</span>
              </div>
            </div>
            <button style={{ padding: "8px 16px", background: ins.color, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>Act Now</button>
          </div>
        ))}
      </div>

      {/* Spending Report */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, borderRadius: 16, padding: 24, marginTop: 20, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>Generate AI Spending Report</h3>
            <p style={{ fontSize: 13, opacity: 0.85, margin: 0 }}>Get a detailed PDF analysis of your subscription habits, trends, and savings opportunities</p>
          </div>
          <button style={{ padding: "10px 20px", background: "#fff", color: COLORS.primary, border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <Icon name="download" size={16} /> Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CALENDAR PAGE ────────────────────────────────────────────────────────────
function CalendarPage({ dark, subs }) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1));
  const border = dark ? COLORS.darkBorder : COLORS.lightBorder;
  const cardBg = dark ? COLORS.darkCard : "#fff";
  const text = dark ? COLORS.textLight : COLORS.textDark;
  const muted = dark ? COLORS.darkMuted : COLORS.lightMuted;

  const year = currentDate.getFullYear(), month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const renewalsOnDay = (day) => subs.filter(s => {
    const d = new Date(s.renewal);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: text, margin: "0 0 2px" }}>Renewal Calendar</h1>
        <p style={{ color: muted, fontSize: 13, margin: 0 }}>Track upcoming subscription renewals</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
        <div style={{ background: cardBg, borderRadius: 16, padding: 24, border: `1px solid ${border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: text, margin: 0 }}>{monthNames[month]} {year}</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setCurrentDate(new Date(year, month - 1))} style={{ padding: "6px 12px", background: dark ? "#334155" : "#F1F5F9", border: "none", borderRadius: 8, cursor: "pointer", color: text, fontSize: 14 }}>‹</button>
              <button onClick={() => setCurrentDate(new Date(year, month + 1))} style={{ padding: "6px 12px", background: dark ? "#334155" : "#F1F5F9", border: "none", borderRadius: 8, cursor: "pointer", color: text, fontSize: 14 }}>›</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: muted, padding: "4px 0" }}>{d}</div>
            ))}
            {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const renewals = renewalsOnDay(day);
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
              return (
                <div key={day} style={{
                  padding: "8px 4px", borderRadius: 10, textAlign: "center", minHeight: 52,
                  background: isToday ? COLORS.primary : renewals.length ? `${COLORS.warning}20` : "transparent",
                  border: renewals.length && !isToday ? `1px solid ${COLORS.warning}40` : "1px solid transparent",
                  cursor: renewals.length ? "pointer" : "default",
                }}>
                  <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: isToday ? "#fff" : text, marginBottom: 4 }}>{day}</div>
                  {renewals.slice(0, 2).map(r => (
                    <div key={r.id} style={{ fontSize: 9, background: isToday ? "rgba(255,255,255,0.2)" : r.color, color: isToday ? "#fff" : "#fff", borderRadius: 4, padding: "1px 3px", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.name}
                    </div>
                  ))}
                  {renewals.length > 2 && <div style={{ fontSize: 9, color: muted }}>+{renewals.length - 2}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: cardBg, borderRadius: 14, padding: 16, border: `1px solid ${border}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: text, margin: "0 0 12px" }}>This Month</h3>
            {subs.filter(s => {
              const d = new Date(s.renewal);
              return d.getFullYear() === year && d.getMonth() === month;
            }).sort((a, b) => new Date(a.renewal) - new Date(b.renewal)).map(s => {
              const d = new Date(s.renewal);
              const days = Math.ceil((d - new Date()) / 86400000);
              const urgency = days <= 3 ? COLORS.danger : days <= 7 ? COLORS.warning : COLORS.success;
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${border}` }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: urgency, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: text, margin: 0 }}>{s.name}</p>
                    <p style={{ fontSize: 11, color: muted, margin: 0 }}>July {d.getDate()} · ${s.cost}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ background: `${COLORS.warning}15`, borderRadius: 14, padding: 16, border: `1px solid ${COLORS.warning}30` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icon name="bell" size={16} style={{ color: COLORS.warning }} />
              <h3 style={{ fontSize: 13, fontWeight: 600, color: text, margin: 0 }}>Budget Alert</h3>
            </div>
            <p style={{ fontSize: 12, color: muted, margin: 0, lineHeight: 1.6 }}>You have ${subs.filter(s => { const d = new Date(s.renewal), now = new Date(); return (d - now) / 86400000 <= 7; }).reduce((s, x) => s + x.cost, 0).toFixed(2)} in renewals due within 7 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
function AnalyticsPage({ dark, subs }) {
  const border = dark ? COLORS.darkBorder : COLORS.lightBorder;
  const cardBg = dark ? COLORS.darkCard : "#fff";
  const text = dark ? COLORS.textLight : COLORS.textDark;
  const muted = dark ? COLORS.darkMuted : COLORS.lightMuted;

  const monthly = subs.reduce((s, x) => s + x.cost, 0);
  const catTotals = {};
  subs.forEach(s => { catTotals[s.category] = (catTotals[s.category] || 0) + s.cost; });
  const catColors = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning, COLORS.danger, "#8B5CF6", "#EC4899", "#14B8A6"];
  const topCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

  const monthlyData = [128, 142, 155, 148, 168, monthly, monthly * 1.03, monthly * 1.05, monthly * 1.02, monthly * 1.07, monthly * 1.1, monthly * 1.12];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const maxMonthly = Math.max(...monthlyData);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: text, margin: "0 0 2px" }}>Analytics Center</h1>
        <p style={{ color: muted, fontSize: 13, margin: 0 }}>Deep insights into your subscription spending</p>
      </div>

      {/* Summary Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { l: "Total Spend (2025)", v: `$${(monthly * 6.5).toFixed(0)}`, c: COLORS.primary },
          { l: "Avg Monthly", v: `$${monthly.toFixed(2)}`, c: COLORS.secondary },
          { l: "Highest Month", v: `$${Math.max(...monthlyData).toFixed(0)}`, c: COLORS.danger },
          { l: "Projected Year", v: `$${(monthly * 12).toFixed(0)}`, c: COLORS.warning },
        ].map((s, i) => (
          <div key={i} style={{ background: cardBg, borderRadius: 12, padding: "14px 16px", border: `1px solid ${border}` }}>
            <p style={{ fontSize: 11, color: muted, margin: "0 0 6px" }}>{s.l}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.c, margin: 0 }}>{s.v}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 16 }}>
        {/* Monthly Trend */}
        <div style={{ background: cardBg, borderRadius: 14, padding: 20, border: `1px solid ${border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: text, margin: "0 0 20px" }}>Monthly Spending (12 months)</h3>
          <div style={{ position: "relative", height: 160 }}>
            <svg width="100%" height="160" viewBox="0 0 600 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={COLORS.primary} stopOpacity="0" />
                </linearGradient>
              </defs>
              {monthlyData.map((v, i) => {
                const x = (i / (monthlyData.length - 1)) * 560 + 20;
                const y = 140 - ((v / maxMonthly) * 120);
                return i === 0 ? null : (
                  <line key={i} x1={(((i-1) / (monthlyData.length - 1)) * 560 + 20)} y1={140 - ((monthlyData[i-1] / maxMonthly) * 120)} x2={x} y2={y} stroke={COLORS.primary} strokeWidth={2} />
                );
              })}
              {monthlyData.map((v, i) => {
                const x = (i / (monthlyData.length - 1)) * 560 + 20;
                const y = 140 - ((v / maxMonthly) * 120);
                return <circle key={i} cx={x} cy={y} r={3} fill={COLORS.primary} />;
              })}
            </svg>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {months.map(m => <span key={m} style={{ fontSize: 10, color: muted }}>{m}</span>)}
          </div>
        </div>

        {/* Category Distribution */}
        <div style={{ background: cardBg, borderRadius: 14, padding: 20, border: `1px solid ${border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: text, margin: "0 0 16px" }}>Category Distribution</h3>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <DonutChart data={topCats.map(([, v], i) => ({ value: v, color: catColors[i] }))} size={130} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {topCats.slice(0, 5).map(([cat, amt], i) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: catColors[i], flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: text, flex: 1 }}>{cat}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: text }}>${amt.toFixed(0)}</span>
                <span style={{ fontSize: 11, color: muted }}>({((amt / monthly) * 100).toFixed(0)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Comparison */}
      <div style={{ background: cardBg, borderRadius: 14, padding: 20, border: `1px solid ${border}` }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: text, margin: "0 0 16px" }}>Cost Comparison — Top Subscriptions</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...subs].sort((a, b) => b.cost - a.cost).slice(0, 6).map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{s.logo}</div>
              <span style={{ fontSize: 13, color: text, width: 100, flexShrink: 0 }}>{s.name}</span>
              <div style={{ flex: 1, height: 10, background: dark ? "#334155" : "#E2E8F0", borderRadius: 5, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(s.cost / (subs[0]?.cost || 1)) * 100}%`, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`, borderRadius: 5 }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: text, width: 60, textAlign: "right", flexShrink: 0 }}>${s.cost.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotificationsPage({ dark }) {
  const border = dark ? COLORS.darkBorder : COLORS.lightBorder;
  const cardBg = dark ? COLORS.darkCard : "#fff";
  const text = dark ? COLORS.textLight : COLORS.textDark;
  const muted = dark ? COLORS.darkMuted : COLORS.lightMuted;
  const [read, setRead] = useState(new Set());

  const notifications = [
    { id: 1, type: "renewal", title: "AWS renewal in 3 days", desc: "Your AWS subscription ($47.50) renews on July 1st. Ensure sufficient funds.", time: "2 hours ago", icon: "bell", color: COLORS.warning, unread: true },
    { id: 2, type: "trial", title: "Slack trial ending soon", desc: "Your Slack trial ends in 5 days. Upgrade to paid or cancel to avoid charges.", time: "5 hours ago", icon: "zap", color: COLORS.danger, unread: true },
    { id: 3, type: "ai", title: "AI found potential savings", desc: "SubSense AI detected overlapping design tools. You could save $43/month.", time: "1 day ago", icon: "brain", color: COLORS.primary, unread: true },
    { id: 4, type: "renewal", title: "Spotify renewed successfully", desc: "Your Spotify subscription ($9.99) was renewed on June 10th.", time: "6 days ago", icon: "check", color: COLORS.success, unread: false },
    { id: 5, type: "budget", title: "Monthly budget at 90%", desc: "You've spent $166 of your $185 monthly budget. 10% remaining.", time: "1 week ago", icon: "alert", color: COLORS.warning, unread: false },
    { id: 6, type: "price", title: "Netflix price increase detected", desc: "Netflix increased their price from $13.99 to $15.99. Your next bill reflects this.", time: "2 weeks ago", icon: "trending", color: COLORS.danger, unread: false },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: text, margin: "0 0 2px" }}>Notifications</h1>
          <p style={{ color: muted, fontSize: 13, margin: 0 }}>{notifications.filter(n => n.unread && !read.has(n.id)).length} unread alerts</p>
        </div>
        <button onClick={() => setRead(new Set(notifications.map(n => n.id)))} style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${border}`, borderRadius: 8, color: text, cursor: "pointer", fontSize: 13 }}>Mark all read</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notifications.map(n => {
          const isUnread = n.unread && !read.has(n.id);
          return (
            <div key={n.id} onClick={() => setRead(r => new Set([...r, n.id]))} style={{
              background: isUnread ? (dark ? `${n.color}10` : `${n.color}08`) : cardBg,
              borderRadius: 14, padding: 18, border: `1px solid ${isUnread ? n.color + "40" : border}`,
              cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start", transition: "all .15s"
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${n.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={n.icon} size={18} style={{ color: n.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: text, margin: 0 }}>{n.title}</h3>
                  {isUnread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.color }} />}
                </div>
                <p style={{ fontSize: 13, color: muted, margin: "0 0 6px", lineHeight: 1.6 }}>{n.desc}</p>
                <p style={{ fontSize: 11, color: muted, margin: 0 }}>{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notification Settings */}
      <div style={{ background: cardBg, borderRadius: 14, padding: 20, border: `1px solid ${border}`, marginTop: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: text, margin: "0 0 16px" }}>Notification Preferences</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Renewal reminders", desc: "7 days, 3 days, and 1 day before renewal", enabled: true },
            { label: "Trial expiration alerts", desc: "When trials are about to convert to paid", enabled: true },
            { label: "AI insights", desc: "When AI detects savings opportunities", enabled: true },
            { label: "Price changes", desc: "When subscription prices increase", enabled: true },
            { label: "Budget alerts", desc: "When spending approaches your set limit", enabled: false },
            { label: "Weekly digest", desc: "Weekly summary of your subscription activity", enabled: false },
          ].map((pref, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: text, margin: "0 0 2px" }}>{pref.label}</p>
                <p style={{ fontSize: 12, color: muted, margin: 0 }}>{pref.desc}</p>
              </div>
              <div style={{ width: 44, height: 24, borderRadius: 12, background: pref.enabled ? COLORS.primary : (dark ? "#334155" : "#E2E8F0"), position: "relative", cursor: "pointer" }}>
                <div style={{ position: "absolute", top: 2, left: pref.enabled ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ dark, addToast }) {
  const border = dark ? COLORS.darkBorder : COLORS.lightBorder;
  const cardBg = dark ? COLORS.darkCard : "#fff";
  const text = dark ? COLORS.textLight : COLORS.textDark;
  const muted = dark ? COLORS.darkMuted : COLORS.lightMuted;
  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${border}`, background: dark ? "#0F172A" : "#F8FAFC", color: text, fontSize: 13, outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: text, margin: "0 0 20px" }}>Profile Settings</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Profile Info */}
        <div style={{ background: cardBg, borderRadius: 14, padding: 24, border: `1px solid ${border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: text, margin: "0 0 20px" }}>Personal Information</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff" }}>JD</div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: text, margin: "0 0 2px" }}>John Doe</p>
              <p style={{ fontSize: 13, color: muted, margin: "0 0 10px" }}>Pro Plan · Member since Jan 2024</p>
              <button style={{ padding: "6px 14px", background: `${COLORS.primary}15`, color: COLORS.primary, border: `1px solid ${COLORS.primary}30`, borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Change photo</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Full Name", value: "John Doe" },
              { label: "Email", value: "john.doe@example.com" },
              { label: "Phone", value: "+1 (555) 234-5678" },
              { label: "Monthly Budget", value: "$200" },
            ].map((f, i) => (
              <div key={i}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: text, marginBottom: 5 }}>{f.label}</label>
                <input defaultValue={f.value} style={inputStyle} />
              </div>
            ))}
            <button onClick={() => addToast("Profile updated successfully")} style={{ padding: "10px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Save changes</button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Password */}
          <div style={{ background: cardBg, borderRadius: 14, padding: 24, border: `1px solid ${border}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: text, margin: "0 0 16px" }}>Change Password</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Current password", "New password", "Confirm new password"].map((l, i) => (
                <div key={i}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: text, marginBottom: 5 }}>{l}</label>
                  <input type="password" placeholder="••••••••" style={inputStyle} />
                </div>
              ))}
              <button onClick={() => addToast("Password changed successfully")} style={{ padding: "10px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Update password</button>
            </div>
          </div>

          {/* Preferences */}
          <div style={{ background: cardBg, borderRadius: 14, padding: 24, border: `1px solid ${border}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: text, margin: "0 0 16px" }}>Plan & Billing</h3>
            <div style={{ background: `${COLORS.primary}10`, border: `1px solid ${COLORS.primary}30`, borderRadius: 10, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.primary, margin: "0 0 2px" }}>Pro Plan</p>
                  <p style={{ fontSize: 12, color: muted, margin: 0 }}>$9/month · Renews Aug 15, 2025</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, background: COLORS.primary, color: "#fff", padding: "4px 10px", borderRadius: 100 }}>ACTIVE</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ flex: 1, padding: "10px", background: "transparent", border: `1px solid ${border}`, borderRadius: 10, color: text, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Cancel plan</button>
              <button style={{ flex: 1, padding: "10px", background: COLORS.secondary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Upgrade to Business</button>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={{ background: `${COLORS.danger}08`, borderRadius: 14, padding: 20, border: `1px solid ${COLORS.danger}30` }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: COLORS.danger, margin: "0 0 8px" }}>Danger Zone</h3>
            <p style={{ fontSize: 12, color: muted, margin: "0 0 12px", lineHeight: 1.6 }}>Permanently delete your account and all subscription data. This cannot be undone.</p>
            <button style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${COLORS.danger}`, borderRadius: 8, color: COLORS.danger, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Delete account</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────
function AdminPage({ dark, subs }) {
  const border = dark ? COLORS.darkBorder : COLORS.lightBorder;
  const cardBg = dark ? COLORS.darkCard : "#fff";
  const text = dark ? COLORS.textLight : COLORS.textDark;
  const muted = dark ? COLORS.darkMuted : COLORS.lightMuted;

  const users = [
    { name: "John Doe", email: "john@example.com", plan: "Pro", subs: 10, spend: 185, joined: "Jan 2024", status: "active" },
    { name: "Sarah Chen", email: "sarah@example.com", plan: "Business", subs: 24, spend: 420, joined: "Mar 2024", status: "active" },
    { name: "Marcus J.", email: "marcus@example.com", plan: "Free", subs: 5, spend: 45, joined: "Apr 2024", status: "active" },
    { name: "Priya Patel", email: "priya@example.com", plan: "Pro", subs: 15, spend: 230, joined: "Feb 2024", status: "active" },
    { name: "Alex Rivera", email: "alex@example.com", plan: "Business", subs: 31, spend: 680, joined: "Jan 2024", status: "suspended" },
  ];

  const platformStats = [
    { label: "Total Users", value: "52,841", change: "+12.3%", color: COLORS.primary },
    { label: "Active Subscriptions", value: "847,234", change: "+8.1%", color: COLORS.secondary },
    { label: "Monthly Revenue", value: "$124,503", change: "+15.2%", color: COLORS.success },
    { label: "Churn Rate", value: "2.4%", change: "-0.3%", color: COLORS.danger },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: `${COLORS.danger}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="shield" size={18} style={{ color: COLORS.danger }} />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: text, margin: 0 }}>Admin Dashboard</h1>
          <p style={{ color: muted, fontSize: 12, margin: 0 }}>Platform management & analytics</p>
        </div>
        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, background: `${COLORS.danger}15`, color: COLORS.danger, padding: "4px 12px", borderRadius: 100 }}>ADMIN</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {platformStats.map((s, i) => (
          <div key={i} style={{ background: cardBg, borderRadius: 12, padding: "16px 18px", border: `1px solid ${border}` }}>
            <p style={{ fontSize: 11, color: muted, margin: "0 0 6px" }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.color, margin: "0 0 4px" }}>{s.value}</p>
            <p style={{ fontSize: 11, color: s.change.startsWith("+") ? COLORS.success : COLORS.danger, margin: 0, fontWeight: 600 }}>{s.change} vs last month</p>
          </div>
        ))}
      </div>

      {/* User Table */}
      <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: text, margin: 0 }}>User Management</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 12, color: muted }}>Showing 5 of 52,841</span>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {["User", "Plan", "Subscriptions", "Monthly Spend", "Joined", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>{u.name.split(" ").map(n => n[0]).join("")}</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: text, margin: 0 }}>{u.name}</p>
                      <p style={{ fontSize: 11, color: muted, margin: 0 }}>{u.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: u.plan === "Business" ? `${COLORS.secondary}15` : u.plan === "Pro" ? `${COLORS.primary}15` : `${COLORS.lightMuted}15`, color: u.plan === "Business" ? COLORS.secondary : u.plan === "Pro" ? COLORS.primary : muted }}>{u.plan}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: text }}>{u.subs}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: text }}>${u.spend}</td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: muted }}>{u.joined}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: u.status === "active" ? `${COLORS.success}15` : `${COLORS.danger}15`, color: u.status === "active" ? COLORS.success : COLORS.danger, textTransform: "capitalize" }}>{u.status}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ padding: "5px 10px", background: `${COLORS.primary}15`, border: "none", borderRadius: 6, cursor: "pointer", color: COLORS.primary, fontSize: 11, fontWeight: 600 }}>View</button>
                    <button style={{ padding: "5px 10px", background: `${COLORS.danger}15`, border: "none", borderRadius: 6, cursor: "pointer", color: COLORS.danger, fontSize: 11, fontWeight: 600 }}>{u.status === "active" ? "Suspend" : "Restore"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activity Log */}
      <div style={{ background: cardBg, borderRadius: 14, padding: 20, border: `1px solid ${border}` }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: text, margin: "0 0 14px" }}>Recent Activity Log</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { action: "New user registered", detail: "sarah.chen@gmail.com signed up for Pro", time: "2 min ago", type: "success" },
            { action: "Subscription added", detail: "User #8291 added Figma subscription", time: "15 min ago", type: "info" },
            { action: "Payment failed", detail: "User #3401 AWS payment declined", time: "1 hour ago", type: "danger" },
            { action: "Plan upgraded", detail: "User #1842 upgraded Free → Pro", time: "2 hours ago", type: "success" },
            { action: "Account suspended", detail: "User #5510 suspended for ToS violation", time: "3 hours ago", type: "danger" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < 4 ? `1px solid ${border}` : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.type === "success" ? COLORS.success : a.type === "danger" ? COLORS.danger : COLORS.secondary, marginTop: 5, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: text, margin: "0 0 2px" }}>{a.action}</p>
                <p style={{ fontSize: 12, color: muted, margin: "0 0 2px" }}>{a.detail}</p>
                <p style={{ fontSize: 11, color: muted, margin: 0 }}>{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const { dark, toggleDark } = useTheme();
  const { toasts, add: addToast, remove } = useToast();
  const [page, setPage] = useState("landing");
  const [subs, setSubs] = useState(SAMPLE_SUBS);
  const [authed, setAuthed] = useState(false);

  const handleLogin = () => { setAuthed(true); setPage("dashboard"); addToast("Welcome back, John!", "success"); };

  const appPages = ["dashboard", "subscriptions", "ai-insights", "calendar", "analytics", "notifications", "profile", "admin"];

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        button { font-family: inherit; }
        input, select, textarea { font-family: inherit; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #94A3B8; border-radius: 2px; }
      `}</style>
      <Toast toasts={toasts} remove={remove} />
      {page === "landing" && <LandingPage dark={dark} setPage={(p) => { if (["login","register","forgot","reset"].includes(p)) { setPage(p); } else { setPage(p); } }} />}
      {["login","register","forgot","reset"].includes(page) && <AuthPage dark={dark} page={page} setPage={setPage} onLogin={handleLogin} />}
      {appPages.includes(page) && (
        <AppShell dark={dark} toggleDark={toggleDark} page={page} setPage={setPage} addToast={addToast}>
          {page === "dashboard" && <DashboardPage dark={dark} subs={subs} setPage={setPage} />}
          {page === "subscriptions" && <SubscriptionsPage dark={dark} subs={subs} setSubs={setSubs} addToast={addToast} />}
          {page === "ai-insights" && <AIInsightsPage dark={dark} subs={subs} />}
          {page === "calendar" && <CalendarPage dark={dark} subs={subs} />}
          {page === "analytics" && <AnalyticsPage dark={dark} subs={subs} />}
          {page === "notifications" && <NotificationsPage dark={dark} />}
          {page === "profile" && <ProfilePage dark={dark} addToast={addToast} />}
          {page === "admin" && <AdminPage dark={dark} subs={subs} />}
        </AppShell>
      )}
    </>
  );
}
