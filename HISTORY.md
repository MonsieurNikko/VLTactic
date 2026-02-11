# Project History & Changelog

This document tracks the evolution of the project. **AI Agents MUST read this file** to understand the latest state and **MUST update this file** upon completing significant milestones or version bumps.

## Format
- **Date:** YYYY-MM-DD
- **Version:** vX.Y.Z
- **Author:** [Agent Name/User]
- **Changes:** Bullet points of what changed.
- **Context:** Brief note on *why* changes were made (if architectural).

---

## [Unreleased] - Planning Phase
- **2026-02-10** - **Project Initialization**
  - Established `project_context.md` (Vision, Tech Stack: Next.js + Konva + Supabase).
  - Established `agent_guidelines.md` (Coding rules, "Tree System" protocol).
  - Created `implementation_plan.md` (Phased approach).
  - Defined 3 Bonus Features: Economy Calculator, Timeline/Playback, VOD Sync.

## [v0.1.0] - Phase 1: Foundation & Core Board
- **2026-02-10** - **Phase 1 Complete**
  - **Author:** GitHub Copilot
  - **Changes:**
    - Initialized Next.js 16 project (TypeScript, Tailwind CSS, App Router).
    - Installed `react-konva`, `konva`, `zustand`.
    - Created Zustand store (`boardStore.ts`) — items, viewport, pending agent, map selection.
    - Created `MapBoard.tsx` — Konva Stage with zoom (scroll), pan (right-click drag), click-to-place.
    - Created `DraggableAgent.tsx` — drag-and-drop agent circles with team color ring, initials, selection ring. Double-click to remove.
    - Created `Sidebar.tsx` — agent selection by role, team toggle (ATK/DEF), search, board items list.
    - Created `Toolbar.tsx` — map selector dropdown, zoom controls, clear board button.
    - Defined all Valorant agents (`agents.ts`) with roles, colors, abilities.
    - Defined all Valorant maps (`maps.ts`) with dimensions.
    - Created SVG placeholder map for Ascent with zone labels.
    - Dark theme UI throughout. Dynamic import for SSR-safe Konva.
  - **Context:** Phase 1 establishes the interactive canvas foundation. Users can select agents, place them on the map, drag them, and manage the board.

## [v0.2.0] - Phase 1.5: Quality Upgrade Round 1
- **2026-02-11** - **Self-Evaluation → 4/10 → Fix Round**
  - **Author:** GitHub Copilot
  - **Changes:**
    - Replaced placeholder SVG maps with real CDN images from `valorant-api.com`.
    - Added utility placement system — click ability in sidebar → place on map as colored icon.
    - Added freehand drawing tool (marker mode).
    - Added Space+Drag panning for ergonomic navigation.
    - Added onboarding overlay guide for new users.
    - Improved agent visual design (team-colored ring, readable initials, selection glow).
    - Added map loading spinner with fallback grid.
  - **Context:** First self-evaluation rated the app 4/10. This round addressed the most critical gaps: no real maps, no utility placement, no drawing capability.

## [v0.3.0] - Phase 1.5: Quality Upgrade Round 2
- **2026-02-11** - **Self-Evaluation → 6.5/10 → Full Upgrade**
  - **Author:** GitHub Copilot
  - **Changes:**
    - **[CRITICAL] Undo drawings:** `Ctrl+Z` undoes last drawing (freehand or arrow). ↩ button in Toolbar.
    - **[CRITICAL] Multi-color drawing:** 6 color options (Yellow, Red, Green, Blue, White, Orange). Color picker in Toolbar.
    - **[CRITICAL] Arrow tool:** New `➜ Arrow` mode (shortcut `A`) for directional strategy indicators. Uses `<Arrow>` from react-konva.
    - **[MEDIUM] Sidebar click logic fixed:** Row click only expands/collapses agent. Separate "👤 Place Agent" button for placement mode. Individual ability buttons for utility placement.
    - **[MEDIUM] Toolbar resetView:** Now computes centered viewport from actual `stageSize` + map dimensions. No more hardcoded magic numbers.
    - **[LIGHT] Agent CDN icons:** All 28 agents display real icons from `valorant-api.com/agents/{uuid}/displayicon.png`.
    - **[LIGHT] Centralized ability mapping:** New `data/abilities.ts` with 60+ abilities correctly classified into 7 types (Smoke, Flash, Wall, Molly, Recon, Trap, Heal). Fixes: Stim Beacon≠Smoke, Orbital Strike→Molly, Regrowth→Heal, Prowler→Recon, etc.
    - **[LIGHT] New agent Veto added:** Sentinel, abilities: Chokehold, Interceptor, Crosscut, Evolution.
    - **[LIGHT] Fixed abilities:** Waylay (Saturate, Lightspeed, Refract, Convergent Paths), Tejo (Special Delivery, Guided Salvo, Stealth Drone, Armageddon), Vyse (Shear, Arc Rose, Razorvine, Steel Garden), Harbor (Storm Surge replaces Cascade).
    - **[LIGHT] Mobile support:** Sidebar hidden on mobile with ☰ toggle button. Toolbar has `overflow-x-auto`.
    - **Keyboard shortcuts:** `V`=Select, `D`=Draw, `A`=Arrow, `Ctrl+Z`=Undo, `Space+Drag`=Pan, `Delete`=Remove, `Esc`=Cancel.
  - **Context:** Second self-evaluation rated 6.5/10 identifying 9 issues. This round systematically addressed ALL of them. App now at a usable baseline for strategy planning.
  - **Git:** Pushed to `https://github.com/MonsieurNikko/VLTactic.git` (branch `main`).
