import { useState, useEffect } from 'react';
import api from '../services/api';
import { Image as ImageIcon, Sparkles, Download, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageGen = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await api.get('/image/');
      setImages(response.data);
    } catch (error) {
      console.error('Failed to fetch images', error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/image/', { prompt });
      setImages([response.data, ...images]);
      setPrompt('');
    } catch (error) {
      console.error('Failed to generate image', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/image/${id}`);
      setImages(images.filter(img => img._id !== id));
    } catch (error) {
      console.error('Failed to delete image', error);
    }
  };

  const handleDownload = async (url, prompt) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `mygpt-image-${prompt.substring(0, 15)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Failed to download image', error);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <ImageIcon size={32} className="text-pink-500" />
          AI Image Generator
        </h1>
        <p className="text-gray-400 mt-2">Describe what you want to see, and AI will create it for you.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px] pointer-events-none" />
        
        <form onSubmit={handleGenerate} className="relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A futuristic city in neon colors with flying cars..."
              className="flex-1 bg-gray-950 border border-gray-700 text-white rounded-xl py-3 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="bg-pink-600 hover:bg-pink-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-medium py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(219,39,119,0.3)] whitespace-nowrap"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Generate Image
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-200">Your Gallery</h2>
        
        {images.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-gray-500">
            <ImageIcon size={48} className="mb-4 opacity-20" />
            <p>No images generated yet. Create your first masterpiece above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {images.map(img => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={img._id}
                  className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <div className="aspect-square bg-gray-950 relative overflow-hidden">
                    <img 
                      src={img.image_url} 
                      alt={img.prompt} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="flex items-center gap-2 w-full justify-end">
                        <button 
                          onClick={() => handleDownload(img.image_url, img.prompt)}
                          className="bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(img._id)}
                          className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-300 line-clamp-2" title={img.prompt}>
                      {img.prompt}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(img.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGen;
