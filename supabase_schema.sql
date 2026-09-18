-- ═══════════════════════════════════════════════════════════════════════════
-- NEXUS RECHARGE — SUPABASE COMPLETE BACKEND SCHEMA & AUTOMATION ENGINE
-- Compatible con PostgreSQL 16 y Supabase Cloud
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── 1. TABLA: PROFILES (Perfiles de Usuarios vinculados a Auth) ───────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    phone VARCHAR(50),
    avatar_url TEXT,
    role VARCHAR(30) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'referee', 'operator')),
    wallet_balance_usd NUMERIC(12, 2) DEFAULT 0.00 CHECK (wallet_balance_usd >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su propio perfil" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Trigger para crear perfil automáticamente al registrarse en Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, role, wallet_balance_usd)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'phone',
        'user',
        0.00
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 2. TABLA: PRODUCTS (Catálogo Oficial con Logos y Banners) ────────────
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(50) PRIMARY KEY, -- ej: 'free-fire', 'fc-24', 'zinli', 'netflix'
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    service_type VARCHAR(30) NOT NULL CHECK (service_type IN ('game', 'wallet', 'giftcard', 'subscription')),
    provider_tag VARCHAR(100) NOT NULL,
    publisher VARCHAR(100),
    icon_name VARCHAR(50) NOT NULL,
    cover_image TEXT NOT NULL,
    banner_image TEXT,
    badge_text VARCHAR(100),
    description TEXT,
    delivery_time VARCHAR(50) DEFAULT '1.8 seg',
    account_identifier_label VARCHAR(150) DEFAULT 'ID de Jugador (UID)',
    account_type VARCHAR(30) DEFAULT 'uid' CHECK (account_type IN ('uid', 'zone_uid', 'username', 'email', 'tag')),
    requires_zone_id BOOLEAN DEFAULT FALSE,
    regex_pattern TEXT,
    min_price_usd NUMERIC(10, 2) DEFAULT 0.95,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Catálogo público para todos" ON public.products FOR SELECT USING (is_active = TRUE);

-- ── 3. TABLA: PACKAGES (Denominaciones de Recargas y Pases) ───────────────
CREATE TABLE IF NOT EXISTS public.packages (
    id VARCHAR(80) PRIMARY KEY, -- ej: 'ff-1060', 'fc-pass', 'nfx-profile-1m'
    product_id VARCHAR(50) NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'diamonds',
    amount NUMERIC(12, 2) NOT NULL,
    bonus_amount NUMERIC(12, 2) DEFAULT 0,
    unit VARCHAR(30) DEFAULT '💎',
    price_usd NUMERIC(10, 2) NOT NULL,
    tag VARCHAR(80),
    tag_color VARCHAR(30) DEFAULT 'primary',
    item_type VARCHAR(50) DEFAULT 'currency',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Paquetes públicos para todos" ON public.packages FOR SELECT USING (is_active = TRUE);

-- ── 4. MOTOR DE AUTOMATIZACIÓN: INVENTORY PINS (Códigos Digitales) ───────
-- Aquí se precargan los pines de Netflix, Spotify, Steam y E-PINs de Free Fire
-- Cuando un pago es aprobado, el sistema despacha el PIN en 1.8 segundos
CREATE TABLE IF NOT EXISTS public.inventory_pins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(50) NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    package_id VARCHAR(80) REFERENCES public.packages(id) ON DELETE SET NULL,
    pin_code TEXT NOT NULL, -- Código o credencial cifrada
    pin_serial VARCHAR(100),
    status VARCHAR(30) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESERVED', 'REDEEMED', 'EXPIRED')),
    order_id UUID, -- Se vincula automáticamente al ser despachado
    batch_reference VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    redeemed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.inventory_pins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Solo administradores ven pines" ON public.inventory_pins FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'operator'))
);

-- ── 5. TABLA: ORDERS (Registro de Órdenes y Comprobantes) ─────────────────
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    product_id VARCHAR(50) NOT NULL REFERENCES public.products(id),
    package_id VARCHAR(80) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    package_name VARCHAR(150) NOT NULL,
    target_identifier VARCHAR(255) NOT NULL, -- UID, correo o @usuario
    target_zone_id VARCHAR(50), -- Server Zone ID para MLBB
    verified_nickname VARCHAR(150),
    amount_usd NUMERIC(10, 2) NOT NULL,
    amount_bs NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('pagomovil', 'binance', 'banesco', 'wallet')),
    payment_reference VARCHAR(100),
    receipt_url TEXT,
    delivered_pin TEXT, -- Código digital asignado automáticamente
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'PROCESSING', 'COMPLETED', 'FAILED', 'REJECTED')),
    bot_latency_ms INT DEFAULT 1800,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios ven sus órdenes" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios crean órdenes" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Público busca por ID o Ref" ON public.orders FOR SELECT USING (TRUE);

