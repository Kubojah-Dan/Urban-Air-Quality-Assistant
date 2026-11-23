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
  Globe
} from 'lucide-react';
import { useGlobalAssistant } from '../context/AssistantContext.jsx';

/**
 * GlobalAiChatDrawer
 *
 * Full-featured floating AI Chat Assistant:
 * - Desktop: Sophisticated 420px wide glassmorphic flyout (bottom-24 right-6).
 * - Mobile: Responsive bottom-sheet with safe-area padding above navigation.
 * - Speech-to-Text (Web Speech API) with animated audio waveform & Hindi/Tamil/English support.
 * - Text-to-Speech (Web SpeechSynthesis).
 * - Page-Aware Intelligence: dynamically injects current page & telemetry into conversation.
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

      // Set language according to active preference
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
          setSpeechError('Microphone permission denied. Please allow microphone access.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Speech recognition error: ${event.error}`);
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
      setSpeechError('Voice input is not supported in this browser. Please use text typing.');
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
        inset-x-0 bottom-0 max-h-[85dvh] h-[85dvh]
        sm:inset-x-auto sm:bottom-20 sm:right-6 sm:w-[400px] sm:h-[min(560px,calc(100vh-100px))] sm:max-h-[calc(100vh-100px)]
        flex flex-col bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-2xl
        rounded-t-[28px] sm:rounded-[28px] border border-slate-200 dark:border-white/15
        shadow-2xl shadow-cyan-950/50 text-slate-900 dark:text-white overflow-hidden"
    >
      {/* Mobile Drag Indicator */}
      <div className="sm:hidden shrink-0 w-12 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full mx-auto mt-2.5 mb-1" />

      {/* Header (shrink-0 ensures it is NEVER compressed or pushed off-screen) */}
      <header className="shrink-0 px-4 py-3 sm:py-3.5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-black/20">
        <div className="flex items-center gap-2.5">
          {/* Stylized AI Badge */}
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyber-teal to-cyber-blue flex items-center justify-center text-slate-950 font-black shadow-xs">
            <span className="font-display text-xs">D</span>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
                DayShift AI
              </h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-cyber-teal/20 text-cyber-teal font-mono font-bold">
                2.5 Flash
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-cyber-text-secondary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Telemetry Connected</span>
            </p>
          </div>
        </div>

        {/* Controls: Language + Clear + Close */}
        <div className="flex items-center gap-1.5">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={activeLanguage}
              onChange={(e) => setActiveLanguage(e.target.value)}
              aria-label="Language selection"
              className="text-[10px] font-bold bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-cyber-text-secondary py-1 px-1.5 rounded-lg border border-slate-300 dark:border-white/15 outline-none cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>

          {/* New Chat */}
          <button
            type="button"
            onClick={clearConversation}
            title="Start new conversation"
            aria-label="New conversation"
            className="p-1.5 rounded-xl text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close assistant"
            className="p-1.5 rounded-xl text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Page-Aware Context Bar */}
      <div className="shrink-0 px-3.5 py-1.5 bg-cyber-teal/10 dark:bg-cyber-teal/5 border-b border-cyber-teal/20 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-cyber-text-secondary truncate">
          <Compass className="w-3 h-3 text-cyber-teal shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-white">{pageNames[currentPage] || 'Overview'}</span>
          <span>·</span>
          <span className="truncate">{activeCity.displayName.split(',')[0]}</span>
        </div>
        <span className="text-[10px] text-cyber-teal font-mono uppercase tracking-wider font-extrabold shrink-0">
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
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed transition-all ${
                  isUser
                    ? 'bg-cyber-teal text-slate-950 font-medium rounded-tr-none shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-tl-none shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Evidence telemetry tag if present */}
                {msg.evidence && (
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-600 dark:text-cyber-text-secondary font-mono">
                    <span className="bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-800 dark:text-cyber-teal font-bold">
                      PM2.5: {msg.evidence.pm25} µg/m³
                    </span>
                    <span className="bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-700 dark:text-cyber-blue">
                      {msg.evidence.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Attribution & TTS Speaker button for assistant */}
              <div className="flex items-center gap-2 px-1 text-[10px] text-slate-500 dark:text-cyber-text-muted">
                <span>{msg.timestamp}</span>
                {msg.attribution && <span>· {msg.attribution}</span>}
                {!isUser && (
                  <button
                    type="button"
                    onClick={() => speakText(msg.text, msg.id, activeLanguage)}
                    title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                    aria-label={isSpeaking ? 'Stop speech playback' : 'Read message aloud'}
                    className={`hover:text-cyber-teal transition cursor-pointer p-0.5 rounded ${
                      isSpeaking ? 'text-cyber-teal animate-pulse' : ''
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
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 max-w-[70%]">
            <span className="w-2 h-2 rounded-full bg-cyber-teal animate-ping" />
            <span className="text-xs text-slate-600 dark:text-cyber-text-secondary animate-pulse">
              Consulting CAMS & Gemini models...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="shrink-0 px-3 py-2 bg-slate-50 dark:bg-black/30 border-t border-slate-200 dark:border-white/10 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        {currentPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendQuery(p.query)}
            disabled={isProcessing}
            className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white dark:bg-white/5 hover:bg-cyber-teal/20 text-slate-700 dark:text-cyber-text-secondary hover:text-cyber-teal border border-slate-200 dark:border-white/10 transition cursor-pointer whitespace-nowrap"
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
        <div className="shrink-0 px-3 py-1.5 bg-red-500/10 border-t border-red-500/30 text-[10px] text-red-500 flex items-center justify-between">
          <span>{speechError}</span>
          <button type="button" onClick={() => setSpeechError(null)} className="font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Input Box */}
      <div className="shrink-0 p-3 bg-white dark:bg-[#0c1322] border-t border-slate-200 dark:border-white/10 flex items-center gap-2">
        <textarea
          rows={1}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening to speech...' : 'Ask about routine shifts, AQI, indoor air...'}
          className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-cyber-text-muted focus:outline-none focus:ring-1 focus:ring-cyber-teal resize-none"
        />

        {/* Voice Microphone Toggle */}
        <button
          type="button"
          onClick={toggleListening}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          className={`p-2.5 rounded-2xl border transition cursor-pointer ${
            isListening
              ? 'bg-red-500 text-white border-red-400 shadow-md animate-pulse'
              : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 border-slate-200 dark:border-white/10'
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
          className="p-2.5 rounded-2xl bg-cyber-teal text-slate-950 hover:opacity-90 disabled:opacity-40 transition shadow-cyber-glow-teal cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
