import React, { createContext, useContext, useState, useEffect } from 'react';
import { askAssistant } from '../api/assistantApi.js';

const AssistantContext = createContext(null);

export function AssistantProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: 'Namaste! I am DayShift’s Environmental AI Assistant. I can help optimize your commute times, assess outdoor exercise air quality, or advise on indoor air protection.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attribution: 'Google Gemini 2.5 Flash',
      provider: 'google'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('en'); // 'en' | 'hi' | 'ta'
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  // Stop any active speech synthesis if the drawer closes
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  }, [isOpen]);

  const clearConversation = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setMessages([
      {
        id: `m_welcome_${Date.now()}`,
        sender: 'assistant',
        text: 'New conversation started. How can I assist with your routine or air quality decisions today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attribution: 'Google Gemini 2.5 Flash',
        provider: 'google'
      }
    ]);
  };

  const sendMessage = async (queryText, pageContext) => {
    const textToSend = queryText?.trim();
    if (!textToSend || isProcessing) return;

    const userMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const response = await askAssistant({
        query: textToSend,
        city: pageContext?.city || {
          displayName: 'Delhi, India',
          latitude: 28.6139,
          longitude: 77.2090
        },
        context: {
          page: pageContext?.currentPage || 'today',
          language: activeLanguage,
          initialContext: pageContext
        }
      });

      const assistantMessage = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attribution:
          response.provider === 'google'
            ? 'Google Gemini 2.5 Flash'
            : response.provider === 'groq'
            ? 'Groq Failover'
            : 'CAMS Deterministic Engine',
        provider: response.provider,
        evidence: response.evidence
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If speech synthesis is available and user preferred voice, speak response
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        speakText(response.reply, assistantMessage.id, activeLanguage);
      }
    } catch (err) {
      const cityLabel = pageContext?.city?.displayName?.split(',')[0] || 'your area';
      const errorMessage = {
        id: `a_err_${Date.now()}`,
        sender: 'assistant',
        text: `Unable to consult live models at this moment (${err.message}). Based on CAMS patterns for ${cityLabel}, morning surface inversions peak between 07:30 and 09:30 AM. Leaving earlier or using rail transport bypasses dense curbside plumes.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attribution: 'CAMS Telemetry Cache',
        provider: 'cache'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text, messageId, lang = 'en') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (speakingMessageId === messageId) {
      setSpeakingMessageId(null);
      return;
    }

    // Clean markdown symbols for natural speech
    const cleanText = text.replace(/[*#_`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Language mapping
    if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'ta') utterance.lang = 'ta-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  };

  return (
    <AssistantContext.Provider
      value={{
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
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

export function useGlobalAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useGlobalAssistant must be used within an AssistantProvider');
  }
  return context;
}
