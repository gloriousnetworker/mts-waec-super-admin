// components/dashboard-content/Reports.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSuperAdminAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Download, Eye, X, RefreshCw } from 'lucide-react';
import {
  examsContainer,
  examsHeader,
  examsTitle,
  examsSubtitle,
} from '../../styles/styles';

const REPORT_TYPES = [
  { id: 'school',      name: 'School Report',        icon: '🏫', desc: 'All registered schools with student and admin counts' },
  { id: 'admin',       name: 'Admin Report',          icon: '👥', desc: 'Admin accounts, subscriptions, and activity' },
  { id: 'student',     name: 'Student Report',        icon: '🎓', desc: 'Student enrollment and registration data' },
  { id: 'performance', name: 'Performance Analytics', icon: '📊', desc: 'Exam scores, pass rates, and academic metrics' },
  { id: 'revenue',     name: 'Revenue Report',        icon: '💰', desc: 'Subscription revenue and payment analytics' },
  { id: 'subject',     name: 'Subject Report',        icon: '📚', desc: 'Per-subject performance breakdown across the platform' },
];

const DATE_RANGES = [
  { id: 'today', name: 'Today' }, { id: 'week', name: 'This Week' },
  { id: 'month', name: 'This Month' }, { id: 'quarter', name: 'This Quarter' },
  { id: 'year', name: 'This Year' },
];

const fmtDate = v => {
  if (!v) return 'N/A';
  try { const d = v._seconds ? new Date(v._seconds * 1000) : new Date(v); return d.toLocaleDateString('en-NG'); } catch { return 'N/A'; }
};

// ── Data → CSV converters ─────────────────────────────────────────────────────
function toCSV(rows, headers) {
  return [headers.join(','), ...rows.map(r => headers.map(h => `"${r[h] ?? ''}"`).join(','))].join('\n');
}

const buildCSV = (type, data) => {
  switch (type) {
    case 'school': {
      const h = ['Name','Address','Phone','Email','Status','Students','Admins','Created'];
      const rows = (data.schools || []).map(s => ({
        Name: s.name, Address: s.address||'', Phone: s.phone||'', Email: s.email||'',
        Status: s.status||'', Students: s.studentCount||0, Admins: s.adminCount||0,
        Created: fmtDate(s.createdAt),
      }));
      return toCSV(rows, h);
    }
    case 'admin': {
      const h = ['Name','Email','School ID','Plan','Status','Sub Active','Expiry'];
      const rows = (data.admins || []).map(a => ({
        Name: a.name, Email: a.email, 'School ID': a.schoolId||'',
        Plan: a.subscription?.plan||'N/A', Status: a.status||'',
        'Sub Active': a.subscription?.active ? 'Yes' : 'No',
        Expiry: fmtDate(a.subscription?.expiryDate),
      }));
      return toCSV(rows, h);
    }
    case 'student': {
      const h = ['First Name','Last Name','Class','Login ID','School ID','Status'];
      const rows = (data.students || []).map(s => ({
        'First Name': s.firstName||'', 'Last Name': s.lastName||'',
        Class: s.class||'', 'Login ID': s.loginId||'', 'School ID': s.schoolId||'', Status: s.status||'',
      }));
      return toCSV(rows, h);
    }
    case 'performance': {
      const h = ['Subject','Avg Score %','Total Exams'];
      const rows = Object.entries(data.subjectBreakdown || {}).map(([subj, v]) => ({
        Subject: subj, 'Avg Score %': v.average?.toFixed(1)||0, 'Total Exams': v.count||0,
      }));
      return toCSV(rows, h);
    }
    case 'revenue': {
      const h = ['Admin Name','School Name','Plan','Amount (₦)','Active','Status','Expiry'];
      const rows = (data.subscriptions || []).map(s => ({
        'Admin Name': s.adminName||'', 'School Name': s.schoolName||'', Plan: s.plan||'',
        'Amount (₦)': s.amount||0, Active: s.active||'', Status: s.status||'', Expiry: fmtDate(s.expiryDate),
      }));
      return toCSV(rows, h);
    }
    case 'subject': {
      const h = ['Subject','Avg Score %','Total Attempts','Total Correct','Total Wrong'];
      const rows = (data.subjects || []).map(s => ({
        Subject: s.subjectName||'', 'Avg Score %': s.avgScore||0,
        'Total Attempts': s.totalAttempts||0, 'Total Correct': s.totalCorrect||0, 'Total Wrong': s.totalWrong||0,
      }));
      return toCSV(rows, h);
    }
    default: return '';
  }
};

