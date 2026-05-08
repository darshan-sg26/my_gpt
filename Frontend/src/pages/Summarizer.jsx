import { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, Wand2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Summarizer = () => {
  const [inputText, setInputText] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSummary, setActiveSummary] = useState(null);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await api.get('/summary/');
      setSummaries(response.data);
      if (response.data.length > 0 && !activeSummary) {
        setActiveSummary(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch summaries', error);
    }
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const response = await api.post('/summary/', { original_text: inputText });
      setSummaries([response.data, ...summaries]);
      setActiveSummary(response.data);
      setInputText('');
    } catch (error) {
      console.error('Failed to generate summary', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/summary/${id}`);
      setSummaries(summaries.filter(s => s._id !== id));
      if (activeSummary?._id === id) {
        setActiveSummary(null);
      }
    } catch (error) {
      console.error('Failed to delete summary', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
      {/* Sidebar for History */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-bold text-gray-200 flex items-center gap-2">
            <FileText size={18} className="text-purple-400" />
            History
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {summaries.map(summary => (
            <div
              key={summary._id}
              className={`group w-full text-left px-3 py-3 rounded-lg flex items-start justify-between cursor-pointer transition-colors ${
                activeSummary?._id === summary._id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
              onClick={() => setActiveSummary(summary)}
            >
              <div className="overflow-hidden">
                <span className="truncate text-sm block">{summary.original_text}</span>
                <span className="text-xs text-gray-500">{new Date(summary.created_at).toLocaleDateString()}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(summary._id); }}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wand2 size={24} className="text-purple-500" />
            AI Summarizer
          </h1>
          <p className="text-gray-400 mt-1">Paste your long text below to get a concise AI-generated summary.</p>
        </div>

        <div className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-40 bg-gray-900 border border-gray-800 rounded-2xl p-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSummarize}
              disabled={!inputText.trim() || loading}
              className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-medium py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Summarizing...
                </>
              ) : (
                <>
                  <Wand2 size={18} /> Summarize
                </>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {activeSummary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-6"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText size={20} className="text-purple-400" />
                Result
              </h3>
              <div className="prose prose-invert max-w-none prose-sm md:prose-base">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {activeSummary.summary_text}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Summarizer;
