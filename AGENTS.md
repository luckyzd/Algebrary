# AGENTS.md

## Cursor Cloud specific instructions

**Algebrary (万物方程)** is a web game built with Vite + React + TypeScript. Players combine real-world concepts using arithmetic operations (+, -, ×, ÷), powered by AI (OpenAI-compatible APIs).

### Running the app
- `pnpm dev` starts the Vite dev server on port 5173 (binds `0.0.0.0`).
- `pnpm build` runs `tsc -b && vite build` for production builds.
- `pnpm lint` runs ESLint with flat config.

### Key notes
- The game requires an AI API key to compute equations. Without one, the UI still works but the "= 运算 =" button shows an error toast.
- Game state (elements, equations, achievements, AI config) persists in `localStorage`.
- The `pnpm.onlyBuiltDependencies` field in `package.json` allows `esbuild` postinstall to run; this is required for Vite.
- No backend server — all AI calls are made directly from the browser to the user-configured API endpoint.