-- ── 6. FUNCIÓN DE DESPACHO AUTOMÁTICO EN 1 SEGUNDO ──────────────────────
-- Esta función atomiza el despacho: asume un PIN disponible y completa la orden
CREATE OR REPLACE FUNCTION public.dispatch_instant_order(
    p_order_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_pin RECORD;
BEGIN
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Orden no encontrada');
    END IF;

    -- Buscar PIN disponible para este producto y paquete
    SELECT * INTO v_pin FROM public.inventory_pins 
    WHERE product_id = v_order.product_id 
      AND (package_id = v_order.package_id OR package_id IS NULL)
      AND status = 'AVAILABLE'
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

    IF FOUND THEN
        -- Marcar PIN como canjeado y asignarlo a la orden
        UPDATE public.inventory_pins 
        SET status = 'REDEEMED', order_id = v_order.id, redeemed_at = NOW() 
        WHERE id = v_pin.id;

        UPDATE public.orders 
        SET status = 'COMPLETED', delivered_pin = v_pin.pin_code, completed_at = NOW() 
        WHERE id = v_order.id;

        RETURN jsonb_build_object('success', true, 'pin', v_pin.pin_code, 'mode', 'INSTANT_PIN');
    ELSE
        -- Si no hay PIN en stock, marcar en procesamiento automático para bot
        UPDATE public.orders 
        SET status = 'PROCESSING' 
        WHERE id = v_order.id;

        RETURN jsonb_build_object('success', true, 'mode', 'BOT_WORKER_QUEUED');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 7. TABLA: TOURNAMENTS (Torneos con $1/kill, EA FC 24, FF y COD) ──────
CREATE TABLE IF NOT EXISTS public.tournaments (
    id VARCHAR(80) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    game_slug VARCHAR(50) NOT NULL REFERENCES public.products(id),
    game_name VARCHAR(100) NOT NULL,
    format VARCHAR(50) NOT NULL CHECK (format IN ('BATTLE_ROYALE', '1V1_H2H', 'CLASH_SQUAD_4V4', 'ARENA_5V5')),
    mode VARCHAR(100) NOT NULL,
    entry_fee_usd NUMERIC(10, 2) NOT NULL DEFAULT 3.00,
    total_prize_pool_usd NUMERIC(10, 2) NOT NULL,
    placement_prize_pool_usd NUMERIC(10, 2) NOT NULL,
    kill_prize_pool_usd NUMERIC(10, 2) DEFAULT 0.00,
    prize_per_kill_usd NUMERIC(10, 2) DEFAULT 1.00,
    platform_rake_percent NUMERIC(5, 2) DEFAULT 15.00, -- 15% ganancia neta para Nexus
    max_teams INT NOT NULL,
    registered_teams INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'REGISTRATION_OPEN' CHECK (status IN ('REGISTRATION_OPEN', 'CHECK_IN', 'IN_PROGRESS', 'COMPLETED')),
    room_id VARCHAR(100),
    room_password VARCHAR(100),
    server_region VARCHAR(100) DEFAULT 'Sudamérica (SAC)',
    scheduled_at VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Torneos visibles para todos" ON public.tournaments FOR SELECT USING (TRUE);

-- ── 8. TABLA: TOURNAMENT_TEAMS (Inscripciones de Escuadras) ───────────────
CREATE TABLE IF NOT EXISTS public.tournament_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id VARCHAR(80) NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    team_name VARCHAR(100) NOT NULL,
    team_tag VARCHAR(10) NOT NULL,
    captain_uid VARCHAR(100) NOT NULL,
    captain_whatsapp VARCHAR(50) NOT NULL,
    player2_uid VARCHAR(100),
    player3_uid VARCHAR(100),
    player4_uid VARCHAR(100),
    substitute_uid VARCHAR(100),
    total_kills INT DEFAULT 0,
    placement_position INT,
    kill_earnings_usd NUMERIC(10, 2) DEFAULT 0.00,
    placement_prize_usd NUMERIC(10, 2) DEFAULT 0.00,
    total_prize_usd NUMERIC(10, 2) DEFAULT 0.00,
    is_checked_in BOOLEAN DEFAULT FALSE,
    slot_number INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tournament_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver escuadras de torneos" ON public.tournament_teams FOR SELECT USING (TRUE);

-- ── 9. SEED DATA OFICIAL (Imágenes HD, Banners y Datos Iniciales) ─────────
INSERT INTO public.products (id, name, category, service_type, provider_tag, publisher, icon_name, cover_image, banner_image, badge_text, description, delivery_time, account_identifier_label, account_type, regex_pattern, min_price_usd, sort_order)
VALUES
('free-fire', 'Free Fire', 'Battle Royale', 'game', 'Garena SAC Direct', 'Garena', 'local_fire_department', 
 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=85',
 'Pase Booyah & Membresías', 'Diamantes oficiales directos por UID con acreditación en 1.8 segundos.', '1.8 seg', 'ID de Jugador (UID)', 'uid', '^\d{8,12}$', 0.95, 1),

('fc-24', 'EA Sports FC 24 Mobile', 'Deportes', 'game', 'EA Sports Direct', 'Electronic Arts', 'sports_soccer',
 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1600&q=85',
 'FC Points & Pase Estrella', 'FC Points y Joyas oficiales para armar tu plantilla Ultimate Team con jugadores del evento actual.', 'Automático', 'UID de EA FC Mobile', 'uid', '^\d{8,12}$', 4.90, 2),

('cod-mobile', 'Call of Duty: Mobile', 'FPS Táctico', 'game', 'Activision Latam', 'Activision', 'save_as',
 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=85',
 'Ruletas Míticas & Pase', 'CP directos para ruletas míticas y cajas de suministros.', '2.1 seg', 'Player ID / UID Activision', 'uid', '^\d{8,12}$', 0.99, 3),

('mobile-legends', 'Mobile Legends: Bang Bang', 'MOBA 5v5', 'game', 'Moonton Smile API', 'Moonton', 'swords',
 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=85',
 'Pase Starlight & Diamantes', 'Diamantes oficiales con validación simultánea de User ID y Server Zone ID.', '1.5 seg', 'User ID de Mobile Legends', 'zone_uid', '^\d{6,10}$', 1.50, 4),

('roblox', 'Roblox', 'Sandbox & Blox Fruits', 'game', 'Roblox Corp', 'Roblox Corporation', 'token',
 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=85',
 'Robux & Premium 1 Mes', 'Robux directos a tu avatar sin pedir contraseña.', 'Inmediato', 'Nombre de Usuario (@Username)', 'username', '^[@0-9A-Za-z_-]{3,25}$', 5.00, 5),

('zinli', 'Zinli Dólares Visa', 'Billetera Digital', 'wallet', 'Zinli Visa Panamá', 'Zinli Inc.', 'credit_card',
 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=85',
 'Dólares Visa P2P 0% Fee', 'Dólares recargados a tu tarjeta virtual Zinli (Panamá) en 60 segundos con 0% comisión de red.', '60 seg (P2P)', 'Correo Electrónico de cuenta Zinli', 'email', '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', 5.40, 6),

('netflix', 'Netflix', 'Entretenimiento & Streaming', 'subscription', 'Netflix Oficial', 'Netflix Inc.', 'tv',
 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1600&q=85',
 'Pantallas Ultra HD 4K', 'Pines y tarjetas de regalo oficiales para recargar tu cuenta o pantallas privadas.', 'Inmediato (PIN)', 'Correo Electrónico de Entrega', 'email', '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', 4.00, 7),

('spotify', 'Spotify Premium', 'Entretenimiento & Streaming', 'subscription', 'Spotify AB', 'Spotify', 'music',
 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=1600&q=85',
 'Música Sin Anuncios', 'Disfruta de música sin límites ni anuncios y descargas offline en tu celular.', 'Inmediato (PIN)', 'Correo Electrónico de Entrega', 'email', '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', 3.00, 8),

('steam', 'Steam Wallet', 'Tarjetas de Regalo', 'giftcard', 'Valve Corporation', 'Valve', 'sports_esports',
 'https://images.unsplash.com/photo-1612287233207-69c5e3966580?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1612287233207-69c5e3966580?auto=format&fit=crop&w=1600&q=85',
 'Cartera USD Canjeable', 'Códigos digitales oficiales para recargar saldo en tu cuenta Steam y comprar cualquier juego.', 'Instantáneo (PIN)', 'Correo Electrónico de Entrega', 'email', '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', 5.25, 9),

('shein', 'Shein Moda', 'Tarjetas de Regalo', 'giftcard', 'Shein Global', 'Shein', 'shopping_bag',
 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=85',
 'Tarjetas de Regalo & Carrito', 'Tarjetas de regalo oficiales para compras de ropa con envío puerta a puerta.', '5 min (Gift Card)', 'Correo o WhatsApp de Entrega', 'email', '^[0-9A-Za-z@._-]{6,35}$', 10.70, 10)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    cover_image = EXCLUDED.cover_image,
    account_type = EXCLUDED.account_type,
    account_identifier_label = EXCLUDED.account_identifier_label;

-- ── 10. SEED TORNEOS (Incluyendo EA FC 24 y $1 por Kill) ─────────────────
INSERT INTO public.tournaments (id, title, game_slug, game_name, format, mode, entry_fee_usd, total_prize_pool_usd, placement_prize_pool_usd, kill_prize_pool_usd, prize_per_kill_usd, platform_rake_percent, max_teams, registered_teams, status, room_id, room_password, server_region, scheduled_at)
VALUES
('ff-copa-15', 'Copa Free Fire Escuadras #15 ($1/Kill)', 'free-fire', 'Free Fire', 'BATTLE_ROYALE', 
 'Bermuda & Purgatorio (Bo3 / 32 Escuadras)', 3.00, 96.00, 48.96, 32.64, 1.00, 15.00, 32, 24, 'REGISTRATION_OPEN', '948102', 'nexus2026', 'Sudamérica (SAC)', 'Sábado 8:00 PM VET'),

('fc24-champions-1', 'Copa EA Sports FC 24 Mobile — 1v1 Cara a Cara', 'fc-24', 'EA Sports FC 24 Mobile', '1V1_H2H',
 'Cara a Cara (H2H) 6 Minutos — Eliminación Directa Bo3', 5.00, 80.00, 70.00, 0.00, 0.00, 15.00, 16, 12, 'REGISTRATION_OPEN', 'H2H-FC24-01', 'nexusfc', 'América Latina', 'Domingo 6:00 PM VET'),

('cod-clash-4v4', 'Torneo COD Mobile 4v4 — Buscar & Destruir', 'cod-mobile', 'Call of Duty: Mobile', 'CLASH_SQUAD_4V4',
 'Buscar & Destruir Táctico Bo5', 5.00, 60.00, 40.00, 15.00, 1.00, 15.00, 16, 10, 'REGISTRATION_OPEN', '891042', 'cod2026', 'Activision Latam', 'Viernes 9:00 PM VET')
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    total_prize_pool_usd = EXCLUDED.total_prize_pool_usd;

-- ═══════════════════════════════════════════════════════════════════════════
-- FIN DEL SCRIPT SQL — Copiar y pegar en el SQL Editor de tu proyecto Supabase
-- ═══════════════════════════════════════════════════════════════════════════