// ── Data → print HTML ─────────────────────────────────────────────────────────
const buildPrintHTML = (type, data, reportName, dateRange) => {
  const date = new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });
  const baseCSS = `
    @page { size: A4 landscape; margin: 12mm 14mm; }
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 9pt; color: #1a1a1a; margin: 0; }
    h1 { font-size: 14pt; color: #1F2A49; margin: 0 0 2px; }
    .meta { font-size: 8pt; color: #666; margin-bottom: 10px; }
    .summary { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
    .summary-card { background: #f0f4ff; border-radius: 6px; padding: 6px 10px; }
    .summary-val { font-size: 13pt; font-weight: bold; color: #1F2A49; }
    .summary-lbl { font-size: 7pt; color: #555; }
    table { width: 100%; border-collapse: collapse; font-size: 8pt; margin-bottom: 14px; }
    th { background: #1F2A49; color: #fff; padding: 5px 7px; text-align: left; white-space: nowrap; }
    td { padding: 4px 7px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) { background: #f9fafb; }
    .badge { display:inline-block; padding:1px 5px; border-radius:3px; font-weight:bold; font-size:7.5pt; }
    .g{background:#d1fae5;color:#059669}.y{background:#fef3c7;color:#d97706}.r{background:#fee2e2;color:#dc2626}
    @media print { thead { display: table-header-group; } tr { page-break-inside: avoid; } }
  `;

  let body = `<h1>${reportName}</h1>
  <p class="meta">Date Range: ${dateRange} &nbsp;|&nbsp; Generated: ${date} &nbsp;|&nbsp; Einstein's CBT — Mega Tech Solutions</p>`;

  switch (type) {
    case 'school': {
      const s = data.schools || [];
      body += `<div class="summary">
        <div class="summary-card"><div class="summary-val">${s.length}</div><div class="summary-lbl">Total Schools</div></div>
        <div class="summary-card"><div class="summary-val">${s.filter(x => x.status==='active').length}</div><div class="summary-lbl">Active</div></div>
        <div class="summary-card"><div class="summary-val">${s.reduce((a,x)=>a+(x.studentCount||0),0)}</div><div class="summary-lbl">Total Students</div></div>
      </div>
      <table><thead><tr><th>#</th><th>School</th><th>Address</th><th>Email</th><th>Phone</th><th>Status</th><th>Students</th><th>Admins</th><th>Created</th></tr></thead><tbody>`;
      s.forEach((x, i) => {
        body += `<tr><td>${i+1}</td><td><b>${x.name}</b></td><td>${x.address||'—'}</td><td>${x.email||'—'}</td><td>${x.phone||'—'}</td>
          <td><span class="badge ${x.status==='active'?'g':'r'}">${x.status}</span></td>
          <td>${x.studentCount||0}</td><td>${x.adminCount||0}</td><td>${fmtDate(x.createdAt)}</td></tr>`;
      });
      body += '</tbody></table>';
      break;
    }
    case 'admin': {
      const a = data.admins || [];
      body += `<div class="summary">
        <div class="summary-card"><div class="summary-val">${a.length}</div><div class="summary-lbl">Total Admins</div></div>
        <div class="summary-card"><div class="summary-val">${a.filter(x=>x.status==='active').length}</div><div class="summary-lbl">Active</div></div>
      </div>
      <table><thead><tr><th>#</th><th>Name</th><th>Email</th><th>Plan</th><th>Sub Status</th><th>Expiry</th><th>Account</th></tr></thead><tbody>`;
      a.forEach((x, i) => {
        const subActive = x.subscription?.active;
        body += `<tr><td>${i+1}</td><td><b>${x.name}</b></td><td>${x.email||'—'}</td>
          <td>${x.subscription?.plan||'N/A'}</td>
          <td><span class="badge ${subActive?'g':'r'}">${subActive?'Active':'Inactive'}</span></td>
          <td>${fmtDate(x.subscription?.expiryDate)}</td>
          <td><span class="badge ${x.status==='active'?'g':'r'}">${x.status}</span></td></tr>`;
      });
      body += '</tbody></table>';
      break;
    }
    case 'student': {
      const st = data.students || [];
      body += `<div class="summary">
        <div class="summary-card"><div class="summary-val">${st.length}</div><div class="summary-lbl">Total Students</div></div>
      </div>
      <table><thead><tr><th>#</th><th>Name</th><th>Class</th><th>Login ID</th><th>Status</th></tr></thead><tbody>`;
      st.forEach((x, i) => {
        body += `<tr><td>${i+1}</td><td><b>${x.firstName} ${x.lastName}</b></td>
          <td>${x.class||'—'}</td><td style="font-family:monospace">${x.loginId||'—'}</td>
          <td><span class="badge ${x.status==='active'?'g':'r'}">${x.status||'active'}</span></td></tr>`;
      });
      body += '</tbody></table>';
      break;
    }
    case 'performance': {
      body += `<div class="summary">
        <div class="summary-card"><div class="summary-val">${data.totalExams||0}</div><div class="summary-lbl">Total Exams</div></div>
        <div class="summary-card"><div class="summary-val">${(data.averageScore||0).toFixed(1)}%</div><div class="summary-lbl">Platform Avg</div></div>
      </div>
      <table><thead><tr><th>Subject</th><th>Avg Score</th><th>Total Exams</th></tr></thead><tbody>`;
      Object.entries(data.subjectBreakdown || {}).forEach(([subj, v]) => {
        const pct = v.average || 0;
        body += `<tr><td><b>${subj}</b></td>
          <td><span class="badge ${pct>=75?'g':pct>=50?'y':'r'}">${pct.toFixed(1)}%</span></td>
          <td>${v.count||0}</td></tr>`;
      });
      body += '</tbody></table>';
      break;
    }
    case 'revenue': {
      const subs = data.subscriptions || [];
      body += `<div class="summary">
        <div class="summary-card"><div class="summary-val">₦${(data.totalRevenue||0).toLocaleString()}</div><div class="summary-lbl">Total Revenue</div></div>
        <div class="summary-card"><div class="summary-val">${subs.filter(x=>x.active==='Yes').length}</div><div class="summary-lbl">Active Subs</div></div>
      </div>
      <table><thead><tr><th>#</th><th>Admin</th><th>School</th><th>Plan</th><th>Amount</th><th>Active</th><th>Status</th><th>Expiry</th></tr></thead><tbody>`;
      subs.forEach((x, i) => {
        body += `<tr><td>${i+1}</td><td><b>${x.adminName}</b></td><td>${x.schoolName||'—'}</td>
          <td>${x.plan}</td><td>₦${(x.amount||0).toLocaleString()}</td>
          <td><span class="badge ${x.active==='Yes'?'g':'r'}">${x.active}</span></td>
          <td><span class="badge ${x.status==='active'?'g':'r'}">${x.status}</span></td>
          <td>${fmtDate(x.expiryDate)}</td></tr>`;
      });
      body += '</tbody></table>';
      break;
    }
    case 'subject': {
      const subjs = data.subjects || [];
      body += `<div class="summary">
        <div class="summary-card"><div class="summary-val">${data.totalSubjects||0}</div><div class="summary-lbl">Total Subjects</div></div>
      </div>
      <table><thead><tr><th>#</th><th>Subject</th><th>Avg Score</th><th>Attempts</th><th>Correct</th><th>Wrong</th></tr></thead><tbody>`;
      subjs.forEach((x, i) => {
        body += `<tr><td>${i+1}</td><td><b>${x.subjectName}</b></td>
          <td><span class="badge ${x.avgScore>=75?'g':x.avgScore>=50?'y':'r'}">${x.avgScore}%</span></td>
          <td>${x.totalAttempts}</td><td style="color:#059669;font-weight:600">${x.totalCorrect}</td>
          <td style="color:#dc2626;font-weight:600">${x.totalWrong}</td></tr>`;
      });
      body += '</tbody></table>';
      break;
    }
    default: body += '<p>No data available for this report type.</p>';
  }

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${reportName}</title><style>${baseCSS}</style></head><body>${body}
  <script>window.addEventListener('load',()=>{setTimeout(()=>window.print(),400);});</script></body></html>`;
};

// ── Preview table renderer ────────────────────────────────────────────────────
function PreviewTable({ type, data }) {
  switch (type) {
    case 'school': {
      const s = data.schools || [];
      return (
        <div>
          <div className="flex gap-4 mb-4 flex-wrap">
            {[['Total Schools', s.length], ['Active', s.filter(x=>x.status==='active').length], ['Students', s.reduce((a,x)=>a+(x.studentCount||0),0)]].map(([l,v]) => (
              <div key={l} className="bg-brand-primary-lt px-4 py-2 rounded-lg"><div className="text-lg font-bold text-brand-primary">{v}</div><div className="text-xs text-content-muted">{l}</div></div>
            ))}
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-[#1F2A49] text-white">
              {['School','Address','Email','Phone','Status','Students','Admins'].map(h=><th key={h} className="px-3 py-2 text-left whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>{s.map((x,i)=><tr key={i} className={i%2===0?'bg-white':'bg-surface-muted'}>
              <td className="px-3 py-2 font-semibold">{x.name}</td><td className="px-3 py-2">{x.address||'—'}</td>
              <td className="px-3 py-2">{x.email||'—'}</td><td className="px-3 py-2">{x.phone||'—'}</td>
              <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${x.status==='active'?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{x.status}</span></td>
              <td className="px-3 py-2">{x.studentCount||0}</td><td className="px-3 py-2">{x.adminCount||0}</td>
            </tr>)}</tbody>
          </table>
        </div>
      );
    }
    case 'admin': {
      const a = data.admins || [];
      return (
        <table className="w-full text-xs border-collapse">
          <thead><tr className="bg-[#1F2A49] text-white">
            {['Name','Email','Plan','Sub Active','Expiry','Account'].map(h=><th key={h} className="px-3 py-2 text-left whitespace-nowrap">{h}</th>)}
          </tr></thead>
          <tbody>{a.map((x,i)=><tr key={i} className={i%2===0?'bg-white':'bg-surface-muted'}>
            <td className="px-3 py-2 font-semibold">{x.name}</td><td className="px-3 py-2">{x.email||'—'}</td>
            <td className="px-3 py-2">{x.subscription?.plan||'N/A'}</td>
            <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${x.subscription?.active?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{x.subscription?.active?'Yes':'No'}</span></td>
            <td className="px-3 py-2 whitespace-nowrap">{fmtDate(x.subscription?.expiryDate)}</td>
            <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${x.status==='active'?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{x.status}</span></td>
          </tr>)}</tbody>
        </table>
      );
    }
    case 'student': {
      const st = data.students || [];
      return (
        <table className="w-full text-xs border-collapse">
          <thead><tr className="bg-[#1F2A49] text-white">
            {['Name','Class','Login ID','Status'].map(h=><th key={h} className="px-3 py-2 text-left whitespace-nowrap">{h}</th>)}
          </tr></thead>
          <tbody>{st.map((x,i)=><tr key={i} className={i%2===0?'bg-white':'bg-surface-muted'}>
            <td className="px-3 py-2 font-semibold">{x.firstName} {x.lastName}</td>
            <td className="px-3 py-2">{x.class||'—'}</td>
            <td className="px-3 py-2 font-mono">{x.loginId||'—'}</td>
            <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${x.status==='active'?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{x.status||'active'}</span></td>
          </tr>)}</tbody>
        </table>
      );
    }
    case 'performance': {
      return (
        <div>
          <div className="flex gap-4 mb-4">
            <div className="bg-brand-primary-lt px-4 py-2 rounded-lg"><div className="text-lg font-bold text-brand-primary">{data.totalExams||0}</div><div className="text-xs text-content-muted">Total Exams</div></div>
            <div className="bg-brand-primary-lt px-4 py-2 rounded-lg"><div className="text-lg font-bold text-brand-primary">{(data.averageScore||0).toFixed(1)}%</div><div className="text-xs text-content-muted">Platform Avg</div></div>
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-[#1F2A49] text-white">
              {['Subject','Avg Score','Total Exams'].map(h=><th key={h} className="px-3 py-2 text-left">{h}</th>)}
            </tr></thead>
            <tbody>{Object.entries(data.subjectBreakdown||{}).map(([subj,v],i)=>{
              const pct = v.average||0;
              return <tr key={i} className={i%2===0?'bg-white':'bg-surface-muted'}>
                <td className="px-3 py-2 font-semibold">{subj}</td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pct>=75?'bg-green-100 text-green-700':pct>=50?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-600'}`}>{pct.toFixed(1)}%</span></td>
                <td className="px-3 py-2">{v.count||0}</td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      );
    }
    case 'revenue': {
      const subs = data.subscriptions || [];
      return (
        <div>
          <div className="flex gap-4 mb-4">
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200"><div className="text-lg font-bold text-green-700">₦{(data.totalRevenue||0).toLocaleString()}</div><div className="text-xs text-content-muted">Total Revenue</div></div>
            <div className="bg-brand-primary-lt px-4 py-2 rounded-lg"><div className="text-lg font-bold text-brand-primary">{subs.filter(x=>x.active==='Yes').length}</div><div className="text-xs text-content-muted">Active Subs</div></div>
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-[#1F2A49] text-white">
              {['Admin','School','Plan','Amount','Active','Status','Expiry'].map(h=><th key={h} className="px-3 py-2 text-left whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>{subs.map((x,i)=><tr key={i} className={i%2===0?'bg-white':'bg-surface-muted'}>
              <td className="px-3 py-2 font-semibold">{x.adminName}</td><td className="px-3 py-2">{x.schoolName||'—'}</td>
              <td className="px-3 py-2">{x.plan}</td><td className="px-3 py-2">₦{(x.amount||0).toLocaleString()}</td>
              <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${x.active==='Yes'?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{x.active}</span></td>
              <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${x.status==='active'?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{x.status}</span></td>
              <td className="px-3 py-2 whitespace-nowrap">{fmtDate(x.expiryDate)}</td>
            </tr>)}</tbody>
          </table>
        </div>
      );
    }
    case 'subject': {
      const subjs = data.subjects || [];
      return (
        <table className="w-full text-xs border-collapse">
          <thead><tr className="bg-[#1F2A49] text-white">
            {['Subject','Avg Score','Attempts','Correct','Wrong'].map(h=><th key={h} className="px-3 py-2 text-left whitespace-nowrap">{h}</th>)}
          </tr></thead>
          <tbody>{subjs.map((x,i)=><tr key={i} className={i%2===0?'bg-white':'bg-surface-muted'}>
            <td className="px-3 py-2 font-semibold">{x.subjectName}</td>
            <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${x.avgScore>=75?'bg-green-100 text-green-700':x.avgScore>=50?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-600'}`}>{x.avgScore}%</span></td>
            <td className="px-3 py-2">{x.totalAttempts}</td>
            <td className="px-3 py-2 text-green-600 font-semibold">{x.totalCorrect}</td>
            <td className="px-3 py-2 text-red-500 font-semibold">{x.totalWrong}</td>
          </tr>)}</tbody>
        </table>
      );
    }
    default: return <p className="text-sm text-content-muted">No preview available.</p>;
  }
}

export default function Reports() {
  const { fetchWithAuth } = useSuperAdminAuth();
  const [reportType, setReportType] = useState('school');
  const [dateRange, setDateRange] = useState('month');
  const [format, setFormat] = useState('csv');
  const [generating, setGenerating] = useState(false);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [recentReports, setRecentReports] = useState([]);
  const [previewData, setPreviewData] = useState(null); // { type, data, name }
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchSchools();
    const saved = localStorage.getItem('recentReports');
    if (saved) setRecentReports(JSON.parse(saved));
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await fetchWithAuth('/super-admin/schools');
      if (res?.ok) {
        const d = await res.json();
        setSchools(d.schools || d.data || []);
      }
    } catch {}
  };

  const saveRecentReport = (entry) => {
    const updated = [entry, ...recentReports].slice(0, 8);
    setRecentReports(updated);
    localStorage.setItem('recentReports', JSON.stringify(updated));
  };

  const fetchReportData = async () => {
    const body = {
      type: reportType, format: 'json', dateRange,
      ...(reportType === 'school' && selectedSchool !== 'all' && { schoolId: selectedSchool }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    };
    const res = await fetchWithAuth('/super-admin/reports/generate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!res?.ok) throw new Error('Failed to generate report');
    return res.json();
  };

  const handlePreview = async () => {
    setGenerating(true);
    const toastId = toast.loading('Loading preview...');
    try {
      const data = await fetchReportData();
      const meta = REPORT_TYPES.find(t => t.id === reportType);
      setPreviewData({ type: reportType, data, name: meta?.name || reportType });
      setShowPreview(true);
      toast.success('Preview ready', { id: toastId });
    } catch {
      toast.error('Failed to load report data', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (overrideFormat) => {
    const fmt = overrideFormat || format;
    setGenerating(true);
    const toastId = toast.loading('Generating report...');
    try {
      const data = previewData?.data || await fetchReportData();
      const meta = REPORT_TYPES.find(t => t.id === reportType);
      const reportName = meta?.name || reportType;
      const fileName = `${reportType}-report-${new Date().toISOString().split('T')[0]}`;

      if (fmt === 'csv') {
        const csv = buildCSV(reportType, data);
        if (!csv) return toast.error('No data to export', { id: toastId });
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${fileName}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
      } else if (fmt === 'pdf') {
        const html = buildPrintHTML(reportType, data, reportName, DATE_RANGES.find(r=>r.id===dateRange)?.name||dateRange);
        const w = window.open('', '_blank');
        if (!w) return toast.error('Allow pop-ups to export PDF', { id: toastId });
        w.document.write(html); w.document.close();
      } else if (fmt === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${fileName}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
      } else if (fmt === 'word') {
        const html = buildPrintHTML(reportType, data, reportName, DATE_RANGES.find(r=>r.id===dateRange)?.name||dateRange);
        const blob = new Blob([html], { type: 'application/msword' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${fileName}.doc`;
        a.click();
        URL.revokeObjectURL(a.href);
      }

      saveRecentReport({
        id: Date.now(), name: reportName,
        date: new Date().toISOString().split('T')[0],
        type: reportType, format: fmt,
      });
      toast.success('Report downloaded!', { id: toastId });
    } catch (err) {
      toast.error('Failed to generate report', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Report Generation</h1>
        <p className={examsSubtitle}>Generate, preview, and download comprehensive reports</p>
      </div>

      {/* Report type grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {REPORT_TYPES.map(t => (
          <button key={t.id} onClick={() => setReportType(t.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${reportType === t.id ? 'border-brand-primary bg-brand-primary-lt' : 'border-border bg-white hover:border-brand-primary'}`}>
            <div className="text-2xl mb-2">{t.icon}</div>
            <h3 className="text-sm font-bold text-content-primary mb-1">{t.name}</h3>
            <p className="text-xs text-content-muted leading-relaxed">{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Config */}
      <div className="bg-white rounded-xl border border-border p-5 mb-6">
        <h2 className="text-sm font-bold text-content-primary mb-4">Report Configuration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-content-secondary uppercase tracking-wide mb-1.5">Date Range</label>
            <select value={dateRange} onChange={e => setDateRange(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-brand-primary">
              {DATE_RANGES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          {reportType === 'school' && (
            <div>
              <label className="block text-xs font-semibold text-content-secondary uppercase tracking-wide mb-1.5">School</label>
              <select value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-brand-primary">
                <option value="all">All Schools</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-content-secondary uppercase tracking-wide mb-1.5">Export Format</label>
            <select value={format} onChange={e => setFormat(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-brand-primary">
              <option value="csv">CSV (Excel)</option>
              <option value="pdf">PDF Document</option>
              <option value="json">JSON (Raw)</option>
              <option value="word">Word Document</option>
            </select>
          </div>
        </div>

        {/* Summary pill */}
        <div className="bg-brand-primary-lt rounded-lg px-4 py-3 mb-5 text-xs text-content-secondary flex flex-wrap gap-x-4 gap-y-1">
          <span>Report: <b className="text-brand-primary">{REPORT_TYPES.find(t=>t.id===reportType)?.name}</b></span>
          <span>Range: <b className="text-brand-primary">{DATE_RANGES.find(r=>r.id===dateRange)?.name}</b></span>
          <span>Format: <b className="text-brand-primary">{format.toUpperCase()}</b></span>
        </div>

        <div className="flex justify-end gap-3 flex-wrap">
          <button onClick={() => { setReportType('school'); setDateRange('month'); setSelectedSchool('all'); setFormat('csv'); }}
            className="px-4 py-2.5 bg-white text-content-secondary border border-border rounded-lg text-sm font-semibold hover:border-brand-primary transition-colors">
            Reset
          </button>
          <button onClick={handlePreview} disabled={generating}
            className={`flex items-center gap-2 px-4 py-2.5 bg-white text-brand-primary border border-brand-primary rounded-lg text-sm font-semibold hover:bg-brand-primary-lt transition-colors ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Eye size={15} /> Preview
          </button>
          <button onClick={() => handleDownload()} disabled={generating}
            className={`flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-dk transition-colors ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Download size={15} /> {generating ? 'Generating...' : 'Download'}
          </button>
        </div>
      </div>

      {/* Recent reports */}
      {recentReports.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-bold text-content-primary mb-3">Recent Reports</h3>
          <div className="space-y-2">
            {recentReports.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-surface-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{REPORT_TYPES.find(t=>t.id===r.type)?.icon || '📄'}</span>
                  <div>
                    <p className="text-sm font-semibold text-content-primary">{r.name}</p>
                    <p className="text-xs text-content-muted">{r.date} · {r.format.toUpperCase()}</p>
                  </div>
                </div>
                <span className="text-xs text-content-muted bg-surface-subtle px-2 py-1 rounded-full">{r.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview modal */}
      <AnimatePresence>
        {showPreview && previewData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setShowPreview(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              className="bg-white rounded-2xl border border-border shadow-xl w-full max-w-5xl my-8"
              onClick={e => e.stopPropagation()}>
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-content-primary">{previewData.name}</h3>
                  <p className="text-xs text-content-muted mt-0.5">Preview — {DATE_RANGES.find(r=>r.id===dateRange)?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDownload('csv')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-semibold hover:bg-green-100">
                    <Download size={12} /> CSV
                  </button>
                  <button onClick={() => handleDownload('pdf')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100">
                    <Download size={12} /> PDF
                  </button>
                  <button onClick={() => setShowPreview(false)}
                    className="p-2 text-content-muted hover:text-content-primary hover:bg-surface-muted rounded-lg transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>
              {/* Modal body */}
              <div className="p-6 overflow-x-auto">
                <PreviewTable type={previewData.type} data={previewData.data} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
