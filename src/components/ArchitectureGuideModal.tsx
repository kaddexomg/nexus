import React, { useState } from 'react';
import { POSTGRESQL_SCHEMA_SQL } from '../data/mockData';
import { sound } from '../utils/audio';
import { Database, ShieldCheck, Cpu, GitBranch, Copy, Check, X, FileCode } from 'lucide-react';

interface ArchitectureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureGuideModal: React.FC<ArchitectureGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'antierror' | 'gateways' | 'roadmap'>('sql');
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    sound.playClick();
    navigator.clipboard.writeText(POSTGRESQL_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#09090b]/90 backdrop-blur-md animate-fadeIn"
      id="architecture-guide-modal"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#121215] border border-[#27272a] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/20 border border-[#a78bfa]/40 flex items-center justify-center text-[#a78bfa]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#fafafa]">
                  Lineamientos de Arquitectura & Backend Oficial
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#27272a] text-[#a78bfa] text-[10px] font-mono">
                  v4.2 Liquid Core
                </span>
              </div>
              <p className="text-xs text-[#a1a1aa] mt-0.5">
                Especificaciones completas de base de datos, protocolos anti-error y escalabilidad.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#27272a] bg-[#0c0c0f] px-4 sm:px-6 overflow-x-auto">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('sql');
            }}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'sql'
                ? 'border-[#a78bfa] text-[#fafafa]'
                : 'border-transparent text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            <FileCode className="w-4 h-4 text-[#a78bfa]" />
            <span>Esquema SQL PostgreSQL</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('antierror');
            }}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'antierror'
                ? 'border-[#34d399] text-[#fafafa]'
                : 'border-transparent text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#34d399]" />
            <span>Protocolo Anti-Error (4 Capas)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('gateways');
            }}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'gateways'
                ? 'border-[#a78bfa] text-[#fafafa]'
                : 'border-transparent text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            <Cpu className="w-4 h-4 text-[#a78bfa]" />
            <span>Pasarelas & Seguridad</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('roadmap');
            }}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'roadmap'
                ? 'border-[#38bdf8] text-[#fafafa]'
                : 'border-transparent text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            <GitBranch className="w-4 h-4 text-[#38bdf8]" />
            <span>Fases de Escalabilidad</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: ESQUEMA SQL */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#fafafa]">
                    Definición de Tablas Relacionales PostgreSQL
                  </h4>
                  <p className="text-xs text-[#a1a1aa]">
                    Modelos listos para producción con claves foráneas, restricciones de unicidad e índices.
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#34d399]" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#a78bfa]" />
                      <span>Copiar SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] text-[#d4d4d8] font-mono text-xs overflow-x-auto max-h-[50vh] leading-relaxed">
                  {POSTGRESQL_SCHEMA_SQL}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: PROTOCOLO ANTI-ERROR (4 CAPAS) */}
          {activeTab === 'antierror' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-1">
                <h4 className="text-sm font-bold text-[#fafafa]">
                  Filosofía del Protocolo de Seguridad Anti-Error
                </h4>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  En el mercado de recargas gamer, enviar diamantes al ID incorrecto o despachar órdenes por comprobantes falsos causa pérdidas irreparables. Nexus Recharge implementa una arquitectura defensiva de 4 barreras continuas:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#7c3aed]/30 text-[#ede9fe] text-[10px] font-mono font-bold">
                      CAPA 1
                    </span>
                    <span className="text-xs text-[#34d399] font-mono font-bold">Pre-Flight Check</span>
                  </div>
                  <h5 className="text-xs font-bold text-[#fafafa]">Resolución de Identidad en Tiempo Real</h5>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Un microservicio consulta la API del juego y resuelve el Nickname público, nivel y región del jugador. El cliente visualiza la tarjeta emergente y debe marcar la casilla obligatoria: <em>"Confirmo que mi nombre de usuario en el juego es..."</em>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#7c3aed]/30 text-[#ede9fe] text-[10px] font-mono font-bold">
                      CAPA 2
                    </span>
                    <span className="text-xs text-[#34d399] font-mono font-bold">Idempotencia de Pagos</span>
                  </div>
                  <h5 className="text-xs font-bold text-[#fafafa]">Hash Criptográfico y Unicidad de Referencias</h5>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Cada referencia de Pago Móvil o hash de Binance Pay se indexa con restricción <code>UNIQUE</code>. Se genera un <code>idempotency_key</code> único que impide que dobles clics generen transacciones duplicadas.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#7c3aed]/30 text-[#ede9fe] text-[10px] font-mono font-bold">
                      CAPA 3
                    </span>
                    <span className="text-xs text-[#34d399] font-mono font-bold">Transacciones Atómicas</span>
                  </div>
                  <h5 className="text-xs font-bold text-[#fafafa]">Locks de Fila y Despacho Aislado</h5>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Para gift cards y pines virtuales se usa <code>SELECT ... FOR UPDATE SKIP LOCKED</code> para garantizar que ningún código sea entregado a dos clientes en microsegundos de concurrencia.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#7c3aed]/30 text-[#ede9fe] text-[10px] font-mono font-bold">
                      CAPA 4
                    </span>
                    <span className="text-xs text-[#34d399] font-mono font-bold">Reconciliación Diferida</span>
                  </div>
                  <h5 className="text-xs font-bold text-[#fafafa]">Reintento con Backoff Exponencial</h5>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Si la API de Garena o Activision sufre un timeout, la orden no falla; pasa a estado <code>RETRYING</code> en una cola con reintento automático de 3 intentos espaciados y alerta al operador si persiste.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PASARELAS & SEGURIDAD */}
          {activeTab === 'gateways' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-3">
                  <h4 className="text-sm font-bold text-[#fafafa] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#34d399] text-[20px]">payments</span>
                    Pago Móvil Interbancario (Venezuela)
                  </h4>
                  <ul className="space-y-2 text-xs text-[#a1a1aa]">
                    <li>• Liquidación a tasa oficial del día referencial en Bolívares.</li>
                    <li>• Validación de longitud de referencia bancaria (6 a 8 dígitos).</li>
                    <li>• Prevención de inyección SQL mediante consultas parametrizadas.</li>
                    <li>• Soporte para Banco de Venezuela, Banesco, Mercantil y Provincial.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-3">
                  <h4 className="text-sm font-bold text-[#fafafa] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#f59e0b] text-[20px]">currency_exchange</span>
                    Binance Pay USDT Merchant
                  </h4>
                  <ul className="space-y-2 text-xs text-[#a1a1aa]">
                    <li>• Integración directa con Binance Pay API mediante firma HMAC SHA512.</li>
                    <li>• Zero gas fees tanto para el cliente como para el merchant.</li>
                    <li>• Webhook oficial con validación de IP de origen y nonce.</li>
                    <li>• Despacho automático de diamantes en menos de 1 segundo.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ROADMAP DE ESCALABILIDAD */}
          {activeTab === 'roadmap' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#18181b] border border-[#27272a] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#34d399]/20 text-[#34d399] flex items-center justify-center font-bold text-xs shrink-0">
                  F1
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#fafafa]">Fase 1: Core MVP & Recargas Automatizadas</h5>
                  <p className="text-[11px] text-[#a1a1aa] mt-0.5">
                    Terminal gamer interactiva, pre-flight check de UID, pasarela Pago Móvil y Binance Pay con despacho asistido por bot daemon.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#18181b] border border-[#27272a] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#a78bfa]/20 text-[#a78bfa] flex items-center justify-center font-bold text-xs shrink-0">
                  F2
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#fafafa]">Fase 2: Motor de Torneos y Escuadras Esports</h5>
                  <p className="text-[11px] text-[#a1a1aa] mt-0.5">
                    Brackets dinámicos, cálculo de premios en Bs./USDT, registro de capitanes, check-in con entrega de credenciales de sala privada.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#18181b] border border-[#27272a] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center font-bold text-xs shrink-0">
                  F3
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#fafafa]">Fase 3: Bóveda de Tarjetas de Regalo (Gift Cards)</h5>
                  <p className="text-[11px] text-[#a1a1aa] mt-0.5">
                    Códigos de Google Play, PlayStation Store, Steam y Roblox con entrega instantánea descifrada y bóveda cifrada en PostgreSQL.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#18181b] border border-[#27272a] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center font-bold text-xs shrink-0">
                  F4
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#fafafa]">Fase 4: App Móvil Nativa (PWA / React Native)</h5>
                  <p className="text-[11px] text-[#a1a1aa] mt-0.5">
                    Notificaciones push con sonido arcade para torneos, recargas guardadas en 1 tap y sincronización de billetera virtual.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
