const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

// Ensure directories
['public/assets/games', 'public/assets/logos', 'public/assets/banners'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://google.com/'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = `${u.protocol}//${u.host}${redirectUrl}`;
        }
        return downloadFile(redirectUrl, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const stat = fs.statSync(dest);
        if (stat.size < 100) {
          fs.unlinkSync(dest);
          reject(new Error(`File too small (${stat.size} bytes)`));
        } else {
          resolve(stat.size);
        }
      });
    });
    req.on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
    req.setTimeout(20000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// 1. Real Game and Platform Covers (Authentic photographs/wallpapers)
const GAME_COVERS = {
  'valorant': 'https://media.rawg.io/media/resize/1280/-/games/b11/b11127b9ee3c3701bd15b9af3286d20e.jpg',
  'free-fire': 'https://media.rawg.io/media/resize/1280/-/screenshots/a2f/a2fc4a4a2c67b74b29bc6f4959c24f93.jpg',
  'mobile-legends': 'https://media.rawg.io/media/resize/1280/-/screenshots/d57/d57f217454e00c0e5a220ed9d2953459.jpeg',
  'cod-mobile': 'https://media.rawg.io/media/resize/1280/-/games/08f/08f242250bb76520879f116aa7cf33cf.jpg',
  'fc-24': 'https://cdn.cloudflare.steamstatic.com/steam/apps/2195250/library_hero.jpg',
  'roblox': 'https://media.rawg.io/media/resize/1280/-/games/3af/3af386b6e26be6741b711ae6215ef42f.jpg',
  'brawl-stars': 'https://media.rawg.io/media/resize/1280/-/screenshots/e94/e94aac28a7b797d4647d448cab957dc5.jpg',
  'pubg-mobile': 'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/library_hero.jpg',
  'steam': 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/library_hero.jpg',
  'playstation': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=85',
  'xbox': 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=1200&q=85',
  'google-play': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=85',
  'apple': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1200&q=85',
  'netflix': 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=85',
  'spotify': 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=1200&q=85',
  'zinli': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=85',
  'shein': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=85',
  'discord-nitro': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85'
};

// 2. High-impact Widescreen Hero Banners
const HERO_BANNERS = {
  'banner-valorant': 'https://media.rawg.io/media/resize/1280/-/games/b11/b11127b9ee3c3701bd15b9af3286d20e.jpg',
  'banner-freefire': 'https://media.rawg.io/media/resize/1280/-/screenshots/a2f/a2fc4a4a2c67b74b29bc6f4959c24f93.jpg',
  'banner-fc24': 'https://cdn.cloudflare.steamstatic.com/steam/apps/2195250/library_hero.jpg',
  'banner-mlbb': 'https://media.rawg.io/media/resize/1280/-/screenshots/d57/d57f217454e00c0e5a220ed9d2953459.jpeg',
  'banner-wallets': 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/library_hero.jpg'
};

// 3. Official Logos (SimpleIcons CDN & Vector SVGs)
const SIMPLE_ICONS = {
  'steam': 'https://cdn.simpleicons.org/steam/white',
  'playstation': 'https://cdn.simpleicons.org/playstation/white',
  'roblox': 'https://cdn.simpleicons.org/roblox/white',
  'netflix': 'https://cdn.simpleicons.org/netflix/red',
  'spotify': 'https://cdn.simpleicons.org/spotify/green',
  'discord-nitro': 'https://cdn.simpleicons.org/discord/white',
  'apple': 'https://cdn.simpleicons.org/apple/white',
  'google-play': 'https://cdn.simpleicons.org/googleplay',
  'shein': 'https://cdn.simpleicons.org/shein/white'
};

// Custom high-fidelity SVGs for games without SimpleIcons
const GAME_SVGS = {
  'free-fire': `<svg viewBox="0 0 450 110" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ffGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FF512F" />
        <stop offset="50%" stop-color="#DD2476" />
        <stop offset="100%" stop-color="#FFD200" />
      </linearGradient>
      <filter id="ffShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.9" />
      </filter>
    </defs>
    <g filter="url(#ffShadow)">
      <text x="50%" y="78" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-style="italic" font-weight="900" font-size="64" fill="#FFFFFF" letter-spacing="4" stroke="#000" stroke-width="3">
        FREE <tspan fill="url(#ffGrad)">FIRE</tspan>
      </text>
    </g>
  </svg>`,

  'valorant': `<svg viewBox="0 0 420 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="valShadow">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity="0.9"/>
      </filter>
    </defs>
    <g filter="url(#valShadow)">
      <polygon points="35,22 80,22 55,80 35,22" fill="#FF4655"/>
      <polygon points="90,22 105,22 78,85 63,85" fill="#FF4655"/>
      <text x="135" y="74" font-family="'Arial Black', sans-serif" font-weight="900" font-size="54" fill="#FFFFFF" letter-spacing="8">VALORANT</text>
    </g>
  </svg>`,

  'mobile-legends': `<svg viewBox="0 0 500 110" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mlGold" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFE259"/>
        <stop offset="100%" stop-color="#FFA751"/>
      </linearGradient>
    </defs>
    <g filter="drop-shadow(0 4px 8px rgba(0,0,0,0.9))">
      <path d="M40,25 L70,15 L95,45 L70,85 L40,65 Z" fill="url(#mlGold)" stroke="#FFF" stroke-width="2"/>
      <text x="270" y="55" text-anchor="middle" font-family="'Arial Black', sans-serif" font-weight="900" font-size="38" fill="#FFFFFF" letter-spacing="3">MOBILE LEGENDS</text>
      <text x="270" y="90" text-anchor="middle" font-family="'Impact', sans-serif" font-size="28" fill="url(#mlGold)" letter-spacing="8">BANG BANG</text>
    </g>
  </svg>`,

  'fc-24': `<svg viewBox="0 0 380 100" xmlns="http://www.w3.org/2000/svg">
    <g filter="drop-shadow(0 4px 8px rgba(0,0,0,0.9))">
      <polygon points="35,20 85,20 60,82" fill="#00FF87"/>
      <text x="110" y="72" font-family="'Arial Black', sans-serif" font-weight="900" font-size="56" fill="#FFFFFF" letter-spacing="4">FC 24</text>
    </g>
  </svg>`,

  'cod-mobile': `<svg viewBox="0 0 450 110" xmlns="http://www.w3.org/2000/svg">
    <g filter="drop-shadow(0 4px 8px rgba(0,0,0,0.9))">
      <text x="50%" y="50" text-anchor="middle" font-family="'Impact', sans-serif" font-size="46" fill="#FFFFFF" letter-spacing="3">CALL OF DUTY</text>
      <rect x="150" y="66" width="150" height="26" rx="4" fill="#F59E0B"/>
      <text x="50%" y="85" text-anchor="middle" font-family="'Arial Black', sans-serif" font-weight="900" font-size="19" fill="#000" letter-spacing="5">MOBILE</text>
    </g>
  </svg>`,

  'brawl-stars': `<svg viewBox="0 0 420 110" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bsYellow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFF200"/>
        <stop offset="100%" stop-color="#F39C12"/>
      </linearGradient>
    </defs>
    <g filter="drop-shadow(0 4px 8px rgba(0,0,0,0.9))">
      <polygon points="65,15 80,45 110,48 85,70 95,100 65,82 35,100 45,70 20,48 50,45" fill="url(#bsYellow)" stroke="#000" stroke-width="3"/>
      <text x="260" y="55" text-anchor="middle" font-family="'Arial Black', sans-serif" font-weight="900" font-size="40" fill="url(#bsYellow)" stroke="#000" stroke-width="2">BRAWL</text>
      <text x="260" y="94" text-anchor="middle" font-family="'Arial Black', sans-serif" font-weight="900" font-size="40" fill="#FFFFFF" stroke="#000" stroke-width="2">STARS</text>
    </g>
  </svg>`,

  'pubg-mobile': `<svg viewBox="0 0 420 100" xmlns="http://www.w3.org/2000/svg">
    <g filter="drop-shadow(0 4px 8px rgba(0,0,0,0.9))">
      <rect x="25" y="20" width="170" height="60" rx="6" fill="#F59E0B" stroke="#000" stroke-width="2"/>
      <text x="110" y="65" text-anchor="middle" font-family="'Impact', sans-serif" font-size="44" fill="#000" letter-spacing="2">PUBG</text>
      <text x="280" y="68" font-family="'Arial Black', sans-serif" font-weight="900" font-size="40" fill="#FFFFFF" letter-spacing="4">MOBILE</text>
    </g>
  </svg>`,

  'xbox': `<svg viewBox="0 0 350 100" xmlns="http://www.w3.org/2000/svg">
    <g filter="drop-shadow(0 4px 8px rgba(0,0,0,0.9))">
      <circle cx="55" cy="50" r="35" fill="#107C10"/>
      <path d="M38,36 Q55,50 72,36 M38,64 Q55,50 72,64" stroke="#FFF" stroke-width="7" fill="none" stroke-linecap="round"/>
      <text x="115" y="66" font-family="'Arial Black', sans-serif" font-weight="900" font-size="48" fill="#FFFFFF" letter-spacing="5">XBOX</text>
    </g>
  </svg>`,

  'zinli': `<svg viewBox="0 0 360 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="zinliGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6C5CE7"/>
        <stop offset="100%" stop-color="#A29BFE"/>
      </linearGradient>
    </defs>
    <g filter="drop-shadow(0 4px 8px rgba(0,0,0,0.9))">
      <rect x="25" y="20" width="60" height="60" rx="16" fill="url(#zinliGrad)"/>
      <path d="M42,36 L68,36 L48,64 L70,64" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="105" y="65" font-family="'Arial Black', sans-serif" font-weight="900" font-size="48" fill="#FFFFFF" letter-spacing="2">Zinli</text>
    </g>
  </svg>`
};

async function main() {
  console.log('=== 1. DOWNLOADING REAL GAME COVERS ===');
  for (const [slug, url] of Object.entries(GAME_COVERS)) {
    const dest = path.join('public/assets/games', `${slug}.jpg`);
    try {
      const size = await downloadFile(url, dest);
      console.log(`✓ [COVER] ${slug}: ${(size / 1024).toFixed(1)} KB`);
    } catch (e) {
      console.error(`✗ [COVER] ${slug}: ${e.message}`);
    }
  }

  console.log('\n=== 2. DOWNLOADING WIDESCREEN HERO BANNERS ===');
  for (const [name, url] of Object.entries(HERO_BANNERS)) {
    const dest = path.join('public/assets/banners', `${name}.jpg`);
    try {
      const size = await downloadFile(url, dest);
      console.log(`✓ [BANNER] ${name}: ${(size / 1024).toFixed(1)} KB`);
    } catch (e) {
      console.error(`✗ [BANNER] ${name}: ${e.message}`);
    }
  }

  console.log('\n=== 3. DOWNLOADING & SAVING OFFICIAL LOGOS ===');
  // SimpleIcons
  for (const [slug, url] of Object.entries(SIMPLE_ICONS)) {
    const dest = path.join('public/assets/logos', `${slug}.svg`);
    try {
      const size = await downloadFile(url, dest);
      console.log(`✓ [LOGO-CDN] ${slug}: ${size} bytes`);
    } catch (e) {
      console.error(`✗ [LOGO-CDN] ${slug}: ${e.message}`);
    }
  }

  // Custom high-fidelity SVGs
  for (const [slug, svg] of Object.entries(GAME_SVGS)) {
    const dest = path.join('public/assets/logos', `${slug}.svg`);
    fs.writeFileSync(dest, svg.trim());
    console.log(`✓ [LOGO-SVG] ${slug}: saved (${svg.length} bytes)`);
  }

  console.log('\n=== ASSET PIPELINE COMPLETE ===');
}

main();
