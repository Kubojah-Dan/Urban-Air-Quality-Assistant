import React from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

/**
 * DrawerInputBar Component
 *
 * Glassmorphic input dock with textarea, Web Speech API mic toggle,
 * live listening indicator, and send button.
 *
 * @param {Object} props
 * @param {string} props.query
 * @param {(val: string) => void} props.setQuery
 * @param {() => void} props.onSend
 * @param {boolean} props.isListening
 * @param {() => void} props.toggleListening
 * @param {boolean} props.isProcessing
 * @param {string} props.activeLanguage
 * @param {string|null} props.speechError
 * @param {() => void} props.clearSpeechError
 */
export function DrawerInputBar({
  query,
  setQuery,
  onSend,
  isListening,
  toggleListening,
  isProcessing,
  activeLanguage,
  speechError,
  clearSpeechError
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <>
      {/* Listening Waveform Indicator */}
      {isListening && (
        <div className="shrink-0 px-4 py-2 bg-cyber-teal/15 dark:bg-cyber-teal/10 border-t border-cyber-teal/30 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-xs text-slate-900 dark:text-white font-extrabold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>
              Listening... Speak in{' '}
              {activeLanguage === 'hi' ? 'Hindi' : activeLanguage === 'ta' ? 'Tamil' : 'English'}
            </span>
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
          <button type="button" onClick={clearSpeechError} className="font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Input Dock */}
      <div className="shrink-0 p-3 bg-white/95 dark:bg-[#091122] border-t border-slate-200/80 dark:border-white/10">
        <div className="rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200/80 dark:border-white/15 backdrop-blur-xl p-1.5 flex items-center gap-1.5 shadow-inner">
          <textarea
            rows={1}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
            onClick={onSend}
            disabled={!query.trim() || isProcessing}
            aria-label="Send message"
            className="w-9 h-9 rounded-full bg-cyber-teal text-slate-950 flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-transform active:scale-95 shadow-cyber-glow-teal cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
