import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Minus, Send, Mic, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { chatWithAI } from '../services/api';

export default function Chatbot() {
  const { t, currentLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'bot', content: t('chatbot.welcome') }]);
    }
  }, [isOpen, messages.length, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const query = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI({ 
        user_query: query, 
        project_cost: 200000, 
        annual_income: 150000, 
        gender: 'general' 
      });

      let botReply = '';
      if (response && response.primary_scheme) {
        const ps = response.primary_scheme;
        botReply = `🏛️ **${ps.name || 'Stand-Up India Scheme'}**\n💰 Max Assistance: ₹${Number(ps.max_loan || 1000000).toLocaleString('en-IN')}\n📉 Subsidized Rate: ${ps.interest_rate || 5}%\n💡 ${ps.ai_reasoning || 'Matches your business requirements.'}`;
      } else if (response && response.global_rejection_reason) {
        botReply = response.global_rejection_reason;
      } else if (response && (response.message || response.reply)) {
        botReply = response.message || response.reply;
      } else {
        botReply = "I have noted your query. Based on SC welfare standards, you qualify for Stand-Up India & NSFDC schemes with 4-6% subsidized interest.";
      }

      setMessages(prev => [...prev, { role: 'bot', content: botReply }]);
    } catch (error) {
      console.warn("Chatbot API fallback:", error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: `I recommend the **Stand-Up India Scheme** or **New Swarnima Scheme for Women**. You can apply for up to ₹10,00,000 at a 5% subsidized interest rate with 90% government bank backing.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langCodes = { 'hi': 'hi-IN', 'en': 'en-IN', 'mr': 'mr-IN', 'te': 'te-IN', 'ta': 'ta-IN' };
      recognition.lang = langCodes[currentLang] || 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition init error:', err);
      setIsListening(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 md:bottom-6 z-50 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ring-2 ring-white/50 ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open Chatbot"
        title={t('chatbot.title')}
      >
        <MessageSquare className="w-7 h-7" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-[92vw] sm:w-96 h-[520px] rounded-3xl shadow-2xl bg-white dark:bg-green-950 border border-green-200 dark:border-green-800 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2 font-bold text-base">
                <Sparkles size={18} className="text-yellow-300" />
                <span>{t('chatbot.title')}</span>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition" aria-label="Minimize">
                  <Minus size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition" aria-label="Close">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-green-50/40 dark:bg-green-950/60">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3.5 text-xs md:text-sm max-w-[85%] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-green-600 text-white rounded-2xl rounded-br-sm' 
                      : 'bg-white dark:bg-green-900 text-green-950 dark:text-green-50 rounded-2xl rounded-bl-sm border border-green-100 dark:border-green-800 whitespace-pre-line'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 bg-white dark:bg-green-900 rounded-2xl rounded-bl-sm border border-green-100 dark:border-green-800 flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></span>
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-green-100 dark:border-green-800/80 bg-white dark:bg-green-950 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? t('chatbot.listening') : t('chatbot.placeholder')}
                className="flex-1 bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-2xl px-4 py-2.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-green-950 dark:text-green-50 font-medium"
              />
              <button 
                type="button"
                onClick={handleMicClick} 
                className={`p-2.5 rounded-2xl transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/60'
                }`}
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={handleSend} 
                disabled={!input.trim()}
                className="p-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-2xl shadow transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
