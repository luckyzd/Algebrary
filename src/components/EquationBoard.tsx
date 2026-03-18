import { useState } from 'react'
import type { Element, Operator, AIConfig, Rarity } from '../types'
import { RARITY_LABELS } from '../types'
import { computeEquation } from '../ai'

interface EquationBoardProps {
  left: Element | null
  right: Element | null
  aiConfig: AIConfig
  onClearSlot: (side: 'left' | 'right') => void
  onSetCustom: (side: 'left' | 'right', el: Element) => void
  onResult: (eq: {
    left: Element
    operator: Operator
    right: Element
    result: Element
  }) => void
  onError: (msg: string) => void
}

const OPERATORS: { op: Operator; label: string; desc: string }[] = [
  { op: '+', label: '+', desc: '融合：合并两者本质' },
  { op: '-', label: '−', desc: '去除：减去后者特征' },
  { op: '×', label: '×', desc: '放大：后者变换前者' },
  { op: '÷', label: '÷', desc: '提取：分解出本质' },
]

const RARITY_EMOJI: Record<Rarity, string> = {
  common: '⚪',
  rare: '🔵',
  epic: '🟣',
  legendary: '🌟',
}

function makeCustomElement(name: string): Element {
  return {
    id: `custom_${name}_${Date.now()}`,
    name: name.trim(),
    emoji: '✨',
    description: '自由输入的概念',
    isCustom: true,
  }
}

export default function EquationBoard({
  left,
  right,
  aiConfig,
  onClearSlot,
  onSetCustom,
  onResult,
  onError,
}: EquationBoardProps) {
  const [selectedOp, setSelectedOp] = useState<Operator>('+')
  const [computing, setComputing] = useState(false)
  const [result, setResult] = useState<Element | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [freeInputMode, setFreeInputMode] = useState(false)
  const [leftInput, setLeftInput] = useState('')
  const [rightInput, setRightInput] = useState('')

  const effectiveLeft = freeInputMode && leftInput.trim() ? makeCustomElement(leftInput) : left
  const effectiveRight = freeInputMode && rightInput.trim() ? makeCustomElement(rightInput) : right
  const canCompute = effectiveLeft && effectiveRight && !computing

  async function handleCompute() {
    if (!effectiveLeft || !effectiveRight) return

    if (!aiConfig.apiKey) {
      onError('请先在设置中配置 AI API Key')
      return
    }

    if (freeInputMode) {
      if (leftInput.trim()) onSetCustom('left', effectiveLeft)
      if (rightInput.trim()) onSetCustom('right', effectiveRight)
    }

    setComputing(true)
    setResult(null)
    setShowResult(false)

    try {
      const res = await computeEquation(effectiveLeft, selectedOp, effectiveRight, aiConfig)
      setResult(res)
      setTimeout(() => setShowResult(true), 50)
      onResult({ left: effectiveLeft, operator: selectedOp, right: effectiveRight, result: res })
    } catch (err) {
      onError(err instanceof Error ? err.message : '运算失败，请重试')
    } finally {
      setComputing(false)
    }
  }

  function handleReset() {
    setResult(null)
    setShowResult(false)
    setLeftInput('')
    setRightInput('')
    onClearSlot('left')
    onClearSlot('right')
  }

  function toggleFreeInput() {
    setFreeInputMode((v) => !v)
    setLeftInput('')
    setRightInput('')
  }

  const rarityClass = result?.rarity ? `rarity-${result.rarity}` : ''

  return (
    <div className="board">
      <div className="board-title">
        <h2>万物运算台</h2>
        <div className="board-mode-row">
          <p className="board-hint">
            {freeInputMode
              ? '输入任意概念，让 AI 计算万物之间的运算'
              : '从左侧选取元素，选择运算符，再选取第二个元素'}
          </p>
          <button
            className={`mode-toggle ${freeInputMode ? 'active' : ''}`}
            onClick={toggleFreeInput}
            title={freeInputMode ? '切换为选择模式' : '切换为自由输入模式'}
          >
            {freeInputMode ? '📝 自由输入' : '🔮 选择模式'}
          </button>
        </div>
      </div>

      <div className="equation">
        {freeInputMode ? (
          <div className="slot free-input-slot">
            <input
              type="text"
              className="free-input"
              placeholder="输入任意概念…"
              value={leftInput}
              onChange={(e) => setLeftInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCompute()}
            />
          </div>
        ) : (
          <button
            className={`slot ${left ? 'filled' : 'empty'}`}
            onClick={() => left && onClearSlot('left')}
            title={left ? `点击移除 ${left.name}` : '请从元素库选取'}
          >
            {left ? (
              <>
                <span className="slot-emoji">{left.emoji}</span>
                <span className="slot-name">{left.name}</span>
              </>
            ) : (
              <span className="slot-placeholder">?</span>
            )}
          </button>
        )}

        <div className="operator-group">
          {OPERATORS.map(({ op, label, desc }) => (
            <button
              key={op}
              className={`op-btn ${selectedOp === op ? 'active' : ''}`}
              onClick={() => setSelectedOp(op)}
              title={desc}
            >
              {label}
            </button>
          ))}
        </div>

        {freeInputMode ? (
          <div className="slot free-input-slot">
            <input
              type="text"
              className="free-input"
              placeholder="输入任意概念…"
              value={rightInput}
              onChange={(e) => setRightInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCompute()}
            />
          </div>
        ) : (
          <button
            className={`slot ${right ? 'filled' : 'empty'}`}
            onClick={() => right && onClearSlot('right')}
            title={right ? `点击移除 ${right.name}` : '请从元素库选取'}
          >
            {right ? (
              <>
                <span className="slot-emoji">{right.emoji}</span>
                <span className="slot-name">{right.name}</span>
              </>
            ) : (
              <span className="slot-placeholder">?</span>
            )}
          </button>
        )}
      </div>

      <div className="board-actions">
        <button
          className="compute-btn"
          disabled={!canCompute}
          onClick={handleCompute}
        >
          {computing ? (
            <span className="spinner" />
          ) : (
            '= 运算 ='
          )}
        </button>
        {(left || right || result || leftInput || rightInput) && (
          <button className="reset-btn" onClick={handleReset}>
            清空
          </button>
        )}
      </div>

      {result && (
        <div className={`result-card ${showResult ? 'visible' : ''} ${rarityClass}`}>
          {result.rarity && result.rarity !== 'common' && (
            <div className={`rarity-badge rarity-badge-${result.rarity}`}>
              {RARITY_EMOJI[result.rarity]} {RARITY_LABELS[result.rarity]}
            </div>
          )}
          <div className="result-emoji">{result.emoji}</div>
          <div className="result-name">{result.name}</div>
          <div className="result-desc">{result.description}</div>
          <div className="result-equation">
            {effectiveLeft?.emoji} {effectiveLeft?.name} {selectedOp}{' '}
            {effectiveRight?.emoji} {effectiveRight?.name} = {result.emoji}{' '}
            {result.name}
          </div>
        </div>
      )}
    </div>
  )
}
