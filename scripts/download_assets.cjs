const fs = require('fs');
const https = require('https');
const path = require('path');

// Ensure directories
['public/assets/games', 'public/assets/logos'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed ${url}: status ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    });
    req.on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// 18 High-res curated game and platform covers
const COVERS = {
  'free-fire': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85',
  'valorant': 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=85',
  'mobile-legends': 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=85',
  'cod-mobile': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=85',
  'fc-24': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=85',
  'roblox': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85',
  'brawl-stars': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
  'pubg-mobile': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=85',
  'playstation': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=85',
  'xbox': 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=1200&q=85',
  'google-play': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=85',
  'apple': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1200&q=85',
  'steam': 'https://images.unsplash.com/photo-1612287233207-69c5e3966580?auto=format&fit=crop&w=1200&q=85',
  'netflix': 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=85',
  'spotify': 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=1200&q=85',
  'zinli': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=85',
  'shein': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=85',
  'discord-nitro': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85'
};

// Clean vector logos for platforms and games
const LOGOS = {
  'free-fire': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="75%" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="70" fill="#FFFFFF" letter-spacing="4" stroke="#FF5500" stroke-width="2" font-style="italic">FREE FIRE</text>
  </svg>`,
  'valorant': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <path d="M70 25 L120 25 L95 85 L70 25 Z" fill="#FF4655"/>
    <path d="M130 25 L145 25 L115 95 L90 95 Z" fill="#FF4655"/>
    <text x="170" y="78" font-family="'Arial Black', sans-serif" font-weight="900" font-size="52" fill="#FFFFFF" letter-spacing="8">VALORANT</text>
  </svg>`,
  'mobile-legends': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="60%" text-anchor="middle" font-family="'Arial Black', sans-serif" font-weight="900" font-size="44" fill="#E2E8F0" letter-spacing="3">MOBILE LEGENDS</text>
    <text x="50%" y="85%" text-anchor="middle" font-family="'Arial', sans-serif" font-weight="800" font-size="20" fill="#F6AD55" letter-spacing="6">BANG BANG</text>
  </svg>`,
  'cod-mobile': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="58%" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="50" fill="#FFFFFF" letter-spacing="3">CALL OF DUTY</text>
    <rect x="180" y="74" width="140" height="24" rx="4" fill="#F59E0B"/>
    <text x="50%" y="91%" text-anchor="middle" font-family="'Arial Black', sans-serif" font-size="18" fill="#000000" letter-spacing="4">MOBILE</text>
  </svg>`,
  'fc-24': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <polygon points="60,30 110,30 85,90" fill="#10B981" />
    <text x="130" y="78" font-family="'Arial Black', sans-serif" font-weight="900" font-size="56" fill="#FFFFFF" letter-spacing="4">FC 24</text>
  </svg>`,
  'roblox': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="60" y="30" width="60" height="60" rx="8" transform="rotate(15 90 60)" fill="#EF4444"/>
    <rect x="78" y="48" width="24" height="24" rx="3" transform="rotate(15 90 60)" fill="#09090B"/>
    <text x="150" y="78" font-family="'Arial Black', sans-serif" font-weight="900" font-size="56" fill="#FFFFFF" letter-spacing="6">ROBLOX</text>
  </svg>`,
  'brawl-stars': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="56%" text-anchor="middle" font-family="'Arial Black', sans-serif" font-weight="900" font-size="44" fill="#FBBF24" stroke="#000" stroke-width="2">BRAWL</text>
    <text x="50%" y="94%" text-anchor="middle" font-family="'Arial Black', sans-serif" font-weight="900" font-size="44" fill="#FBBF24" stroke="#000" stroke-width="2">STARS</text>
  </svg>`,
  'pubg-mobile': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="30" width="160" height="60" rx="6" fill="#F59E0B"/>
    <text x="120" y="74" text-anchor="middle" font-family="'Impact', sans-serif" font-size="44" fill="#000000" letter-spacing="2">PUBG</text>
    <text x="230" y="75" font-family="'Arial Black', sans-serif" font-size="42" fill="#FFFFFF" letter-spacing="3">MOBILE</text>
  </svg>`,
  'playstation': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="80" cy="60" r="38" fill="#003791"/>
    <path d="M70,42 Q80,35 90,42 Q90,75 75,75 Q65,75 65,65 Z" fill="#FFFFFF"/>
    <text x="140" y="74" font-family="'Arial Black', sans-serif" font-size="40" fill="#FFFFFF" letter-spacing="2">PlayStation</text>
  </svg>`,
  'xbox': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="80" cy="60" r="38" fill="#107C10"/>
    <path d="M60,45 Q80,60 100,45 M60,75 Q80,60 100,75" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round"/>
    <text x="140" y="74" font-family="'Arial Black', sans-serif" font-size="46" fill="#FFFFFF" letter-spacing="4">XBOX</text>
  </svg>`,
  'google-play': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <polygon points="60,35 105,60 60,85" fill="#00E676"/>
    <polygon points="60,35 95,54 85,60" fill="#00B0FF"/>
    <polygon points="60,85 95,66 85,60" fill="#FF3D00"/>
    <polygon points="105,60 92,52 85,60 92,68" fill="#FFC400"/>
    <text x="130" y="74" font-family="'Arial Black', sans-serif" font-size="38" fill="#FFFFFF">Google Play</text>
  </svg>`,
  'apple': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <path d="M80,38 Q85,30 92,30 Q90,38 83,41 M75,44 Q80,44 85,46 Q92,44 97,48 Q95,65 85,78 Q80,85 75,85 Q70,85 66,78 Q58,68 62,54 Q65,44 75,44 Z" fill="#FFFFFF"/>
    <text x="120" y="72" font-family="'Arial Black', sans-serif" font-size="40" fill="#FFFFFF">Apple Card</text>
  </svg>`,
  'steam': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="80" cy="60" r="38" fill="#171A21"/>
    <circle cx="95" cy="50" r="12" fill="#66C0F4"/>
    <circle cx="70" cy="72" r="8" fill="#66C0F4"/>
    <line x1="90" y1="53" x2="73" y2="70" stroke="#66C0F4" stroke-width="5"/>
    <text x="140" y="74" font-family="'Arial Black', sans-serif" font-size="48" fill="#FFFFFF" letter-spacing="4">STEAM</text>
  </svg>`,
  'netflix': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="76%" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="64" fill="#E50914" letter-spacing="6">NETFLIX</text>
  </svg>`,
  'spotify': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="80" cy="60" r="38" fill="#1DB954"/>
    <path d="M60,52 Q80,46 100,53 M63,61 Q80,56 97,62 M66,70 Q80,66 94,71" stroke="#000000" stroke-width="5" fill="none" stroke-linecap="round"/>
    <text x="140" y="74" font-family="'Arial Black', sans-serif" font-size="42" fill="#FFFFFF" letter-spacing="2">Spotify</text>
  </svg>`,
  'zinli': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="50" y="32" width="70" height="56" rx="10" fill="#7C3AED"/>
    <circle cx="85" cy="60" r="16" fill="#FBBF24"/>
    <text x="145" y="74" font-family="'Arial Black', sans-serif" font-weight="900" font-size="50" fill="#FFFFFF" letter-spacing="3">zinli</text>
  </svg>`,
  'shein': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="76%" text-anchor="middle" font-family="'Impact', sans-serif" font-size="62" fill="#FFFFFF" letter-spacing="12">SHEIN</text>
  </svg>`,
  'discord-nitro': `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="80" cy="60" r="38" fill="#5865F2"/>
    <path d="M65,55 Q80,50 95,55 L90,72 Q80,68 70,72 Z" fill="#FFFFFF"/>
    <text x="140" y="74" font-family="'Arial Black', sans-serif" font-size="44" fill="#5865F2" letter-spacing="3">NITRO</text>
  </svg>`
};

async function main() {
  console.log('1. Saving vector logos...');
  for (const [slug, svg] of Object.entries(LOGOS)) {
    const filePath = path.join('public/assets/logos', `${slug}.svg`);
    fs.writeFileSync(filePath, svg.trim(), 'utf8');
  }
  console.log('✓ All 18 logos written to public/assets/logos/');

  console.log('2. Downloading game covers...');
  for (const [slug, url] of Object.entries(COVERS)) {
    const dest = path.join('public/assets/games', `${slug}.jpg`);
    try {
      await download(url, dest);
      console.log(`✓ Saved ${slug}.jpg`);
    } catch (err) {
      console.warn(`! Fallback for ${slug}: ${err.message}`);
    }
  }
  console.log('Asset generation complete!');
}

main().catch(console.error);
