import { useState } from 'react'
import type { AIConfig } from '../types'

interface SettingsModalProps {
  config: AIConfig
  onSave: (config: AIConfig) => void
  onClose: () => void
}

export default function SettingsModal({
  config,
  onSave,
  onClose,
}: SettingsModalProps) {
  const [endpoint, setEndpoint] = useState(config.endpoint)
  const [apiKey, setApiKey] = useState(config.apiKey)
  const [model, setModel] = useState(config.model)

  function handleSave() {
    onSave({
      endpoint: endpoint.replace(/\/+$/, ''),
      apiKey: apiKey.trim(),
      model: model.trim(),
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ AI 模型设置</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="settings-note">
            Algebrary 使用 AI 来计算万物之间的运算。请配置你的 AI 模型（支持
            OpenAI 兼容 API）。
          </p>

          <label className="field">
            <span className="field-label">API 端点</span>
            <input
              type="url"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="field-input"
            />
            <span className="field-hint">
              支持 OpenAI、DeepSeek、Moonshot、通义千问等兼容 API
            </span>
          </label>

          <label className="field">
            <span className="field-label">API Key</span>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="field-input"
            />
          </label>

          <label className="field">
            <span className="field-label">模型名称</span>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gpt-4o-mini"
              className="field-input"
            />
            <span className="field-hint">
              推荐：gpt-4o-mini、deepseek-chat、moonshot-v1-8k
            </span>
          </label>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            取消
          </button>
          <button className="btn-primary" onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
