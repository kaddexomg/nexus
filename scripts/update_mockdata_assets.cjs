const fs = require('fs');
let content = fs.readFileSync('./src/data/mockData.ts', 'utf8');

const gameIds = [
  'free-fire', 'cod-mobile', 'fc-24', 'pubg-mobile', 'roblox',
  'mobile-legends', 'brawl-stars', 'zinli', 'netflix', 'spotify',
  'steam', 'shein', 'playstation', 'xbox', 'google-play', 'apple',
  'valorant', 'discord-nitro'
];

for (const id of gameIds) {
  // Replace coverImage for each game
  const regex = new RegExp(`(id:\\s*'${id}',[\\s\\S]*?coverImage:\\s*')[^']+(')`, 'm');
  content = content.replace(regex, `$1/assets/games/${id}.jpg$2,\n    logoImage: '/assets/logos/${id}.svg'`);
}

fs.writeFileSync('./src/data/mockData.ts', content, 'utf8');
console.log('Successfully updated mockData.ts with local assets and logos!');
