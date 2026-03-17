import type { Operator } from '../types'

interface HeaderProps {
  elementCount: number
  equationCount: number
  operatorUsage: Record<Operator, number>
  achievementCount: number
  totalAchievements: number
  onOpenSettings: () => void
  onOpenAchievements: () => void
  onOpenDiscovery: () => void
}

export default function Header({
  elementCount,
  equationCount,
  operatorUsage,
  achievementCount,
  totalAchievements,
  onOpenSettings,
  onOpenAchievements,
  onOpenDiscovery,
}: HeaderProps) {
  const totalOps =
    operatorUsage['+'] +
    operatorUsage['-'] +
    operatorUsage['×'] +
    operatorUsage['÷']

  return (
    <header className="header">
      <div className="header-brand">
        <h1 className="header-title">
          <span className="header-icon">🧮</span>
          Algebrary
        </h1>
        <span className="header-subtitle">万物方程</span>
      </div>

      <div className="header-stats">
        <div className="stat" title="已发现元素">
          <span className="stat-icon">🔮</span>
          <span className="stat-value">{elementCount}</span>
          <span className="stat-label">元素</span>
        </div>
        <div className="stat" title="运算次数">
          <span className="stat-icon">⚡</span>
          <span className="stat-value">{totalOps}</span>
          <span className="stat-label">运算</span>
        </div>
        <div className="stat" title="方程记录">
          <span className="stat-icon">📜</span>
          <span className="stat-value">{equationCount}</span>
          <span className="stat-label">发现</span>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="header-btn"
          onClick={onOpenDiscovery}
          title="发现日志"
        >
          📖
        </button>
        <button
          className="header-btn"
          onClick={onOpenAchievements}
          title="成就"
        >
          🏆
          {achievementCount > 0 && (
            <span className="badge">
              {achievementCount}/{totalAchievements}
            </span>
          )}
        </button>
        <button
          className="header-btn"
          onClick={onOpenSettings}
          title="AI 设置"
        >
          ⚙️
        </button>
      </div>
    </header>
  )
}
