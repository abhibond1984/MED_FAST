
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import { ChatMessage, CartItem } from '../types';
import { chatWithPharmaBot } from '../services/geminiService';

interface Props {
  cartItems: CartItem[];
}

const PharmaBot: React.FC<Props> = ({ cartItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I am PharmaBot. I can help you with medicine info or check for interactions.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Proactive suggestion based on cart
  useEffect(() => {
    if (cartItems.length > 0 && messages.length === 1 && isOpen) {
       const timer = setTimeout(() => {
         setMessages(prev => [...prev, { 
           role: 'model', 
           text: `I see you have ${cartItems[0].name} in your cart. Do you need advice on dosage or side effects?` 
         }]);
       }, 1000);
       return () => clearTimeout(timer);
    }
  }, [cartItems, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await chatWithPharmaBot(input, messages, cartItems);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-40 flex items-center gap-2 group"
      >
        <div className="relative">
           <MessageSquare className="w-6 h-6" />
           {cartItems.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-emerald-500"></span>}
        </div>
        <span className="text-sm font-semibold hidden md:inline group-hover:inline transition-all duration-300">AI Pharmacist</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 w-[90vw] md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden max-h-[60vh] md:max-h-[500px] animate-scale-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg">
             <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">PharmaBot AI</h3>
            <p className="text-[10px] opacity-80 flex items-center gap-1"><Sparkles className="w-2 h-2" /> Context Aware</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about side effects..."
          className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-emerald-600 disabled:opacity-50 text-white p-2.5 rounded-full hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PharmaBot;
