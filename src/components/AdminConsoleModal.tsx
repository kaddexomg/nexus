import React, { useState, useEffect, useCallback } from 'react';
import { Order } from '../types';
import { sound } from '../utils/audio';
import { supabase } from '../services/supabase';
import { GAMES_DATA, PACKAGES_DATA } from '../data/mockData';
import { 
  Smartphone, Check, X, AlertOctagon, ShieldAlert, DollarSign, BellRing, 
  RefreshCw, Key, Package, Trophy, Layers, Send, CheckCircle2, AlertCircle, 
  Copy, PlusCircle, Sparkles, Database, Shield
} from 'lucide-react';

interface AdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingOrders: Order[];
  onApproveOrder: (orderId: string) => void;
  onRejectOrder: (orderId: string, reason: string) => void;
  isKillSwitchActive: boolean;
  onToggleKillSwitch: () => void;
}

type AdminTab = 'orders' | 'inventory' | 'tournaments' | 'finance';

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({
  isOpen,
  onClose,
  pendingOrders,
  onApproveOrder,
  onRejectOrder,
  isKillSwitchActive,
  onToggleKillSwitch,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [rejectReason, setRejectReason] = useState<string>('Referencia bancaria no encontrada en BDV');
  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);

  // ── Inventory PINs State ──
  const pinPlatforms = GAMES_DATA.filter(g => 
    g.serviceType === 'giftcard' || g.serviceType === 'subscription' || ['steam', 'netflix', 'spotify', 'free-fire'].includes(g.id)
  );
  const [selectedPinProduct, setSelectedPinProduct] = useState<string>('playstation');
  const [selectedPinPackage, setSelectedPinPackage] = useState<string>('psn-10');
  const [batchPinText, setBatchPinText] = useState<string>('');
  const [pinUploadSuccess, setPinUploadSuccess] = useState<string | null>(null);
  const [pinUploadError, setPinUploadError] = useState<string | null>(null);
  const [isUploadingPins, setIsUploadingPins] = useState(false);
  const [availablePinsCount, setAvailablePinsCount] = useState<number>(0);

  // ── Tournaments State ──
  const [tournamentsList, setTournamentsList] = useState<any[]>([]);
  const [editingTourneyId, setEditingTourneyId] = useState<string | null>(null);
  const [tourneyEditForm, setTourneyEditForm] = useState({ roomId: '', roomPassword: '', status: '' });
  const [isSavingTourney, setIsSavingTourney] = useState(false);

  // Fetch pin stats and tournaments from Supabase
  const loadAdminData = useCallback(async () => {
    try {
      // 1. PIN counts
      const { count } = await supabase
        .from('inventory_pins')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'AVAILABLE');
      if (typeof count === 'number') setAvailablePinsCount(count);

      // 2. Tournaments
      const { data: tourneys } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });
      if (tourneys && tourneys.length > 0) {
        setTournamentsList(tourneys);
      }
    } catch (e) {
      console.warn('Could not load live admin data from Supabase:', e);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadAdminData();
    }
  }, [isOpen, loadAdminData]);

  // Update available packages when selected product changes
  const currentProductPackages = PACKAGES_DATA[selectedPinProduct] || [];
  useEffect(() => {
    if (currentProductPackages.length > 0) {
      setSelectedPinPackage(currentProductPackages[0].id);
    }
  }, [selectedPinProduct]);

  // ── Handle Batch Upload of PINs ──
  const handleBatchUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinUploadSuccess(null);
    setPinUploadError(null);

    const lines = batchPinText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) {
      setPinUploadError('Por favor ingresa al menos un código PIN para cargar.');
      return;
    }

    setIsUploadingPins(true);
    try {
      const records = lines.map(code => ({
        product_id: selectedPinProduct,
        package_id: selectedPinPackage,
        pin_code: code,
        status: 'AVAILABLE',
        batch_reference: `LOTE-${new Date().toISOString().slice(0, 10)}`
      }));

      const { error } = await supabase.from('inventory_pins').insert(records);

      if (error) {
        setPinUploadError(`Error de Supabase: ${error.message}`);
        try { sound.playAlert(); } catch {}
      } else {
        setPinUploadSuccess(`¡Éxito! Se cargaron ${lines.length} PINes listos para entrega inmediata automática.`);
        setBatchPinText('');
        try { sound.playSuccess(); } catch {}
        loadAdminData();
      }
    } catch (err: any) {
      setPinUploadError(err.message || 'Error inesperado al registrar los códigos.');
    } finally {
      setIsUploadingPins(false);
    }
  };

  // ── Handle Tournament Room Update ──
  const handleSaveTourney = async (tourneyId: string) => {
    setIsSavingTourney(true);
    try {
      const { error } = await supabase
        .from('tournaments')
        .update({
          room_id: tourneyEditForm.roomId,
          room_password: tourneyEditForm.roomPassword,
          status: tourneyEditForm.status
        })
        .eq('id', tourneyId);

      if (!error) {
        try { sound.playSuccess(); } catch {}
        setEditingTourneyId(null);
        loadAdminData();
      } else {
        alert(`Error al actualizar torneo: ${error.message}`);
      }
    } catch (e: any) {
      alert(e.message || 'Error al conectar con Supabase');
    } finally {
      setIsSavingTourney(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#09090b]/90 backdrop-blur-md animate-fadeIn"
      id="admin-console-modal"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 rounded-2xl bg-[#121215] border border-[#27272a] shadow-[0_25px_70px_rgba(0,0,0,0.95)] space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#fafafa] tracking-wide">
                  Panel de Control Maestro — Nexus Staff
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono border border-emerald-500/30">
                  Supabase Live
                </span>
              </div>
              <span className="text-xs text-[#a1a1aa]">
                Conciliación bancaria, inventario de PINes, torneos y control de caja
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                try { sound.playClick(); } catch {}
                loadAdminData();
              }}
              title="Recargar datos"
              className="w-8 h-8 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                try { sound.playClick(); } catch {}
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-[#0c0c0f] border border-[#27272a]">
          <button
            onClick={() => {
              try { sound.playClick(); } catch {}
              setActiveTab('orders');
            }}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Conciliación ({pendingOrders.length})</span>
          </button>

          <button
            onClick={() => {
              try { sound.playClick(); } catch {}
              setActiveTab('inventory');
            }}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Cargar PINes ({availablePinsCount})</span>
          </button>

          <button
            onClick={() => {
              try { sound.playClick(); } catch {}
              setActiveTab('tournaments');
            }}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'tournaments'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Salas & Torneos</span>
          </button>

          <button
            onClick={() => {
              try { sound.playClick(); } catch {}
              setActiveTab('finance');
            }}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'finance'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Caja & Kill-Switch</span>
          </button>
        </div>

        {/* ═══ TAB 1: PENDING ORDERS CONCILIATION ═══ */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#fafafa] uppercase tracking-wider flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-amber-400" />
                  Pagos por Conciliar en Tiempo Real
                </h4>
                <p className="text-[11px] text-[#a1a1aa]">
                  Verifica el comprobante bancario en tu banco o wallet antes de dar aprobación de un toque.
                </p>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono font-bold">
                ● Auto-despacho 1.8s Activo
              </span>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#0c0c0f] border border-[#27272a] text-center space-y-2">
                <Check className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-[#fafafa]">¡Bandeja de Pagos al Día!</p>
                <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
                  No hay órdenes pendientes de aprobación en este momento. Las compras automáticas con saldo se despachan sin intervención.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-3 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#fafafa]">
                            {order.gameName} • {order.packageName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold uppercase">
                            {order.paymentMethod}
                          </span>
                        </div>
                        <span className="text-xs text-[#a1a1aa] font-mono block mt-1">
                          Cuenta / Destino: <strong className="text-amber-400">{order.targetPlayerId}</strong> ({order.verifiedNickname})
                        </span>
                        <span className="text-xs text-[#a1a1aa] font-mono block">
                          Referencia Bancaria: <strong className="text-emerald-400">{order.paymentReference}</strong>
                        </span>
                      </div>

                      <div className="text-right sm:border-l sm:border-[#27272a] sm:pl-4">
                        <span className="text-base font-bold text-[#fafafa] font-mono block">
                          Bs. {order.amountBs.toFixed(2)}
                        </span>
                        <span className="text-xs text-[#a1a1aa] font-mono block">
                          ${order.amountUsdt.toFixed(2)} USD
                        </span>
                      </div>
                    </div>

                    {/* Reject form */}
                    {activeRejectId === order.id ? (
                      <div className="p-3.5 rounded-lg bg-[#0c0c0f] border border-rose-500/40 space-y-2">
                        <label className="block text-xs text-rose-400 font-semibold">
                          Motivo del rechazo de pago:
                        </label>
                        <select
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa]"
                        >
                          <option value="Referencia bancaria no encontrada en BDV">
                            Referencia bancaria no encontrada en BDV
                          </option>
                          <option value="Monto recibido menor al precio del paquete">
                            Monto recibido menor al precio del paquete
                          </option>
                          <option value="Comprobante duplicado / captura alterada">
                            Comprobante duplicado / captura alterada
                          </option>
                          <option value="UID o cuenta de destino no válida para esta región">
                            UID o cuenta de destino no válida para esta región
                          </option>
                        </select>
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            onClick={() => setActiveRejectId(null)}
                            className="px-3 py-1.5 rounded bg-[#27272a] text-xs text-[#a1a1aa] cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => {
                              sound.playAlert();
                              onRejectOrder(order.id, rejectReason);
                              setActiveRejectId(null);
                            }}
                            className="px-3.5 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                          >
                            Confirmar Rechazo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-2 border-t border-[#27272a]">
                        <button
                          onClick={() => {
                            sound.playSuccess();
                            onApproveOrder(order.id);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                        >
                          <Check className="w-4 h-4" />
                          <span>Aprobar Pago y Acreditar al Instante</span>
                        </button>

                        <button
                          onClick={() => {
                            sound.playClick();
                            setActiveRejectId(order.id);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-[#1e1e22] hover:bg-rose-500/20 border border-[#27272a] hover:border-rose-500 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Rechazar</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB 2: INVENTORY PINS BATCH LOADER ═══ */}
        {activeTab === 'inventory' && (
          <form onSubmit={handleBatchUpload} className="space-y-4 animate-fadeIn">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-400 text-sm">Carga Masiva de PINes de Inventario</h4>
                  <p className="text-xs text-[#a1a1aa]">
                    Precarga códigos de tarjetas de regalo (PlayStation, Xbox, Google Play, Apple, Steam, Netflix). Se entregan 1 a 1 automáticamente al pagar.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#a1a1aa] block uppercase">Pines Disponibles</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{availablePinsCount}</span>
              </div>
            </div>

            {pinUploadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{pinUploadSuccess}</span>
              </div>
            )}

            {pinUploadError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinUploadError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[#a1a1aa]">
                  1. Seleccionar Plataforma / Juego
                </label>
                <select
                  value={selectedPinProduct}
                  onChange={(e) => setSelectedPinProduct(e.target.value)}
                  className="w-full bg-[#0c0c0f] border border-[#27272a] rounded-xl px-3.5 py-2.5 text-xs text-[#fafafa] focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {pinPlatforms.map(g => (
                    <option key={g.id} value={g.id}>{g.name} ({g.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[#a1a1aa]">
                  2. Paquete / Denominación de la Tarjeta
                </label>
                <select
                  value={selectedPinPackage}
                  onChange={(e) => setSelectedPinPackage(e.target.value)}
                  className="w-full bg-[#0c0c0f] border border-[#27272a] rounded-xl px-3.5 py-2.5 text-xs text-[#fafafa] focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {currentProductPackages.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ${p.priceUsdt.toFixed(2)} USD
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-[#a1a1aa]">
                3. Pegar Códigos PIN (Un código por línea)
              </label>
              <textarea
                rows={6}
                value={batchPinText}
                onChange={(e) => setBatchPinText(e.target.value)}
                placeholder={`Ejemplo:\nPSN-USA-8941-2041\nPSN-USA-9921-4412\nPSN-USA-1102-8841`}
                className="w-full bg-[#0c0c0f] border border-[#27272a] rounded-xl p-3.5 font-mono text-xs text-[#fafafa] focus:outline-none focus:border-amber-500 placeholder:text-zinc-600"
              />
              <span className="text-[11px] text-[#a1a1aa] block mt-1">
                Líneas detectadas:{' '}
                <strong className="text-amber-400">
                  {batchPinText.split('\n').filter(l => l.trim().length > 0).length}
                </strong>
              </span>
            </div>

            <button
              type="submit"
              disabled={isUploadingPins}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isUploadingPins ? 'Guardando en Base de Datos...' : 'Guardar Lote de PINes en Supabase'}</span>
            </button>
          </form>
        )}

        {/* ═══ TAB 3: TOURNAMENTS & ROOMS ═══ */}
        {activeTab === 'tournaments' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#fafafa] uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Gestión de Torneos y Credenciales de Sala
                </h4>
                <p className="text-[11px] text-[#a1a1aa]">
                  Publica el ID de sala y contraseña para los jugadores inscritos (Free Fire, COD, Copa FC 24).
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {tournamentsList.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#a1a1aa] bg-[#0c0c0f] rounded-xl border border-[#27272a]">
                  Cargando torneos desde Supabase...
                </div>
              ) : (
                tournamentsList.map(t => (
                  <div key={t.id} className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h5 className="text-sm font-bold text-[#fafafa]">{t.title}</h5>
                        <span className="text-xs text-[#a1a1aa] block">
                          Juego: <strong className="text-amber-400">{t.game_name}</strong> • Modalidad: {t.format} • Entrada: ${t.entry_fee_usd}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'REGISTRATION_OPEN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {t.status}
                        </span>
                        <span className="text-xs font-mono text-[#fafafa]">
                          {t.registered_teams} / {t.max_teams} Cupos
                        </span>
                      </div>
                    </div>

                    {editingTourneyId === t.id ? (
                      <div className="p-3.5 rounded-lg bg-[#0c0c0f] border border-amber-500/40 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] text-[#a1a1aa] mb-1">ID de Sala:</label>
                            <input
                              type="text"
                              value={tourneyEditForm.roomId}
                              onChange={(e) => setTourneyEditForm({ ...tourneyEditForm, roomId: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#a1a1aa] mb-1">Contraseña de Sala:</label>
                            <input
                              type="text"
                              value={tourneyEditForm.roomPassword}
                              onChange={(e) => setTourneyEditForm({ ...tourneyEditForm, roomPassword: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#a1a1aa] mb-1">Estado del Torneo:</label>
                            <select
                              value={tourneyEditForm.status}
                              onChange={(e) => setTourneyEditForm({ ...tourneyEditForm, status: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa]"
                            >
                              <option value="REGISTRATION_OPEN">REGISTRATION_OPEN</option>
                              <option value="CHECK_IN">CHECK_IN</option>
                              <option value="IN_PROGRESS">IN_PROGRESS</option>
                              <option value="COMPLETED">COMPLETED</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingTourneyId(null)}
                            className="px-3 py-1 rounded bg-[#27272a] text-xs text-[#a1a1aa]"
                          >
                            Cancelar
                          </button>
                          <button
                            disabled={isSavingTourney}
                            onClick={() => handleSaveTourney(t.id)}
                            className="px-4 py-1.5 rounded bg-amber-500 text-black text-xs font-bold"
                          >
                            {isSavingTourney ? 'Guardando...' : 'Actualizar Sala'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-2 border-t border-[#27272a] text-xs font-mono">
                        <div className="flex items-center gap-4 text-[#a1a1aa]">
                          <span>Sala: <strong className="text-[#fafafa]">{t.room_id || 'Por asignar'}</strong></span>
                          <span>Clave: <strong className="text-[#fafafa]">{t.room_password || 'Por asignar'}</strong></span>
                        </div>
                        <button
                          onClick={() => {
                            setEditingTourneyId(t.id);
                            setTourneyEditForm({
                              roomId: t.room_id || '',
                              roomPassword: t.room_password || '',
                              status: t.status || 'REGISTRATION_OPEN'
                            });
                          }}
                          className="px-3 py-1 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] transition-all cursor-pointer"
                        >
                          Editar Credenciales
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ═══ TAB 4: FINANCE & KILL-SWITCH ═══ */}
        {activeTab === 'finance' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Live Cash Registers Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#0c0c0f] border border-[#27272a]">
                <span className="text-[10px] uppercase font-mono text-[#a1a1aa] block">BDV / Pago Móvil Recibido</span>
                <span className="text-xl font-bold text-[#fafafa] font-mono mt-1 block">Bs. 38,420.00</span>
                <span className="text-[11px] text-emerald-400 font-mono">14 órdenes conciliadas</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0c0c0f] border border-[#27272a]">
                <span className="text-[10px] uppercase font-mono text-[#a1a1aa] block">Binance Merchant USDT</span>
                <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">$614.72 USDT</span>
                <span className="text-[11px] text-[#a1a1aa] font-mono">Zero fee liquidado</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0c0c0f] border border-[#27272a]">
                <span className="text-[10px] uppercase font-mono text-[#a1a1aa] block">Ganancia Neta Estimada</span>
                <span className="text-xl font-bold text-amber-400 font-mono mt-1 block">$82.40 USD</span>
                <span className="text-[11px] text-amber-400 font-mono">+18.5% margen de ganancia</span>
              </div>
            </div>

            {/* KILL-SWITCH EMERGENCY STOP */}
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                isKillSwitchActive
                  ? 'bg-rose-500/20 border-rose-500 text-[#fafafa]'
                  : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isKillSwitchActive ? 'bg-rose-500 text-white animate-pulse' : 'bg-[#27272a] text-[#71717a]'
                  }`}
                >
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#fafafa]">
                    {isKillSwitchActive ? '¡KILL SWITCH ACTIVADO!' : 'Parada de Emergencia (Kill Switch)'}
                  </h4>
                  <p className="text-xs text-[#a1a1aa] max-w-md">
                    {isKillSwitchActive
                      ? 'Todas las compras y torneos están pausados temporalmente por mantenimiento o inestabilidad.'
                      : 'Pausa instantánea para proteger fondos si la pasarela de pagos o API de juego falla.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playAlert();
                  onToggleKillSwitch();
                }}
                className={`px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isKillSwitchActive
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg'
                }`}
              >
                {isKillSwitchActive ? 'Reanudar Operaciones' : 'Detener Todo (Kill-Switch)'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
