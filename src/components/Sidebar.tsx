import React from 'react';
import { LayoutDashboard, Users, Target, Key, Shield, Briefcase, FileDown, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export type Module = 'dashboard' | 'userData' | 'buyerPersona' | 'archetype' | 'brandKey' | 'valuePromise' | 'marketingPlan' | 'export';

interface SidebarProps {
  currentModule: Module;
  setCurrentModule: (m: Module) => void;
  openLogin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentModule, setCurrentModule, openLogin }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'userData', label: 'Datos Básicos', icon: Briefcase },
    { id: 'buyerPersona', label: 'Buyer Personas', icon: Users },
    { id: 'archetype', label: 'Arquetipo', icon: Target },
    { id: 'brandKey', label: 'Brand Key', icon: Key },
    { id: 'valuePromise', label: 'Promesa de Valor', icon: Shield },
    { id: 'marketingPlan', label: 'Plan de Marketing', icon: LayoutDashboard },
    { id: 'export', label: 'Generar Reporte', icon: FileDown },
  ];

  return (
    <div className="w-72 bg-[#1B1B1B] text-white min-h-screen flex flex-col shadow-2xl z-20">
      <div className="p-8 pb-6 flex flex-col items-center border-b border-white/5 relative overflow-hidden">
        {/* Animated Tech Logo */}
        
        <h1 className="text-xl font-bold tracking-[0.15em] text-white">
          SIMART<span className="text-[#FF6D2A] font-light">KETING</span>
        </h1>
        <p className="text-[9px] text-[#A5A5A5] mt-1.5 uppercase tracking-[0.3em] font-medium opacity-80">
          El estratega eres tú
        </p>

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D2A] opacity-[0.03] blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      </div>
      
      <div className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentModule(item.id as Module)}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative group overflow-hidden ${
              currentModule === item.id ? 'bg-[#FF6D2A]/10 text-white shadow-sm border border-[#FF6D2A]/20' : 'text-[#A5A5A5] hover:text-white hover:bg-white/5'
            }`}
          >
            {/* Hover Tech Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>

            {currentModule === item.id && (
              <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF6D2A] rounded-r-md shadow-[0_0_10px_rgba(255,109,42,0.8)]" />
            )}
            <item.icon className={`w-5 h-5 transition-colors duration-300 ${currentModule === item.id ? 'text-[#FF6D2A]' : 'group-hover:text-[#FF6D2A]'}`} />
            <span className="font-medium text-sm tracking-wide z-10">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="p-5 border-t border-white/5 flex flex-col gap-4">
         {!user ? (
           <button 
             onClick={openLogin}
             className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#FF6D2A] to-[#FF7600] hover:from-[#FF7600] hover:to-[#FF6D2A] text-white px-4 py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all font-semibold text-sm transform hover:-translate-y-0.5"
           >
             <LogIn className="w-4 h-4" />
             <span>Iniciar Sesión</span>
           </button>
         ) : (
           <div className="flex flex-col gap-2 w-full">
             <div className="flex items-center gap-3 overflow-hidden bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="w-8 h-8 rounded-full bg-[#FF6D2A] flex items-center justify-center flex-shrink-0">
                  {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" /> : <UserIcon className="w-4 h-4 text-white" />}
                </div>
                <div className="flex flex-col overflow-hidden text-left">
                  <span className="text-sm font-semibold text-white truncate">{user.displayName || 'Estratega'}</span>
                  <span className="text-xs text-[#A5A5A5] truncate">{user.email}</span>
                </div>
             </div>
             
             <button 
               onClick={logout} 
               className="w-full flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 hover:text-red-400 px-4 py-2.5 rounded-xl transition-all font-semibold text-xs"
             >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
             </button>
           </div>
         )}
         
         <div className="flex flex-col items-center gap-2 mt-2">
           <div className="w-8 h-1 bg-gradient-to-r from-transparent via-[#FF6D2A] to-transparent rounded-full opacity-50"></div>
           <span className="text-[10px] text-[#A5A5A5] uppercase tracking-[0.2em] font-bold">Powered by Gemini</span>
         </div>
      </div>
    </div>
  );
};
