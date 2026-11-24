import React, { useState, useRef, useEffect } from 'react';
import { Compass } from 'lucide-react';
import { useGlobalAssistant } from '../context/AssistantContext.jsx';
import { DrawerHeader } from './drawer/DrawerHeader.jsx';
import { DrawerMessageItem } from './drawer/DrawerMessageItem.jsx';
import { DrawerQuickPrompts } from './drawer/DrawerQuickPrompts.jsx';
import { DrawerInputBar } from './drawer/DrawerInputBar.jsx';

/**
 * GlobalAiChatDrawer
 *
 * Ultra-premium glassmorphic floating AI Assistant.
 * Built with rounded elements, layered frosted surfaces, speech recognition waveform,
 * dynamic audio playback, and responsive viewport-safe bounds on both mobile and desktop.
 *
 * @param {Object} props
 * @param {string} [props.currentPage='today']
 * @param {Object} [props.activeContext]
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
    longitude: 77.209
  };

  const pageNames = {
    landing: 'Overview',
    today: 'Today Dashboard',
    routine: 'My Routine Planner',
    indoor: 'Indoor Air Coach',
    explorer: 'Air Quality Explorer',
    history: 'Impact History',
    start: 'Start Consultation'
  };

  const currentPrompts = [
    { label: '⚡ Optimal departure shift', query: 'What is the optimal departure shift for my commute?' },
    { label: '🚇 Metro vs Solo Drive', query: 'Compare curb exposure between metro and solo driving today.' },
    { label: '🪟 Inversion window advice', query: 'When should I seal or ventilate my windows today?' },
    { label: '🏃 Outdoor fitness safety', query: 'Is this evening safe for outdoor running or walking?' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.lang =
        activeLanguage === 'hi' ? 'hi-IN' : activeLanguage === 'ta' ? 'ta-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
          handleSendQuery(transcript);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setSpeechError(`Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopSpeaking();
    };
  }, [activeLanguage, stopSpeaking]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError('Web Speech API is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.abort();
        setTimeout(() => recognitionRef.current?.start(), 100);
      }
    }
  };

  const handleSendQuery = async (queryToSend) => {
    const q = (queryToSend || inputQuery).trim();
    if (!q || isProcessing) return;

    setInputQuery('');
    await sendMessage(q, {
      city: activeCity,
      currentPage,
      userPreferences: activeContext?.preferences || {}
    });
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="DayShift AI Assistant Chat"
      className="fixed z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-6
        inset-x-0 bottom-0 h-[82dvh] max-h-[82dvh]
        sm:inset-x-auto sm:bottom-20 sm:right-6 sm:w-[410px] sm:h-[min(570px,calc(100vh-100px))] sm:max-h-[calc(100vh-100px)]
        flex flex-col bg-white/95 dark:bg-[#091122]/95 backdrop-blur-3xl
        rounded-t-[32px] sm:rounded-[32px] border border-slate-200/90 dark:border-white/15
        shadow-2xl shadow-cyan-950/50 ring-1 ring-cyber-teal/30 text-slate-900 dark:text-white overflow-hidden"
    >
      {/* Mobile Drag Pill */}
      <div className="sm:hidden shrink-0 w-12 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full mx-auto mt-2.5 mb-1" />

      {/* 1. Drawer Header */}
      <DrawerHeader
        activeLanguage={activeLanguage}
        setActiveLanguage={setActiveLanguage}
        clearConversation={clearConversation}
        onClose={() => setIsOpen(false)}
      />

      {/* 2. Page-Aware Capsule Bar */}
      <div className="shrink-0 px-3.5 py-1.5 bg-gradient-to-r from-cyber-teal/15 via-cyber-blue/10 to-transparent border-b border-cyber-teal/20 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-cyber-text-secondary truncate">
          <Compass className="w-3 h-3 text-cyber-teal shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-white">
            {pageNames[currentPage] || 'Overview'}
          </span>
          <span>·</span>
          <span className="truncate">{activeCity.displayName.split(',')[0]}</span>
        </div>
        <span className="text-[10px] text-cyber-teal font-mono uppercase tracking-wider font-extrabold shrink-0 bg-cyber-teal/10 px-2 py-0.5 rounded-full border border-cyber-teal/20">
          Page-Aware
        </span>
      </div>

      {/* 3. Messages List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3.5">
        {messages.map((msg) => (
          <DrawerMessageItem
            key={msg.id}
            message={msg}
            isSpeaking={speakingMessageId === msg.id}
            onSpeak={speakText}
            activeLanguage={activeLanguage}
          />
        ))}

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

      {/* 4. Suggested Quick Prompts */}
      <DrawerQuickPrompts
        prompts={currentPrompts}
        isProcessing={isProcessing}
        onSelectPrompt={handleSendQuery}
      />

      {/* 5. Input Bar with Mic & Send */}
      <DrawerInputBar
        query={inputQuery}
        setQuery={setInputQuery}
        onSend={() => handleSendQuery()}
        isListening={isListening}
        toggleListening={toggleListening}
        isProcessing={isProcessing}
        activeLanguage={activeLanguage}
        speechError={speechError}
        clearSpeechError={() => setSpeechError(null)}
      />
    </div>
  );
}
