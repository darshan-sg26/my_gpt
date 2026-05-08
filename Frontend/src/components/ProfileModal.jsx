import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { X, User as UserIcon, Mail } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfilePicture } = useAuth();
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !user) return null;

  const handleUpdate = async (picture) => {
    if (user.profile_picture === picture) return;
    setUpdating(true);
    try {
      await updateProfilePicture(picture);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/50">
            <h2 className="text-xl font-bold text-white">Your Profile</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* User Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <UserIcon className="text-blue-500" size={20} />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Username</p>
                  <p className="font-medium text-white">{user.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <Mail className="text-purple-500" size={20} />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</p>
                  <p className="font-medium text-white">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Picture Selection */}
            <div>
              <p className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Choose Avatar</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleUpdate('male')}
                  disabled={updating}
                  className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    user.profile_picture === 'male'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-800 bg-gray-950 hover:border-gray-700'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                    user.profile_picture === 'male' ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gray-800'
                  }`}>
                    👨
                  </div>
                  <span className={`font-medium ${user.profile_picture === 'male' ? 'text-blue-400' : 'text-gray-400'}`}>
                    Male Avatar
                  </span>
                </button>

                <button
                  onClick={() => handleUpdate('female')}
                  disabled={updating}
                  className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    user.profile_picture === 'female'
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-gray-800 bg-gray-950 hover:border-gray-700'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                    user.profile_picture === 'female' ? 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-gray-800'
                  }`}>
                    👩
                  </div>
                  <span className={`font-medium ${user.profile_picture === 'female' ? 'text-pink-400' : 'text-gray-400'}`}>
                    Female Avatar
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileModal;
