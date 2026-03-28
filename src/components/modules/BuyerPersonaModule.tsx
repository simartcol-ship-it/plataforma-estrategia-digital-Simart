import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Plus, Trash2, Wand2, Bot, User as UserIcon, Image as ImageIcon, Upload, ArrowLeft, Edit3, Grid, Download } from 'lucide-react';
import { geminiService } from '../../services/gemini';
import { BuyerPersona } from '../../types';
import { VoiceButton } from '../VoiceButton';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

type ViewMode = 'list' | 'choice' | 'ai-setup' | 'edit';

export const BuyerPersonaModule = () => {
  const { buyerPersonas, setBuyerPersonas } = useAppContext();
  const [view, setView] = useState<ViewMode>('choice');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // AI Setup State
  const [aiSetup, setAiSetup] = useState({ sector: '', producto: '', descripcion: '' });

  const createManual = () => {
    const newId = Date.now().toString();
    const newPersona: BuyerPersona = {
      id: newId, isAI: false,
      nombreAvatar: 'Nuevo Perfil Manual', edad: '', ubicacion: '', ocupacion: '', cita: '',
      metas: '', dolores: '', valores: '', miedos: '', redesSociales: '',
      keywords: '', formatoContenido: '', competencia: '', arquetipoRelacionado: ''
    };
    setBuyerPersonas([newPersona, ...buyerPersonas]);
    setEditingId(newId);
    setView('edit');
  };

  const createWithAI = async () => {
    setLoading(true);
    try {
      const generatedData = await geminiService.generateBuyerPersona(aiSetup.sector, aiSetup.producto, aiSetup.descripcion);
      const newId = Date.now().toString();
      const newPersona: BuyerPersona = {
        id: newId, isAI: true,
        ...generatedData,
        nombreAvatar: generatedData.nombreAvatar || 'Perfil IA',
        edad: generatedData.edad || '', ubicacion: generatedData.ubicacion || '', ocupacion: generatedData.ocupacion || '', cita: generatedData.cita || '',
        metas: generatedData.metas || '', dolores: generatedData.dolores || '', valores: generatedData.valores || '', miedos: generatedData.miedos || '',
        redesSociales: generatedData.redesSociales || '', keywords: generatedData.keywords || '', formatoContenido: generatedData.formatoContenido || '',
        competencia: generatedData.competencia || '', arquetipoRelacionado: generatedData.arquetipoRelacionado || ''
      };
      setBuyerPersonas([newPersona, ...buyerPersonas]);
      setEditingId(newId);
      setView('edit');
      setAiSetup({ sector: '', producto: '', descripcion: '' });
    } catch (error) {
      console.error(error);
      alert("Error generando con IA. Verifica tu clave de Gemini.");
    }
    setLoading(false);
  };

  const removePersona = (id: string, e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    if(window.confirm('¿Estás seguro de eliminar este Buyer Persona?')) {
      const updated = buyerPersonas.filter(p => p.id !== id);
      setBuyerPersonas(updated);
      if (editingId === id) setView(updated.length > 0 ? 'list' : 'choice');
      else if (updated.length === 0) setView('choice');
    }
  };

  const updatePersona = (id: string, field: keyof BuyerPersona, value: any) => {
    setBuyerPersonas(buyerPersonas.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updatePersona(id, 'imageUrl', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateAIPromptForImage = async (persona: BuyerPersona) => {
    setLoading(true);
    try {
      const url = await geminiService.generateBuyerPersonaImage({
        edad: persona.edad,
        ocupacion: persona.ocupacion,
        ubicacion: persona.ubicacion
      });
      updatePersona(persona.id, 'imageUrl', url);
    } catch (error) {
      console.error("Error generando imagen con IA:", error);
      alert("Error en el servicio de imágenes. Intenta subir una foto manualmente.");
    }
    setLoading(false);
  };

  const isFormComplete = (p: BuyerPersona) => {
    const requiredFields = ['nombreAvatar','edad','ubicacion','ocupacion','cita','metas','dolores','valores','miedos','redesSociales','keywords','formatoContenido','competencia'];
    return requiredFields.every(field => {
      const val = (p as any)[field];
      return val && val.trim().length > 0;
    });
  };

  const analyzeProfileAI = async (id: string) => {
    const persona = buyerPersonas.find(p => p.id === id);
    if (!persona) return;
    setLoading(true);
    try {
      const result = await geminiService.analyzeBuyerPersonaProfile(persona);
      updatePersona(id, 'aiAnalysis', result);
    } catch (error) {
      console.error(error);
      alert("Error analizando con IA. Verifica tu configuración.");
    }
    setLoading(false);
  };

  const downloadPDF = async (persona: BuyerPersona, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    console.log("Iniciando generación de PDF auto-descargable...");
    
    try {
      const originalNode = document.getElementById(`pdf-template-${persona.id}`);
      if (!originalNode) throw new Error("Plantilla no encontrada");
      
      // Creamos un CLON EXACTO puro en el DOM raíz para evadir los bugs de visibilidad de React
      const printContainer = document.createElement('div');
      printContainer.id = 'print-container-safeboot';
      printContainer.style.background = 'white';
      printContainer.style.position = 'absolute';
      printContainer.style.top = '0';
      printContainer.style.left = '0';
      printContainer.style.width = '1200px';
      printContainer.style.zIndex = '-9999'; // oculto detrás del body pero renderizable
      
      const clone = originalNode.cloneNode(true) as HTMLElement;
      clone.style.display = 'block';
      clone.style.width = '1200px';
      
      printContainer.appendChild(clone);
      document.body.appendChild(printContainer);
      
      // Esperar que el navegador dibuje los elementos
      await new Promise(r => setTimeout(r, 200));

      let canvas;
      try {
        // Intento 1: Capturar con Imágenes activando CORS Proxy Nativo
        canvas = await html2canvas(printContainer, { 
          scale: 1.5, 
          useCORS: true, 
          allowTaint: false, 
          windowWidth: 1200,
          backgroundColor: '#ffffff'
        });
      } catch (err) {
        console.warn("Error gráfico de seguridad al cargar imágenes. Limpiando avatares...", err);
        // Si el firewall del antivirus o navegador tira un "Tainted Canvas Fatal Error":
        // Ocultamos todas las imágenes problemáticas del clon e intentamos de nuevo.
        const images = printContainer.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++) {
            images[i].style.display = 'none';
        }
        canvas = await html2canvas(printContainer, { 
          scale: 1.5, 
          useCORS: false, 
          windowWidth: 1200,
          backgroundColor: '#ffffff'
        });
      }

      if (!canvas || canvas.width === 0) throw new Error("Canvas vacío");

      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      
      // Construir y disparar la descarga directa
      const pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`BuyerPersona_${persona.nombreAvatar || 'Estrategia'}.pdf`);
      
      // Limpieza segura
      document.body.removeChild(printContainer);
      console.log("PDF Archivo descargado exitosamente");

    } catch (error) {
      console.error("Fallo Definitivo:", error);
      alert('Tu red está bloqueando severamente la exportación directa. El archivo no se pudo guardar.');
      
      // Failsafe de borrado
      const oldContainer = document.getElementById('print-container-safeboot');
      if (oldContainer) document.body.removeChild(oldContainer);
    }
    setLoading(false);
  };

  // --- VIEWS ---

  if (view === 'choice') {
    return (
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto mt-10 space-y-3">
          <h2 className="text-3xl font-bold text-[#1B1B1B]">Crea tu Buyer Persona</h2>
          <p className="text-gray-500">Define a tu cliente ideal para conectar estratégicamente con su mente y corazón.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
          {/* Manual Option */}
          <div onClick={createManual} className="bg-white p-8 rounded-2xl border-2 border-transparent hover:border-[#FF6D2A] hover:shadow-xl cursor-pointer transition-all group flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UserIcon className="text-blue-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Crearlo Manualmente</h3>
            <p className="text-sm font-semibold text-blue-600 mb-3">Ideal si ya conoces a tu audiencia.</p>
            <p className="text-sm text-gray-500">Define a tu cliente ideal utilizando tus propios datos y hallazgos psicográficos. Esta opción te permite un perfilado 100% ajustado a tu realidad. Es el camino para quienes buscan precisión absoluta.</p>
          </div>

          {/* AI Option */}
          <div onClick={() => setView('ai-setup')} className="bg-white p-8 rounded-2xl border-2 border-transparent hover:border-[#FF6D2A] hover:shadow-[0_0_30px_rgba(255,109,42,0.15)] cursor-pointer transition-all group flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FF6D2A]/10 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wand2 className="text-[#FF6D2A] w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#1B1B1B]">Crearlo con IA</h3>
            <p className="text-sm font-semibold text-[#FF6D2A] mb-3">Ideal si estás empezando o te falta información.</p>
            <p className="text-sm text-gray-500">Deja que la IA analice tendencias y proponga un perfil basado en el mercado. La IA te da el punto de partida, tú le das la realidad. Deberás validar y ajustar estos datos.</p>
          </div>
        </div>
        
        {buyerPersonas.length > 0 && (
          <div className="text-center mt-10">
            <button onClick={() => setView('list')} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors flex items-center gap-2 mx-auto">
              <Grid className="w-4 h-4" /> Ver mi Dashboard de Perfiles ({buyerPersonas.length})
            </button>
          </div>
        )}
      </div>
    );
  }

  if (view === 'ai-setup') {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <button onClick={() => setView('choice')} className="flex items-center gap-2 text-gray-400 hover:text-gray-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a Opciones
        </button>
        <h2 className="text-2xl font-bold text-[#1B1B1B] mb-2 flex items-center gap-2"><Bot className="text-[#FF6D2A]" /> Asistente de Creación IA</h2>
        <p className="text-gray-500 mb-6">Solo dame 3 datos clave y construiré un prospecto completo de cliente ideal para ti.</p>
        
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold mb-1">Sector de la empresa</label><input type="text" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none" placeholder="Ej: Tecnología, Salud, Gastronomía" value={aiSetup.sector} onChange={e => setAiSetup({...aiSetup, sector: e.target.value})} /></div>
          <div><label className="block text-sm font-semibold mb-1">Tu Producto o Servicio principal</label><input type="text" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none" placeholder="Ej: Software de contabilidad para pymes" value={aiSetup.producto} onChange={e => setAiSetup({...aiSetup, producto: e.target.value})} /></div>
          <div><label className="block text-sm font-semibold mb-1">Descripción corta de a quién deseas atraer</label><textarea className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] outline-none h-24 resize-none" placeholder="Ej: Dueños de negocios tradicionales que quieren digitalizarse pero les da miedo la tecnología." value={aiSetup.descripcion} onChange={e => setAiSetup({...aiSetup, descripcion: e.target.value})} /></div>
        </div>

        <button onClick={createWithAI} disabled={!aiSetup.sector || !aiSetup.producto || !aiSetup.descripcion || loading} className="w-full mt-6 bg-gradient-to-r from-[#FF6D2A] to-[#FF7600] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 transition-all">
          {loading ? <span className="animate-pulse">Diseñando Perfil Psicológico...</span> : <><Wand2 className="w-5 h-5" /> Generar Buyer Persona Total</>}
        </button>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
         <div>
           <h2 className="text-3xl font-bold text-[#1B1B1B] flex items-center gap-2">
             <Grid className="text-[#FF6D2A]" /> Dashboard de Buyer Personas
           </h2>
           <p className="text-gray-500 text-sm mt-1">Gestiona y analiza todos los perfiles de tu audiencia.</p>
         </div>
         <button onClick={() => setView('choice')} className="bg-[#1B1B1B] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#1a384f] transition shadow-md">
           <Plus className="w-4 h-4" /> Crear Nuevo Perfil
         </button>
        </div>

        {buyerPersonas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-500">
            No tienes ningún Buyer Persona guardado. Haz clic en "Crear Nuevo Perfil".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyerPersonas.map((persona) => (
              <div key={persona.id} onClick={() => { setEditingId(persona.id); setView('edit'); }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center hover:shadow-xl hover:border-[#FF6D2A]/30 transition-all cursor-pointer group relative">
                
                <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={(e) => downloadPDF(persona, e)} className="p-2 bg-white rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 shadow-sm" title="Descargar PDF"><Download className="w-4 h-4" /></button>
                  <button onClick={(e) => removePersona(persona.id, e)} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                </div>

                <div className="w-24 h-24 rounded-full bg-gray-50 border-4 border-white shadow-md overflow-hidden mb-4 relative flex items-center justify-center">
                  {persona.imageUrl ? <img src={persona.imageUrl} alt="Avatar" className="w-full h-full object-cover" /> : <UserIcon className="w-12 h-12 text-gray-300" />}
                </div>
                
                <h3 className="text-lg font-bold text-[#1B1B1B] text-center w-full truncate">{persona.nombreAvatar || 'Perfil Sin Nombre'}</h3>
                <p className="text-sm text-gray-500 text-center w-full truncate mb-3">{persona.ocupacion || 'Sin ocupación'}</p>
                
                <div className="mb-4">
                  {persona.isAI ? 
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-[#FF6D2A] text-[10px] font-bold tracking-widest uppercase"><Wand2 className="w-3 h-3" /> Creado con IA</span>
                  :
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-widest uppercase"><Edit3 className="w-3 h-3" /> Manual</span>
                  }
                </div>

                <div className="w-full pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400 font-semibold">
                  <span>{persona.edad ? `${persona.edad} años` : '-- años'}</span>
                  <span>{persona.aiAnalysis ? '✅ Analizado' : '⏳ Pendiente'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // BIG EDITOR VIEW
  const persona = buyerPersonas.find(p => p.id === editingId);
  if (!persona) return null;
  const complete = isFormComplete(persona);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={() => setView('list')} className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" /> Volver al Dashboard
        </button>
        <div className="flex items-center gap-3">
          {persona.isAI && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-[#FF6D2A] text-[10px] font-bold tracking-widest uppercase"><Wand2 className="w-3 h-3" /> Generado por IA</span>}
          <button onClick={() => removePersona(persona.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Eliminar Perfil"><Trash2 className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
           <input type="text" value={persona.nombreAvatar} onChange={(e) => updatePersona(persona.id, 'nombreAvatar', e.target.value)}
              className="font-black text-3xl bg-transparent border-b-2 border-transparent focus:border-[#FF6D2A] outline-none text-[#1B1B1B] w-full max-w-2xl transition-colors" placeholder="Nombra a este Buyer Persona" />
           <p className="text-gray-400 text-sm mt-1">Modifica cualquier dato. Los cambios se guardan automáticamente.</p>
        </div>

        <div className="p-8 grid grid-cols-1 xl:grid-cols-4 gap-10">
          
          {/* Visual & Demographics (Col 1) */}
          <div className="xl:col-span-1 space-y-6">
             <div className="aspect-square rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group">
               {persona.imageUrl ? (
                 <img src={persona.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <div className="text-center p-4">
                   <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                   <p className="text-sm text-gray-500 font-medium">Foto del Perfil</p>
                 </div>
               )}
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-3 p-4">
                  <label className="cursor-pointer bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 w-full justify-center shadow-lg transition-transform hover:scale-105">
                    <Upload className="w-4 h-4" /> Subir Imagen
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(persona.id, e)} />
                  </label>
                  <button onClick={() => generateAIPromptForImage(persona)} disabled={!complete} className="bg-gradient-to-r from-[#FF6D2A] to-[#FF7600] text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center transition-all">
                    <Wand2 className="w-4 h-4 flex-shrink-0" /> Prompt IA Visual
                  </button>
               </div>
             </div>
             
             <div className="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
               <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF6D2A]"></div> Perfil Psicográfico
               </h4>
               <div><label className="text-xs font-bold text-gray-500 mb-1 block">Edad</label><input type="text" className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] focus:border-transparent text-sm outline-none transition-shadow" value={persona.edad} onChange={e => updatePersona(persona.id, 'edad', e.target.value)} /></div>
               <div><label className="text-xs font-bold text-gray-500 mb-1 block">Ubicación</label><input type="text" className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] focus:border-transparent text-sm outline-none transition-shadow" value={persona.ubicacion} onChange={e => updatePersona(persona.id, 'ubicacion', e.target.value)} /></div>
               <div><label className="text-xs font-bold text-gray-500 mb-1 block">Ocupación</label><input type="text" className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] focus:border-transparent text-sm outline-none transition-shadow" value={persona.ocupacion} onChange={e => updatePersona(persona.id, 'ocupacion', e.target.value)} /></div>
             </div>
          </div>

          {/* Core Strategy Fields (Col 2,3,4) */}
          <div className="xl:col-span-3 space-y-8">
             
             <div className="space-y-2 relative">
                <label className="font-black text-gray-800 text-sm tracking-wide">Insight Crítico / Motivación Principal (Cita Literal)</label>
                <div className="relative">
                  <input type="text" className="w-full border-2 p-4 rounded-xl focus:border-[#FF6D2A] focus:ring-4 focus:ring-[#FF6D2A]/10 outline-none pr-14 italic text-gray-700 bg-orange-50/20 border-orange-100 text-lg transition-all" value={persona.cita} onChange={e => updatePersona(persona.id, 'cita', e.target.value)} placeholder='"Necesito resolver X para poder lograr Y en mi vida..."' />
                  <VoiceButton onResult={(t) => updatePersona(persona.id, 'cita', persona.cita ? `${persona.cita} ${t}` : t)} />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <h4 className="font-black text-[#FF6D2A] text-sm uppercase tracking-widest border-b-2 border-orange-100 pb-2">Psicografía y Dolores</h4>
                   <div className="relative"><label className="text-xs font-bold text-gray-500 mb-1 block">Metas y Objetivos</label><textarea className="w-full border border-gray-200 bg-gray-50 focus:bg-white p-3 rounded-xl focus:ring-2 focus:ring-[#FF6D2A] focus:border-transparent outline-none h-28 text-sm pb-10 resize-none transition-all shadow-inner" value={persona.metas} onChange={e => updatePersona(persona.id, 'metas', e.target.value)} /><VoiceButton isTextArea onResult={(t) => updatePersona(persona.id, 'metas', persona.metas ? `${persona.metas} ${t}` : t)} /></div>
                   <div className="relative"><label className="text-xs font-bold text-gray-500 mb-1 block">Dolores Profundos</label><textarea className="w-full border border-gray-200 bg-gray-50 focus:bg-white p-3 rounded-xl focus:ring-2 focus:ring-[#FF6D2A] focus:border-transparent outline-none h-28 text-sm pb-10 resize-none transition-all shadow-inner" value={persona.dolores} onChange={e => updatePersona(persona.id, 'dolores', e.target.value)} /><VoiceButton isTextArea onResult={(t) => updatePersona(persona.id, 'dolores', persona.dolores ? `${persona.dolores} ${t}` : t)} /></div>
                </div>

                <div className="space-y-4">
                   <h4 className="font-black text-[#FF6D2A] text-sm uppercase tracking-widest border-b-2 border-orange-100 pb-2">Comportamiento</h4>
                   <div className="relative"><label className="text-xs font-bold text-gray-500 mb-1 block">Valores de vida</label><textarea className="w-full border border-gray-200 bg-gray-50 focus:bg-white p-3 rounded-xl focus:ring-2 focus:ring-[#FF6D2A] focus:border-transparent outline-none h-28 text-sm pb-10 resize-none transition-all shadow-inner" value={persona.valores} onChange={e => updatePersona(persona.id, 'valores', e.target.value)} /><VoiceButton isTextArea onResult={(t) => updatePersona(persona.id, 'valores', persona.valores ? `${persona.valores} ${t}` : t)} /></div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="relative"><label className="text-xs font-bold text-gray-500 mb-1 block">Miedos de compra</label><input type="text" className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] focus:border-transparent text-sm outline-none transition-shadow" value={persona.miedos} onChange={e => updatePersona(persona.id, 'miedos', e.target.value)} /></div>
                     <div className="relative"><label className="text-xs font-bold text-gray-500 mb-1 block">Redes Sociales</label><input type="text" className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-[#FF6D2A] focus:border-transparent text-sm outline-none transition-shadow" value={persona.redesSociales} onChange={e => updatePersona(persona.id, 'redesSociales', e.target.value)} placeholder="Ej: Insta, TikTok" /></div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="relative"><label className="text-xs font-bold text-slate-500 mb-1 block">Keywords de Búsqueda</label><textarea className="w-full border border-white p-2.5 rounded-xl outline-none h-20 text-sm resize-none focus:ring-2 focus:ring-[#FF6D2A]" value={persona.keywords} onChange={e => updatePersona(persona.id, 'keywords', e.target.value)} placeholder="Ej: Cómo hacer X, mejor opción para Y..." /></div>
                <div className="relative"><label className="text-xs font-bold text-slate-500 mb-1 block">Formato Preferido</label><textarea className="w-full border border-white p-2.5 rounded-xl outline-none h-20 text-sm resize-none focus:ring-2 focus:ring-[#FF6D2A]" value={persona.formatoContenido} onChange={e => updatePersona(persona.id, 'formatoContenido', e.target.value)} placeholder="Ej: Videos cortos, carruseles" /></div>
                <div className="relative"><label className="text-xs font-bold text-slate-500 mb-1 block">Marcas que Consume</label><textarea className="w-full border border-white p-2.5 rounded-xl outline-none h-20 text-sm resize-none focus:ring-2 focus:ring-[#FF6D2A]" value={persona.competencia} onChange={e => updatePersona(persona.id, 'competencia', e.target.value)} placeholder="Competidores o referentes" /></div>
             </div>

             <div className="flex justify-end pt-6 border-t border-gray-100 mt-8">
               {!complete && <span className="text-xs text-red-500 mr-4 self-center font-bold bg-red-50 px-3 py-1.5 rounded-lg">Faltan campos por completar para habilitar IA</span>}
               <button onClick={() => analyzeProfileAI(persona.id)} disabled={!complete || loading} className={`px-8 py-3.5 rounded-xl flex items-center gap-2 font-bold transition-all text-sm ${complete ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/30' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                 <Wand2 className="w-5 h-5" /> {loading ? 'El Estratega IA está analizando...' : 'Realizar Análisis Profundo con IA'}
               </button>
             </div>
          </div>
        </div>

        {/* AI OUTPUT SECTION */}
        {persona.aiAnalysis && (
          <div className="bg-[#FFF5F0] border-t-4 border-[#FF6D2A] p-10">
             <h3 className="font-black text-2xl text-[#1B1B1B] mb-8 flex items-center gap-3">
               <div className="w-10 h-10 bg-[#FF6D2A]/10 rounded-full flex items-center justify-center"><Bot className="w-6 h-6 text-[#FF6D2A]" /></div>
               Tablero de Mando IA (Modificable)
             </h3>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
               <div className="space-y-2">
                  <label className="font-black text-xs text-[#FF6D2A] uppercase tracking-widest bg-orange-100/50 px-3 py-1 rounded inline-block">Descripción Master del Perfil</label>
                  <textarea style={{ textAlign: 'justify' }} className="w-full p-5 border border-orange-200 rounded-2xl bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF6D2A] outline-none min-h-[140px] text-sm text-gray-700 shadow-sm leading-relaxed" value={persona.aiAnalysis.descripcion} onChange={e => updatePersona(persona.id, 'aiAnalysis', { ...persona.aiAnalysis!, descripcion: e.target.value })} />
               </div>
               <div className="space-y-2">
                  <label className="font-black text-xs text-[#FF6D2A] uppercase tracking-widest bg-orange-100/50 px-3 py-1 rounded inline-block">¿Qué espera realmente de nosotros?</label>
                  <textarea style={{ textAlign: 'justify' }} className="w-full p-5 border border-orange-200 rounded-2xl bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF6D2A] outline-none min-h-[140px] text-sm text-gray-700 shadow-sm leading-relaxed" value={persona.aiAnalysis.queEspera} onChange={e => updatePersona(persona.id, 'aiAnalysis', { ...persona.aiAnalysis!, queEspera: e.target.value })} />
               </div>
             </div>

             <div className="space-y-2 mb-8">
               <label className="font-black text-xs text-[#FF6D2A] uppercase tracking-widest bg-orange-100/50 px-3 py-1 rounded inline-block">Investigación Competitiva Digital</label>
               <textarea style={{ textAlign: 'justify' }} className="w-full p-5 border border-orange-200 rounded-2xl bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF6D2A] outline-none min-h-[120px] text-sm text-gray-700 shadow-sm leading-relaxed" value={persona.aiAnalysis.analisisCompetencia} onChange={e => updatePersona(persona.id, 'aiAnalysis', { ...persona.aiAnalysis!, analisisCompetencia: e.target.value })} />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1 space-y-2">
                  <label className="font-black text-xs text-[#FF6D2A] uppercase tracking-widest bg-orange-100/50 px-3 py-1 rounded inline-block">Pilares de Contenido Estratégico</label>
                  <textarea style={{ textAlign: 'justify' }} className="w-full p-5 border border-orange-200 rounded-2xl bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF6D2A] outline-none min-h-[350px] text-sm text-gray-700 shadow-sm leading-relaxed whitespace-pre-wrap" value={persona.aiAnalysis.pilaresContenido} onChange={e => updatePersona(persona.id, 'aiAnalysis', { ...persona.aiAnalysis!, pilaresContenido: e.target.value })} />
               </div>
               <div className="lg:col-span-2 space-y-2">
                  <label className="font-black text-xs text-[#FF6D2A] uppercase tracking-widest bg-orange-100/50 px-3 py-1 rounded inline-block">Matriz de Contenido (20 Ideas de Atracción)</label>
                  <textarea style={{ textAlign: 'justify' }} className="w-full p-5 border border-orange-200 rounded-2xl bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF6D2A] outline-none min-h-[350px] text-sm text-gray-700 shadow-sm leading-relaxed whitespace-pre-wrap" value={persona.aiAnalysis.ideasContenido} onChange={e => updatePersona(persona.id, 'aiAnalysis', { ...persona.aiAnalysis!, ideasContenido: e.target.value })} />
               </div>
             </div>
          </div>
        )}
      </div>

      {/* --- HIDDEN PDF TEMPLATES FOR EXPORT --- */}
      <div className="fixed top-[200%] left-[-9999px] opacity-0 pointer-events-none z-[-1]">
         {buyerPersonas.map((p) => (
           <div key={`pdf-${p.id}`} id={`pdf-template-${p.id}`} style={{ width: '1200px', display: 'none', background: '#f8fafc', padding: '40px' }}>
              <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
                 {/* Header PDF */}
                 <div className="flex items-center gap-8 mb-10 pb-8 border-b-4 border-gray-100">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 bg-gray-50 flex items-center justify-center">
                       {p.imageUrl ? <img src={p.imageUrl.startsWith('data:') ? p.imageUrl : `${p.imageUrl}${p.imageUrl.includes('?') ? '&' : '?'}nocache=${Date.now()}`} crossOrigin={p.imageUrl.startsWith('data:') ? undefined : "anonymous"} alt="Avatar" className="w-full h-full object-cover" /> : <UserIcon className="w-16 h-16 text-gray-300" />}
                    </div>
                    <div>
                       <h1 className="text-5xl font-black text-[#1B1B1B] mb-2">{p.nombreAvatar || 'Perfil Sin Nombre'}</h1>
                       <div className="flex gap-4 text-gray-500 text-lg font-medium">
                          <span>{p.ocupacion || 'Sin ocupación'}</span> • 
                          <span>{p.edad ? `${p.edad} años` : '-- años'}</span> • 
                          <span>{p.ubicacion || 'Sin ubicación'}</span>
                       </div>
                    </div>
                 </div>

                 {/* Core Info Row */}
                 <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6">
                       <h3 className="text-sm font-black text-[#FF6D2A] uppercase tracking-widest mb-3">Insight Crítico (Cita)</h3>
                       <p className="text-xl italic text-gray-700 font-semibold">{p.cita || '...'}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                       <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-3">Marcas Referentes</h3>
                       <p className="text-base text-gray-700">{p.competencia || '...'}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8 mb-8">
                     <div className="space-y-6">
                        <div><h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Metas y Objetivos</h3><p className="text-sm text-gray-800 bg-gray-50 p-4 rounded-xl">{p.metas || '...'}</p></div>
                        <div><h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Dolores Profundos</h3><p className="text-sm text-gray-800 bg-gray-50 p-4 rounded-xl">{p.dolores || '...'}</p></div>
                        <div><h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Valores y Miedos</h3><p className="text-sm text-gray-800 bg-gray-50 p-4 rounded-xl border-l-4 border-red-400"><strong>Miedos:</strong> {p.miedos || '...'} <br/><br/><strong>Valores:</strong> {p.valores || '...'}</p></div>
                     </div>
                     <div className="space-y-6">
                        <div><h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Redes Sociales</h3><p className="text-sm text-gray-800 bg-gray-50 p-4 rounded-xl">{p.redesSociales || '...'}</p></div>
                        <div><h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Keywords de Búsqueda</h3><p className="text-sm text-gray-800 bg-gray-50 p-4 rounded-xl">{p.keywords || '...'}</p></div>
                        <div><h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Formato de Contenido</h3><p className="text-sm text-gray-800 bg-gray-50 p-4 rounded-xl">{p.formatoContenido || '...'}</p></div>
                     </div>
                 </div>

                 {/* AI Analysis Section */}
                 {p.aiAnalysis && (
                   <div className="mt-12 border-t border-gray-200 pt-10">
                      <div className="flex items-center gap-3 mb-8">
                         <Bot className="w-8 h-8 text-[#FF6D2A]" />
                         <h2 className="text-3xl font-black text-[#1B1B1B]">Análisis Estratégico IA</h2>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 mb-8">
                         <div className="bg-[#FFF5F0] p-6 rounded-2xl border border-orange-100">
                            <h3 className="text-xs font-black text-[#FF6D2A] uppercase tracking-widest mb-3">Descripción Master</h3>
                            <p className="text-sm text-gray-800 leading-relaxed text-justify whitespace-pre-wrap">{p.aiAnalysis.descripcion}</p>
                         </div>
                         <div className="bg-[#FFF5F0] p-6 rounded-2xl border border-orange-100">
                            <h3 className="text-xs font-black text-[#FF6D2A] uppercase tracking-widest mb-3">¿Qué Espera de Nosotros?</h3>
                            <p className="text-sm text-gray-800 leading-relaxed text-justify whitespace-pre-wrap">{p.aiAnalysis.queEspera}</p>
                         </div>
                      </div>

                      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 mb-8">
                         <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest mb-4">Investigación Competitiva Digital</h3>
                         <p className="text-sm text-gray-800 leading-relaxed text-justify whitespace-pre-wrap">{p.aiAnalysis.analisisCompetencia}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-8">
                         <div className="col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-xs font-black text-[#FF6D2A] uppercase tracking-widest mb-4">3 Pilares de Contenido</h3>
                            <p className="text-sm text-gray-800 leading-relaxed text-justify whitespace-pre-wrap">{p.aiAnalysis.pilaresContenido}</p>
                         </div>
                         <div className="col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-xs font-black text-[#FF6D2A] uppercase tracking-widest mb-4">Matriz 20 Ideas de Atracción</h3>
                            <p className="text-sm text-gray-800 leading-relaxed text-justify whitespace-pre-wrap">{p.aiAnalysis.ideasContenido}</p>
                         </div>
                      </div>
                   </div>
                 )}
              </div>
           </div>
         ))}
      </div>

    </div>
  );
};
