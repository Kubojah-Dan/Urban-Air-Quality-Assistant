import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * DrawerMessageItem Component
 *
 * Renders an individual chat bubble (User vs DayShift AI),
 * authentic evidence badges, message timestamp, attribution,
 * and text-to-speech speaker controls.
 *
 * @param {Object} props
 * @param {Object} props.message
 * @param {boolean} props.isSpeaking
 * @param {(text: string, id: string, lang: string) => void} props.onSpeak
 * @param {string} props.activeLanguage
 */
export function DrawerMessageItem({
  message,
  isSpeaking,
  onSpeak,
  activeLanguage
}) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}>
      <div
        className={`max-w-[85%] text-xs leading-relaxed transition-all ${
          isUser
            ? 'rounded-2xl rounded-tr-xs bg-gradient-to-tr from-cyber-teal to-[#00d2ad] text-slate-950 font-medium px-4 py-3 shadow-md'
            : 'rounded-2xl rounded-tl-xs p-4 bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/90 dark:border-white/10 backdrop-blur-xl shadow-xs text-slate-900 dark:text-white'
        }`}
      >
        <p className="whitespace-pre-line">{message.text}</p>

        {/* Real Evidence Tag */}
        {message.evidence && (
          <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-600 dark:text-cyber-text-secondary font-mono">
            <span className="bg-slate-200/80 dark:bg-white/10 px-2 py-0.5 rounded-full text-slate-800 dark:text-cyber-teal font-bold border border-slate-300 dark:border-white/10">
              PM₂.₅: {message.evidence.pm25} µg/m³
            </span>
            <span className="bg-slate-200/80 dark:bg-white/10 px-2 py-0.5 rounded-full text-slate-700 dark:text-cyber-blue border border-slate-300 dark:border-white/10">
              {message.evidence.category}
            </span>
          </div>
        )}
      </div>

      {/* Attribution & TTS Audio Playback Button */}
      <div className="flex items-center gap-2 px-1 text-[10px] text-slate-500 dark:text-cyber-text-muted">
        <span>{message.timestamp}</span>
        {message.attribution && <span>· {message.attribution}</span>}
        {!isUser && (
          <button
            type="button"
            onClick={() => onSpeak(message.text, message.id, activeLanguage)}
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
}
