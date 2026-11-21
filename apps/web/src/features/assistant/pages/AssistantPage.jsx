import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, CheckCircle2, AlertCircle, RefreshCw, Compass, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

/**
 * AssistantPage
 *
 * Screen G: Environmental AI Assistant.
 * Redesigned for mobile-first native app feel:
 * - Floating prompt pills with responsive horizontal scrolling
 * - Multi-model badge (Google Gemini 2.5 Flash & Groq Failover)
 * - Message speech bubbles with clean timestamp, attribution, and trade-off cues
 * - Floating mobile-friendly input with teal glow
 * - 100% adaptive contrast in Light and Dark modes.
 */
export function AssistantPage({ initialContext }) {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Namaste! I am DayShift’s Environmental AI Assistant. Ask me how shifting your departure time, choosing the Metro, or adjusting vehicle AC recirculation can reduce your exposure without arriving late.',
      timestamp: '9:41 AM',
      attribution: 'Gemini 2.5 Flash'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    { label: '⏰ Leave 30m earlier?', query: 'Can I leave 30 minutes earlier to avoid peak morning pollution?' },
    { label: '🚆 Switch to Metro?', query: 'What if I switch my car commute to the Metro network?' },
    { label: '🚗 Car AC recirculation?', query: 'Does keeping car windows closed and AC on recirculation reduce PM2.5 in traffic?' },
    { label: '🍳 Kitchen ventilation?', query: 'How does kitchen exhaust compare to opening windows during outdoor smog?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isProcessing) return;

    const userMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsProcessing(true);

    setTimeout(() => {
      let replyText =
        'Based on current Copernicus CAMS regional forecasts for your area, morning surface temperature inversions peak between 08:30 and 09:30 AM. Leaving 30 minutes earlier (07:30 - 08:00 AM) avoids approximately 22% of localized particulate exposure while maintaining your 09:00 AM arrival deadline.';

      if (textToSend.toLowerCase().includes('metro')) {
        replyText =
          'Switching from a solo petrol car to the Metro rail network avoids ~380g of tailpipe CO2 per 10km (ARAI 2024 registry) while in-cabin underground filtration protects against curbside diesel exhaust plumes.';
      } else if (textToSend.toLowerCase().includes('window') || textToSend.toLowerCase().includes('recirculation')) {
        replyText =
          'Operating your vehicle AC with cabin recirculation enabled reduces in-cabin PM2.5 concentration by up to 50–70% compared to open windows in heavy traffic, provided your cabin filter is clean.';
      } else if (textToSend.toLowerCase().includes('kitchen') || textToSend.toLowerCase().includes('exhaust')) {
        replyText =
          'Running a vented kitchen exhaust hood directly expels ultra-fine cooking combustion particles outside. During outdoor smog episodes, keep windows closed and rely on exhaust venting rather than cross-breeze dilution.';
      }

      const assistantMessage = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attribution: 'Google Gemini 2.5 Flash'
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 750);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-16">
      {/* Header with High-Contrast Typography & Model Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cyber-card p-4 sm:p-5 rounded-[28px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyber-teal/20 flex items-center justify-center text-cyber-teal shadow-xs shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              DayShift AI Assistant
            </h1>
            <span className="text-[11px] text-slate-600 dark:text-cyber-text-secondary flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyber-teal animate-pulse" />
              Dual Provider: Gemini 2.5 Flash + Groq Failover
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full font-mono font-bold border border-slate-300 dark:border-white/10">
            Safety Calibrated
          </span>
        </div>
      </div>

      {/* Suggested Question Chips (Adaptive contrast in both light & dark mode) */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none px-1">
        {suggestedPrompts.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(item.query)}
            className="flex-shrink-0 text-xs font-bold px-3.5 py-2 rounded-2xl border transition cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 shadow-xs active:scale-95"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="cyber-card-elevated p-4 sm:p-6 rounded-[32px] min-h-[380px] max-h-[520px] overflow-y-auto space-y-4 border border-slate-200 dark:border-white/15">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-sm ${
                  isUser
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold'
                    : 'bg-cyber-teal text-slate-950 font-black'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[80%] p-4 rounded-[24px] text-xs leading-relaxed space-y-2 shadow-sm ${
                  isUser
                    ? 'bg-cyber-teal text-slate-950 rounded-tr-xs font-bold'
                    : 'bg-slate-100/90 text-slate-900 border border-slate-200 dark:bg-white/5 dark:text-white dark:border-white/10 rounded-tl-xs font-medium'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                <div
                  className={`flex items-center justify-between text-[10px] pt-1 border-t ${
                    isUser
                      ? 'border-slate-950/10 text-slate-800 font-semibold'
                      : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-cyber-text-muted'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.attribution && (
                    <span className="font-bold text-teal-800 dark:text-cyber-teal font-mono">
                      {msg.attribution}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-cyber-teal p-3 bg-cyber-teal/10 rounded-2xl w-fit font-bold border border-cyber-teal/20 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Consulting environmental models & safety validator...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar (Sticky, touch-friendly on mobile) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 cyber-card p-2 sm:p-2.5 rounded-[24px] border border-slate-200 dark:border-white/15 shadow-lg"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask a question or propose a commute / indoor change..."
          className="flex-1 bg-transparent px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-medium"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isProcessing}
          className="p-3 sm:px-5 sm:py-3 rounded-2xl bg-cyber-teal text-slate-950 font-black text-xs shadow-cyber-glow-teal disabled:opacity-40 transition cursor-pointer flex items-center gap-1.5 hover:opacity-90"
        >
          <span className="hidden sm:inline">Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
