// components/dashboard-content/Activity.jsx — System-wide activity feed
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSuperAdminAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Activity as ActivityIcon, BookOpen, Send, UserPlus, Zap, RefreshCw } from 'lucide-react';

const TYPE_META = {
  exam_created:     { label: 'Exam Created',     icon: <BookOpen size={14}/>,  bg: 'bg-blue-50',   text: 'text-blue-700',  border: 'border-blue-200' },
  exam_activated:   { label: 'Exam Activated',   icon: <Zap size={14}/>,       bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  exam_submitted:   { label: 'Result Submitted', icon: <Send size={14}/>,      bg: 'bg-green-50',  text: 'text-green-700', border: 'border-green-200' },
  student_registered: { label: 'Student Registered', icon: <UserPlus size={14}/>, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

const FILTER_TYPES = ['all', 'exam_created', 'exam_activated', 'exam_submitted', 'student_registered'];

const fmtTs = v => {
  if (!v) return 'N/A';
  try {
    const d = new Date(v);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return 'N/A'; }
};

export default function Activity() {
  const { fetchWithAuth } = useSuperAdminAuth();
  const [feed, setFeed] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterSchool, setFilterSchool] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFeed();
    fetchSchools();
  }, []);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/super-admin/activity?limit=100');
      if (res?.ok) {
        const data = await res.json();
        setFeed(data.activity || []);
      } else { toast.error('Failed to load activity'); }
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  };

  const fetchSchools = async () => {
    try {
      const res = await fetchWithAuth('/super-admin/schools?limit=200');
      if (res?.ok) {
        const d = await res.json();
        setSchools(d.schools || d.data || []);
      }
    } catch {}
  };

  const filtered = feed.filter(e => {
    const matchType = filterType === 'all' || e.type === filterType;
    const matchSchool = filterSchool === 'all' || e.schoolId === filterSchool;
    const matchSearch = !search || e.description?.toLowerCase().includes(search.toLowerCase()) || e.schoolName?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSchool && matchSearch;
  });

  const counts = FILTER_TYPES.slice(1).reduce((acc, t) => {
    acc[t] = feed.filter(e => e.type === t).length; return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-content-primary flex items-center gap-2">
          <ActivityIcon size={20} className="text-brand-primary" /> System Activity
        </h1>
        <p className="text-sm text-content-muted mt-1">Real-time log of all events across schools — exams, results, and student registrations.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {FILTER_TYPES.slice(1).map(t => {
          const m = TYPE_META[t];
          return (
            <button key={t} onClick={() => setFilterType(filterType === t ? 'all' : t)}
              className={`p-3 rounded-xl border text-left transition-all ${filterType === t ? `${m.bg} ${m.border} border` : 'bg-white border-border hover:border-brand-primary'}`}>
              <div className={`flex items-center gap-1.5 mb-1 ${m.text}`}>{m.icon}<span className="text-[10px] font-semibold uppercase tracking-wide">{m.label}</span></div>
              <div className="text-2xl font-bold text-content-primary">{counts[t] || 0}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search events, schools..." className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2.5 border border-border rounded-lg text-sm text-content-primary focus:outline-none focus:border-brand-primary">
          <option value="all">All Events</option>
          {FILTER_TYPES.slice(1).map(t => <option key={t} value={t}>{TYPE_META[t].label}</option>)}
        </select>
        <select value={filterSchool} onChange={e => setFilterSchool(e.target.value)}
          className="px-3 py-2.5 border border-border rounded-lg text-sm text-content-primary focus:outline-none focus:border-brand-primary">
          <option value="all">All Schools</option>
          {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button onClick={fetchFeed} className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-dk transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-brand-primary-lt border-t-brand-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <ActivityIcon size={40} className="text-content-muted mx-auto mb-3 opacity-40" />
          <p className="text-sm text-content-muted">No activity found matching your filters.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((event, i) => {
            const m = TYPE_META[event.type] || TYPE_META.exam_created;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                className={`bg-white rounded-xl border ${m.border} p-4 flex items-start gap-4`}>
                {/* Type icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${m.bg} ${m.text}`}>
                  {m.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${m.bg} ${m.text}`}>{m.label}</span>
                    <span className="text-[11px] font-semibold text-brand-primary truncate">{event.schoolName}</span>
                  </div>
                  <p className="text-[13px] text-content-primary leading-snug">{event.description}</p>
                  {event.meta && event.type === 'exam_submitted' && (
                    <div className="flex gap-3 mt-1">
                      {event.meta.percentage !== undefined && (
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${event.meta.percentage >= 75 ? 'bg-green-100 text-green-700' : event.meta.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
                          {event.meta.percentage}%
                        </span>
                      )}
                      {event.meta.score !== undefined && <span className="text-[11px] text-content-muted">{event.meta.score}/{event.meta.totalMarks} marks</span>}
                    </div>
                  )}
                  {event.meta && event.type === 'student_registered' && event.meta.class && (
                    <span className="text-[11px] text-content-muted mt-0.5 block">Class: {event.meta.class}{event.meta.loginId ? ` · Login: ${event.meta.loginId}` : ''}</span>
                  )}
                </div>

                {/* Time */}
                <div className="flex-shrink-0 text-[11px] text-content-muted whitespace-nowrap">
                  {fmtTs(event.timestamp)}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-content-muted text-center mt-4">{filtered.length} event{filtered.length !== 1 ? 's' : ''} shown</p>
      )}
    </div>
  );
}
