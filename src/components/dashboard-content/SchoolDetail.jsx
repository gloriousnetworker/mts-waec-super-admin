// components/dashboard-content/SchoolDetail.jsx — Super Admin school drill-down
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSuperAdminAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, Download, Users, BookOpen, BarChart2, Trophy, CheckCircle } from 'lucide-react';

const TABS = ['Overview', 'Exams & Results', 'Students'];
const PCT_CLASS = p => p >= 75 ? 'bg-green-100 text-green-700' : p >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600';
const fmtDate = v => { if (!v) return 'N/A'; try { const d = v._seconds ? new Date(v._seconds * 1000) : new Date(v); return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return 'N/A'; } };

export default function SchoolDetail({ schoolId, schoolName, onBack }) {
  const { fetchWithAuth } = useSuperAdminAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Overview');
  const [selectedExam, setSelectedExam] = useState(null);
  const [stuSearch, setStuSearch] = useState('');
  const [examSearch, setExamSearch] = useState('');

  useEffect(() => { fetchOverview(); }, [schoolId]);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/super-admin/schools/${schoolId}/overview`);
      if (res?.ok) setData(await res.json());
      else toast.error('Failed to load school details');
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  };

  // ── Export helpers ────────────────────────────────────────────────────────
  const exportResultsCSV = () => {
    if (!data) return;
    const exam = selectedExam || data.exams?.[0];
    if (!exam) return toast.error('No exam selected');

    const subjects = exam.subjects?.filter(s => s.subjectId && s.subjectName) || [];
    const subjectHeaders = subjects.flatMap(s => [`${s.subjectName} %`, `${s.subjectName} Score`]);
    const headers = ['Student', 'Class', ...subjectHeaders, 'Total %', 'Total Score', 'Correct', 'Wrong', 'Date'].join(',');

    const rows = (exam.results || []).map(r => {
      const subCells = subjects.flatMap(s => {
        const sb = (r.subjectBreakdown || []).find(x => x.subjectId === s.subjectId);
        return sb ? [`${sb.percentage}%`, `${sb.score}/${sb.totalMarks}`] : ['—', '—'];
      });
      return [
        `"${r.studentName || ''}"`, r.studentClass || '',
        ...subCells,
        `${r.percentage || 0}%`, `${r.score || 0}/${r.totalMarks || 0}`,
        r.correctAnswers || 0, r.wrongAnswers || 0,
        fmtDate(r.submittedAt),
      ].join(',');
    });

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `${data.school.name}_${exam.title}_results.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllResultsPDF = () => {
    if (!data) return;
    const title = data.school.name;
    const date = new Date().toLocaleDateString();
    let html = `<!DOCTYPE html><html><head><title>${title} — Results</title>
    <style>body{font-family:Arial,sans-serif;margin:32px}h1,h2{color:#1F2A49}
    table{width:100%;border-collapse:collapse;margin:16px 0;font-size:11px}
    th{background:#1F2A49;color:#fff;padding:8px;text-align:left}
    td{padding:7px;border-bottom:1px solid #ddd}tr:nth-child(even){background:#f9f9f9}
    .badge{padding:2px 6px;border-radius:4px;font-weight:bold}
    .g{background:#d1fae5;color:#059669}.y{background:#fef3c7;color:#d97706}.r{background:#fee2e2;color:#dc2626}
    </style></head><body>
    <h1>${title}</h1><p>Exported: ${date}</p>
    <table><tr><th>Stat</th><th>Value</th></tr>
    <tr><td>Students</td><td>${data.stats.totalStudents}</td></tr>
    <tr><td>Exams</td><td>${data.stats.totalExamSetups}</td></tr>
    <tr><td>Avg Score</td><td>${data.stats.avgScore}%</td></tr>
    <tr><td>Pass Rate</td><td>${data.stats.passRate}%</td></tr>
    <tr><td>Distinction</td><td>${data.stats.distinctionRate}%</td></tr>
    </table>`;

    for (const exam of data.exams || []) {
      if (!exam.results?.length) continue;
      const subjects = exam.subjects?.filter(s => s.subjectId && s.subjectName) || [];
      html += `<h2>${exam.title} (${exam.class})</h2>
      <table><thead><tr><th>Student</th><th>Class</th>
      ${subjects.map(s => `<th>${s.subjectName}</th>`).join('')}
      <th>Total</th><th>Date</th></tr></thead><tbody>`;
      for (const r of exam.results) {
        const pc = r.percentage >= 75 ? 'g' : r.percentage >= 50 ? 'y' : 'r';
        html += `<tr><td>${r.studentName}</td><td>${r.studentClass}</td>
        ${subjects.map(s => { const sb = (r.subjectBreakdown || []).find(x => x.subjectId === s.subjectId); return sb ? `<td><span class="badge ${sb.percentage >= 75 ? 'g' : sb.percentage >= 50 ? 'y' : 'r'}">${sb.percentage}%</span> ${sb.score}/${sb.totalMarks}</td>` : '<td>—</td>'; }).join('')}
        <td><span class="badge ${pc}">${r.percentage || 0}%</span></td>
        <td>${fmtDate(r.submittedAt)}</td></tr>`;
      }
      html += '</tbody></table>';
    }
    html += '<script>window.onload=()=>window.print()</script></body></html>';
    const w = window.open('', '_blank'); w.document.write(html); w.document.close();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-brand-primary-lt border-t-brand-primary rounded-full animate-spin" />
    </div>
  );

  if (!data) return (
    <div className="text-center py-16 text-content-muted">Failed to load school details.</div>
  );

  const { school, admins, students, exams, stats } = data;
  const filteredStudents = students.filter(s =>
    !stuSearch || `${s.firstName} ${s.lastName} ${s.loginId} ${s.class}`.toLowerCase().includes(stuSearch.toLowerCase())
  );
  const filteredExams = exams.filter(e =>
    !examSearch || e.title?.toLowerCase().includes(examSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-content-secondary hover:text-brand-primary transition-colors">
          <ArrowLeft size={16} /> Back to Schools
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-content-primary">{school.name}</h1>
            <p className="text-sm text-content-muted mt-0.5">{school.address || 'No address'} · {school.email || ''}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${school.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {school.status || 'active'}
              </span>
              {admins.map(a => (
                <span key={a.id} className="text-xs text-content-muted">Admin: {a.name}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={exportResultsCSV} className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors">
              <Download size={13} /> Export CSV
            </button>
            <button onClick={exportAllResultsPDF} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
              <Download size={13} /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { icon: <Users size={16}/>, label: 'Students', value: stats.totalStudents },
          { icon: <BookOpen size={16}/>, label: 'Exams', value: stats.totalExamSetups },
          { icon: <CheckCircle size={16}/>, label: 'Submissions', value: stats.completedSubmissions },
          { icon: <BarChart2 size={16}/>, label: 'Avg Score', value: `${stats.avgScore}%` },
          { icon: <Trophy size={16}/>, label: 'Pass Rate', value: `${stats.passRate}%`, color: 'text-green-600' },
          { icon: <Trophy size={16}/>, label: 'Distinction', value: `${stats.distinctionRate}%`, color: 'text-brand-primary' },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-1.5 text-content-muted mb-1.5">{icon}<span className="text-[11px]">{label}</span></div>
            <div className={`text-xl font-bold ${color || 'text-content-primary'}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-white rounded-xl border border-border p-1 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'bg-brand-primary text-white' : 'text-content-secondary hover:bg-surface-muted'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === 'Overview' && (
        <div className="space-y-5">
          {/* Admins */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-bold text-content-primary mb-4">School Admins</h3>
            {admins.length === 0 ? <p className="text-sm text-content-muted">No admins assigned.</p> : (
              <div className="space-y-3">
                {admins.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-surface-muted rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-content-primary">{a.name}</p>
                      <p className="text-xs text-content-muted">{a.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${a.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{a.status}</span>
                      {a.subscription && <p className="text-[10px] text-content-muted mt-0.5">{a.subscription.plan} plan</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent exam activity */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-bold text-content-primary mb-4">Exam Activity</h3>
            {exams.length === 0 ? <p className="text-sm text-content-muted">No exams created yet.</p> : (
              <div className="space-y-2">
                {exams.slice(0, 8).map(e => (
                  <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-muted">
                    <div>
                      <p className="text-sm font-semibold text-content-primary">{e.title}</p>
                      <p className="text-xs text-content-muted">{e.class} · {e.submittedCount}/{e.studentCount} submitted · {fmtDate(e.createdAt)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${e.status === 'active' ? 'bg-blue-100 text-blue-700' : e.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-surface-muted text-content-muted border border-border'}`}>{e.status}</span>
                      {e.submittedCount > 0 && <p className="text-[11px] font-semibold text-brand-primary mt-0.5">Avg: {e.avgScore}%</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Exams & Results ── */}
      {tab === 'Exams & Results' && (
        <div className="space-y-4">
          {/* Exam picker + search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input value={examSearch} onChange={e => setExamSearch(e.target.value)}
              placeholder="Search exams..." className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
            {selectedExam && (
              <button onClick={exportResultsCSV} className="flex items-center gap-1.5 px-4 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-semibold hover:bg-green-100 whitespace-nowrap">
                <Download size={14} /> Export CSV
              </button>
            )}
          </div>

          {filteredExams.length === 0 && <p className="text-sm text-content-muted text-center py-8">No exams found.</p>}

          {filteredExams.map(exam => {
            const isSelected = selectedExam?.id === exam.id;
            const subjectCols = exam.subjects?.filter(s => s.subjectId && s.subjectName) || [];

            return (
              <div key={exam.id} className="bg-white rounded-xl border border-border overflow-hidden">
                {/* Exam header row */}
                <button
                  onClick={() => setSelectedExam(isSelected ? null : exam)}
                  className="w-full flex items-center justify-between p-4 hover:bg-surface-muted transition-colors text-left"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-content-primary">{exam.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${exam.status === 'active' ? 'bg-blue-100 text-blue-700' : exam.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-surface-muted text-content-muted border border-border'}`}>{exam.status}</span>
                      <span className="px-2 py-0.5 bg-brand-primary-lt text-brand-primary rounded-full text-[10px] font-semibold">{exam.class}</span>
                    </div>
                    <p className="text-xs text-content-muted">
                      {exam.subjects?.length || 0} subject(s) · {exam.submittedCount}/{exam.studentCount} submitted
                      {exam.submittedCount > 0 && ` · Avg: ${exam.avgScore}% · Pass: ${exam.passRate}%`}
                      {' · '}{fmtDate(exam.createdAt)}
                    </p>
                  </div>
                  <span className={`text-content-muted text-sm transition-transform ${isSelected ? 'rotate-180' : ''}`}>▾</span>
                </button>

                {/* Results table */}
                {isSelected && (
                  <div className="border-t border-border overflow-x-auto">
                    {exam.results?.length === 0 ? (
                      <p className="text-sm text-content-muted text-center py-6">No results submitted yet.</p>
                    ) : (
                      <table className="w-full text-xs">
                        <thead className="bg-surface-muted">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-content-muted whitespace-nowrap">Student</th>
                            <th className="px-4 py-3 text-left font-semibold text-content-muted whitespace-nowrap">Class</th>
                            {subjectCols.map(s => (
                              <th key={s.subjectId} className="px-4 py-3 text-left font-semibold text-brand-primary whitespace-nowrap">{s.subjectName}</th>
                            ))}
                            <th className="px-4 py-3 text-left font-semibold text-content-muted whitespace-nowrap">Total</th>
                            <th className="px-4 py-3 text-left font-semibold text-content-muted whitespace-nowrap">Correct</th>
                            <th className="px-4 py-3 text-left font-semibold text-content-muted whitespace-nowrap">Wrong</th>
                            <th className="px-4 py-3 text-left font-semibold text-content-muted whitespace-nowrap">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exam.results.map((r, i) => (
                            <tr key={i} className="border-t border-border hover:bg-surface-muted/50">
                              <td className="px-4 py-3 font-medium text-content-primary whitespace-nowrap">{r.studentName}</td>
                              <td className="px-4 py-3 text-content-muted whitespace-nowrap">{r.studentClass}</td>
                              {subjectCols.map(s => {
                                const sb = (r.subjectBreakdown || []).find(x => x.subjectId === s.subjectId);
                                if (!sb) return <td key={s.subjectId} className="px-4 py-3 text-content-muted">—</td>;
                                return (
                                  <td key={s.subjectId} className="px-4 py-3">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${PCT_CLASS(sb.percentage)}`}>{sb.percentage}%</span>
                                    <div className="text-[10px] text-content-muted mt-0.5 whitespace-nowrap">{sb.score}/{sb.totalMarks} · ✓{sb.correct} ✗{sb.wrong}</div>
                                  </td>
                                );
                              })}
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${PCT_CLASS(r.percentage)}`}>{r.percentage || 0}%</span>
                                <div className="text-[10px] text-content-muted">{r.score}/{r.totalMarks}</div>
                              </td>
                              <td className="px-4 py-3 text-green-600 font-medium">{r.correctAnswers || 0}</td>
                              <td className="px-4 py-3 text-red-500 font-medium">{r.wrongAnswers || 0}</td>
                              <td className="px-4 py-3 text-content-muted whitespace-nowrap">{fmtDate(r.submittedAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Students ── */}
      {tab === 'Students' && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <input value={stuSearch} onChange={e => setStuSearch(e.target.value)}
              placeholder="Search students by name, login ID, or class..."
              className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-surface-muted">
                <tr>
                  {['Student', 'Class', 'Login ID', 'Exams Taken', 'Avg Score', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-content-muted whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr key={i} className="border-t border-border hover:bg-surface-muted/50">
                    <td className="px-4 py-3 font-medium text-content-primary whitespace-nowrap">{s.firstName} {s.lastName}</td>
                    <td className="px-4 py-3 text-content-muted">{s.class}</td>
                    <td className="px-4 py-3 text-content-muted font-mono">{s.loginId}</td>
                    <td className="px-4 py-3 text-content-primary font-semibold">{s.examCount}</td>
                    <td className="px-4 py-3">
                      {s.avgScore !== null ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${PCT_CLASS(s.avgScore)}`}>{s.avgScore}%</span>
                      ) : <span className="text-content-muted">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{s.status || 'active'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && <p className="text-sm text-content-muted text-center py-8">No students found.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
