import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, FileText, Image as ImageIcon, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileModal from './ProfileModal';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const settingsRef = useRef(null);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Chatbot', path: '/chat', icon: <MessageSquare size={20} /> },
    { name: 'Summarizer', path: '/summarizer', icon: <FileText size={20} /> },
    { name: 'Image Gen', path: '/image-gen', icon: <ImageIcon size={20} /> },
  ];

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAvatarIcon = () => {
    if (user?.profile_picture === 'female') return '👩';
    if (user?.profile_picture === 'male') return '👨';
    return user?.username?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <>
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full hidden md:flex relative z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] text-lg leading-none pb-0.5">
            {getAvatarIcon()}
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            MyGPT
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-800 text-blue-400 shadow-[inset_2px_0_0_#3b82f6]'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 relative" ref={settingsRef}>
          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-4 right-4 mb-2 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden py-2"
              >
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsProfileOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 transition-colors"
                >
                  <User size={18} className="text-blue-400" />
                  <span className="font-medium">Profile</span>
                </button>
                <div className="h-px bg-gray-700 my-1 mx-4"></div>
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 transition-colors"
                >
                  <LogOut size={18} className="text-red-400" />
                  <span className="font-medium">Log out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all ${
              isSettingsOpen ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
            }`}
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};

export default Sidebar;
