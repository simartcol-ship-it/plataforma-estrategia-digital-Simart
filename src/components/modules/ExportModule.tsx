import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { FileDown, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { generateStrategicPDF } from '../../utils/pdfGenerator';

export const ExportModule = () => {
  const { userData, buyerPersonas, brandArchetype, brandKey, valuePromise, marketingPlan } = useAppContext();
  const [status, setStatus] = useState<'idle' | 'generating' | 'success'>('idle');

  const handleExport = async () => {
    setStatus('generating');
    try {
      await generateStrategicPDF(userData, buyerPersonas);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      alert('Error crítico al generar el PDF. Revisa la consola para más detalles.');
      setStatus('idle');
    }
  };

  const isDataValid = () => {
    if (!userData.empresa) return false;
    return true; // Simplified validation
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-center">
      <div className="bg-gradient-to-r from-[#1B1B1B] to-[#2A2A2A] p-10 text-white flex flex-col items-center">
        <FileDown className="w-16 h-16 text-[#FF6D2A] mb-4" />
        <h2 className="text-3xl font-bold">Generación de Reporte Estratégico</h2>
        <p className="text-blue-100 mt-2 max-w-lg">Consolida toda la información recopilada en los diferentes módulos y descarga el manual completo en formato PDF pre-diseñado.</p>
      </div>
      
      <div className="p-10">
        {!isDataValid() ? (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-lg inline-block text-sm border border-amber-200">
            <strong>Advertencia:</strong> Debes ingresar al menos el Nombre de la Empresa en Datos Básicos para generar el reporte.
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-600 max-w-xl mx-auto">
              El reporte incluirá todas las facetas del negocio: {buyerPersonas.length} Buyer Personas, Arquetipo de Marca, Brand Key, Promesa de Valor y Plan de Marketing.
            </p>
            <button 
              onClick={handleExport}
              disabled={status === 'generating'}
              className={`px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-3 mx-auto min-w-[300px]
                ${status === 'generating' ? 'bg-gray-400 cursor-not-allowed text-white' : 
                  status === 'success' ? 'bg-green-500 text-white hover:bg-green-600' : 
                  'bg-[#FF6D2A] text-white hover:bg-orange-600 hover:shadow-orange-200 hover:-translate-y-1'}`}
            >
              {status === 'generating' && <RefreshCcw className="w-6 h-6 animate-spin" />}
              {status === 'success' && <CheckCircle2 className="w-6 h-6" />}
              {status === 'idle' && <FileDown className="w-6 h-6" />}
              
              {status === 'generating' ? 'Generando PDF...' : 
               status === 'success' ? '¡PDF Descargado!' : 
               'Descargar Reporte en PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
