import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Shield } from 'lucide-react';
import { VoiceButton } from '../VoiceButton';

export const ValuePromiseModule = () => {
  const { valuePromise, setValuePromise } = useAppContext();

  const updateField = (field: keyof typeof valuePromise, value: string) => {
    setValuePromise({ ...valuePromise, [field]: value });
  };

  const handleVoice = (field: keyof typeof valuePromise, text: string) => {
    const currentText = valuePromise[field] || '';
    updateField(field, currentText ? `${currentText} ${text}` : text);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#1B1B1B] to-[#2A2A2A] p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6 text-[#FF6D2A]" /> Promesa de Valor (Value Proposition Canvas)</h2>
        <p className="text-blue-100 mt-1">Conecta el perfil del cliente con el valor de tu producto o servicio.</p>
      </div>
      
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PERFIL DEL CLIENTE */}
        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 space-y-4">
          <h3 className="font-bold text-lg border-b pb-2 text-[#1B1B1B]">Perfil del Cliente</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Trabajos del Cliente (Customer Jobs)</label>
            <div className="relative">
              <textarea className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none h-24 pb-8 resize-none" 
                value={valuePromise.customerJobs} onChange={e => updateField('customerJobs', e.target.value)} placeholder="¿Qué intenta resolver el cliente?" />
              <VoiceButton isTextArea onResult={(t) => handleVoice('customerJobs', t)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dolores (Pains)</label>
            <div className="relative">
              <textarea className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none h-24 pb-8 resize-none" 
                value={valuePromise.pains} onChange={e => updateField('pains', e.target.value)} placeholder="¿Qué le molesta o frustra?" />
              <VoiceButton isTextArea onResult={(t) => handleVoice('pains', t)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ganancias (Gains)</label>
            <div className="relative">
              <textarea className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none h-24 pb-8 resize-none" 
                value={valuePromise.gains} onChange={e => updateField('gains', e.target.value)} placeholder="¿Qué beneficios espera obtener?" />
              <VoiceButton isTextArea onResult={(t) => handleVoice('gains', t)} />
            </div>
          </div>
        </div>

        {/* MAPA DE VALOR */}
        <div className="bg-orange-50/30 p-6 rounded-xl border border-orange-100 space-y-4">
          <h3 className="font-bold text-lg border-b pb-2 text-[#1B1B1B]">Mapa de Valor</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Aliviadores de Dolor (Pain Relievers)</label>
            <div className="relative">
              <textarea className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none h-24 pb-8 resize-none" 
                value={valuePromise.painRelievers} onChange={e => updateField('painRelievers', e.target.value)} placeholder="¿Cómo reduces las frustraciones?" />
              <VoiceButton isTextArea onResult={(t) => handleVoice('painRelievers', t)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Creadores de Ganancias (Gain Creators)</label>
            <div className="relative">
              <textarea className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none h-24 pb-8 resize-none" 
                value={valuePromise.gainCreators} onChange={e => updateField('gainCreators', e.target.value)} placeholder="¿Cómo maximizas los beneficios?" />
              <VoiceButton isTextArea onResult={(t) => handleVoice('gainCreators', t)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Síntesis de Promesa</label>
            <div className="relative">
              <textarea className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none h-24 pb-8 resize-none bg-white border-orange-300 shadow-inner" 
                value={valuePromise.synthesis} onChange={e => updateField('synthesis', e.target.value)} placeholder="En resumen: Ayudamos a [Cliente] a [Resolver Problema] mediante [Solución] para [Beneficio Final]." />
              <VoiceButton isTextArea onResult={(t) => handleVoice('synthesis', t)} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
