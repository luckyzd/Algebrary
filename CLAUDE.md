# CLAUDE.md

## Project Overview

**Algebrary (万物方程)** is a browser-based AI-powered game where players combine real-world concepts and abstract ideas using arithmetic operators (+, -, ×, ÷). The AI interprets these combinations semantically (e.g., Fire + Water = Steam) and generates creative results with names, emojis, descriptions, and rarity tiers. It is a fully client-side SPA with no backend.

**Tech stack**: React 18 + TypeScript (strict) + Vite + custom CSS

---

## Commands

```bash
pnpm dev        # Start dev server at http://localhost:5173 (binds 0.0.0.0)
pnpm build      # Type-check (tsc -b) then bundle (vite build)
pnpm preview    # Serve the production build locally
pnpm lint       # ESLint with flat config (eslint.config.js)
```

No test framework is configured. `pnpm lint` is the only automated quality check.

### Dependency management

Use **pnpm** (not npm or yarn). The `pnpm.onlyBuiltDependencies: ["esbuild"]` field in `package.json` is required for Vite's esbuild postinstall — do not remove it.

---

## Repository Structure

```
src/
├── App.tsx              # Root component — owns ALL global state
├── main.tsx             # React entry point
├── index.css            # Full cosmic dark theme (~1,450 lines)
├── types.ts             # Shared interfaces + constants (ELEMENT_POOL, OPERATORS, etc.)
├── storage.ts           # localStorage helpers (safeGet / safeSet)
├── ai.ts                # AI request/response logic (OpenAI & Anthropic formats)
├── achievements.ts      # Achievement definitions with checker functions
└── components/
    ├── Header.tsx           # Stats bar + settings/discovery/achievements buttons
    ├── ElementLibrary.tsx   # Left sidebar — element selection + search + shuffle
    ├── EquationBoard.tsx    # Center — equation slots, operator picker, compute button
    ├── SettingsModal.tsx    # AI provider/model/key configuration
    ├── DiscoveryLog.tsx     # Scrollable history of discovered equations
    ├── AchievementsModal.tsx# Achievement grid with lock/unlock states
    └── Toast.tsx            # Auto-dismissing notification overlay (4 s)
```

---

## Architecture & Key Conventions

### State management

`App.tsx` is the **single source of truth**. All persistent state lives there:

```typescript
const [elements, setElements]               = useState<Element[]>(loadElements)
const [equations, setEquations]             = useState<Equation[]>(loadEquations)
const [unlockedAchievements, ...]           = useState<string[]>(loadAchievements)
const [aiConfig, setAiConfig]               = useState<AIConfig>(loadAIConfig)
```

UI state (modals, toast queue) also lives in `App.tsx`. Children receive data and callback props — there is **no Context API, Redux, or external state library**.

**Data flow**: child calls callback prop → App updates state → saves to localStorage → re-renders children.

### Naming conventions

| Construct | Style | Example |
|---|---|---|
| Components / Types / Interfaces | PascalCase | `ElementLibrary`, `AIConfig` |
| Functions / variables | camelCase | `handleSelectElement`, `addToast` |
| Constants | UPPER_SNAKE_CASE | `STORAGE_KEYS`, `ELEMENT_POOL` |

### Component patterns

- **Functional components** with hooks only — no class components.
- **Modal pattern**: full-screen overlay div, click-outside closes it.
- **Card pattern**: element cards in sidebar, equation rows in discovery log.
- Callbacks are named `on<Action>` (e.g., `onSelect`, `onResult`, `onError`).

### TypeScript

Strict mode is enabled (`tsconfig.app.json`): `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. Fix all type errors before committing.

---

## Data Models

```typescript
// types.ts
interface Element {
  id: string
  name: string
  emoji: string
  description: string
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  discoveredAt?: number
  isStarter?: boolean
  isCustom?: boolean
}

interface Equation {
  left: Element
  operator: '+' | '-' | '×' | '÷'
  right: Element
  result: Element
  timestamp: number
}

interface AIConfig {
  endpoint: string
  apiKey: string
  model: string
  apiFormat: 'openai' | 'anthropic'
}
```

---

## Persistence (localStorage)

All state is persisted to localStorage via `storage.ts`:

| Key | Content |
|---|---|
| `algebrary_elements` | Array of discovered `Element` objects |
| `algebrary_equations` | Array of past `Equation` objects |
| `algebrary_achievements` | Array of unlocked achievement IDs |
| `algebrary_ai_config` | `AIConfig` object |

`safeGet<T>(key, fallback)` returns parsed JSON or `fallback` on error.  
`safeSet(key, value)` silently swallows localStorage quota errors.

---

## AI Integration (ai.ts)

The app has **no backend** — AI calls go directly from the browser to the user-configured endpoint.

### Supported API formats

| Format | Providers |
|---|---|
| `openai` | OpenAI, DeepSeek, Moonshot, Zhipu GLM, 通义千问, 百度千帆, any OpenAI-compatible |
| `anthropic` | Anthropic Claude (native API) |

### Request parameters

- Temperature: `0.8`
- Max tokens: `200`
- Response: JSON `{ name, emoji, description, rarity }`

### Operator semantics (system prompt in Chinese)

| Operator | Semantic meaning |
|---|---|
| `+` (加法) | Merge the essence of two concepts → fusion |
| `-` (减法) | Remove the second concept's traits from the first |
| `×` (乘法) | Second concept amplifies or transforms the first |
| `÷` (除法) | Extract the part of the first concept related to the second |

### Rarity distribution (approximate)

`common` ~50% · `rare` ~30% · `epic` ~15% · `legendary` ~5%

---

## Element System

- **48 starter elements** defined in `ELEMENT_POOL` (types.ts), spanning 4 Chinese categories: 自然, 生命, 抽象概念, 人文/物质.
- Starter elements have `isStarter: true`; user-discovered elements have `discoveredAt` timestamps.
- **Free input mode** (EquationBoard): users can type arbitrary concept names — these create temporary `Element` objects with emoji `✨` that get added to the library if new.
- **Shuffle button** in ElementLibrary shows a random subset of elements.

---

## Achievement System (achievements.ts)

13 achievements checked after each successful equation:

| ID | Trigger |
|---|---|
| `first_equation` | First equation completed |
| `collector_10/25/50/100` | Discover N elements |
| `all_operators` | Use all 4 operators at least once |
| `adder/subtractor/multiplier/divider` | Use each operator 10+ times |
| `equations_10/50` | Complete N equations |
| `first_rare/epic/legendary` | Discover that rarity tier |

---

## CSS Theme (index.css)

The entire UI uses a **cosmic dark theme** with:
- Primary: `#8b5cf6` (purple)
- Accent: `#06b6d4` (cyan)
- Gold: `#f59e0b`
- Rose: `#f43f5e`
- Glass morphism: `backdrop-filter: blur`, semi-transparent backgrounds
- Animations: floating emojis, spinning compute button, pulse borders
- Custom scrollbars matching the theme

Do not use a CSS framework — extend `index.css` directly to add new styles.

---

## Important Constraints

- **No backend** — never add a server-side component without discussing it first.
- **No test framework** — `pnpm lint` is the only CI gate; keep ESLint passing.
- **No additional dependencies** unless necessary — the dependency list is intentionally minimal.
- AI API keys are user-supplied and stored in localStorage — **never hardcode or log keys**.
- The compute button (`= 运算 =`) is disabled while a request is in flight (`computing` flag in EquationBoard); preserve this UX guard when modifying the compute flow.
- All user-visible strings in the core game UI are in **Chinese** — maintain this for new UI text.
