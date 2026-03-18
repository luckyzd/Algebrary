import { useEffect } from 'react'

export interface ToastData {
  id: number
  emoji: string
  title: string
  message: string
  type: 'achievement' | 'discovery' | 'error'
}

interface ToastProps {
  toast: ToastData
  onDismiss: (id: number) => void
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-emoji">{toast.emoji}</span>
      <div className="toast-content">
        <div className="toast-title">{toast.title}</div>
        <div className="toast-message">{toast.message}</div>
      </div>
      <button className="toast-close" onClick={() => onDismiss(toast.id)}>
        ✕
      </button>
    </div>
  )
}
