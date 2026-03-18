import { useState, useCallback, useRef } from 'react'
import type { Element, Operator, AIConfig, Equation, AchievementContext } from './types'
import { pickRandomStarters } from './types'
import { ACHIEVEMENTS } from './achievements'
import {
  loadElements,
  saveElements,
  loadEquations,
  saveEquations,
  loadAchievements,
  saveAchievements,
  loadAIConfig,
  saveAIConfig,
} from './storage'

import Header from './components/Header'
import ElementLibrary from './components/ElementLibrary'
import EquationBoard from './components/EquationBoard'
import SettingsModal from './components/SettingsModal'
import DiscoveryLog from './components/DiscoveryLog'
import AchievementsModal from './components/AchievementsModal'
import Toast, { type ToastData } from './components/Toast'

type SlotTarget = 'left' | 'right'

export default function App() {
  const [elements, setElements] = useState<Element[]>(loadElements)
  const [equations, setEquations] = useState<Equation[]>(loadEquations)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(loadAchievements)
  const [aiConfig, setAiConfig] = useState<AIConfig>(loadAIConfig)

  const [left, setLeft] = useState<Element | null>(null)
  const [right, setRight] = useState<Element | null>(null)
  const nextSlot = useRef<SlotTarget>('left')

  const [showSettings, setShowSettings] = useState(false)
  const [showDiscovery, setShowDiscovery] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [toasts, setToasts] = useState<ToastData[]>([])
  const toastIdRef = useRef(0)

  const addToast = useCallback(
    (emoji: string, title: string, message: string, type: ToastData['type']) => {
      const id = ++toastIdRef.current
      setToasts((prev) => [...prev, { id, emoji, title, message, type }])
    },
    [],
  )

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const operatorUsage: Record<Operator, number> = {
    '+': 0, '-': 0, '×': 0, '÷': 0,
  }
  for (const eq of equations) {
    operatorUsage[eq.operator]++
  }

  function handleSelectElement(el: Element) {
    if (nextSlot.current === 'left') {
      setLeft(el)
      nextSlot.current = 'right'
    } else {
      setRight(el)
      nextSlot.current = 'left'
    }
  }

  function handleClearSlot(side: SlotTarget) {
    if (side === 'left') setLeft(null)
    else setRight(null)
    nextSlot.current = side
  }

  function checkAchievements(
    newElements: Element[],
    newEquations: Equation[],
    currentUnlocked: string[],
    newOpUsage: Record<Operator, number>,
  ) {
    const ctx: AchievementContext = {
      elements: newElements,
      equations: newEquations,
      unlockedAchievements: currentUnlocked,
      operatorUsage: newOpUsage,
    }

    const newlyUnlocked: string[] = []
    for (const ach of ACHIEVEMENTS) {
      if (!currentUnlocked.includes(ach.id) && ach.check(ctx)) {
        newlyUnlocked.push(ach.id)
        addToast(ach.emoji, '🏆 成就解锁！', `${ach.name} — ${ach.description}`, 'achievement')
      }
    }

    if (newlyUnlocked.length > 0) {
      const updated = [...currentUnlocked, ...newlyUnlocked]
      setUnlockedAchievements(updated)
      saveAchievements(updated)
    }
  }

  function handleResult(eq: {
    left: Element
    operator: Operator
    right: Element
    result: Element
  }) {
    const newEquation: Equation = { ...eq, timestamp: Date.now() }
    const newEquations = [...equations, newEquation]
    setEquations(newEquations)
    saveEquations(newEquations)

    const exists = elements.some(
      (e) => e.name === eq.result.name && e.emoji === eq.result.emoji,
    )
    let newElements = elements
    if (!exists) {
      newElements = [...elements, eq.result]
      setElements(newElements)
      saveElements(newElements)
      addToast(
        eq.result.emoji,
        '新元素发现！',
        `${eq.result.name} — ${eq.result.description}`,
        'discovery',
      )
    }

    const newOpUsage = { ...operatorUsage }
    newOpUsage[eq.operator]++
    checkAchievements(newElements, newEquations, unlockedAchievements, newOpUsage)
  }

  function handleError(msg: string) {
    addToast('❌', '运算出错', msg, 'error')
  }

  function handleSaveConfig(config: AIConfig) {
    setAiConfig(config)
    saveAIConfig(config)
    addToast('✅', '设置已保存', `模型: ${config.model}`, 'discovery')
  }

  function handleShuffleStarters() {
    const discovered = elements.filter((e) => !e.isStarter)
    const newStarters = pickRandomStarters()
    const newElements = [...newStarters, ...discovered]
    setElements(newElements)
    saveElements(newElements)
    setLeft(null)
    setRight(null)
    nextSlot.current = 'left'
    const names = newStarters.map((e) => e.emoji).join(' ')
    addToast('🎲', '初始元素已刷新', names, 'discovery')
  }

  function handleResetData() {
    const starterElements = pickRandomStarters()
    setElements(starterElements)
    setEquations([])
    setUnlockedAchievements([])
    setLeft(null)
    setRight(null)
    saveElements(starterElements)
    saveEquations([])
    saveAchievements([])
    addToast('🔄', '数据已重置', '所有进度已清除，随机初始元素已生成', 'discovery')
  }

  const selectedId = left && !right ? left.id : null

  return (
    <div className="app">
      <Header
        elementCount={elements.length}
        equationCount={equations.length}
        operatorUsage={operatorUsage}
        achievementCount={unlockedAchievements.length}
        totalAchievements={ACHIEVEMENTS.length}
        onOpenSettings={() => setShowSettings(true)}
        onOpenAchievements={() => setShowAchievements(true)}
        onOpenDiscovery={() => setShowDiscovery(true)}
      />

      <main className="main-content">
        <ElementLibrary
          elements={elements}
          selectedId={selectedId}
          onSelect={handleSelectElement}
          onShuffle={handleShuffleStarters}
        />
        <EquationBoard
          left={left}
          right={right}
          aiConfig={aiConfig}
          onClearSlot={handleClearSlot}
          onResult={handleResult}
          onError={handleError}
        />
      </main>

      {!aiConfig.apiKey && (
        <div className="welcome-banner" onClick={() => setShowSettings(true)}>
          <div className="welcome-content">
            <h2>👋 欢迎来到 Algebrary！</h2>
            <p>
              在这里，世间万物都可以像向量一样进行加减乘除运算。
              <br />
              火 + 水 = ? &nbsp; 猫 × 海洋 = ? &nbsp; 彩虹 ÷ 天空 = ?
            </p>
            <p className="welcome-cta">
              👉 点击这里配置你的 AI 模型，开始万物运算之旅
            </p>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>Algebrary · 万物皆可运算</span>
        <button className="footer-reset" onClick={handleResetData}>
          重置数据
        </button>
      </footer>

      {showSettings && (
        <SettingsModal
          config={aiConfig}
          onSave={handleSaveConfig}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showDiscovery && (
        <DiscoveryLog
          equations={equations}
          onClose={() => setShowDiscovery(false)}
        />
      )}
      {showAchievements && (
        <AchievementsModal
          unlockedIds={unlockedAchievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={dismissToast} />
        ))}
      </div>
    </div>
  )
}
