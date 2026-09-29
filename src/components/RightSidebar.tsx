'use client';
import React, { useState, useEffect } from 'react';
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
  const [, setTick] = useState(0);

  // Listen for local branding updates
  useEffect(() => {
    const handleBrandingUpdated = () => setTick((t) => t + 1);
    window.addEventListener('branding-updated', handleBrandingUpdated);
    return () => window.removeEventListener('branding-updated', handleBrandingUpdated);
  }, []);

  const userName = user?.name ? user.name : 'Usuario';
  const userPoints = user?.points !== undefined ? user.points.toLocaleString() : '15,000';

  const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some((r: any) => r.name === 'super_admin');
  const isWhiteLabelAdmin = !isSuperAdmin && (
    user?.role === 'white_label_admin' || 
    user?.roles?.some((r: any) => r.name === 'white_label_admin') ||
    Boolean((user as any)?.whiteLabels?.length && !(user as any)?.agency_id)
  );

  // Dynamic branding assets for the 3D card
  const cardColor = currentWhiteLabel?.card_color || 
                    (user as any)?.agency?.card_color || 
                    (typeof window !== 'undefined' ? localStorage.getItem('santun_card_color') : null) || 
                    '#1d4ed8';

  const cardLogo = currentWhiteLabel?.card_logo || 
                   (user as any)?.agency?.card_logo || 
                   (typeof window !== 'undefined' ? localStorage.getItem('santun_card_logo') : null) || 
                   null;

  const brandDisplayName = currentWhiteLabel?.name || (user as any)?.agency?.name || 'SANTUN';

  // Support contact hierarchy:
  // - Agency user -> Admin Marca Blanca (data of their White Label Admin)
  // - Marca Blanca user -> Super Admin (data of Super Admin)
  // - Super Admin -> Platform Admin / Self
  let managerTitle = user?.support_contact?.title;
  let managerSubtitle = user?.support_contact?.subtitle;
  let managerName = user?.support_contact?.name;
  let rawWhatsapp = user?.support_contact?.whatsapp;

  if (!managerName) {
    if (isWhiteLabelAdmin) {
      managerTitle = 'Super Admin';
      managerSubtitle = 'Administrador General de Plataforma';
      managerName = (user as any)?.white_label?.creator?.name || 'Super Admin Platform';
      rawWhatsapp = (user as any)?.white_label?.creator?.phone || '';
    } else if (isSuperAdmin) {
      managerTitle = 'Super Admin';
      managerSubtitle = 'Administración Global de Plataforma';
      managerName = user?.name || 'Super Admin';
      rawWhatsapp = user?.phone || '';
    } else {
      // Agency users / Agency Admins
      const hostWhiteLabel = (user?.agency as any)?.white_label || currentWhiteLabel;
      const wlAdminUser = hostWhiteLabel?.users?.[0] || (user as any)?.agency?.white_label_admin;
      
      managerTitle = 'Admin Marca Blanca';
      managerSubtitle = hostWhiteLabel?.name ? `Marca Blanca ${hostWhiteLabel.name}` : 'Soporte Marca Blanca';
      managerName = wlAdminUser?.name || hostWhiteLabel?.name || 'Admin Marca Blanca';
      rawWhatsapp = hostWhiteLabel?.whatsapp || wlAdminUser?.phone || hostWhiteLabel?.phone || '';
    }
  }

  const managerInitials = (managerName || 'SP').substring(0, 2).toUpperCase();

  // Clean WhatsApp number to digits only for wa.me link
  const cleanWhatsapp = (rawWhatsapp || '').replace(/[^0-9]/g, '');
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Hola ${managerName}, necesito asistencia con el portal ${brandDisplayName}`)}`
    : `https://wa.me/?text=${encodeURIComponent(`Hola ${managerName}, necesito asistencia con el portal ${brandDisplayName}`)}`;

  // Determine card style background
  const cardBgStyle = cardColor.startsWith('#') || cardColor.startsWith('rgb')
    ? { background: `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 60%, ${cardColor}aa 100%)` }
    : undefined;

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
            <p className="font-label-md text-on-surface-variant opacity-70">Credencial {brandDisplayName} 3D Verificada</p>
          </div>
          
          <div className="w-full py-4 perspective-[1000px]">
            <div className="relative w-full aspect-[1.58/1] preserve-3d transition-transform duration-500 hover:rotate-x-12 hover:-rotate-y-12 hover:-translate-y-2 hover:scale-105 rounded-xl cursor-pointer group shadow-xl">
              {/* Card Face */}
              <div 
                className="w-full h-full rounded-xl overflow-hidden border border-white/20 relative text-white p-5 flex flex-col justify-between shadow-inner"
                style={cardBgStyle}
              >
                 
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
                 
                 {/* Middle: Brand Name or Custom Card Logo */}
                 <div className="relative z-10 w-full flex justify-start items-center gap-2 mt-1">
                    {cardLogo ? (
                      <img 
                        src={cardLogo} 
                        alt={brandDisplayName} 
                        className="max-h-7 max-w-[160px] object-contain drop-shadow-md" 
                      />
                    ) : (
                      <>
                        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs uppercase">
                          {brandDisplayName.charAt(0)}
                        </div>
                        <span className="text-lg font-extrabold tracking-widest text-white drop-shadow-sm font-sans uppercase truncate">
                          {brandDisplayName}
                        </span>
                      </>
                    )}
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

        {/* Bottom Section: Dynamic Manager / Contact Card with WhatsApp */}
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
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2 w-full py-2 bg-[#25D366] text-white rounded-lg font-bold text-xs transition-all hover:bg-[#1da851] hover:shadow-md active:scale-95 mt-1"
            >
              <span className="material-symbols-outlined text-[16px]">forum</span>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default RightSidebar;
