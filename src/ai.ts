import type { Element, Operator, AIConfig } from './types'

const SYSTEM_PROMPT = `你是"Algebrary（万物方程）"游戏的核心运算引擎。在这个游戏中，世间万物都被视为语义空间中的"向量"，可以进行加减乘除运算。

运算规则：
- 加法(+)：融合两个概念的本质特征，产生包含双方特质的新事物。例如："火 + 水 = 蒸汽"
- 减法(-)：从第一个概念中去除第二个概念的特征，留下剩余的本质。例如："飞机 - 翅膀 = 火箭"
- 乘法(×)：用第二个概念去放大、变换第一个概念。例如："猫 × 海洋 = 鲸鱼"
- 除法(÷)：从第一个概念中提取、分解出与第二个相关的本质。例如："彩虹 ÷ 天空 = 颜色"

严格要求：
1. 结果必须是一个具体的事物、概念或现象（1-4个字）
2. 结果要有创意但合乎逻辑，让人觉得"原来如此！"
3. emoji 必须是单个表情符号，最能代表结果
4. description 用一句简短的话解释这个运算为什么得出这个结果
5. 仅返回 JSON，不要有任何其他内容

返回格式：{"name":"结果","emoji":"🎯","description":"解释"}`

const OPERATOR_LABEL: Record<Operator, string> = {
  '+': '加法（融合）',
  '-': '减法（去除）',
  '×': '乘法（放大）',
  '÷': '除法（提取）',
}

export async function computeEquation(
  left: Element,
  operator: Operator,
  right: Element,
  config: AIConfig,
): Promise<Element> {
  const userMessage = `请计算：${left.emoji} ${left.name} ${operator} ${right.emoji} ${right.name} = ?\n运算类型：${OPERATOR_LABEL[operator]}`

  const response = await fetch(`${config.endpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.8,
      max_tokens: 200,
    }),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`API 请求失败 (${response.status}): ${text.slice(0, 200)}`)
  }

  const data = await response.json()
  const content: string = data.choices?.[0]?.message?.content ?? ''

  const jsonMatch = content.match(/\{[\s\S]*?\}/)
  if (!jsonMatch) throw new Error('AI 返回格式异常，请重试')

  const parsed = JSON.parse(jsonMatch[0]) as {
    name: string
    emoji: string
    description: string
  }

  if (!parsed.name || !parsed.emoji) {
    throw new Error('AI 返回数据不完整，请重试')
  }

  return {
    id: `${left.id}_${operator}_${right.id}_${Date.now()}`,
    name: parsed.name,
    emoji: parsed.emoji,
    description: parsed.description || '',
    discoveredAt: Date.now(),
  }
}
