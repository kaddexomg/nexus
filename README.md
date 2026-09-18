# ⚡ NEXUS RECHARGE — Liquid Gaming Core

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![Motion](https://img.shields.io/badge/Motion-v12.23-black?style=for-the-badge&logo=framer)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_16-3ECF8E?style=for-the-badge&logo=supabase)
![DolarApi](https://img.shields.io/badge/DolarApi-Live_VE-34D399?style=for-the-badge)

**Plataforma de alta velocidad para recargas de videojuegos, billeteras digitales y torneos esports en Venezuela y Latinoamérica.**

[Características](#-características-principales) • [Arquitectura](#-arquitectura-del-sistema) • [Activos y Marcas 2026](#-catálogo-de-marcas-y-activos-2026) • [Instalación](#-instalación-y-ejecución) • [Documentación](#-documentación-maestra)

</div>

---

## 🎮 Resumen del Proyecto

En Venezuela y América Latina, la gran mayoría de los jugadores no disponen de tarjetas de crédito internacionales para comprar diamantes, pases de batalla o recargar plataformas como Zinli, Steam o PlayStation.

**Nexus Recharge** resuelve este problema permitiendo a cualquier persona adquirir artículos oficiales de sus videojuegos y servicios favoritos pagando en **Bolívares (Pago Móvil BDV, Banesco, Mercantil)** o en **Criptomonedas (Binance Pay USDT)** con despacho directo por UID o E-PIN en menos de 1.8 segundos, **sin contraseñas y con conciliación transparente**.

---

## ✨ Características Principales

### 1. 🌌 Motor de Iluminación Ambiental Reactiva y Breathing GPU
- **Atmósfera Dinámica:** Tres orbes luminosos acelerados por hardware en ciclo continuo sinusoidal (9s, 12s, 10s) que mutan su colorimetría inmediatamente al color oficial de la marca (`--brand-current` y `--brand-glow`) cuando el usuario pasa el cursor o selecciona un juego.
- **Scroll Parallax:** Parallax fluido vinculado al scroll vertical mediante hooks de Motion sin lag de CPU.
- **Láser Superior Neón:** Rayo horizontal que proyecta un halo luminoso de 350px con el color activo de la marca.

### 2. 📱 Identidad Visual Oficial 2026 con iOS Squircles
- **18 Marcas Oficiales:** Iconografía procesada con curvatura de super-elipse de Apple (`rounded-[22%]`), marco especular de cristal y sombras de profundidad.
- **Key-Art Covers 2026:** Portadas oficiales en alta resolución (Free Fire 2026, EA Sports FC 26 Mobile, PUBG Mobile Erangel, Brawl Stars Starr Park, Spotify, Netflix, Zinli USD Visa Card, etc.).
- **Zinli Brand Identity:** Color oficial Violeta Iris Real (`#672fbf`) y Menta Eléctrico (`#00c9b7`), acompañado de una **Tarjeta Visa Internacional Virtual interactiva en vivo**.

### 3. 🎯 Flujos de Recarga Especializados por Plataforma (Step 1)
- **Free Fire:** UID + Selector obligatorio de región (`SAC`, `US`, `EU`).
- **EA Sports FC 26 Mobile:** UID + Selector de plataforma (`FC Mobile`, `PlayStation`, `Xbox`, `PC`).
- **Mobile Legends:** User ID + Server Zone ID de 4 dígitos.
- **Brawl Stars:** Supercell Player Tag con `#`.
- **Zinli Dólares Visa:** Correo Zinli + Nombre de titular con pre-visualización de tarjeta virtual.
- **Suscripciones y Gift Cards:** Correo electrónico verificado para despacho instantáneo de código E-PIN.

### 4. 🏆 Nexus Arena Esports con Métricas Deportivas Reales
- **EA Sports FC 26:** Copa 1v1 Ultimate Team con formato de goles en 90 min, tiempo extra y tanda de penales (sin kills inapropiadas para fútbol).
- **Free Fire:** Batalla campal de 48 jugadores con puntuación oficial por posición y eliminaciones.
- **Brawl Stars:** Competitivo 3v3 Atrapagemas (Bo3).

### 5. 🗄️ Backend Supabase Cloud Integrado
- **PostgreSQL en la nube:** URL `https://qiykiwhipbcvnyfqoyuz.supabase.co`.
- **Autenticación Completa:** Email/Password y Google OAuth (`AuthModal.tsx`).
- **Row Level Security (RLS):** Protección de órdenes, perfiles y transacciones.
- **Consola de Operadores:** Acceso administrativo mediante el atajo de teclado `Ctrl + Shift + A`.

---

## 🏗️ Arquitectura del Sistema

```
nexus-recharge/
├── AGENT_RULES.md                    # Reglas operativas estrictas para agentes de IA
├── BACKEND_AUTOMATIONS_AND_COSTS.md  # Blueprint financiero, presupuestos, APIs y daemon workers
├── OPERATIONS_BLUEPRINT.md           # Modelo comercial, márgenes y mitigación de devaluación
├── PROJECT_INDEX.md                  # Índice maestro y especificación técnica completa
├── README.md                         # Este archivo
├── supabase_schema.sql               # Esquema completo de Supabase PostgreSQL
├── public/assets/
│   ├── logos/                        # 18 logos oficiales iOS Squircle 512x512
│   ├── games/                        # 18 portadas oficiales Key-Art 2026
│   └── banners/                      # Banners cinematográficos Ultra HD
└── src/
    ├── App.tsx                       # Orquestador SPA con motor de iluminación ambiental
    ├── components/                   # 27 componentes modulares (Catalog, Detail, Tournaments, etc.)
    ├── context/                      # AuthContext (Supabase), CurrencyContext (DolarApi), ThemeContext
    ├── services/                     # supabase.ts, currencyService.ts
    ├── data/mockData.ts              # Catálogo maestro de 18 productos, paquetes y torneos
    └── utils/audio.ts                # Sintetizador procedural con Web Audio API
```

---

## 🎨 Catálogo de Marcas y Activos 2026

| Plataforma / Juego | Categoría | Color Primario | Glow RGBA | Icono iOS | Portada Key-Art |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Garena Free Fire** | Battle Royale | `#ff5500` | `rgba(255, 85, 0, 0.45)` | `/assets/logos/free-fire.png` | `/assets/games/free-fire.jpg` |
| **EA Sports FC 26 Mobile** | Fútbol / Esports | `#00ff87` | `rgba(0, 255, 135, 0.50)` | `/assets/logos/fc-26.png` | `/assets/games/fc-26.jpg` |
| **Zinli Dólares Visa** | Billetera Digital | `#672fbf` | `rgba(103, 47, 191, 0.55)` | `/assets/logos/zinli.png` | `/assets/games/zinli.jpg` |
| **PUBG Mobile** | Battle Royale | `#f59e0b` | `rgba(245, 158, 11, 0.45)` | `/assets/logos/pubg-mobile.png` | `/assets/games/pubg-mobile.jpg` |
| **Brawl Stars** | Acción Supercell | `#facc15` | `rgba(250, 204, 21, 0.45)` | `/assets/logos/brawl-stars.png` | `/assets/games/brawl-stars.jpg` |
| **Spotify Premium** | Streaming | `#1ed760` | `rgba(30, 215, 96, 0.45)` | `/assets/logos/spotify.png` | `/assets/games/spotify.jpg` |
| **Netflix** | Streaming | `#e50914` | `rgba(229, 9, 20, 0.45)` | `/assets/logos/netflix.png` | `/assets/games/netflix.jpg` |
| **Roblox** | Sandbox | `#e11d48` | `rgba(225, 29, 72, 0.45)` | `/assets/logos/roblox.png` | `/assets/games/roblox.jpg` |
| **Valorant** | FPS PC | `#ff4655` | `rgba(255, 70, 85, 0.45)` | `/assets/logos/valorant.png` | `/assets/games/valorant.jpg` |
| **Mobile Legends** | MOBA 5v5 | `#38bdf8` | `rgba(56, 189, 248, 0.45)` | `/assets/logos/mobile-legends.png` | `/assets/games/mobile-legends.jpg` |
| **Call of Duty: Mobile** | FPS Móvil | `#eab308` | `rgba(234, 179, 8, 0.45)` | `/assets/logos/cod-mobile.png` | `/assets/games/cod-mobile.jpg` |
| **Steam Wallet USD** | Gift Card | `#1a9fff` | `rgba(26, 159, 255, 0.45)` | `/assets/logos/steam.png` | `/assets/games/steam.jpg` |
| **PlayStation Network** | Gift Card | `#0070d1` | `rgba(0, 112, 209, 0.45)` | `/assets/logos/playstation.png` | `/assets/games/playstation.jpg` |
| **Xbox Game Pass** | Suscripción | `#107c10` | `rgba(16, 124, 16, 0.45)` | `/assets/logos/xbox.png` | `/assets/games/xbox.jpg` |
| **Google Play Store** | Gift Card | `#01875f` | `rgba(1, 135, 95, 0.45)` | `/assets/logos/google-play.png` | `/assets/games/google-play.jpg` |
| **Apple Gift Card** | Gift Card | `#0071e3` | `rgba(0, 113, 227, 0.45)` | `/assets/logos/apple.png` | `/assets/games/apple.jpg` |
| **Discord Nitro** | App / Social | `#5865f2` | `rgba(88, 101, 242, 0.45)` | `/assets/logos/discord-nitro.png` | `/assets/games/discord-nitro.jpg` |
| **Shein Moda** | Gift Card | `#f43f5e` | `rgba(244, 63, 94, 0.45)` | `/assets/logos/shein.png` | `/assets/games/shein.jpg` |

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+

### Pasos
```bash
# 1. Clonar el repositorio
git clone https://github.com/kaddexomg/nexus.git
cd nexus

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Verificar tipado estricto
npx tsc --noEmit

# 5. Compilar para producción
npm run build
```

---

## 📚 Documentación Maestra

* 📄 [**`PROJECT_INDEX.md`**](PROJECT_INDEX.md): Índice maestro, especificaciones de arquitectura, contratos y activos.
* ⚙️ [**`BACKEND_AUTOMATIONS_AND_COSTS.md`**](BACKEND_AUTOMATIONS_AND_COSTS.md): Guía de automatización, APIs, daemons y presupuestos de operación.
* 🛡️ [**`AGENT_RULES.md`**](AGENT_RULES.md): Reglas inquebrantables de desarrollo y preservación del sistema.
* 💼 [**`OPERATIONS_BLUEPRINT.md`**](OPERATIONS_BLUEPRINT.md): Protocolos operativos, mitigación cambiaria y conciliación bancaria.
* 🗄️ [**`supabase_schema.sql`**](supabase_schema.sql): Esquema SQL de base de datos con políticas RLS y triggers automáticos.

---

<div align="center">
Desarrollado para la comunidad gamer de Venezuela y América Latina.
</div>
