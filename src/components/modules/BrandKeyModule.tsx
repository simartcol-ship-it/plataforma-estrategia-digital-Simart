import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Key } from 'lucide-react';
import { VoiceButton } from '../VoiceButton';

export const BrandKeyModule = () => {
  const { brandKey, setBrandKey } = useAppContext();

  const updateField = (field: keyof typeof brandKey, value: string) => {
    setBrandKey({ ...brandKey, [field]: value });
  };

  const fields = [
    { key: 'fortaleza', label: 'Centro de Fortaleza (Root Strength)', placeholder: '¿De dónde venimos? Nuestro origen y base fundacional.' },
    { key: 'competencia', label: 'Entorno Competitivo (Competitive Environment)', placeholder: '¿Quiénes y cómo son nuestros competidores principales?' },
    { key: 'target', label: 'Público Objetivo (Target)', placeholder: '¿A quién nos dirigimos y cuál es su actitud hacia la categoría?' },
    { key: 'insight', label: 'Insight del Consumidor', placeholder: '¿Cuál es la verdad profunda que resolvemos?' },
    { key: 'beneficios', label: 'Beneficios (Funcionales y Emocionales)', placeholder: '¿Qué gana el cliente al elegirnos?' },
    { key: 'valores', label: 'Valores y Creencias', placeholder: '¿En qué creemos ciegamente?' },
    { key: 'razones', label: 'Razones para Creer (Reasons to Believe)', placeholder: '¿Por qué pueden confiar en nosotros?' },
    { key: 'discriminador', label: 'Discriminador', placeholder: 'La principal diferencia contra la competencia.' },
    { key: 'esencia', label: 'Esencia de Marca', placeholder: 'La idea central en 2 o 3 palabras.' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#1B1B1B] to-[#2A2A2A] p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Key className="w-6 h-6 text-[#FF6D2A]" /> Brand Key</h2>
        <p className="text-blue-100 mt-1">Estructura el ADN y el posicionamiento de tu marca.</p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700">{label}</label>
            <div className="relative">
              <textarea 
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] focus:border-transparent outline-none min-h-[100px] pb-10 text-sm text-gray-700 resize-none transition" 
                value={(brandKey as any)[key]} 
                onChange={e => updateField(key as keyof typeof brandKey, e.target.value)} 
                placeholder={placeholder} 
              />
              <VoiceButton 
                isTextArea
                onResult={(text) => {
                  const currentText = (brandKey as any)[key] || '';
                  updateField(key as keyof typeof brandKey, currentText ? `${currentText} ${text}` : text);
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
