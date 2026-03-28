import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceButtonProps {
  onResult: (text: string) => void;
  className?: string;
  isTextArea?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ onResult, className = '', isTextArea = false }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES'; // Default to Spanish for this app

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onResult]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("El dictado por voz no es compatible con este navegador. Por favor usa Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const buttonPosition = isTextArea ? "absolute bottom-3 right-3" : "absolute top-1/2 -translate-y-1/2 right-3";

  return (
    <div className={`${buttonPosition} z-10 ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        title={isListening ? "Detener dictado" : "Dictar por voz"}
        className={`p-2 rounded-full transition-all flex items-center justify-center ${
          isListening 
            ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.6)]' 
            : 'bg-gray-100 text-gray-500 hover:bg-orange-100 hover:text-[#FF6D2A]'
        }`}
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <MicOff className="w-4 h-4" />
          </motion.div>
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>
      
      {/* Recording Ripple Effect */}
      {isListening && (
        <motion.div
          className="absolute inset-0 bg-red-500 rounded-full -z-10"
          animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </div>
  );
};
