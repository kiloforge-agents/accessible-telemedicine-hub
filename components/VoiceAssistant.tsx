'use client';

import { useState, useEffect, useRef } from 'react';
import { useVoice } from '@/hooks/useVoice';
import { Mic, MicOff, Volume2, X, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const COMMANDS = [
  { pattern: /find|search|show|look/i, action: 'navigate:/providers', response: 'Taking you to find doctors now.' },
  { pattern: /book|schedule|appointment/i, action: 'navigate:/providers', response: "Let's book an appointment. I'll show you available doctors." },
  { pattern: /my appointment|my booking/i, action: 'navigate:/appointments', response: 'Opening your appointments.' },
  { pattern: /home|main|start/i, action: 'navigate:/', response: 'Going to the home page.' },
  { pattern: /general|family|gp/i, action: 'navigate:/providers?specialty=General+Practice', response: 'Showing general practice doctors.' },
  { pattern: /child|pediatric|kid/i, action: 'navigate:/providers?specialty=Pediatrics', response: 'Showing pediatricians for you.' },
  { pattern: /mental|therapy|anxiety|depression/i, action: 'navigate:/providers?specialty=Mental+Health', response: 'Showing mental health specialists.' },
  { pattern: /women|gynecol|maternal/i, action: "navigate:/providers?specialty=Women's+Health", response: "Showing women's health specialists." },
  { pattern: /help|what can|commands/i, action: 'help', response: "I can help you find doctors, book appointments, or check your schedule. Try: 'Find a doctor', 'Book an appointment', or 'Show my appointments'." },
];

interface Message { role: 'user' | 'assistant'; text: string; }

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hello! I'm your health assistant. Tap the microphone and tell me what you need -- like 'Find a doctor' or 'Book an appointment'." }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, isSupported, startListening, stopListening, speak, resetTranscript } = useVoice();
  const router = useRouter();

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (transcript && !isListening) handleCommand(transcript);
  }, [transcript, isListening]);

  const handleCommand = (text: string) => {
    setIsProcessing(true);
    setMessages(prev => [...prev, { role: 'user', text }]);
    resetTranscript();
    setTimeout(() => {
      let response = "I'm not sure about that. Try saying 'Find a doctor', 'Book an appointment', or 'Help'.";
      let action = '';
      for (const cmd of COMMANDS) {
        if (cmd.pattern.test(text)) { response = cmd.response; action = cmd.action; break; }
      }
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
      speak(response);
      if (action.startsWith('navigate:')) {
        setTimeout(() => { router.push(action.replace('navigate:', '')); setIsOpen(false); }, 1500);
      }
      setIsProcessing(false);
    }, 600);
  };

  const toggleListen = () => { if (isListening) stopListening(); else startListening(); };

  if (!isSupported && !isOpen) return null;

  return (
    <>
      <button onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-500/30 flex items-center justify-center hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
        aria-label="Open voice assistant" title="Voice Assistant">
        <Volume2 className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-h-96 bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-100 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-sky-600 to-teal-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Voice Assistant</p>
                <p className="text-sky-200 text-xs">Speak your request</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-sky-500 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none shadow-sm border border-slate-100'
                }`}>{msg.text}</div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white rounded-xl rounded-bl-none px-3 py-2 shadow-sm border border-slate-100">
                  <Loader2 className="w-4 h-4 text-sky-500 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-100">
            <button onClick={toggleListen}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isListening ? 'bg-red-500 text-white' : 'bg-sky-500 text-white hover:bg-sky-600'
              }`} aria-label={isListening ? 'Stop listening' : 'Start listening'}>
              {isListening ? (
                <><MicOff className="w-4 h-4" /><span>Listening...</span>
                  <div className="flex gap-0.5 items-center">
                    {[1,2,3,4,5].map(i => <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />)}
                  </div>
                </>
              ) : (
                <><Mic className="w-4 h-4" /><span>Tap to Speak</span></>
              )}
            </button>
            <div className="mt-2 flex gap-1.5 flex-wrap">
              {['Find doctor', 'Book now', 'My appointments', 'Help'].map(cmd => (
                <button key={cmd} onClick={() => handleCommand(cmd)}
                  className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-lg hover:bg-sky-50 hover:text-sky-700 transition-colors flex items-center gap-1">
                  {cmd} <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
