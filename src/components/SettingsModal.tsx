import { useState } from 'react'
import type { AIConfig, ApiFormat } from '../types'

interface Preset {
  name: string
  endpoint: string
  model: string
  icon: string
  apiFormat: ApiFormat
}

const PRESETS: Preset[] = [
  { name: '智谱 GLM', endpoint: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4-flash', icon: '🧠', apiFormat: 'openai' },
  { name: 'OpenAI', endpoint: 'https://api.openai.com/v1', model: 'gpt-4o-mini', icon: '🤖', apiFormat: 'openai' },
  { name: 'Claude', endpoint: 'https://api.anthropic.com/v1', model: 'claude-sonnet-4-20250514', icon: '🎭', apiFormat: 'anthropic' },
  { name: 'DeepSeek', endpoint: 'https://api.deepseek.com/v1', model: 'deepseek-chat', icon: '🐋', apiFormat: 'openai' },
  { name: 'Moonshot', endpoint: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k', icon: '🌙', apiFormat: 'openai' },
  { name: '通义千问', endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-turbo', icon: '☁️', apiFormat: 'openai' },
  { name: '百度千帆', endpoint: 'https://qianfan.baidubce.com/v2', model: 'ernie-speed-128k', icon: '🔵', apiFormat: 'openai' },
]

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
  const [apiFormat, setApiFormat] = useState<ApiFormat>(config.apiFormat)

  function handlePreset(preset: Preset) {
    setEndpoint(preset.endpoint)
    setModel(preset.model)
    setApiFormat(preset.apiFormat)
  }

  function handleSave() {
    onSave({
      endpoint: endpoint.replace(/\/+$/, ''),
      apiKey: apiKey.trim(),
      model: model.trim(),
      apiFormat,
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
            Algebrary 使用 AI 来计算万物之间的运算。支持 OpenAI 兼容 API 和
            Anthropic Claude API。
          </p>

          <div className="field">
            <span className="field-label">快捷预设</span>
            <div className="preset-grid">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  className={`preset-btn ${endpoint === p.endpoint ? 'active' : ''}`}
                  onClick={() => handlePreset(p)}
                  title={`${p.endpoint}\n模型: ${p.model}\n格式: ${p.apiFormat}`}
                >
                  <span className="preset-icon">{p.icon}</span>
                  <span className="preset-name">{p.name}</span>
                </button>
              ))}
            </div>
            <span className="field-hint">
              点击预设自动填充端点、模型和 API 格式，你只需填写 API Key
            </span>
          </div>

          <div className="field">
            <span className="field-label">API 格式</span>
            <div className="format-toggle">
              <button
                className={`format-btn ${apiFormat === 'openai' ? 'active' : ''}`}
                onClick={() => setApiFormat('openai')}
              >
                OpenAI 兼容
              </button>
              <button
                className={`format-btn ${apiFormat === 'anthropic' ? 'active' : ''}`}
                onClick={() => setApiFormat('anthropic')}
              >
                Anthropic Claude
              </button>
            </div>
            <span className="field-hint">
              {apiFormat === 'openai'
                ? '适用于 OpenAI、智谱 GLM、DeepSeek、Moonshot、通义千问、百度千帆等'
                : '适用于 Anthropic Claude 系列模型（claude-sonnet-4-20250514、claude-3-haiku 等）'}
            </span>
          </div>

          <label className="field">
            <span className="field-label">API 端点</span>
            <input
              type="url"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder={
                apiFormat === 'anthropic'
                  ? 'https://api.anthropic.com/v1'
                  : 'https://api.openai.com/v1'
              }
              className="field-input"
            />
          </label>

          <label className="field">
            <span className="field-label">API Key</span>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={
                apiFormat === 'anthropic' ? 'sk-ant-...' : 'sk-...'
              }
              className="field-input"
            />
          </label>

          <label className="field">
            <span className="field-label">模型名称</span>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={
                apiFormat === 'anthropic'
                  ? 'claude-sonnet-4-20250514'
                  : 'gpt-4o-mini'
              }
              className="field-input"
            />
            <span className="field-hint">
              {apiFormat === 'anthropic'
                ? '推荐：claude-sonnet-4-20250514、claude-3-5-sonnet-20241022、claude-3-haiku-20240307'
                : '可随意修改为该服务商的其他模型，如 glm-4、deepseek-chat、gpt-4o 等'}
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
