import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Target } from 'lucide-react';
import { LISTA_ARQUETIPOS } from '../../constants';

export const BrandArchetypeModule = () => {
  const { brandArchetype, setBrandArchetype } = useAppContext();

  const updateField = (field: keyof typeof brandArchetype, value: string) => {
    setBrandArchetype({ ...brandArchetype, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#1B1B1B] to-[#2A2A2A] p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Target className="w-6 h-6 text-[#FF6D2A]" /> Arquetipo de Marca</h2>
        <p className="text-blue-100 mt-1">Define la personalidad y comportamiento de tu marca en el entorno digital.</p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arquetipo Dominante</label>
            <select className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none" 
              value={brandArchetype.dominant} onChange={e => updateField('dominant', e.target.value)}>
              <option value="">Selecciona uno...</option>
              {LISTA_ARQUETIPOS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arquetipo Secundario</label>
            <select className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none" 
              value={brandArchetype.secondary} onChange={e => updateField('secondary', e.target.value)}>
              <option value="">Selecciona uno...</option>
              {LISTA_ARQUETIPOS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sector / Industria</label>
            <input type="text" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none" 
              value={brandArchetype.sector} onChange={e => updateField('sector', e.target.value)} placeholder="Ej: Tecnología B2B" />
          </div>
        </div>

        <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Distribución de Personalidad (%)</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-1/3 text-sm text-gray-600">Porcentaje Dominante (P1)</span>
              <input type="text" className="flex-1 border p-2 rounded focus:border-[#FF6D2A] outline-none" value={brandArchetype.p1} onChange={e => updateField('p1', e.target.value)} placeholder="70%" />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-1/3 text-sm text-gray-600">Porcentaje Secundario (P2)</span>
              <input type="text" className="flex-1 border p-2 rounded focus:border-[#FF6D2A] outline-none" value={brandArchetype.p2} onChange={e => updateField('p2', e.target.value)} placeholder="20%" />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-1/3 text-sm text-gray-600">Porcentaje Terciario (P3)</span>
              <input type="text" className="flex-1 border p-2 rounded focus:border-[#FF6D2A] outline-none" value={brandArchetype.p3} onChange={e => updateField('p3', e.target.value)} placeholder="10%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
