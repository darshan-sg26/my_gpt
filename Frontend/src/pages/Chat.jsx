import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Send, Bot, User, PlusCircle, MessageSquare, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (id) {
      fetchMessages(id);
    } else {
      setMessages([]);
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await api.get('/chat/');
      setChats(response.data);
    } catch (error) {
      console.error('Failed to fetch chats', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await api.get(`/chat/${chatId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await api.post('/chat/', { title: 'New Chat' });
      setChats([response.data, ...chats]);
      navigate(`/chat/${response.data._id}`);
    } catch (error) {
      console.error('Failed to create chat', error);
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    
    try {
      await api.delete(`/chat/${chatId}`);
      setChats(chats.filter(c => c._id !== chatId));
      if (id === chatId) {
        navigate('/chat');
      }
    } catch (error) {
      console.error('Failed to delete chat', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    let currentChatId = id;
    if (!currentChatId) {
      try {
        const response = await api.post('/chat/', { title: input.substring(0, 30) + (input.length > 30 ? '...' : '') });
        currentChatId = response.data._id;
        setChats([response.data, ...chats]);
        navigate(`/chat/${currentChatId}`, { replace: true });
      } catch (error) {
        console.error('Failed to create chat', error);
        return;
      }
    }

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${api.defaults.baseURL}/chat/${currentChatId}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          content: userMsg.content,
          role: 'user',
          chat_id: currentChatId
        })
      });

      if (!response.ok) throw new Error('Failed to start stream');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let aiMsg = { role: 'ai', content: '' };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false); // Stop loading animation as stream starts

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        aiMsg.content += chunk;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...aiMsg };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Failed to send message', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
      {/* Sidebar for Chat History */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-800">
          <button 
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
          >
            <PlusCircle size={18} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.map(chat => (
            <div
              key={chat._id}
              onClick={() => navigate(`/chat/${chat._id}`)}
              className={`group w-full text-left px-3 py-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                id === chat._id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={16} className="flex-shrink-0" />
                <span className="truncate text-sm">{chat.title}</span>
              </div>
              <button 
                onClick={(e) => handleDeleteChat(e, chat._id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
                <Bot size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-300 mb-2">MyGPT Assistant</h2>
              <p className="text-gray-500 text-center max-w-md">How can I help you today? My personality is now more lively and professional!</p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index}
                  className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-tr from-blue-500 to-purple-500 text-white' 
                      : 'bg-gradient-to-tr from-indigo-500 to-blue-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-3xl mx-auto">
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-4 rounded-2xl bg-gray-800 border border-gray-700 rounded-tl-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message MyGPT..."
              className="w-full bg-gray-950 border border-gray-700 text-white rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-2 bottom-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl transition-colors flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="text-center mt-2 text-xs text-gray-500">
            AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
