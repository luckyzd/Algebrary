# AGENTS.md

## Cursor Cloud specific instructions

This repository ("Algebrary") is currently a **greenfield project** with no application code, build system, or dependencies. The repo contains only a `README.md` placeholder.

### Current state
- **No tech stack** has been chosen yet — no `package.json`, `requirements.txt`, `Cargo.toml`, or similar.
- **No services** to start, no tests to run, no linter configured.
- **No Docker/container** setup exists.

### For future agents
- Once a tech stack is chosen and code is added, update this file with service startup instructions, test commands, and any non-obvious caveats.
- The update script (`SetupVmEnvironment`) is currently a no-op (`echo "No dependencies to install"`). Replace it with the appropriate dependency install command (e.g., `npm install`, `pip install -r requirements.txt`) once dependencies are introduced.
