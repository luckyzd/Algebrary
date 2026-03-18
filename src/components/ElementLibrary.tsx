import { useState, useMemo } from 'react'
import type { Element } from '../types'

interface ElementLibraryProps {
  elements: Element[]
  selectedId: string | null
  onSelect: (el: Element) => void
}

export default function ElementLibrary({
  elements,
  selectedId,
  onSelect,
}: ElementLibraryProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return elements
    const q = search.trim().toLowerCase()
    return elements.filter(
      (el) =>
        el.name.toLowerCase().includes(q) ||
        el.description.toLowerCase().includes(q),
    )
  }, [elements, search])

  return (
    <div className="library">
      <div className="library-header">
        <h2 className="library-title">元素库</h2>
        <span className="library-count">{elements.length}</span>
      </div>

      <div className="library-search">
        <input
          type="text"
          placeholder="搜索元素..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="library-grid">
        {filtered.map((el) => (
          <button
            key={el.id}
            className={`element-card ${selectedId === el.id ? 'selected' : ''} ${el.isStarter ? 'starter' : 'discovered'}`}
            onClick={() => onSelect(el)}
            title={`${el.name}: ${el.description}`}
          >
            <span className="element-emoji">{el.emoji}</span>
            <span className="element-name">{el.name}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="library-empty">没有找到匹配的元素</div>
        )}
      </div>
    </div>
  )
}
