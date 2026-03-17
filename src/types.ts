export interface Element {
  id: string
  name: string
  emoji: string
  description: string
  discoveredAt?: number
  isStarter?: boolean
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

export interface AIConfig {
  endpoint: string
  apiKey: string
  model: string
}

export const STARTER_ELEMENTS: Element[] = [
  { id: 'fire', name: '火', emoji: '🔥', description: '燃烧的力量', isStarter: true },
  { id: 'water', name: '水', emoji: '💧', description: '流动的生命之源', isStarter: true },
  { id: 'earth', name: '土', emoji: '🌍', description: '坚实的大地', isStarter: true },
  { id: 'wind', name: '风', emoji: '💨', description: '自由的气流', isStarter: true },
  { id: 'light', name: '光', emoji: '☀️', description: '照亮万物的能量', isStarter: true },
  { id: 'darkness', name: '暗', emoji: '🌑', description: '深邃的黑暗', isStarter: true },
  { id: 'life', name: '生命', emoji: '🌱', description: '蓬勃生长的力量', isStarter: true },
  { id: 'death', name: '死亡', emoji: '💀', description: '终结与轮回', isStarter: true },
]

export const DEFAULT_AI_CONFIG: AIConfig = {
  endpoint: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
}
