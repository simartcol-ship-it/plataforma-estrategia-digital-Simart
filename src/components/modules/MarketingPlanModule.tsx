import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { LayoutDashboard, Plus, Trash2 } from 'lucide-react';

export const MarketingPlanModule = () => {
  const { marketingPlan, setMarketingPlan } = useAppContext();
  const [newGoal, setNewGoal] = useState('');

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setMarketingPlan({ ...marketingPlan, goals: [...marketingPlan.goals, newGoal.trim()] });
    setNewGoal('');
  };

  const removeGoal = (index: number) => {
    const goals = [...marketingPlan.goals];
    goals.splice(index, 1);
    setMarketingPlan({ ...marketingPlan, goals });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#1B1B1B] to-[#2A2A2A] p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2"><LayoutDashboard className="w-6 h-6 text-[#FF6D2A]" /> Plan de Marketing</h2>
        <p className="text-blue-100 mt-1">Establece los objetivos estratégicos de marketing de la marca.</p>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Comercial de la Marca</label>
          <input type="text" className="w-full max-w-md border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none" 
            value={marketingPlan.brandName} onChange={e => setMarketingPlan({ ...marketingPlan, brandName: e.target.value })} placeholder="Ingresa el nombre de la campaña o marca" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos de Marketing (SMART)</label>
          <div className="flex gap-2 max-w-xl">
            <input 
              type="text" 
              className="flex-1 border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none" 
              value={newGoal} 
              onChange={e => setNewGoal(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && addGoal()}
              placeholder="Ej: Aumentar leads calificados en un 20% en 3 meses" 
            />
            <button onClick={addGoal} className="bg-[#FF6D2A] text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2">
              <Plus className="w-5 h-5"/> Agregar
            </button>
          </div>
        </div>

        {marketingPlan.goals.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3">Lista de Objetivos</h3>
            <ul className="space-y-2">
              {marketingPlan.goals.map((goal, idx) => (
                <li key={idx} className="flex justify-between items-center bg-white p-3 rounded-md border shadow-sm">
                  <span className="text-gray-700 text-sm">{goal}</span>
                  <button onClick={() => removeGoal(idx)} className="text-red-400 hover:text-red-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
