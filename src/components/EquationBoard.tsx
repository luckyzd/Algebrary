import { useState } from 'react'
import type { Element, Operator, AIConfig } from '../types'
import { computeEquation } from '../ai'

interface EquationBoardProps {
  left: Element | null
  right: Element | null
  aiConfig: AIConfig
  onClearSlot: (side: 'left' | 'right') => void
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

export default function EquationBoard({
  left,
  right,
  aiConfig,
  onClearSlot,
  onResult,
  onError,
}: EquationBoardProps) {
  const [selectedOp, setSelectedOp] = useState<Operator>('+')
  const [computing, setComputing] = useState(false)
  const [result, setResult] = useState<Element | null>(null)
  const [showResult, setShowResult] = useState(false)

  const canCompute = left && right && !computing

  async function handleCompute() {
    if (!left || !right) return

    if (!aiConfig.apiKey) {
      onError('请先在设置中配置 AI API Key')
      return
    }

    setComputing(true)
    setResult(null)
    setShowResult(false)

    try {
      const res = await computeEquation(left, selectedOp, right, aiConfig)
      setResult(res)
      setTimeout(() => setShowResult(true), 50)
      onResult({ left, operator: selectedOp, right, result: res })
    } catch (err) {
      onError(err instanceof Error ? err.message : '运算失败，请重试')
    } finally {
      setComputing(false)
    }
  }

  function handleReset() {
    setResult(null)
    setShowResult(false)
    onClearSlot('left')
    onClearSlot('right')
  }

  return (
    <div className="board">
      <div className="board-title">
        <h2>万物运算台</h2>
        <p className="board-hint">从左侧选取元素，选择运算符，再选取第二个元素</p>
      </div>

      <div className="equation">
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
        {(left || right || result) && (
          <button className="reset-btn" onClick={handleReset}>
            清空
          </button>
        )}
      </div>

      {result && (
        <div className={`result-card ${showResult ? 'visible' : ''}`}>
          <div className="result-emoji">{result.emoji}</div>
          <div className="result-name">{result.name}</div>
          <div className="result-desc">{result.description}</div>
          <div className="result-equation">
            {left?.emoji} {left?.name} {selectedOp} {right?.emoji} {right?.name}{' '}
            = {result.emoji} {result.name}
          </div>
        </div>
      )}
    </div>
  )
}
