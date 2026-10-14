'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AgencyCreativeCatalog } from '../components/marketing-b2b/AgencyCreativeCatalog';
import { WhiteLabelDashboard } from '../components/marketing-b2b/WhiteLabelDashboard';
import { CustomizationModal } from '../components/marketing-b2b/CustomizationModal';
import { GenerationHistoryModal } from '../components/marketing-b2b/GenerationHistoryModal';
import { MarketingTemplate } from '../types/marketingB2B';
import { 
  Sparkles, Layers, ShieldCheck, History, Eye, Store, RefreshCw 
} from 'lucide-react';

export const MarketingB2BPage: React.FC = () => {
  const { user, dashboardType } = useAuth();

  // Role detection
  const isSuperOrWhiteLabelAdmin = 
    dashboardType === 'white_label_admin' || 
    dashboardType === 'super_admin' || 
    user?.role === 'super_admin' || 
    user?.role === 'white_label_admin' ||
    user?.roles?.some((r: any) => r.name === 'super_admin' || r.name === 'white_label_admin');

  // Mode switcher for admins (defaults to admin dashboard, but allows previewing agency catalog)
  const [viewMode, setViewMode] = useState<'admin' | 'agency'>(
    isSuperOrWhiteLabelAdmin ? 'admin' : 'agency'
  );

  // Modals state
  const [selectedTemplate, setSelectedTemplate] = useState<MarketingTemplate | null>(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeGenerationUuid, setActiveGenerationUuid] = useState<string | null>(null);

  const handleSelectTemplate = (template: MarketingTemplate) => {
    setSelectedTemplate(template);
    setIsCustomizationOpen(true);
  };

  const handleGenerationStarted = (gen: { id: number; uuid: string; status: string }) => {
    setActiveGenerationUuid(gen.uuid);
    setIsCustomizationOpen(false);
    setIsHistoryOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Admin Mode Switcher Banner (Only visible to WL / Super Admins) */}
      {isSuperOrWhiteLabelAdmin && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="font-bold text-slate-200">Panel de Control Multitenant:</span>
            <span>Estás autenticado con permisos de administración central.</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'admin'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Administración Marca Blanca
              </button>
              <button
                type="button"
                onClick={() => setViewMode('agency')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'agency'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                Vista Catálogo Agencias
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              title="Ver Historial de Generaciones"
            >
              <History className="w-3.5 h-3.5 text-purple-400" />
              Historial
            </button>
          </div>
        </div>
      )}

      {/* Main Content View */}
      {isSuperOrWhiteLabelAdmin && viewMode === 'admin' ? (
        <WhiteLabelDashboard />
      ) : (
        <AgencyCreativeCatalog
          onSelectTemplate={handleSelectTemplate}
          onOpenHistory={() => setIsHistoryOpen(true)}
        />
      )}

      {/* Customization Modal */}
      <CustomizationModal
        template={selectedTemplate}
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        onGenerationStarted={handleGenerationStarted}
      />

      {/* Generation Queue & Download History Modal */}
      <GenerationHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => {
          setIsHistoryOpen(false);
          setActiveGenerationUuid(null);
        }}
        activeGenerationUuid={activeGenerationUuid}
      />
    </div>
  );
};

export default MarketingB2BPage;
