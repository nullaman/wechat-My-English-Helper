import React, { useState, useCallback, useEffect } from 'react';
import { WordData } from './types';
import { INITIAL_WORDS } from './constants';
import WordCard from './components/WordCard';
import { generateWord } from './services/geminiService';
import { Plus, Loader2, Sparkles, WifiOff } from 'lucide-react';

const App: React.FC = () => {
  const [words, setWords] = useState<WordData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  // Helper to show toast message (Simulates wx.showToast)
  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2000);
  };

  // Simulates onLoad lifecycle
  useEffect(() => {
    const fetchDailyWords = async () => {
      try {
        // Attempt to fetch from the requested local endpoint
        // Added a timeout to fail fast if localhost isn't running
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('http://localhost:8080/api/v1/daily-words', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setWords(data);
        } else {
          throw new Error(`Status: ${response.status}`);
        }
      } catch (error) {
        console.warn('Network request failed, falling back to offline data:', error);
        // Requirement: wx.showToast for "Network Error"
        showToast('Network Error'); 
        
        // Fallback to initial data so the app is usable in preview
        setWords(INITIAL_WORDS);
      }
    };

    fetchDailyWords();
  }, []);

  const handleGenerateWord = useCallback(async () => {
    setIsLoading(true);
    try {
      const newWordData = await generateWord();
      if (newWordData) {
        const newWord: WordData = {
          id: Date.now(),
          ...newWordData,
        };
        setWords((prev) => [newWord, ...prev]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Failed to generate word", error);
      showToast("Failed to generate word");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans pb-20">
      {/* Toast Notification */}
      <div 
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] transition-opacity duration-300 pointer-events-none ${toast.show ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="bg-black/80 backdrop-blur-sm text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 min-w-[160px] justify-center">
          <WifiOff size={20} className="text-white/80" />
          <span className="font-medium">{toast.message}</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 h-14 flex items-center justify-center shadow-sm">
        <h1 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
          <Sparkles size={18} className="text-yellow-500" />
          Daily Words
        </h1>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4">
        <div className="flex flex-col">
          {words.length === 0 ? (
             // Skeleton loading state could go here, effectively hidden by fast fallback
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-400"/></div>
          ) : (
            words.map((word) => (
              <WordCard key={word.id} data={word} />
            ))
          )}
        </div>

        {words.length > 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Everything is learned for now.
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 sm:right-[calc(50%-10rem)] z-50">
        <button
          onClick={handleGenerateWord}
          disabled={isLoading}
          className={`
            flex items-center justify-center w-14 h-14 rounded-full shadow-lg 
            text-white transition-all duration-300 transform hover:scale-105 active:scale-95
            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}
          `}
          aria-label="Generate new word"
        >
          {isLoading ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            <Plus className="w-8 h-8" />
          )}
        </button>
      </div>
    </div>
  );
};

export default App;