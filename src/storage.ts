import type { Element, Equation, AIConfig } from './types'
import { pickRandomStarters, DEFAULT_AI_CONFIG } from './types'

const STORAGE_KEYS = {
  elements: 'algebrary_elements',
  equations: 'algebrary_equations',
  achievements: 'algebrary_achievements',
  aiConfig: 'algebrary_ai_config',
} as const

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota exceeded — silently ignore */
  }
}

export function loadElements(): Element[] {
  const saved = safeGet<Element[]>(STORAGE_KEYS.elements, [])
  if (saved.length === 0) {
    const starters = pickRandomStarters()
    saveElements(starters)
    return starters
  }
  return saved
}

export function saveElements(elements: Element[]): void {
  safeSet(STORAGE_KEYS.elements, elements)
}

export function loadEquations(): Equation[] {
  return safeGet<Equation[]>(STORAGE_KEYS.equations, [])
}

export function saveEquations(equations: Equation[]): void {
  safeSet(STORAGE_KEYS.equations, equations)
}

export function loadAchievements(): string[] {
  return safeGet<string[]>(STORAGE_KEYS.achievements, [])
}

export function saveAchievements(ids: string[]): void {
  safeSet(STORAGE_KEYS.achievements, ids)
}

export function loadAIConfig(): AIConfig {
  const saved = safeGet<AIConfig>(STORAGE_KEYS.aiConfig, { ...DEFAULT_AI_CONFIG })
  if (!saved.apiFormat) {
    saved.apiFormat = saved.endpoint?.includes('anthropic') ? 'anthropic' : 'openai'
  }
  return saved
}

export function saveAIConfig(config: AIConfig): void {
  safeSet(STORAGE_KEYS.aiConfig, config)
}
