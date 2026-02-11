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

## [v0.4.0] - Phase 1.6: UX & Drawing Control Upgrade
- **2026-02-11** - **User Testing + Usability Pass**
  - **Author:** GitHub Copilot
  - **Changes:**
    - Agent icons now render directly on the canvas (CDN avatar inside circle) for clear identification.
    - Drawing selection added: click a drawing to select, `Delete/Backspace` removes it.
    - Redo support added (`Ctrl+Y` / `Ctrl+Shift+Z`) with toolbar redo button.
    - Pending agent auto-cancels when switching to Draw/Arrow tools to avoid accidental placement.
    - Onboarding/shortcut hints updated with redo shortcut.
  - **Context:** Addressed post-review usability gaps (canvas agent recognition, drawing control, undo/redo workflow).

## [v0.5.0] - Phase 1.7: Production Quality Upgrade
- **2026-02-11** - **Comprehensive Feature Enhancement + Critical Bug Fixes**
  - **Author:** GitHub Copilot
  - **Changes:**
    - **[CRITICAL] Save/Load System:** localStorage auto-save every 5s + manual save/load buttons. Version tracking (v0.5.0). SSR-safe guards. Fixes major pain point (data loss on F5 refresh).
    - **[CRITICAL] PNG Export:** Export strategy as high-res PNG (2x resolution). Clipboard copy support. Viewport reset/restore. Integrated into Toolbar with 📸 button.
    - **[CRITICAL] Real Ability Icons:** Fetched complete Valorant API data (88KB). Added UUIDs to all 28 agents. Created ability name→slot mapping. Updated `UtilityIcon.tsx` to load CDN images. Format: `valorant-api.com/agents/{uuid}/abilities/{slot}/displayicon.png`.
    - **[CRITICAL] Next.js CDN Optimization:** Created `CDNImage.tsx` wrapper component with custom loader for external CDNs. Replaced native `<img>` tags in Sidebar. Eliminates Next.js linting warnings.
    - **[CRITICAL] Map Rotation:** 6 horizontal maps (Bind, Breeze, Fracture, Pearl, Lotus, Sunset) pre-rotated -90° CCW via spawn coordinate analysis. `↻ Rotate` button rotates map 90° clockwise with all items/drawings following.
    - **[CRITICAL] Added Corrode map:** New competitive map added to map pool.
    - **[BUG FIX] React Cascading Render Warning:** Added `mounted` boolean flag pattern in `DraggableAgent.tsx` and `MapBoard.tsx` to prevent setState on unmounted components.
    - **[BUG FIX] Race Conditions:** Fixed image loading race conditions during rapid map/agent switches using mounted tracking.
    - **[BUG FIX] SSR localStorage Errors:** Added SSR guards (`typeof window !== "undefined"`) to all localStorage functions. Build now succeeds without prerender errors.
    - **[ARCHITECTURE] Store Integration:** Added `saveToLocalStorage()`, `loadFromLocalStorage()`, `rotateMap()` actions to `boardStore.ts`. Auto-save setup in `MapBoard.tsx` useEffect with cleanup.
    - **[ARCHITECTURE] Component Prop Threading:** Created shared `stageRef` in `page.tsx`, passed to both MapBoard and Toolbar for export functionality.
    - **[DATA] Agent UUIDs:** Added UUID field to all 28 agents in `agents.ts` for ability icon URL generation.
    - **[DATA] Ability Slot Mapping:** Complete ability name→API slot mapping in `abilities.ts` (150+ abilities across all agents).
    - **[TYPES] TypeScript Updates:** Added `uuid?: string` to `AgentDef` interface. Added `AbilitySlot` type export.
    - **[UI] Toolbar Enhancements:** New buttons - 💾 Save, 📂 Load, 📸 Export, 🗑 New, ↻ Rotate. Save status displays "Last saved: Xm ago". Success toast notifications.
    - **[UI] Utility Icon Update:** Real ability icons displayed as Konva Image, fallback to colored circle. Removed text labels for cleaner look.
  - **Context:** User demanded comprehensive upgrade following strict adherence to agent_guidelines.md. Focused on real API integration, persistent storage, export capabilities, map rotation, and critical bug fixes. Addressed all Tier 1 issues from evaluation.
  - **Build:** ✅ Passing (Next.js 16, TypeScript, SSR prerender)
  - **Files Created:** `localStorage.ts`, `exportCanvas.ts`, `CDNImage.tsx`
  - **Files Modified:** `abilities.ts`, `agents.ts`, `types/index.ts`, `boardStore.ts`, `Toolbar.tsx`, `MapBoard.tsx`, `page.tsx`, `DraggableAgent.tsx`, `Sidebar.tsx`, `UtilityIcon.tsx`, `maps.ts`
  - **Next Steps:** Phase 2 - Tree System & Data Logic (Zone mapping, tactical description generation)
