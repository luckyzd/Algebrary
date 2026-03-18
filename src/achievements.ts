import type { Achievement } from './types'

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_equation',
    name: '初次运算',
    description: '完成你的第一次万物运算',
    emoji: '🎉',
    check: (ctx) => ctx.equations.length >= 1,
  },
  {
    id: 'collector_10',
    name: '收集新手',
    description: '发现 10 种不同的元素',
    emoji: '📦',
    check: (ctx) => ctx.elements.length >= 10,
  },
  {
    id: 'collector_25',
    name: '探索者',
    description: '发现 25 种不同的元素',
    emoji: '🔭',
    check: (ctx) => ctx.elements.length >= 25,
  },
  {
    id: 'collector_50',
    name: '博物学家',
    description: '发现 50 种不同的元素',
    emoji: '🏛️',
    check: (ctx) => ctx.elements.length >= 50,
  },
  {
    id: 'collector_100',
    name: '万物大师',
    description: '发现 100 种不同的元素',
    emoji: '👑',
    check: (ctx) => ctx.elements.length >= 100,
  },
  {
    id: 'all_operators',
    name: '四则精通',
    description: '使用过全部四种运算符',
    emoji: '🧮',
    check: (ctx) =>
      ctx.operatorUsage['+'] > 0 &&
      ctx.operatorUsage['-'] > 0 &&
      ctx.operatorUsage['×'] > 0 &&
      ctx.operatorUsage['÷'] > 0,
  },
  {
    id: 'adder',
    name: '融合师',
    description: '使用加法运算 10 次',
    emoji: '➕',
    check: (ctx) => ctx.operatorUsage['+'] >= 10,
  },
  {
    id: 'subtractor',
    name: '提纯师',
    description: '使用减法运算 10 次',
    emoji: '➖',
    check: (ctx) => ctx.operatorUsage['-'] >= 10,
  },
  {
    id: 'multiplier',
    name: '放大师',
    description: '使用乘法运算 10 次',
    emoji: '✖️',
    check: (ctx) => ctx.operatorUsage['×'] >= 10,
  },
  {
    id: 'divider',
    name: '分解师',
    description: '使用除法运算 10 次',
    emoji: '➗',
    check: (ctx) => ctx.operatorUsage['÷'] >= 10,
  },
  {
    id: 'equations_10',
    name: '勤学苦练',
    description: '完成 10 次运算',
    emoji: '📝',
    check: (ctx) => ctx.equations.length >= 10,
  },
  {
    id: 'equations_50',
    name: '运算达人',
    description: '完成 50 次运算',
    emoji: '🚀',
    check: (ctx) => ctx.equations.length >= 50,
  },
  {
    id: 'first_rare',
    name: '不同凡响',
    description: '发现第一个稀有元素',
    emoji: '🔵',
    check: (ctx) => ctx.elements.some((e) => e.rarity === 'rare' || e.rarity === 'epic' || e.rarity === 'legendary'),
  },
  {
    id: 'first_epic',
    name: '史诗时刻',
    description: '发现第一个史诗元素',
    emoji: '🟣',
    check: (ctx) => ctx.elements.some((e) => e.rarity === 'epic' || e.rarity === 'legendary'),
  },
  {
    id: 'first_legendary',
    name: '传说降临',
    description: '发现第一个传说元素',
    emoji: '🌟',
    check: (ctx) => ctx.elements.some((e) => e.rarity === 'legendary'),
  },
]
