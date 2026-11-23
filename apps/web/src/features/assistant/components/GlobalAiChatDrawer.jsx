import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  X,
  MapPin,
  Compass,
  AlertCircle,
  CheckCircle2,
  Globe,
  Bot
} from 'lucide-react';
import { useGlobalAssistant } from '../context/AssistantContext.jsx';

/**
 * GlobalAiChatDrawer
 *
 * Ultra-premium glassmorphic floating AI Assistant.
 * Built with rounded elements, layered frosted surfaces, speech recognition waveform,
 * dynamic audio playback, and responsive viewport-safe bounds on both mobile and desktop.
 */
export function GlobalAiChatDrawer({ currentPage = 'today', activeContext }) {
  const {
    isOpen,
    setIsOpen,
    messages,
    isProcessing,
    sendMessage,
    clearConversation,
    activeLanguage,
    setActiveLanguage,
    speakingMessageId,
    speakText,
    stopSpeaking
  } = useGlobalAssistant();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const activeCity = activeContext?.city || {
    displayName: 'Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090
  };

  const pageNames = {
    landing: 'Overview',
    today: 'Today Dashboard',
    routine: 'My Routine Planner',
    indoor: 'Indoor Air Coach',
    explorer: 'Air Quality Explorer',
    history: 'Impact History',
    assistant: 'AI Assistant',
    privacy: 'Privacy & Settings'
  };

  // Page-Aware Suggested Prompts
  const pagePrompts = {
    today: [
      { label: '⏰ Leave 30m earlier?', query: 'Why is leaving 30 minutes earlier recommended for morning commute?' },
      { label: '🏃 Outdoor exercise safe?', query: `Is it safe to run outdoors right now in ${activeCity.displayName.split(',')[0]}?` },
      { label: '🚗 Car AC recirculation?', query: 'Does keeping car windows closed with AC recirculation cut PM2.5 in traffic?' }
    ],
    routine: [
      { label: '🚆 Shift commute to Metro?', query: 'How much CO2 and curbside exposure do I avoid by switching to the Metro?' },
      { label: '🔄 Alternative evening commute?', query: 'Suggest an alternative lower-pollution routine for my evening return.' },
      { label: '⚖️ Time vs exposure trade-offs?', query: 'What are the time and convenience trade-offs for my recommended routine?' }
    ],
    indoor: [
      { label: '🪟 When to open windows?', query: 'What time of day is optimal for natural ventilation in this city?' },
      { label: '🍳 Kitchen cooking smoke?', query: 'How does cooking without an exhaust hood compare to outdoor pollution?' },
      { label: '💨 Air purifier settings?', query: 'When should I run a mechanical HEPA purifier on high speed?' }
    ],
    explorer: [
      { label: '🌡️ Surface inversion layer?', query: 'Explain how morning temperature inversions trap particulates near the ground.' },
      { label: '📊 PM2.5 vs PM10 difference?', query: 'What is the physical and health difference between PM2.5 and PM10?' },
      { label: '🛰️ CAMS forecast vs sensor?', query: 'How does Copernicus CAMS regional forecast differ from street-level sensors?' }
    ],
    history: [
      { label: '🧾 How is Impact calculated?', query: 'Explain how my Impact Receipt greenhouse gas savings are calculated.' },
      { label: '🌱 ARAI 2024 emissions factors?', query: 'What vehicle emission factors from ARAI 2024 are used for Indian metros?' }
    ],
    landing: [
      { label: '🌿 How does DayShift work?', query: 'What makes DayShift different from a standard air quality index app?' },
      { label: '📍 Check my city air quality', query: `What is the current air quality and forecast for ${activeCity.displayName}?` }
    ]
  };

  const currentPrompts = pagePrompts[currentPage] || pagePrompts.today;

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      if (activeLanguage === 'hi') recognition.lang = 'hi-IN';
      else if (activeLanguage === 'ta') recognition.lang = 'ta-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join('');
        setInputQuery(transcript);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow microphone access in your browser.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Speech recognition: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.abort();
    };
  }, [activeLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError('Voice input is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 200);
      }
    }
  };

  const handleSendQuery = (text) => {
    const query = text || inputQuery;
    if (!query.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    sendMessage(query, {
      currentPage,
      city: activeCity,
      initialContext: activeContext
    });
    setInputQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="DayShift AI Assistant"
      className="fixed z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-6
        inset-x-0 bottom-0 h-[82dvh] max-h-[82dvh]
        sm:inset-x-auto sm:bottom-20 sm:right-6 sm:w-[410px] sm:h-[min(570px,calc(100vh-100px))] sm:max-h-[calc(100vh-100px)]
        flex flex-col bg-white/95 dark:bg-[#091122]/95 backdrop-blur-3xl
        rounded-t-[32px] sm:rounded-[32px] border border-slate-200/90 dark:border-white/15
        shadow-2xl shadow-cyan-950/50 ring-1 ring-cyber-teal/30 text-slate-900 dark:text-white overflow-hidden"
    >
      {/* Mobile Drag Pill */}
      <div className="sm:hidden shrink-0 w-12 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full mx-auto mt-2.5 mb-1" />

      {/* Header */}
      <header className="shrink-0 px-4 py-3 sm:py-3.5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          {/* DayShift Orb Insignia */}
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyber-teal to-cyber-blue flex items-center justify-center text-slate-950 font-black shadow-cyber-glow-teal shrink-0">
            <span className="font-display text-xs">D</span>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
                DayShift AI
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-teal/20 text-cyber-teal font-mono font-bold border border-cyber-teal/30">
                2.5 Flash
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-cyber-text-secondary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live CAMS & CPCB Telemetry</span>
            </p>
          </div>
        </div>

        {/* Controls: Round Language Pill + Clear + Close */}
        <div className="flex items-center gap-1.5">
          {/* Language Selector */}
          <select
            value={activeLanguage}
            onChange={(e) => setActiveLanguage(e.target.value)}
            aria-label="Language selection"
            className="text-[11px] font-bold bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-cyber-text-secondary py-1 px-2.5 rounded-full border border-slate-300/80 dark:border-white/15 outline-none cursor-pointer"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="ta">தமிழ்</option>
          </select>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={clearConversation}
            title="Start new conversation"
            aria-label="New conversation"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close assistant"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Page-Aware Capsule Bar */}
      <div className="shrink-0 px-3.5 py-1.5 bg-gradient-to-r from-cyber-teal/15 via-cyber-blue/10 to-transparent border-b border-cyber-teal/20 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-cyber-text-secondary truncate">
          <Compass className="w-3 h-3 text-cyber-teal shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-white">{pageNames[currentPage] || 'Overview'}</span>
          <span>·</span>
          <span className="truncate">{activeCity.displayName.split(',')[0]}</span>
        </div>
        <span className="text-[10px] text-cyber-teal font-mono uppercase tracking-wider font-extrabold shrink-0 bg-cyber-teal/10 px-2 py-0.5 rounded-full border border-cyber-teal/20">
          Page-Aware
        </span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3.5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div
                className={`max-w-[85%] text-xs leading-relaxed transition-all ${
                  isUser
                    ? 'rounded-2xl rounded-tr-xs bg-gradient-to-tr from-cyber-teal to-[#00d2ad] text-slate-950 font-medium px-4 py-3 shadow-md'
                    : 'rounded-2xl rounded-tl-xs p-4 bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/90 dark:border-white/10 backdrop-blur-xl shadow-xs text-slate-900 dark:text-white'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Real Evidence Tag */}
                {msg.evidence && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-600 dark:text-cyber-text-secondary font-mono">
                    <span className="bg-slate-200/80 dark:bg-white/10 px-2 py-0.5 rounded-full text-slate-800 dark:text-cyber-teal font-bold border border-slate-300 dark:border-white/10">
                      PM₂.₅: {msg.evidence.pm25} µg/m³
                    </span>
                    <span className="bg-slate-200/80 dark:bg-white/10 px-2 py-0.5 rounded-full text-slate-700 dark:text-cyber-blue border border-slate-300 dark:border-white/10">
                      {msg.evidence.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Attribution & TTS Audio Playback Button */}
              <div className="flex items-center gap-2 px-1 text-[10px] text-slate-500 dark:text-cyber-text-muted">
                <span>{msg.timestamp}</span>
                {msg.attribution && <span>· {msg.attribution}</span>}
                {!isUser && (
                  <button
                    type="button"
                    onClick={() => speakText(msg.text, msg.id, activeLanguage)}
                    title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                    aria-label={isSpeaking ? 'Stop speech playback' : 'Read message aloud'}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition cursor-pointer ${
                      isSpeaking
                        ? 'bg-cyber-teal text-slate-950 animate-pulse shadow-cyber-glow-teal'
                        : 'hover:bg-slate-200 dark:hover:bg-white/10 hover:text-cyber-teal'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 max-w-[75%] backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-teal animate-ping" />
            <span className="text-xs text-slate-600 dark:text-cyber-text-secondary animate-pulse font-medium">
              Consulting CAMS & Gemini models...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="shrink-0 px-3.5 py-2.5 bg-slate-50/90 dark:bg-black/30 border-t border-slate-200/80 dark:border-white/10 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {currentPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendQuery(p.query)}
            disabled={isProcessing}
            className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full bg-white dark:bg-white/5 hover:bg-cyber-teal/20 text-slate-700 dark:text-cyber-text-secondary hover:text-cyber-teal border border-slate-200/90 dark:border-white/10 transition cursor-pointer whitespace-nowrap shadow-2xs hover:scale-102"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Listening Waveform Indicator */}
      {isListening && (
        <div className="shrink-0 px-4 py-2 bg-cyber-teal/15 dark:bg-cyber-teal/10 border-t border-cyber-teal/30 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-xs text-slate-900 dark:text-white font-extrabold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>Listening... Speak in {activeLanguage === 'hi' ? 'Hindi' : activeLanguage === 'ta' ? 'Tamil' : 'English'}</span>
          </div>
          <button
            type="button"
            onClick={toggleListening}
            className="text-[10px] font-black uppercase text-red-500 hover:underline cursor-pointer"
          >
            Stop
          </button>
        </div>
      )}

      {/* Speech Error Banner */}
      {speechError && (
        <div className="shrink-0 px-3.5 py-1.5 bg-red-500/10 border-t border-red-500/30 text-[10px] text-red-500 flex items-center justify-between">
          <span>{speechError}</span>
          <button type="button" onClick={() => setSpeechError(null)} className="font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Input Dock */}
      <div className="shrink-0 p-3 bg-white/95 dark:bg-[#091122] border-t border-slate-200/80 dark:border-white/10">
        <div className="rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200/80 dark:border-white/15 backdrop-blur-xl p-1.5 flex items-center gap-1.5 shadow-inner">
          <textarea
            rows={1}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Listening to voice...' : 'Ask about routine shifts, AQI, indoor air...'}
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-cyber-text-muted focus:outline-none resize-none leading-relaxed"
          />

          {/* Voice Microphone Button */}
          <button
            type="button"
            onClick={toggleListening}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white shadow-lg animate-pulse'
                : 'bg-white dark:bg-white/10 text-slate-700 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendQuery()}
            disabled={!inputQuery.trim() || isProcessing}
            aria-label="Send message"
            className="w-9 h-9 rounded-full bg-cyber-teal text-slate-950 flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-transform active:scale-95 shadow-cyber-glow-teal cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
