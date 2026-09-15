# 📐 REGLAS DE CONSTRUCCIÓN Y ARQUITECTURA (AGENT RULES)

> **Reglamento Operativo y de Ingeniería para el Repositorio `nexus-recharge`.**  
> Todo agente inteligente o desarrollador que modifique este proyecto debe acatar estrictamente estas directrices.

---

## 🔒 1. Integridad del Código y Cero Regresiones (Zero-Breaking Policy)

1. **Tipado Estricto con TypeScript:**
   - Queda terminantemente prohibido el uso de `any` para modelos de datos principales.
   - Cualquier modificación o extensión a las entidades debe declararse en [`src/types.ts`](file:///src/types.ts).
   - Siempre verificar que `npx tsc --noEmit` pase con 0 errores antes de dar una tarea por terminada.

2. **Compatibilidad con Tailwind CSS v4:**
   - Este proyecto utiliza `@tailwindcss/vite` y Tailwind v4.1+.
   - No crear archivos `tailwind.config.js` antiguos que rompan la compilación nativa de Tailwind v4.
   - Las variables de temas y utilidades personalizadas deben definirse en [`src/index.css`](file:///src/index.css) o mediante clases semánticas.

3. **Comportamiento del Teclado y Atajos Secretos:**
   - El atajo de teclado del Operador `Ctrl + Shift + A` (o `Cmd + Shift + A`) debe conservarse SIEMPRE en [`src/App.tsx`](file:///src/App.tsx). No exponer botones públicos de acceso al panel de administración para proteger la seguridad del cliente y evitar ataques o pánico.

4. **Persistencia de Sonidos Web Audio API:**
   - Toda interacción clave (clic en botón, selección de paquete, confirmación de orden, alerta de validación) debe invocar el método correspondiente de [`src/utils/audio.ts`](file:///src/utils/audio.ts).
   - Los métodos de sonido deben estar envueltos en bloques `try/catch` o verificar si el contexto de audio del navegador está desbloqueado para no arrojar errores en consolas móviles.

---

## 🎨 2. Sistema de Diseño y Modos Visuales (Dark, Light, Neon)

1. **Modo Oscuro (Dark Gamer — Por Defecto):**
   - Fondo principal: `#09090b` (Zinc 950).
   - Superficies de tarjetas y modales: `#121215` y `#18181b`.
   - Bordes: `#27272a`.
   - Acentos primarios: Violeta `#7c3aed` / Púrpura neón `#a78bfa` y Verde Esmeralda `#34d399`.

2. **Modo Claro (Clean Pro):**
   - Fondo principal: `#f8fafc` (Slate 50).
   - Superficies de tarjetas y modales: `#ffffff`.
   - Textos: `#0f172a` (Slate 900) con excelente contraste de lectura.
   - Bordes: `#e2e8f0`.

3. **Modo Neón (Cyberpunk Glow):**
   - Fondo principal: `#030014` (Deep Cyber Space).
   - Superficies: `#0b091f` con bordes `#3b0764` y resplandor `box-shadow: 0 0 15px rgba(168, 85, 247, 0.4)`.
   - Acentos: Cian Neón `#00f0ff`, Fucsia Eléctrico `#ff007f`, y Lima Láser `#00ff88`.

4. **Contraste Móvil y Ergonomía:**
   - La mayoría de usuarios en Venezuela accede desde teléfonos móviles Android con pantallas de baja o media gama y conexión móvil inestable.
   - Los botones táctiles deben tener un área mínima de contacto de `44x44px`.
   - Todos los datos numéricos bancarios (Cédula, Teléfono, Monto en Bs., Referencia) deben tener botones con retroalimentación háptica/visual y acción de `Copiar al Portapapeles` con 1 solo toque.

---

## 🛡️ 3. Protocolo de Anti-Error y Protección del Jugador

1. **Pre-Flight Check Obligatorio:**
   - Ninguna orden puede pasar al paso de pago sin antes haber validado el ID del jugador y haber mostrado el Nickname real y nivel.
   - Si el ID no existe o no tiene formato válido, debe mostrarse una advertencia en rojo y reproducir `sound.playAlert()`.

2. **Doble Confirmación (Layer 1 Checkbox):**
   - El usuario debe marcar activamente el checkbox que confirma que el Nickname en pantalla es el suyo. Esto elimina disputas de clientes que introducen UIDs ajenos.

3. **Rastreo Transparente (Order Tracking):**
   - Todo pedido completado debe generar un comprobante estandarizado con ID de orden, referencia bancaria, monto pagado en Bs y USDT, y garantía Anti-Ban.

---

## 📋 4. Convenciones de Código y Archivos

- Los nombres de componentes React deben utilizar `PascalCase` (ej. `RechargeTerminal.tsx`).
- Los nombres de funciones y variables deben ser descriptivos en `camelCase`.
- Los nombres de constantes estáticas deben ir en `UPPER_SNAKE_CASE`.
- Mantener los comentarios descriptivos y la documentación intacta al realizar ediciones quirúrgicas en archivos existentes.
