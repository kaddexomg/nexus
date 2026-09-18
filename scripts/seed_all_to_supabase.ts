import { createClient } from '@supabase/supabase-js';
import { GAMES_DATA, PACKAGES_DATA } from './src/data/mockData';

const SUPABASE_URL = 'https://qiykiwhipbcvnyfqoyuz.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWtpd2hpcGJjdm55ZnFveXV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTY4ODIzMiwiZXhwIjoyMTA1MjY0MjMyfQ.Tt5139uoNYnK7AujoTb7kp7t0oIsLajVeZBPf_-WHyk';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function main() {
  console.log('Seeding products...');
  for (const game of GAMES_DATA) {
    const productRecord = {
      id: game.id,
      name: game.name,
      category: game.category,
      service_type: game.serviceType || 'game',
      provider_tag: game.providerTag,
      publisher: game.publisher || '',
      icon_name: game.iconName,
      cover_image: game.coverImage,
      banner_image: game.coverImage,
      badge_text: game.badgeText || '',
      description: game.description,
      delivery_time: game.deliveryTime,
      account_identifier_label: game.accountIdentifierLabel || 'ID de Jugador / Cuenta',
      account_type: game.accountType || 'uid',
      requires_zone_id: game.requiresZoneId || false,
      regex_pattern: game.regexPattern || '',
      min_price_usd: Number((game.minPriceBs / 68.9).toFixed(2)),
      is_active: true
    };
    const { error: pErr } = await supabase.from('products').upsert(productRecord);
    if (pErr) console.error(`Error with product ${game.id}:`, pErr);
  }
  console.log(`Finished products. Total: ${GAMES_DATA.length}`);

  console.log('Seeding packages...');
  let totalPkgs = 0;
  for (const [gameSlug, pkgs] of Object.entries(PACKAGES_DATA)) {
    for (const pkg of pkgs) {
      const pkgRecord = {
        id: pkg.id,
        product_id: gameSlug,
        name: pkg.name,
        category: pkg.category,
        amount: pkg.amount,
        bonus_amount: pkg.bonusAmount || 0,
        unit: pkg.unit,
        price_usd: pkg.priceUsdt,
        tag: pkg.tag || '',
        tag_color: pkg.tagColor || 'primary',
        item_type: pkg.itemType || 'currency',
        description: pkg.description || '',
        is_active: true
      };
      const { error: kErr } = await supabase.from('packages').upsert(pkgRecord);
      if (kErr) console.error(`Error with package ${pkg.id}:`, kErr);
      else totalPkgs++;
    }
  }
  console.log(`Finished packages. Upserted: ${totalPkgs}`);
}

main().then(() => console.log('All done!')).catch(console.error);
