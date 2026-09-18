export type GameSlug =
  | 'free-fire'
  | 'cod-mobile'
  | 'fc-26'
  | 'fc-24'
  | 'pubg-mobile'
  | 'roblox'
  | 'mobile-legends'
  | 'brawl-stars'
  | 'zinli'
  | 'netflix'
  | 'spotify'
  | 'steam'
  | 'shein'
  | 'playstation'
  | 'xbox'
  | 'google-play'
  | 'apple'
  | 'valorant'
  | 'discord-nitro';

export interface Game {
  id: GameSlug;
  name: string;
  category: string;
  serviceType?: 'game' | 'wallet' | 'giftcard' | 'subscription';
  deliveryTime: string;
  providerTag: string;
  publisher?: string;
  iconName: string;
  coverImage: string;
  logoImage?: string;
  badgeText?: string;
  activePassName?: string;
  description: string;
  minPriceBs: number;
  serverRegions: string[];
  idPlaceholder: string;
  idFormatHint: string;
  accountIdentifierLabel?: string;
  accountType?: 'uid' | 'zone_uid' | 'username' | 'email' | 'tag' | 'riot_id';
  themeColor?: string;
  glowColor?: string;
  requiresZoneId?: boolean;
  zonePlaceholder?: string;
  zoneFormatHint?: string;
  regexPattern: string;
}

export type PackageCategory = 'diamonds' | 'passes' | 'neon' | 'balance' | 'giftcards' | 'emotes_skins';

export interface GamePackage {
  id: string;
  gameSlug: GameSlug;
  name: string;
  category: PackageCategory;
  amount: number;
  bonusAmount: number;
  unit: string;
  priceBs: number;
  priceUsdt: number;
  tag?: string;
  tagColor?: 'primary' | 'tertiary' | 'warning';
  itemType?: 'currency' | 'battle_pass' | 'emote' | 'skin' | 'combo' | 'balance' | 'membership';
  description?: string;
  previewIcon?: string;
}

export interface PlayerVerification {
  isValid: boolean;
  nickname: string;
  level: number;
  server: string;
  avatarUrl?: string;
  uid: string;
  verifiedAt: string;
}

export type PaymentMethodType = 'pagomovil' | 'binance' | 'banesco' | 'wallet';

export interface PaymentOption {
  id: PaymentMethodType;
  title: string;
  subtitle: string;
  icon: string;
  fee: string;
  badge?: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'PROCESSING_BOT'
  | 'COMPLETED'
  | 'FAILED_RETRY'
  | 'MANUAL_REQUIRED'
  | 'pending'
  | 'completed';

export interface Order {
  id: string;
  userId?: string;
  gameId?: string;
  gameSlug?: GameSlug;
  gameName: string;
  packageId: string;
  packageName: string;
  targetPlayerId: string;
  targetZoneId?: string;
  verifiedNickname: string;
  amountBs: number;
  amountUsdt: number;
  paymentMethod: PaymentMethodType;
  paymentReference: string;
  status: OrderStatus;
  createdAt: string;
  completedAt?: string;
  botAttempts?: number;
  botLatencyMs?: number;
  receiptNumber?: string;
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  gameSlug: GameSlug;
  format: string;
  mode: string;
  prizePoolUsd: number;
  prizePoolBs: number;
  firstPlaceUsd: number;
  secondPlaceUsd: number;
  thirdPlaceUsd: number;
  maxTeams: number;
  registeredTeams: number;
  entryFeeUsd: number;
  entryFeeBs: number;
  checkInDeadline: string;
  status: 'OPEN' | 'CHECK_IN' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface BracketMatch {
  id: string;
  stage: 'quarters' | 'semis' | 'final';
  roundLabel: string;
  team1: { name: string; score: number | string; isWinner?: boolean };
  team2: { name: string; score: number | string; isWinner?: boolean };
  status: 'finished' | 'in_progress' | 'waiting' | 'scheduled';
  mvp?: string;
  currentMap?: string;
  time?: string;
}

export interface CommunityMessage {
  id: string;
  author: string;
  role?: 'ADMIN' | 'CHAMPION' | 'VETERAN' | 'RECRUIT';
  badge?: string;
  badgeColor?: string;
  channel?: string;
  text?: string;
  content?: string;
  timestamp: string;
  avatar?: string;
  avatarColor?: string;
  reactions?: { emoji: string; count: number }[];
}

export interface DaemonLog {
  id: string;
  time: string;
  type: 'DISPATCH' | 'PAGO_MOVIL' | 'INYECCION' | 'BINANCE_PAY' | 'SECURITY' | 'AUTO';
  message: string;
  latency?: string;
}
