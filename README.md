# ⚡ NEXUS RECHARGE — Liquid Gaming Core

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![Motion](https://img.shields.io/badge/Motion-v12.23-black?style=for-the-badge&logo=framer)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite)
![DolarApi](https://img.shields.io/badge/DolarApi-Live_VE-34D399?style=for-the-badge)

**Plataforma de alta velocidad para recargas de videojuegos, billeteras virtuales y torneos esports en Venezuela y Latinoamérica.**

[Características](#-características-principales) • [Arquitectura](#-arquitectura-del-sistema) • [Modelo Financiero](#-modelo-financiero-y-tasas) • [Instalación](#-instalación-y-ejecución) • [Documentación](#-documentación-para-desarrolladores)

</div>

---

## 🎮 Resumen del Proyecto

En Venezuela y diversas regiones de Latinoamérica, la gran mayoría de los jugadores no disponen de tarjetas de crédito internacionales para comprar diamantes, pases de batalla o recargar plataformas como Zinli o Steam. 

**Nexus Recharge** resuelve este problema permitiendo a cualquier persona adquirir artículos oficiales de sus videojuegos favoritos pagando en **Bolívares (Pago Móvil BDV, Banesco, Mercantil)** o en **Criptomonedas (Binance Pay USDT)** con despacho directo por UID numérico en menos de 1.8 segundos, **sin contraseñas y sin requerir APIs empresariales costosas**.

---

## ✨ Características Principales

### 1. 🧭 Navegación Modular por Pantallas con Transiciones Motion
- **Sin scroll infinito desordenado:** La aplicación opera como una SPA moderna estructurada en módulos independientes con transiciones fluidas de `motion/react`.
- **Módulos integrados:**
  - ⚡ **Inicio (`home`):** Hero cinemático con banners interactivos de juegos destacados y catálogo visual.
  - 💎 **Asistente de Recarga Guiado (`recharge`):** Stepper visual de 4 etapas:
    1. Selección de Videojuego o Servicio (con portadas HD y publisher tags).
    2. Validación de Jugador / UID (con avatar, ping y pre-flight check anti-error).
    3. Catálogo de Artículos Oficiales (Diamantes, Pase Booyah, Battle Pass, Emotes & Skins).
    4. Liquidación y Voucher con copiado rápido de datos bancarios.
  - 💳 **Billeteras Digitales & Gift Cards (`wallets`):** Tarjeta Visa virtual interactiva **Zinli (Panamá)** con chip y contactless, Binance Pay, Steam Wallet USD y Shein.
  - 🏆 **Nexus Arena Esports (`tournaments`):** Hub competitivo de 4 pasos con inscripción de escuadra, conector de salas de juego oficiales (**Custom Room ID + Password**) y brackets actualizados en vivo.
  - 📊 **Monitor de Divisas en Tiempo Real (`rates`):** Tablero sincronizado con `DolarApi` (BCV Oficial, USDT Binance P2P, Euro) y Simulador de Margen Protegido.
  - 🔍 **Rastreador de Órdenes (`tracking`):** Búsqueda instantánea de pedidos por ID o número de referencia.

### 2. 📈 Sincronización en Vivo con DolarApi y Motor de Margen Protegido
- **Conexión en Vivo:** Sincronización automática con `https://ve.dolarapi.com/v1/dolares` y `https://ve.dolarapi.com/v1/euros`.
- **Protección Antidevaluación:** Los precios en Bolívares se calculan en base a la tasa de reposición de USDT en Binance P2P más un margen comercial configurable (5% a 40%), evitando que el negocio opere a pérdida por la brecha entre la tasa oficial BCV y la del mercado.

### 3. 🛡️ Pre-Flight Check Anti-Error (< 0.01% Error Rate)
- Antes de emitir cualquier cobro, el sistema valida el UID del jugador y solicita confirmación expresa del Nickname y servidor para garantizar que los diamantes se envíen a la cuenta correcta.

### 4. 🎨 Motor de Temas y Audio Procedural
- **3 Modos de Color:** Modo Oscuro (Titanio gamer), Modo Claro (Clean Pro de alto contraste) y Modo Neón (Cyberpunk Glow).
- **Web Audio API:** Efectos acústicos arcade sintetizados en código (sin archivos de audio externos pesados).
- **Consola Secreta de Operadores:** Acceso exclusivo para administradores mediante el atajo de teclado `Ctrl + Shift + A`.

---

## 🏗️ Arquitectura del Sistema

```
nexus-recharge/
├── AGENT_RULES.md               # Reglas estrictas de construcción y política de cero roturas
├── OPERATIONS_BLUEPRINT.md      # Modelo de negocio, márgenes y método operativo sin APIs
├── PROJECT_INDEX.md             # Mapa maestro del repositorio para futuros desarrolladores
├── README.md                    # Este archivo
├── package.json                 # Dependencias y scripts
├── tsconfig.json                # Configuración de compilador TypeScript
├── vite.config.ts               # Plugins de Vite (React + Tailwind v4)
└── src/
    ├── App.tsx                  # Enrutador multi-pantalla SPA con transiciones Motion
    ├── main.tsx                 # Entrada React 19 con ThemeProvider y CurrencyProvider
    ├── index.css                # Estilos globales Tailwind v4 y modos de color
    ├── types.ts                 # Contratos TypeScript (Juegos, Órdenes, Torneos)
    ├── services/
    │   └── currencyService.ts   # Conexión con DolarApi Venezuela y motor de cálculo
    ├── context/
    │   ├── ThemeContext.tsx     # Proveedor de temas: Dark, Light y Neón
    │   └── CurrencyContext.tsx  # Proveedor de cotizaciones y margen protegido
    ├── components/
    │   ├── Header.tsx           # Barra superior: navegación modular, saldo y temas
    │   ├── DynamicIsland.tsx    # Notificaciones flotantes de estado del sistema
    │   ├── Hero.tsx             # Sección inicial con banners VIP dinámicos
    │   ├── StepRechargeWizard.tsx # Flujo guiado de recargas por etapas
    │   ├── InteractiveTournamentHub.tsx # Hub de torneos, salas y brackets
    │   ├── LiveRateDashboard.tsx# Monitor de divisas y simulador de margen
    │   ├── ZinliWalletSection.tsx # Tarjeta Visa Zinli, Steam y Shein
    │   ├── OrderSearchSection.tsx # Rastreador de órdenes en vivo
    │   ├── GameCatalog.tsx      # Catálogo con portadas HD y publisher tags
    │   ├── PaymentModal.tsx     # Modal de liquidación con datos Pago Móvil / Binance
    │   ├── OrderTrackingModal.tsx # Voucher de acreditación en 1.8 segundos
    │   ├── AdminConsoleModal.tsx# Consola interna de operadores (Ctrl+Shift+A)
    │   └── NexusBotWidget.tsx   # Asistente virtual flotante
    ├── data/
    │   └── mockData.ts          # Datos maestros de videojuegos, paquetes y torneos
    └── utils/
        └── audio.ts             # Sintetizador procedural con Web Audio API
```

---

## 💰 Modelo Financiero y Tasas

| Denominación / Servicio | Costo Reposición (USDT) | Margen Neto | Vía de Despacho |
| :--- | :--- | :--- | :--- |
| **Micro-recargas (100 - 310 💎)** | $0.85 - $2.70 | **22% - 30%** | E-PIN Pagostore al mayor |
| **Pase Booyah / Battle Pass** | $4.20 - $4.99 | **16% - 20%** | Inyección directa UID |
| **Combos Doble Recarga (1060 💎)** | $8.00 - $9.40 | **14% - 18%** | Lote mayorista Garena SAC |
| **Zinli Visa ($10.00 USD)** | $10.00 | **6% - 10%** | Transferencia P2P en app (0% red) |
| **Torneos Esports** | Variable por pozo | **15% - 25%** | Comisión retenida por pozo |

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v9 o superior

### Pasos
1. **Clonar o descargar el repositorio:**
   ```bash
   git clone https://github.com/kaddexomg/nexus.git
   cd nexus
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo de desarrollo:**
   ```bash
   npm run dev
   ```
   La plataforma estará disponible en: `http://localhost:3000/`

4. **Verificar tipado y compilar para producción:**
   ```bash
   npx tsc --noEmit
   npm run build
   ```

---

## 📚 Documentación para Desarrolladores

Para comprender a fondo la lógica operativa y de negocio, consulta los documentos de inducción en la raíz del proyecto:

* 📄 [**`PROJECT_INDEX.md`**](PROJECT_INDEX.md): Inducción completa, contratos de datos y arquitectura detallada.
* 🛡️ [**`AGENT_RULES.md`**](AGENT_RULES.md): Reglas inquebrantables de desarrollo y política de cero roturas.
* 💼 [**`OPERATIONS_BLUEPRINT.md`**](OPERATIONS_BLUEPRINT.md): Guía de abastecimiento al mayor, mitigación de devaluación y protocolos anti-fraude.

---

<div align="center">
Desarrollado con ❤️ para la comunidad gamer de Venezuela y América Latina.
</div>
