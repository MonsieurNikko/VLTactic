# Project Context: Budget AI Valorant Strategy Board

## 1. Project Vision
To build a **web-based tactical whiteboard for Valorant** that is:
- **Collaborative:** Real-time updates like Google Docs.
- **Performant:** No lag, handling hundreds of icons smoothly using Canvas.
- **Smart but Cheaper:** Uses a "Tree System" (structured data) instead of expensive AI Vision to understand tactics.
- **Community-Driven:** Integrated lineups and sharing.

## 2. Core Philosophy
- **"Budget-First":** Avoid expensive cloud services (AWS, Paid OpenAI). Use Free/Generous tiers (Vercel, Supabase, Gemini Flash).
- **"Data-First":** Do not rely on valid HTML/DOM extraction. The "Truth" is in the JSON state of the board.
- **"Performance-First":** If it laggy, it fails. Use `Konva.js` for rendering.

## 3. Technology Stack (Strict)
- **Frontend Framework:** Next.js (App Router, TypeScript).
- **Styling:** Tailwind CSS.
- **Canvas Library:** `react-konva` (files must use ` "use client" `).
- **Backend / Database:** Supabase (PostgreSQL).
- **Realtime Engine:** Supabase Realtime.
- **AI Model:** Google Gemini Flash (via Vercel AI SDK).

## 4. Key Architectural Concepts

### A. The "Tree System" (Zone Mapping)
Instead of AI analyzing an image, the Board knows where things are.
- **Map Data:** Hardcoded JSON files defining polygons for zones (e.g., "A Main", "Market").
- **Logic:** `Item(x,y)` inside `Zone(Polygon)` -> `Location: "A Main"`.
- **AI Input:** The system generates a text prompt: *"Jett used Updraft at A Main, Omen smoked Market"* and sends THIS to the LLM.

### B. Lineups as Data
- A lineup is not just a drawing. It is an Object containing:
  - `startPoint` (x,y)
  - `endPoint` (x,y)
  - `metadata`: { videoUrl, description, agent, utilityType }

## 5. Documentation Strategy & History
- **`HISTORY.md` Rule:** All Agents MUST update `HISTORY.md` when completing a major task or version bump. This is non-negotiable.
- **`task.md`:** The single source of truth for current progress.
- **Comments:** Explain "why", not just "what".

## 6. Directory Structure (Current — v0.3)
```
/src
  /app
    layout.tsx       # Root layout, metadata "VLTactic"
    page.tsx         # Main page, mobile sidebar toggle
    globals.css      # Tailwind v4 imports + custom scrollbar
  /components
    /board
      MapBoard.tsx   # Konva Stage — zoom, pan, draw, arrows, place agents
      DraggableAgent.tsx  # Draggable agent circle with CDN icon
      UtilityIcon.tsx     # Colored utility icon with ability-type styling
    /ui
      Sidebar.tsx    # Agent/ability selection, team toggle, board items list
      Toolbar.tsx    # Map selector, tool buttons, color picker, undo, zoom
  /data
    agents.ts        # 28 agents with CDN iconUrl, roles, abilities
    maps.ts          # 10 maps with valorant-api.com CDN images
    abilities.ts     # Centralized ability→type mapping (60+ abilities, 7 types)
  /store
    boardStore.ts    # Zustand store — items, drawings, viewport, tools, colors
  /types
    index.ts         # BoardItem, AgentDef, MapDef, DrawingItem, PendingAgent
```

### Current Features (v0.4)
- Place agents + specific abilities on map
- Freehand drawing (6 colors) + Arrow tool
- Undo/Redo drawings (Ctrl+Z / Ctrl+Y)
- Drawing selection + delete (click drawing, Delete/Backspace)
- Zoom/Pan (scroll, Space+drag, right-click, middle-click)
- Keyboard shortcuts: V/D/A/Ctrl+Z/Space/Del/Esc
- Real CDN maps & agent icons from valorant-api.com
- Agent CDN icons rendered on canvas
- Mobile responsive (sidebar toggle)

### NOT YET implemented
- Zone mapping / "Tree System"
- Supabase Realtime / Collaboration
- AI Chat / Tactical analysis
- Lineup metadata
- Economy Calculator / Timeline / VOD Sync

## 7. Future Feature Roadmap (The "Big 3")
1.  **Economy Calculator:** Auto-sum credit cost of loadouts. (e.g., Vandal + Full Armor + 2 Smokes = 2900 + 1000 + 300 = 4200).
2.  **Timeline / Playback:** Instead of static images, allow a "Play" button. Agents move over time (Entry -> Plant -> Post-plant).
3.  **VOD Sync:** Paste a YouTube link + Timestamp. Clicking a strat instantly jumps the video to that moment for reference.
