import type { Equation } from '../types'
import { RARITY_LABELS } from '../types'

interface DiscoveryLogProps {
  equations: Equation[]
  onClose: () => void
}

export default function DiscoveryLog({ equations, onClose }: DiscoveryLogProps) {
  const sorted = [...equations].reverse()

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📖 发现日志</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {sorted.length === 0 ? (
            <div className="log-empty">
              <p>还没有进行任何运算</p>
              <p className="log-empty-hint">
                从元素库中选取两个元素，开始你的万物运算之旅！
              </p>
            </div>
          ) : (
            <div className="log-list">
              {sorted.map((eq, i) => (
                <div key={i} className={`log-item ${eq.result.rarity ? `rarity-${eq.result.rarity}` : ''}`}>
                  <div className="log-equation">
                    <span className="log-element">
                      {eq.left.emoji} {eq.left.name}
                    </span>
                    <span className="log-op">{eq.operator}</span>
                    <span className="log-element">
                      {eq.right.emoji} {eq.right.name}
                    </span>
                    <span className="log-equals">=</span>
                    <span className={`log-result ${eq.result.rarity ? `text-${eq.result.rarity}` : ''}`}>
                      {eq.result.emoji} {eq.result.name}
                    </span>
                    {eq.result.rarity && eq.result.rarity !== 'common' && (
                      <span className={`log-rarity-tag rarity-tag-${eq.result.rarity}`}>
                        {RARITY_LABELS[eq.result.rarity]}
                      </span>
                    )}
                  </div>
                  <div className="log-desc">{eq.result.description}</div>
                  <div className="log-time">
                    {new Date(eq.timestamp).toLocaleString('zh-CN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
