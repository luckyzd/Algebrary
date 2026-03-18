export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export const RARITY_LABELS: Record<Rarity, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
}

export interface Element {
  id: string
  name: string
  emoji: string
  description: string
  rarity?: Rarity
  discoveredAt?: number
  isStarter?: boolean
  isCustom?: boolean
}

export type Operator = '+' | '-' | '×' | '÷'

export interface Equation {
  left: Element
  operator: Operator
  right: Element
  result: Element
  timestamp: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  check: (ctx: AchievementContext) => boolean
}

export interface AchievementContext {
  elements: Element[]
  equations: Equation[]
  unlockedAchievements: string[]
  operatorUsage: Record<Operator, number>
}

export type ApiFormat = 'openai' | 'anthropic'

export interface AIConfig {
  endpoint: string
  apiKey: string
  model: string
  apiFormat: ApiFormat
}

export const ELEMENT_POOL: Element[] = [
  // 自然
  { id: 'fire', name: '火', emoji: '🔥', description: '燃烧的力量', isStarter: true },
  { id: 'water', name: '水', emoji: '💧', description: '流动的生命之源', isStarter: true },
  { id: 'earth', name: '土', emoji: '🌍', description: '坚实的大地', isStarter: true },
  { id: 'wind', name: '风', emoji: '💨', description: '自由的气流', isStarter: true },
  { id: 'light', name: '光', emoji: '☀️', description: '照亮万物的能量', isStarter: true },
  { id: 'darkness', name: '暗', emoji: '🌑', description: '深邃的黑暗', isStarter: true },
  { id: 'thunder', name: '雷', emoji: '⚡', description: '天空的怒吼', isStarter: true },
  { id: 'ice', name: '冰', emoji: '🧊', description: '凝固的寂静', isStarter: true },
  { id: 'snow', name: '雪', emoji: '❄️', description: '纯白的结晶', isStarter: true },
  { id: 'rain', name: '雨', emoji: '🌧️', description: '天空的眼泪', isStarter: true },
  { id: 'cloud', name: '云', emoji: '☁️', description: '漂浮的水汽', isStarter: true },
  { id: 'mountain', name: '山', emoji: '⛰️', description: '巍峨不动的巨人', isStarter: true },
  { id: 'ocean', name: '海', emoji: '🌊', description: '万物的摇篮', isStarter: true },
  { id: 'star', name: '星', emoji: '⭐', description: '夜空中的光点', isStarter: true },
  { id: 'moon', name: '月', emoji: '🌙', description: '夜晚的守望者', isStarter: true },
  { id: 'sun', name: '太阳', emoji: '☀️', description: '生命的源泉', isStarter: true },
  { id: 'sand', name: '沙', emoji: '🏜️', description: '时间磨碎的岩石', isStarter: true },
  { id: 'rainbow', name: '彩虹', emoji: '🌈', description: '光与雨的孩子', isStarter: true },
  { id: 'volcano', name: '火山', emoji: '🌋', description: '大地的愤怒', isStarter: true },
  // 生命
  { id: 'life', name: '生命', emoji: '🌱', description: '蓬勃生长的力量', isStarter: true },
  { id: 'death', name: '死亡', emoji: '💀', description: '终结与轮回', isStarter: true },
  { id: 'flower', name: '花', emoji: '🌸', description: '绽放的美丽', isStarter: true },
  { id: 'tree', name: '树', emoji: '🌳', description: '扎根大地的智者', isStarter: true },
  { id: 'seed', name: '种子', emoji: '🫘', description: '蕴含无限可能', isStarter: true },
  { id: 'bird', name: '鸟', emoji: '🐦', description: '翱翔天际的自由', isStarter: true },
  { id: 'fish', name: '鱼', emoji: '🐟', description: '水中的精灵', isStarter: true },
  { id: 'butterfly', name: '蝴蝶', emoji: '🦋', description: '蜕变的奇迹', isStarter: true },
  { id: 'dragon', name: '龙', emoji: '🐉', description: '传说中的神兽', isStarter: true },
  { id: 'cat', name: '猫', emoji: '🐱', description: '优雅的独行者', isStarter: true },
  { id: 'wolf', name: '狼', emoji: '🐺', description: '荒野的猎手', isStarter: true },
  // 抽象概念
  { id: 'time', name: '时间', emoji: '⏳', description: '永恒流逝的河流', isStarter: true },
  { id: 'space', name: '空间', emoji: '🌌', description: '无限延伸的虚空', isStarter: true },
  { id: 'love', name: '爱', emoji: '❤️', description: '连接万物的力量', isStarter: true },
  { id: 'dream', name: '梦', emoji: '💭', description: '意识深处的幻境', isStarter: true },
  { id: 'wisdom', name: '智慧', emoji: '🧠', description: '思考的结晶', isStarter: true },
  { id: 'courage', name: '勇气', emoji: '🦁', description: '面对未知的力量', isStarter: true },
  { id: 'hope', name: '希望', emoji: '🕊️', description: '黑暗中的微光', isStarter: true },
  { id: 'fear', name: '恐惧', emoji: '👻', description: '内心深处的阴影', isStarter: true },
  { id: 'fate', name: '命运', emoji: '🎯', description: '无形的丝线', isStarter: true },
  { id: 'chaos', name: '混沌', emoji: '🌀', description: '万物诞生前的状态', isStarter: true },
  { id: 'memory', name: '记忆', emoji: '📷', description: '时间留下的印记', isStarter: true },
  // 人文/物质
  { id: 'music', name: '音乐', emoji: '🎵', description: '灵魂的振动', isStarter: true },
  { id: 'sword', name: '剑', emoji: '⚔️', description: '锋利的意志', isStarter: true },
  { id: 'crown', name: '王冠', emoji: '👑', description: '权力的象征', isStarter: true },
  { id: 'mirror', name: '镜子', emoji: '🪞', description: '映射真实的平面', isStarter: true },
  { id: 'book', name: '书', emoji: '📖', description: '知识的容器', isStarter: true },
  { id: 'gold', name: '金', emoji: '🥇', description: '永不褪色的光泽', isStarter: true },
  { id: 'crystal', name: '水晶', emoji: '💎', description: '大地的泪珠', isStarter: true },
  { id: 'potion', name: '药水', emoji: '🧪', description: '神秘的液体', isStarter: true },
]

export const STARTER_COUNT = 8

export function pickRandomStarters(count: number = STARTER_COUNT): Element[] {
  const pool = [...ELEMENT_POOL]
  const picked: Element[] = []
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    picked.push(pool[idx])
    pool.splice(idx, 1)
  }
  return picked
}

export const DEFAULT_AI_CONFIG: AIConfig = {
  endpoint: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
  apiFormat: 'openai',
}
