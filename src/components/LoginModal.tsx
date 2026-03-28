import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, LogIn, Chrome, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [authMethod, setAuthMethod] = useState<'selection' | 'email'>('selection');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error de autenticación. Verifica tus datos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      // La página navegará hacia Google, por lo que el código posterior no se ejecutará
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google.');
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1B1B1B]/80 backdrop-blur-sm z-50 flex items-center justify-center"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="relative h-32 bg-[#1B1B1B] p-6 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FF6D2A] rounded-full blur-3xl opacity-20"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#A5A5A5] rounded-full blur-3xl opacity-20"></div>
                </div>
                <img src="/logo.png" alt="Simartketing Logo" className="relative z-10 h-10 w-auto object-contain" />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20 bg-white/5 p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {authMethod === 'selection' ? (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-[#1B1B1B] mb-2">Bienvenido Estratega</h3>
                      <p className="text-gray-500 font-light text-sm">Elige cómo deseas iniciar sesión para guardar tu progreso estratégico.</p>
                    </div>

                    <button
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-[#1B1B1B] font-medium px-4 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group disabled:opacity-50"
                    >
                      <Chrome className="w-5 h-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                      {isLoading ? 'Cargando...' : 'Continuar con Google'}
                    </button>

                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-light">o continuar con</span>
                      <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <button
                      onClick={() => setAuthMethod('email')}
                      className="w-full flex items-center justify-center gap-3 bg-[#1B1B1B] text-white font-medium px-4 py-3.5 rounded-xl hover:bg-[#2A2A2A] transition-all shadow-md hover:shadow-lg"
                    >
                      <Mail className="w-5 h-5" />
                      Correo y Contraseña
                    </button>
                    
                    {error && (
                      <div className="flex items-center gap-2 text-red-500 text-sm mt-4 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <motion.form 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    onSubmit={handleAuth} 
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <button
                        type="button"
                        onClick={() => { setAuthMethod('selection'); setError(''); }}
                        className="text-sm text-gray-500 hover:text-[#FF6D2A] transition-colors"
                      >
                        ← Volver
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF6D2A] focus:ring-2 focus:ring-[#FF6D2A]/20 transition-all outline-none"
                          placeholder="tu@correo.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF6D2A] focus:ring-2 focus:ring-[#FF6D2A]/20 transition-all outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-end text-sm">
                      <button
                        type="button"
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-gray-500 hover:text-[#1B1B1B] transition-colors underline decoration-gray-300 underline-offset-4"
                      >
                        {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-[#FF6D2A] hover:bg-[#FF7600] text-white font-bold px-4 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/30 mt-8 disabled:opacity-50"
                    >
                      {isRegister ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                      {isLoading ? 'Procesando...' : isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    </button>
                  </motion.form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
