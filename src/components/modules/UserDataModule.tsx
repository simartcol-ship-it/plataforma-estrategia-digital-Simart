import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Briefcase, Building, Mail, User } from 'lucide-react';

export const UserDataModule = () => {
  const { userData, setUserData } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#1B1B1B] to-[#2A2A2A] p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Briefcase className="w-6 h-6 text-[#FF6D2A]" /> Datos del Proyecto</h2>
        <p className="text-blue-100 mt-1">Configura la información básica de la empresa y el responsable.</p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" name="nombre" value={userData.nombre} onChange={handleChange}
              className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-[#FF6D2A] focus:border-transparent outline-none transition" placeholder="Juan Pérez" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="email" name="email" value={userData.email} onChange={handleChange}
              className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-[#FF6D2A] focus:border-transparent outline-none transition" placeholder="juan@empresa.com" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa / Marca</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" name="empresa" value={userData.empresa} onChange={handleChange}
              className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-[#FF6D2A] focus:border-transparent outline-none transition" placeholder="Simart Corp" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" name="cargo" value={userData.cargo} onChange={handleChange}
              className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-[#FF6D2A] focus:border-transparent outline-none transition" placeholder="Director de Marketing" />
          </div>
        </div>
      </div>
    </div>
  );
};
