import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar, Module } from './components/Sidebar';
import { UserDataModule } from './components/modules/UserDataModule';
import { BuyerPersonaModule } from './components/modules/BuyerPersonaModule';
import { BrandArchetypeModule } from './components/modules/BrandArchetypeModule';
import { BrandKeyModule } from './components/modules/BrandKeyModule';
import { ValuePromiseModule } from './components/modules/ValuePromiseModule';
import { MarketingPlanModule } from './components/modules/MarketingPlanModule';
import { ExportModule } from './components/modules/ExportModule';
import { LoginModal } from './components/LoginModal';
import { useAuth } from './context/AuthContext';

import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, Sparkles, Map, LogIn, Menu } from 'lucide-react';

const DashboardSummary = ({ openLogin }: { openLogin: () => void }) => {
  const { user } = useAuth();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="bg-[#F8F9FA] rounded-[2rem] shadow-2xl border border-gray-200/60 overflow-hidden"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#1b1b1b] to-[#151515] p-12 md:p-16 text-center relative overflow-hidden border-b border-gray-800">
        {/* Animated Background Tech Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-[#FF6D2A] rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-[#a5a5a5] rounded-full blur-[120px]"
          />
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDAuNWg2ME0wIDYwaDYwTTAuNSAwVjYwTTYwIDBWNjAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgLz48L3N2Zz4=')]"></div>
        </div>
        
        <motion.div variants={itemVariants} className="relative z-10 flex flex-col items-center">
           <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
             SIMART<span className="text-[#A5A5A5] font-light">KETING</span>
           </h2>
           <motion.div 
             initial={{ width: 0 }} 
             animate={{ width: "60px" }} 
             transition={{ delay: 0.5, duration: 0.8 }}
             className="h-1 bg-[#FF6D2A] rounded-full mb-8 shadow-[0_0_15px_rgba(255,109,42,0.6)]"
           />
           <p className="text-xl md:text-2xl font-light text-gray-200 max-w-4xl mx-auto leading-relaxed">
             El estratega eres <strong className="text-[#FF6D2A] font-semibold">tú</strong>, la potencia es la <strong className="text-[#FF6D2A] font-semibold">IA</strong>.
           </p>
           <p className="text-[#A5A5A5] mt-5 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed mb-8">
             No le dejes el futuro de tu negocio a un algoritmo. Domina el marketing estratégico con el poder de Gemini y recupera el control de tu marca.
           </p>
           
           {!user ? (
             <button 
               onClick={openLogin}
               className="flex items-center gap-3 bg-gradient-to-r from-[#1B1B1B] to-[#2A2A2A] border border-[#FF6D2A]/50 hover:border-[#FF6D2A] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,109,42,0.15)] hover:shadow-[0_0_30px_rgba(255,109,42,0.3)] transition-all transform hover:-translate-y-1"
             >
               <LogIn className="w-5 h-5 text-[#FF6D2A]" />
               <span>Iniciar sesión para comenzar</span>
             </button>
           ) : (
             <div className="inline-block bg-[#1B1B1B] text-white px-8 py-4 rounded-full font-bold text-xl border border-[#A5A5A5]/20 shadow-lg">
               ¡Bienvenido, <span className="text-[#FF6D2A]">{user.displayName || user.email?.split('@')[0] || 'Estratega'}</span>!
             </div>
           )}
        </motion.div>
      </div>

      {/* Content Cards Section */}
      <div className="p-8 md:p-14 space-y-10">
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group p-8 bg-gradient-to-br from-white to-orange-50/30 rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-[#FF6D2A]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1B1B1B] mb-4">
              Toma el control
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed font-light">
              Define tu estrategia con criterio humano; no permitas que la IA decida por ti, <strong className="text-[#FF6D2A] font-medium">deja que trabaje para ti.</strong>
            </p>
          </div>

          <div className="group p-8 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-[#1B1B1B] mb-4">
              Inteligencia a tu servicio
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed font-light">
              Gracias a la integración con <strong className="text-blue-600 font-medium">Gemini</strong>, entender qué pasos dar para tener éxito es más fácil, rápido y preciso.
            </p>
          </div>
        </motion.div>

        {/* Feature Wide Card */}
        <motion.div variants={itemVariants} className="bg-[#1b1b1b] text-white p-10 md:p-14 rounded-3xl relative overflow-hidden group shadow-xl">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#FF6D2A]/10 rounded-full blur-3xl group-hover:bg-[#FF6D2A]/20 transition-colors duration-700"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#a5a5a5]/10 rounded-full blur-3xl group-hover:bg-[#a5a5a5]/20 transition-colors duration-700"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
             <div className="inline-flex items-center justify-center p-3.5 bg-white/5 rounded-2xl mb-2 backdrop-blur-sm border border-white/10 shadow-lg">
               <TrendingUp className="w-8 h-8 text-[#FF6D2A]" />
             </div>
             <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">De la teoría a la <span className="text-[#FF6D2A]">acción</span></h3>
             <div className="space-y-4">
               <p className="text-[#A5A5A5] text-lg md:text-xl leading-relaxed font-light">
                 Diseñada para emprendedores, Pymes y estudiantes que buscan resultados reales, <strong className="text-white font-medium">Simartketing</strong> es la plataforma que transforma la complejidad digital en una hoja de ruta clara.
               </p>
               <p className="text-[#A5A5A5] text-lg md:text-xl leading-relaxed font-light">
                 Una interfaz intuitiva que te guía para que cada campaña y cada mensaje acerquen tu proyecto a la meta definitiva.
               </p>
             </div>
          </div>
        </motion.div>

        {/* Footer Call to Action */}
        <motion.div variants={itemVariants} className="text-center pt-8 pb-4">
          <div className="inline-flex items-center justify-center p-4 bg-orange-50 rounded-full mb-6">
             <Map className="w-8 h-8 text-[#FF6D2A]" />
          </div>
          <h4 className="text-2xl md:text-3xl font-extrabold text-[#1B1B1B] mb-4 tracking-tight">
            Empieza hoy a construir una marca con propósito
          </h4>
          <p className="text-[#A5A5A5] text-xl font-medium">
            Tú pones la meta, <span className="text-[#FF6D2A]">Simartketing</span> te da el mapa.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const MainLayout = () => {
  const [currentModule, setCurrentModule] = useState<Module>('dashboard');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <DashboardSummary openLogin={() => setIsLoginModalOpen(true)} />;
      case 'userData': return <UserDataModule />;
      case 'buyerPersona': return <BuyerPersonaModule />;
      case 'archetype': return <BrandArchetypeModule />;
      case 'brandKey': return <BrandKeyModule />;
      case 'valuePromise': return <ValuePromiseModule />;
      case 'marketingPlan': return <MarketingPlanModule />;
      case 'export': return <ExportModule />;
      default: return <DashboardSummary openLogin={() => setIsLoginModalOpen(true)} />;
    }
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen font-sans text-[#1B1B1B]">
      <Sidebar 
        currentModule={currentModule} 
        setCurrentModule={setCurrentModule} 
        openLogin={() => setIsLoginModalOpen(true)} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-[#1B1B1B] text-white p-4 flex items-center justify-between shadow-md z-10 border-b border-[#FF6D2A]/20">
          <h1 className="text-xl font-bold tracking-[0.15em] ml-2">
            SIMART<span className="text-[#FF6D2A] font-light">KETING</span>
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 bg-white/10 rounded-lg text-[#FF6D2A] hover:bg-white/20 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 md:py-8 md:px-8 xl:px-12 w-full">
            {renderModule()}
          </div>
        </div>
      </main>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
