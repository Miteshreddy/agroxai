import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';

const API = '/api';

const SUGGESTIONS = [
  { label: '🌾 Best crop for my soil', message: 'What is the best crop for my current soil type?' },
  { label: '🧪 Improve soil health', message: 'How can I improve my soil health naturally?' },
  { label: '💊 Fertilizer advice', message: 'What fertilizer should I use for my crop?' },
  { label: '🌧️ Irrigation tips', message: 'What are the best irrigation practices for my region?' },
];

const AgroChatbot = ({ context = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm **AgroXAI Assistant** 🌱\nHow can I help with your farming today?" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    console.log('--- Frontend Chat Request ---');
    console.log('Sending message:', userMsg);
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const payload = {
        message: userMsg,
        context: {
          crop: context.crop || null,
          soilType: context.soilType || null,
          temperature: context.weather?.temperature || null,
          humidity: context.weather?.humidity || null,
          rainfall: context.weather?.rainfall || null,
          season: context.season || null,
          location: context.location || null,
        },
      };
      console.log('Payload:', payload);

      const res = await axios.post(`${API}/chat`, payload);
      console.log('Response Received:', res.data);
      
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch (err) {
      console.error('--- Chat Error Log ---');
      console.error('Status:', err.response?.status);
      console.error('Data:', err.response?.data);
      
      let errMsg = "AI is temporarily unavailable.";
      if (err.response?.status === 429) {
        errMsg = "AI Quota Exceeded. Please wait a minute and try again.";
      } else if (err.response?.data?.error) {
        errMsg = err.response.data.error;
      }

      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: `**${errMsg}**\n\n*(Technical Details: ${err.message})*`,
        isError: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simple markdown bold rendering
  const renderText = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-brand-primary text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        whileTap={{ scale: 0.9 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }} className="relative">
              <MessageCircle size={22} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-[100] w-[380px] max-h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-text-primary px-6 py-5 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                <Bot size={20} className="text-brand-primary" />
              </div>
              <div className="flex-1">
                <p className="text-white font-black text-sm uppercase tracking-wider">AgroXAI Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Powered by Gemini AI</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" style={{ maxHeight: '350px' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-brand-primary/10' : 'bg-slate-100'
                  }`}>
                    {msg.role === 'user' ? <User size={14} className="text-brand-primary" /> : <Sparkles size={14} className="text-brand-text-primary" />}
                  </div>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-primary text-white rounded-tr-md'
                      : 'bg-slate-50 text-brand-text-primary border border-slate-100 rounded-tl-md'
                  }`}>
                    {renderText(msg.text)}
                    {msg.isError && (
                      <button 
                        onClick={() => sendMessage(messages[i-1]?.text)}
                        className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-wider"
                      >
                        <Loader2 size={10} className="animate-spin" /> Retry Now
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Sparkles size={14} className="text-brand-text-primary" />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-brand-primary" />
                    <span className="text-xs font-bold text-slate-400">AI is thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Smart Suggestions */}
            {messages.length <= 2 && !isTyping && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s.message)}
                    className="text-[10px] font-bold text-brand-text-secondary bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full hover:bg-brand-primary/5 hover:border-brand-primary/20 hover:text-brand-primary transition-all"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-slate-100 shrink-0">
              <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100 focus-within:border-brand-primary/30 transition-colors">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about farming..."
                  className="flex-1 bg-transparent outline-none text-sm font-medium text-brand-text-primary placeholder:text-slate-300"
                  disabled={isTyping}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center hover:bg-brand-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AgroChatbot;
