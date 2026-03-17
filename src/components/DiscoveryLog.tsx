import type { Equation } from '../types'

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
                <div key={i} className="log-item">
                  <div className="log-equation">
                    <span className="log-element">
                      {eq.left.emoji} {eq.left.name}
                    </span>
                    <span className="log-op">{eq.operator}</span>
                    <span className="log-element">
                      {eq.right.emoji} {eq.right.name}
                    </span>
                    <span className="log-equals">=</span>
                    <span className="log-result">
                      {eq.result.emoji} {eq.result.name}
                    </span>
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
