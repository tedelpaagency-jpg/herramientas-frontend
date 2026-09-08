'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface RightSidebarProps {
  rightSidebarOpen: boolean;
  setRightSidebarOpen: (open: boolean) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  rightSidebarOpen,
  setRightSidebarOpen,
}) => {
  const { user, currentWhiteLabel } = useAuth();
  const [isAgendarModalOpen, setIsAgendarModalOpen] = useState(false);

  const userName = user?.name ? user.name : 'Dr. Alexander Vane';
  const userPoints = user?.points !== undefined ? user.points.toLocaleString() : '15,000';

  const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some((r: any) => r.name === 'super_admin');
  const isWhiteLabelAdmin = user?.role === 'white_label_admin' || user?.roles?.some((r: any) => r.name === 'white_label_admin');

  let managerTitle = 'Gerente Comercial';
  let managerSubtitle = 'Soporte Dedicado Exclusivo';
  let managerName = 'Soporte Plataforma';
  let managerInitials = 'SP';

  if (isWhiteLabelAdmin) {
    managerTitle = 'Super Admin';
    managerSubtitle = 'Administrador General de Plataforma';
    managerName = (user as any)?.white_label?.creator?.name || (user as any)?.white_labels?.[0]?.creator?.name || 'Super Admin Platform';
    managerInitials = 'SA';
  } else if (isSuperAdmin) {
    managerTitle = 'Super Admin';
    managerSubtitle = 'Administración Global de Plataforma';
    managerName = user?.name || 'Super Admin';
    managerInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'SA';
  } else {
    // Agency users / Agency Admins
    const hostWhiteLabel = (user?.agency as any)?.white_label || currentWhiteLabel;
    const wlAdminUser = hostWhiteLabel?.users?.[0] || (user as any)?.agency?.white_label_admin;
    
    managerTitle = 'Admin Marca Blanca';
    managerSubtitle = hostWhiteLabel?.name ? `Marca Blanca ${hostWhiteLabel.name}` : 'Soporte Marca Blanca';
    managerName = wlAdminUser?.name || hostWhiteLabel?.name || 'Admin Marca Blanca';
    managerInitials = managerName.substring(0, 2).toUpperCase();
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {rightSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 2xl:hidden"
          onClick={() => setRightSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Right Sidebar Drawer */}
      <aside className={`fixed right-0 top-0 w-80 h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 z-[60] flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out ${rightSidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}`}>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setRightSidebarOpen(false)}
          className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-all active:scale-90 2xl:hidden z-10"
          aria-label="Cerrar menú secundario"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Top Section: 3D Digital Credential */}
        <div className="p-6 pt-12 2xl:pt-6 flex flex-col items-center relative">
          <div className="w-full mb-4">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Activos Digitales</h2>
            <p className="font-label-md text-on-surface-variant opacity-70">Credencial SANTUN 3D Verificada</p>
          </div>
          
          <div className="w-full py-4 perspective-[1000px]">
            <div className="relative w-full aspect-[1.58/1] preserve-3d transition-transform duration-500 hover:rotate-x-12 hover:-rotate-y-12 hover:-translate-y-2 hover:scale-105 rounded-xl cursor-pointer group shadow-xl">
              {/* Card Face */}
              <div className="w-full h-full rounded-xl overflow-hidden border border-white/20 relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white p-5 flex flex-col justify-between shadow-inner">
                 
                 {/* Top Row: Chip and Contactless */}
                 <div className="flex justify-between items-start relative z-10 w-full">
                    {/* Chip */}
                    <div className="w-11 h-8 rounded-md bg-gradient-to-br from-yellow-100 to-yellow-400 border border-yellow-600/40 flex flex-col justify-between p-1 shadow-sm opacity-90">
                       <div className="w-full h-[1px] bg-black/10"></div>
                       <div className="w-full flex justify-between">
                          <div className="w-[1px] h-2 bg-black/10"></div>
                          <div className="w-4 h-2 border border-black/10 rounded-sm"></div>
                          <div className="w-[1px] h-2 bg-black/10"></div>
                       </div>
                       <div className="w-full h-[1px] bg-black/10"></div>
                    </div>
                    {/* Contactless Icon */}
                    <span className="material-symbols-outlined text-white/70 rotate-90 text-2xl font-bold">wifi</span>
                 </div>
                 
                 {/* Middle: Brand Name */}
                 <div className="relative z-10 w-full flex justify-start items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">S</div>
                    <span className="text-lg font-extrabold tracking-widest text-white drop-shadow-sm font-sans uppercase">SANTUN</span>
                 </div>
                 
                 {/* Bottom Row: Titular & Points */}
                 <div className="relative z-10 w-full flex justify-between items-end border-t border-white/20 pt-2 pb-1">
                    <div>
                       <div className="text-[9px] uppercase tracking-widest text-white/70 mb-0.5 font-semibold">Titular</div>
                       <div className="font-bold text-sm tracking-wider uppercase truncate max-w-[160px] drop-shadow-sm">{userName}</div>
                    </div>
                    <div className="text-right">
                       <div className="text-[9px] uppercase tracking-widest text-white/70 mb-0.5 font-semibold">Puntos</div>
                       <div className="font-bold text-sm text-yellow-300 drop-shadow-sm">{userPoints}</div>
                    </div>
                 </div>

                 {/* Ambient Shine */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mx-6 border-t border-outline-variant/50"></div>

        {/* Bottom Section: Dynamic Manager Contact Card */}
        <div className="p-4 flex flex-col flex-1">
          <div className="mb-3">
            <h2 className="font-bold text-sm text-on-surface">{managerTitle}</h2>
            <p className="text-xs text-on-surface-variant opacity-80">{managerSubtitle}</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-3 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-secondary-container border border-secondary flex items-center justify-center font-bold text-sm text-secondary">
                  {managerInitials}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border border-surface"></div>
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-on-surface leading-tight truncate">{managerName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[12px] text-secondary">verified</span>
                  <span className="text-[9px] font-bold text-secondary uppercase tracking-wide">Verified Partner</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <span className="text-xs">09:00 - 18:00</span>
              </div>
            </div>

            <a 
              href={`https://wa.me/1234567890?text=Hola%20${encodeURIComponent(managerName)},%20necesito%20asistencia%20con%20el%20portal%20SANTUN`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2 w-full py-2 bg-[#25D366] text-white rounded-lg font-bold text-xs transition-all hover:bg-[#1da851] hover:shadow-md active:scale-95 mt-1"
            >
              <span className="material-symbols-outlined text-[16px]">forum</span>
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Secondary Actions */}
          <div className="mt-auto pt-6 space-y-2">
            <button 
              onClick={() => setIsAgendarModalOpen(true)} 
              className="w-full py-2.5 px-4 bg-surface-container-high text-on-surface-variant font-bold text-sm rounded-lg flex items-center justify-between group transition-all duration-200 ease-in-out hover:bg-surface-container-highest hover:text-on-surface active:scale-[0.98] active:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Agendar Visita
              </span>
              <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 group-active:scale-90">chevron_right</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Agendar Visita Modal */}
      <AnimatePresence>
        {isAgendarModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAgendarModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-surface w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10 border border-outline-variant"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 id="modal-title" className="font-headline-sm font-bold text-on-surface">Agendar Visita</h3>
                <button 
                  onClick={() => setIsAgendarModalOpen(false)} 
                  className="text-on-surface-variant hover:bg-surface-container rounded-full w-11 h-11 flex items-center justify-center transition-colors active:scale-90" 
                  aria-label="Cerrar modal"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <p className="text-body-md text-on-surface-variant mb-6">Selecciona una fecha y hora preferida para la visita de {managerName}.</p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-label-sm font-bold text-on-surface mb-2">Fecha sugerida</label>
                  <input type="date" className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-label-sm font-bold text-on-surface mb-2">Horario preferido</label>
                  <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary outline-none">
                    <option>Mañana (09:00 - 12:00)</option>
                    <option>Mediodía (12:00 - 15:00)</option>
                    <option>Tarde (15:00 - 18:00)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setIsAgendarModalOpen(false)} 
                  className="px-5 py-2.5 text-on-surface-variant font-bold rounded-xl transition-all duration-200 ease-in-out hover:bg-surface-container hover:text-on-surface active:scale-[0.98] active:bg-surface-container-high"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    setIsAgendarModalOpen(false);
                    toast.success(`Solicitud enviada. ${managerName} confirmará en breve.`);
                  }} 
                  className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-xl shadow-md transition-all duration-200 ease-in-out hover:bg-primary-container hover:shadow-lg active:scale-[0.98]"
                >
                  Confirmar Visita
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RightSidebar;
