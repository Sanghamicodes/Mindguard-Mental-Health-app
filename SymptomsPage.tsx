import { useEffect, useState, FormEvent } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Activity, Moon, Zap, Brain } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { MoodEntry } from '../lib/database.types';

const MOOD_EMOJI: Record<number, string> = {
  1: '😞', 2: '😔', 3: '😕', 4: '😐', 5: '😶',
  6: '🙂', 7: '😊', 8: '😄', 9: '😁', 10: '🤩',
};

const MOOD_LABEL: Record<number, string> = {
  1: 'Very Low', 2: 'Low', 3: 'Below Avg', 4: 'Slightly Low', 5: 'Neutral',
  6: 'Slightly Good', 7: 'Good', 8: 'Very Good', 9: 'Excellent', 10: 'Outstanding',
};

interface FormState {
  mood_score: number;
  energy_level: number;
  sleep_hours: number;
  anxiety_level: number;
  notes: string;
}

const defaultForm: FormState = {
  mood_score: 5,
  energy_level: 5,
  sleep_hours: 7,
  anxiety_level: 3,
  notes: '',
};

export default function MoodTracker() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadEntries();
  }, [user]);

  async function loadEntries() {
    setLoading(true);
    const { data } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user!.id)
      .order('recorded_at', { ascending: false })
      .limit(30);
    setEntries(data || []);
    setLoading(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (editingId) {
      const { error } = await supabase
        .from('mood_entries')
        .update({
          mood_score: form.mood_score,
          energy_level: form.energy_level,
          sleep_hours: form.sleep_hours,
          anxiety_level: form.anxiety_level,
          notes: form.notes,
        })
        .eq('id', editingId);
      if (error) setError(error.message);
      else {
        setSuccess('Entry updated!');
        setEditingId(null);
        setForm(defaultForm);
        loadEntries();
      }
    } else {
      const { error } = await supabase.from('mood_entries').insert({
        user_id: user!.id,
        mood_score: form.mood_score,
        energy_level: form.energy_level,
        sleep_hours: form.sleep_hours,
        anxiety_level: form.anxiety_level,
        notes: form.notes,
      });
      if (error) setError(error.message);
      else {
        setSuccess('Mood logged successfully!');
        setForm(defaultForm);
        loadEntries();
        // Auto-generate alerts
        await checkAndCreateAlerts(form.mood_score, form.anxiety_level);
      }
    }
    setSubmitting(false);
    setTimeout(() => setSuccess(''), 3000);
  }

  async function checkAndCreateAlerts(mood: number, anxiety: number) {
    const alerts: Array<{ alert_type: string; severity: string; message: string }> = [];

    if (mood <= 3) {
      alerts.push({
        alert_type: 'mood_drop',
        severity: mood <= 2 ? 'critical' : 'high',
        message: `Your mood score of ${mood}/10 is very low. Consider reaching out to your support network.`,
      });
    }

    if (anxiety >= 8) {
      alerts.push({
        alert_type: 'anxiety_spike',
        severity: anxiety >= 9 ? 'critical' : 'high',
        message: `Your anxiety level of ${anxiety}/10 is elevated. Breathing exercises or talking to someone may help.`,
      });
    }

    for (const alert of alerts) {
      await supabase.from('alerts').insert({
        user_id: user!.id,
        alert_type: alert.alert_type as 'mood_drop' | 'anxiety_spike',
        severity: alert.severity as 'low' | 'medium' | 'high' | 'critical',
        message: alert.message,
      });
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('mood_entries').delete().eq('id', id);
    if (!error) setEntries(prev => prev.filter(e => e.id !== id));
  }

  function startEdit(entry: MoodEntry) {
    setEditingId(entry.id);
    setForm({
      mood_score: entry.mood_score,
      energy_level: entry.energy_level || 5,
      sleep_hours: entry.sleep_hours || 7,
      anxiety_level: entry.anxiety_level || 3,
      notes: entry.notes,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function getMoodColor(score: number) {
    if (score >= 8) return 'text-teal-400';
    if (score >= 6) return 'text-green-400';
    if (score >= 4) return 'text-yellow-400';
    if (score >= 2) return 'text-orange-400';
    return 'text-red-400';
  }

  function getMoodBarColor(score: number) {
    if (score >= 8) return '#14b8a6';
    if (score >= 6) return '#22c55e';
    if (score >= 4) return '#eab308';
    if (score >= 2) return '#f97316';
    return '#ef4444';
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mood Tracker</h1>
        <p className="text-slate-400 mt-1">Log your daily mood, energy, and sleep to identify patterns</p>
      </div>

      {/* Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-5">
          {editingId ? 'Edit Entry' : "How are you feeling today?"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" /> Mood Score
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{MOOD_EMOJI[form.mood_score]}</span>
                <span className={`text-sm font-semibold ${getMoodColor(form.mood_score)}`}>
                  {form.mood_score}/10 · {MOOD_LABEL[form.mood_score]}
                </span>
              </div>
            </div>
            <input
              type="range" min={1} max={10} step={1}
              value={form.mood_score}
              onChange={e => setForm(f => ({ ...f, mood_score: +e.target.value }))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: getMoodBarColor(form.mood_score) }}
            />
            <div className="flex justify-between text-slate-600 text-xs mt-1">
              <span>1 · Very Low</span><span>5 · Neutral</span><span>10 · Outstanding</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {/* Energy */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Energy
                </label>
                <span className="text-amber-400 text-sm font-semibold">{form.energy_level}/10</span>
              </div>
              <input
                type="range" min={1} max={10} step={1}
                value={form.energy_level}
                onChange={e => setForm(f => ({ ...f, energy_level: +e.target.value }))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#f59e0b' }}
              />
            </div>

            {/* Sleep */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                  <Moon className="w-4 h-4 text-blue-400" /> Sleep
                </label>
                <span className="text-blue-400 text-sm font-semibold">{form.sleep_hours}h</span>
              </div>
              <input
                type="range" min={0} max={12} step={0.5}
                value={form.sleep_hours}
                onChange={e => setForm(f => ({ ...f, sleep_hours: +e.target.value }))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#3b82f6' }}
              />
            </div>

            {/* Anxiety */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4 text-red-400" /> Anxiety
                </label>
                <span className="text-red-400 text-sm font-semibold">{form.anxiety_level}/10</span>
              </div>
              <input
                type="range" min={1} max={10} step={1}
                value={form.anxiety_level}
                onChange={e => setForm(f => ({ ...f, anxiety_level: +e.target.value }))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#ef4444' }}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-slate-300 text-sm font-medium block mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="How are you feeling? Any context to add?"
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2.5 rounded-xl border border-red-500/20">{error}</p>}
          {success && <p className="text-teal-400 text-sm bg-teal-500/10 px-4 py-2.5 rounded-xl border border-teal-500/20">{success}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-teal-500/20"
            >
              <Plus className="w-4 h-4" />
              {submitting ? 'Saving...' : editingId ? 'Update Entry' : 'Log Entry'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(defaultForm); }}
                className="px-5 py-2.5 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Entries list */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-5">Recent Entries</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <p className="text-slate-500 text-center py-12">No entries yet. Log your first mood above!</p>
        ) : (
          <div className="space-y-3">
            {entries.map(entry => {
              const expanded = expandedEntry === entry.id;
              return (
                <div key={entry.id} className="border border-slate-800 rounded-xl overflow-hidden">
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                    onClick={() => setExpandedEntry(expanded ? null : entry.id)}
                  >
                    <span className="text-2xl flex-shrink-0">{MOOD_EMOJI[entry.mood_score]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold text-lg ${getMoodColor(entry.mood_score)}`}>{entry.mood_score}/10</span>
                        <span className="text-slate-400 text-sm">{MOOD_LABEL[entry.mood_score]}</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {new Date(entry.recorded_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); startEdit(entry); }}
                        className="text-slate-400 hover:text-teal-400 transition-colors text-xs border border-slate-700 px-2.5 py-1 rounded-lg hover:border-teal-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(entry.id); }}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                  </div>

                  {expanded && (
                    <div className="border-t border-slate-800 px-4 py-4 bg-slate-800/30">
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        {[
                          { label: 'Energy', value: entry.energy_level, color: 'amber' },
                          { label: 'Sleep', value: entry.sleep_hours ? `${entry.sleep_hours}h` : null, color: 'blue' },
                          { label: 'Anxiety', value: entry.anxiety_level, color: 'red' },
                        ].map(({ label, value, color }) => (
                          <div key={label}>
                            <p className="text-slate-500 text-xs mb-0.5">{label}</p>
                            <p className={`text-${color}-400 font-semibold text-sm`}>{value ?? '—'}{typeof value === 'number' && label !== 'Sleep' ? '/10' : ''}</p>
                          </div>
                        ))}
                      </div>
                      {entry.notes && <p className="text-slate-300 text-sm italic">"{entry.notes}"</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
