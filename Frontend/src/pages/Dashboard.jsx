import { useEffect, useState } from 'react';
import api from '../services/api';
import { MessageSquare, FileText, Image as ImageIcon, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, colorClass, bgClass }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-start justify-between transition-transform hover:-translate-y-1">
    <div>
      <p className="text-gray-400 font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
      <Icon size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/user/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
          <Activity size={16} />
          <span>System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={MessageSquare} 
          title="Total Chats" 
          value={data?.stats?.chats_count || 0} 
          colorClass="text-blue-400" 
          bgClass="bg-blue-500/10" 
        />
        <StatCard 
          icon={FileText} 
          title="Summaries Generated" 
          value={data?.stats?.summaries_count || 0} 
          colorClass="text-purple-400" 
          bgClass="bg-purple-500/10" 
        />
        <StatCard 
          icon={ImageIcon} 
          title="Images Created" 
          value={data?.stats?.images_count || 0} 
          colorClass="text-pink-400" 
          bgClass="bg-pink-500/10" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Chats */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Chats</h2>
            <Link to="/chat" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {data?.recent_chats?.length > 0 ? (
              data.recent_chats.map(chat => (
                <Link key={chat._id} to={`/chat/${chat._id}`} className="block p-4 rounded-xl bg-gray-950/50 hover:bg-gray-800 border border-transparent hover:border-gray-700 transition-all">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} className="text-blue-400" />
                    <div>
                      <h4 className="text-gray-200 font-medium">{chat.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{new Date(chat.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent chats</p>
            )}
          </div>
        </div>

        {/* Recent Summaries */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Summaries</h2>
            <Link to="/summarizer" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {data?.recent_summaries?.length > 0 ? (
              data.recent_summaries.map(summary => (
                <div key={summary._id} className="p-4 rounded-xl bg-gray-950/50 border border-gray-800">
                  <div className="flex items-start gap-3">
                    <FileText size={18} className="text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-gray-200 font-medium line-clamp-1">{summary.original_text}</h4>
                      <p className="text-xs text-gray-500 mt-1">{new Date(summary.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent summaries</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
