'use client';

import React, { useState, useEffect } from 'react';
import {
  gamificationService,
  Roulette,
  Reward,
  AgencyRouletteGift,
  UserPointsData,
} from '../services/gamificationService';
import InteractiveRouletteWheel from '../components/InteractiveRouletteWheel';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Gift,
  Coins,
  RotateCw,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  Settings,
  Star,
  Check,
  Package,
  Layers,
  ArrowUpRight,
  TrendingUp,
  History,
  Info,
  Loader2,
  Trash2,
  Edit3,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { TableSkeleton } from '@/components/Skeleton';

export const GamificationPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'wheel' | 'catalog' | 'gifts' | 'admin'>('wheel');

  // Data states
  const [roulettes, setRoulettes] = useState<Roulette[]>([]);
  const [selectedRoulette, setSelectedRoulette] = useState<Roulette | null>(null);
  const [rewardsCatalog, setRewardsCatalog] = useState<Reward[]>([]);
  const [giftsList, setGiftsList] = useState<AgencyRouletteGift[]>([]);
  const [pointsData, setPointsData] = useState<UserPointsData | null>(null);

  // Spin & Modal states
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const [wonGift, setWonGift] = useState<any | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);

  // Admin Modals
  const [showCreateRouletteModal, setShowCreateRouletteModal] = useState(false);
  const [newRouletteTitle, setNewRouletteTitle] = useState('');
  const [newRouletteDesc, setNewRouletteDesc] = useState('');

  const [showCreateRewardModal, setShowCreateRewardModal] = useState(false);
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardDesc, setNewRewardDesc] = useState('');
  const [newRewardPoints, setNewRewardPoints] = useState(100);
  const [newRewardStock, setNewRewardStock] = useState(50);

  const [editingRouletteRewards, setEditingRouletteRewards] = useState<Roulette | null>(null);
  const [rouletteRewardProbs, setRouletteRewardProbs] = useState<{ [key: number]: { enabled: boolean; prob: number; color: string } }>({});

  const isAdmin = user && (user.role === 'super_admin' || user.role === 'admin' || user.roles?.some(r => r.name === 'super_admin' || r.name === 'admin'));

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [rList, rewards, gifts, pts] = await Promise.all([
        gamificationService.getRoulettes(),
        gamificationService.getRewards(),
        gamificationService.getGifts(),
        gamificationService.getUserPoints(),
      ]);

      setRoulettes(rList);
      if (rList.length > 0) {
        setSelectedRoulette(rList[0]);
      }
      setRewardsCatalog(rewards);
      setGiftsList(gifts);
      setPointsData(pts);
    } catch (err) {
      console.error('Error al cargar datos de gamificación:', err);
      toast.error('Error al cargar información de gamificación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpinClick = async () => {
    if (!selectedRoulette || isSpinning) return;

    if (!selectedRoulette.rewards || selectedRoulette.rewards.length === 0) {
      toast.error('Esta ruleta no posee premios configurados.');
      return;
    }

    setIsSpinning(true);
    setWinningIndex(null);
    setWonGift(null);

    try {
      const response = await gamificationService.spinRoulette(selectedRoulette.id);
      const wIdx = response.data?.winner_index ?? 0;

      setWinningIndex(wIdx);

      // Wait 4.5 seconds for wheel physical rotation animation to finish
      setTimeout(() => {
        setIsSpinning(false);
        setWonGift(response.data?.reward || { name: 'Premio Especial' });
        setShowWinModal(true);
        // Refresh gifts list & points
        gamificationService.getGifts().then(setGiftsList);
        gamificationService.getUserPoints().then(setPointsData);
      }, 4600);
    } catch (err: any) {
      setIsSpinning(false);
      const msg = err.response?.data?.message || 'Error al girar la ruleta';
      toast.error(msg);
    }
  };

  const handleRedeemReward = async (reward: Reward) => {
    if (!pointsData || pointsData.balance < reward.points_cost) {
      toast.error(`Puntos insuficientes. Necesitas ${reward.points_cost} puntos.`);
      return;
    }

    try {
      const res = await gamificationService.redeemWithPoints(reward.id);
      toast.success(res.message || '¡Premio canjeado con éxito!');
      // Refresh points and gifts
      const [updatedPoints, updatedGifts] = await Promise.all([
        gamificationService.getUserPoints(),
        gamificationService.getGifts(),
      ]);
      setPointsData(updatedPoints);
      setGiftsList(updatedGifts);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al canjear el premio');
    }
  };

  const handleUpdateGiftStatus = async (giftId: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 2 : 1;
    try {
      await gamificationService.updateGiftStatus(giftId, newStatus);
      toast.success('Estado del premio actualizado');
      const updatedGifts = await gamificationService.getGifts();
      setGiftsList(updatedGifts);
    } catch (err) {
      toast.error('Error al actualizar estado del regalo');
    }
  };

  const handleCreateRouletteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouletteTitle.trim()) return;

    try {
      await gamificationService.createRoulette({
        title: newRouletteTitle.trim(),
        description: newRouletteDesc.trim() || undefined,
      });
      toast.success('Ruleta creada exitosamente');
      setShowCreateRouletteModal(false);
      setNewRouletteTitle('');
      setNewRouletteDesc('');
      loadAllData();
    } catch (err) {
      toast.error('Error al crear la ruleta');
    }
  };

  const handleCreateRewardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardName.trim()) return;

    try {
      await gamificationService.createReward({
        name: newRewardName.trim(),
        description: newRewardDesc.trim() || undefined,
        points_cost: newRewardPoints,
        stock: newRewardStock,
      });
      toast.success('Premio agregado al catálogo');
      setShowCreateRewardModal(false);
      setNewRewardName('');
      setNewRewardDesc('');
      loadAllData();
    } catch (err) {
      toast.error('Error al crear el premio');
    }
  };

  const openEditRouletteRewards = (roulette: Roulette) => {
    setEditingRouletteRewards(roulette);
    const initialMap: { [key: number]: { enabled: boolean; prob: number; color: string } } = {};

    const assigned = roulette.rewards || [];
    rewardsCatalog.forEach((r) => {
      const found = assigned.find((item) => item.reward_id === r.id);
      initialMap[r.id] = {
        enabled: !!found,
        prob: found ? (found.probability || (found.probability_percent ? found.probability_percent / 100 : 0.1)) : 0.1,
        color: found?.color || '#2563eb',
      };
    });

    setRouletteRewardProbs(initialMap);
  };

  const handleSaveRouletteRewardsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRouletteRewards) return;

    const payloadRewards: Array<{ reward_id: number; probability: number; color?: string }> = [];

    Object.keys(rouletteRewardProbs).forEach((rewardIdStr) => {
      const rId = Number(rewardIdStr);
      const conf = rouletteRewardProbs[rId];
      if (conf.enabled) {
        payloadRewards.push({
          reward_id: rId,
          probability: conf.prob,
          color: conf.color,
        });
      }
    });

    try {
      await gamificationService.saveRouletteRewards(editingRouletteRewards.id, payloadRewards);
      toast.success('Probabilidades actualizadas exitosamente');
      setEditingRouletteRewards(null);
      loadAllData();
    } catch (err) {
      toast.error('Error al guardar probabilidades de la ruleta');
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in">
      {/* Header Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gamificación & Recompensas</span>
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight">Ruletas de la Suerte & Puntos SANTUN</h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Gira la ruleta comercial, acumula puntos por actividades comerciales y canjea premios reales.
            </p>
          </div>

          {/* Points Balance Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-white/20 flex items-center gap-4 shadow-lg flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300 block">Mi Saldo Acumulado</span>
              <span className="text-2xl font-black text-amber-400">{pointsData?.balance || 0} Pts</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-800 pt-4 mt-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('wheel')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'wheel'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Ruleta de la Suerte</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Catálogo de Premios & Canje</span>
          </button>
          <button
            onClick={() => setActiveTab('gifts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'gifts'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Mis Regalos & Canjes ({giftsList.length})</span>
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Gestión Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: RULETA DE LA SUERTE */}
      {activeTab === 'wheel' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center text-center relative">
            {/* Roulette Selector Header & Admin Edit Shortcut */}
            <div className="w-full flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Ruleta Activa:</span>
                {roulettes.length > 1 ? (
                  <select
                    value={selectedRoulette?.id || ''}
                    onChange={(e) => {
                      const r = roulettes.find((item) => item.id === Number(e.target.value));
                      if (r) setSelectedRoulette(r);
                    }}
                    className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-extrabold text-slate-900 dark:text-white"
                  >
                    {roulettes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title || r.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {selectedRoulette?.title || selectedRoulette?.name || 'Ruleta Principal'}
                  </span>
                )}
              </div>

              {/* Admin Button to Open Prizes Modal Directly */}
              {isAdmin && selectedRoulette && (
                <button
                  onClick={() => openEditRouletteRewards(selectedRoulette)}
                  className="px-4 py-2 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs font-black hover:bg-amber-100 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Configurar Premios & Probabilidades</span>
                </button>
              )}
            </div>

            {selectedRoulette ? (
              <div className="space-y-6 w-full flex flex-col items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {selectedRoulette.title || selectedRoulette.name}
                  </h2>
                  {selectedRoulette.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                      {selectedRoulette.description}
                    </p>
                  )}
                </div>

                {/* Interactive Wheel SVG Component */}
                <InteractiveRouletteWheel
                  roulette={selectedRoulette}
                  isSpinning={isSpinning}
                  winningIndex={winningIndex}
                  onSpin={handleSpinClick}
                  disabled={isSpinning}
                />

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleSpinClick}
                    disabled={isSpinning}
                    className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                    <span>{isSpinning ? 'Girando Ruleta...' : '¡Girar Ruleta Ahora!'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500">
                <Gift className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-bold">No hay ruletas configuradas actualmente.</p>
                {isAdmin && (
                  <button
                    onClick={() => setShowCreateRouletteModal(true)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
                  >
                    Crear Nueva Ruleta
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Won Gifts & Points Quick Card */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Últimos Regalos Ganados</span>
              </h3>

              {giftsList.length > 0 ? (
                <div className="space-y-3">
                  {giftsList.slice(0, 5).map((g) => (
                    <div
                      key={g.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-slate-900 dark:text-white">
                          {g.reward?.name || g.reward?.title || 'Premio Sorpresa'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {g.winner_at ? new Date(g.winner_at).toLocaleDateString() : 'Reciente'}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                          g.status === 2
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {g.status === 2 ? 'Canjeado' : 'Pendiente'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-4">Aún no has ganado regalos.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATÁLOGO DE PREMIOS & CANJE POR PUNTOS */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 font-bold flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Saldo Actual</span>
                <p className="text-xl font-black text-slate-900 dark:text-white">{pointsData?.balance || 0} Pts</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Ganados</span>
                <p className="text-xl font-black text-emerald-600">+{pointsData?.total_earned || 0} Pts</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 font-bold flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Canjeados</span>
                <p className="text-xl font-black text-rose-600">-{pointsData?.total_spent || 0} Pts</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Gift className="w-6 h-6 text-amber-500" />
              <span>Catálogo de Recompensas</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rewardsCatalog.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-amber-400/60 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{reward.points_cost} Puntos</span>
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">Stock: {reward.stock}</span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white">{reward.name}</h3>
                    {reward.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{reward.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleRedeemReward(reward)}
                    disabled={(pointsData?.balance || 0) < reward.points_cost}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 rounded-2xl font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Canjear por {reward.points_cost} Pts</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MIS REGALOS & CANJES */}
      {activeTab === 'gifts' && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Gift className="w-6 h-6 text-amber-500" />
                <span>Historial de Regalos & Canjes</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Listado de todos los premios ganados en ruletas o canjeados con puntos acumulados.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">ID</th>
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Fecha</th>
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Agencia / Usuario</th>
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Premio</th>
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Origen</th>
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Estado</th>
                  <th className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {giftsList.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 sm:py-3.5 px-3 sm:px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">#{g.id}</td>
                    <td className="py-3 sm:py-3.5 px-3 sm:px-4 font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {g.assigned_at ? new Date(g.assigned_at).toLocaleDateString() : 'Reciente'}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-slate-900 dark:text-white">{g.agency?.name || 'Agencia'}</p>
                      {g.user && <p className="text-[10px] text-slate-400">{g.user.name}</p>}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-amber-600 dark:text-amber-400">
                      {g.reward?.name || g.reward?.title || 'Premio Especial'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {g.roulette?.title || 'Ruleta Comercial'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                          g.status === 2
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {g.status === 2 ? 'Canjeado / Entregado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isAdmin && (
                        <button
                          onClick={() => handleUpdateGiftStatus(g.id, g.status)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          {g.status === 1 ? 'Marcar Entregado' : 'Marcar Pendiente'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GESTIÓN ADMIN */}
      {activeTab === 'admin' && (
        <div className="space-y-6">
          {/* Admin Header Actions */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500" />
                <span>Gestión de Ruletas & Catálogo de Premios</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Crea nuevas ruletas, asigna probabilidades de premiación y edita los premios.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateRouletteModal(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Ruleta</span>
              </button>
              <button
                onClick={() => setShowCreateRewardModal(true)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Premio Catálogo</span>
              </button>
            </div>
          </div>

          {/* List of Roulettes Management */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Ruletas Configuradas ({roulettes.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roulettes.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{r.title || r.name}</h4>
                    <p className="text-xs text-slate-500">{r.description || 'Sin descripción'}</p>
                    <span className="text-[10px] font-bold text-amber-600 block">
                      {r.rewards?.length || 0} Premios asignados
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditRouletteRewards(r)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Premios & Probabilidades</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WINNER MODAL */}
      {showWinModal && wonGift && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 rounded-3xl border-2 border-amber-400/80 w-full max-w-sm p-8 text-center shadow-2xl space-y-4 relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-400/30 animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">¡FELICIDADES!</h2>
              <p className="text-amber-400 font-extrabold text-lg">{wonGift.name || wonGift.title}</p>
              <p className="text-xs text-slate-300">Has ganado este premio en la ruleta de la suerte SANTUN.</p>
            </div>

            <button
              onClick={() => {
                setShowWinModal(false);
                setActiveTab('gifts');
              }}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black text-xs shadow-lg shadow-amber-400/30 transition-all cursor-pointer"
            >
              Ver Mis Regalos
            </button>
          </div>
        </div>
      )}

      {/* CREATE ROULETTE MODAL */}
      {showCreateRouletteModal && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowCreateRouletteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Crear Nueva Ruleta</h3>
            <form onSubmit={handleCreateRouletteSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Título de la Ruleta *</label>
                <input
                  type="text"
                  value={newRouletteTitle}
                  onChange={(e) => setNewRouletteTitle(e.target.value)}
                  placeholder="Ej: Ruleta Comercial Quevedo"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Descripción</label>
                <textarea
                  value={newRouletteDesc}
                  onChange={(e) => setNewRouletteDesc(e.target.value)}
                  placeholder="Descripción opcional"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRouletteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
                  Crear Ruleta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE REWARD MODAL */}
      {showCreateRewardModal && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowCreateRewardModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Agregar Nuevo Premio al Catálogo</h3>
            <form onSubmit={handleCreateRewardSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nombre del Premio *</label>
                <input
                  type="text"
                  value={newRewardName}
                  onChange={(e) => setNewRewardName(e.target.value)}
                  placeholder="Ej: Viaje a Galápagos o GiftCard $50"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Descripción</label>
                <textarea
                  value={newRewardDesc}
                  onChange={(e) => setNewRewardDesc(e.target.value)}
                  placeholder="Detalles del premio"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Costo en Puntos</label>
                  <input
                    type="number"
                    value={newRewardPoints}
                    onChange={(e) => setNewRewardPoints(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold font-mono"
                    min="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Stock Inicial</label>
                  <input
                    type="number"
                    value={newRewardStock}
                    onChange={(e) => setNewRewardStock(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold font-mono"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRewardModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold cursor-pointer">
                  Crear Premio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROULETTE REWARDS PROBABILITIES MODAL */}
      {editingRouletteRewards && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto relative">
            <button
              onClick={() => setEditingRouletteRewards(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Premios y Probabilidades: <span className="text-amber-500">{editingRouletteRewards.title || editingRouletteRewards.name}</span>
            </h3>

            <form onSubmit={handleSaveRouletteRewardsSubmit} className="space-y-4">
              {rewardsCatalog.length > 0 ? (
                rewardsCatalog.map((r) => {
                  const conf = rouletteRewardProbs[r.id] || { enabled: false, prob: 0.1, color: '#2563eb' };
                  return (
                    <div
                      key={r.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 font-black text-slate-900 dark:text-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={conf.enabled}
                            onChange={(e) =>
                              setRouletteRewardProbs({
                                ...rouletteRewardProbs,
                                [r.id]: { ...conf, enabled: e.target.checked },
                              })
                            }
                            className="rounded text-amber-500"
                          />
                          <span>{r.name}</span>
                        </label>
                        <input
                          type="color"
                          value={conf.color}
                          onChange={(e) =>
                            setRouletteRewardProbs({
                              ...rouletteRewardProbs,
                              [r.id]: { ...conf, color: e.target.value },
                            })
                          }
                          className="w-8 h-8 rounded border-none cursor-pointer"
                        />
                      </div>

                      {conf.enabled && (
                        <div className="flex items-center gap-3 pt-1">
                          <span className="font-bold text-slate-500">Probabilidad (0.00 a 1.00):</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            value={conf.prob}
                            onChange={(e) =>
                              setRouletteRewardProbs({
                                ...rouletteRewardProbs,
                                [r.id]: { ...conf, prob: parseFloat(e.target.value) || 0 },
                              })
                            }
                            className="w-28 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs font-bold"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center text-slate-500">
                  <p className="text-xs font-bold">No hay premios creados en el catálogo.</p>
                  <p className="text-[11px] mt-1">Crea primero los premios en el catálogo para asignarlos a esta ruleta.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRouletteRewards(null);
                      setShowCreateRewardModal(true);
                    }}
                    className="mt-3 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Crear Premio en Catálogo
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingRouletteRewards(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold cursor-pointer">
                  Guardar Probabilidades
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationPage;
