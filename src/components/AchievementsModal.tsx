import { ACHIEVEMENTS } from '../achievements'

interface AchievementsModalProps {
  unlockedIds: string[]
  onClose: () => void
}

export default function AchievementsModal({
  unlockedIds,
  onClose,
}: AchievementsModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            🏆 成就 ({unlockedIds.length}/{ACHIEVEMENTS.length})
          </h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="achievements-grid">
            {ACHIEVEMENTS.map((ach) => {
              const unlocked = unlockedIds.includes(ach.id)
              return (
                <div
                  key={ach.id}
                  className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
                >
                  <span className="achievement-emoji">
                    {unlocked ? ach.emoji : '🔒'}
                  </span>
                  <div className="achievement-info">
                    <div className="achievement-name">{ach.name}</div>
                    <div className="achievement-desc">{ach.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
