# Implementation Plan - Budget AI Valorant Board

This plan outlines the development of a high-performance, cost-effective tactical board for Valorant, featuring real-time collaboration and smart data integration.

## User Review Required

> [!IMPORTANT]
> **Tech Stack Selection:**
> - **Frontend:** Next.js (React) + Konva.js (Canvas)
> - **Backend/Auth/Realtime:** Supabase (Free Tier)
> - **Deployment:** Vercel (Free Tier)
> - **AI:** Google Gemini Flash (via Vercel AI SDK)

> [!NOTE]
> **"Tree System" Mapping:**
> We will manually define zones (polygons) for each map. This requires a one-time setup effort per map to ensure the "Location" data is accurate for the AI.

## Proposed Changes

### Phase 1: Foundation & Core Board
#### [NEW] [Project Setup]
- Initialize Next.js project with TypeScript and Tailwind CSS.
- Configure Supabase client.

#### [NEW] [components/MapBoard.tsx]
- Implement `react-konva` Stage and Layer.
- Load high-res Valorant map images.
- Implement Zoom/Pan functionality (using `k-wheel` or gesture logic).

#### [NEW] [components/DraggableItem.tsx]
- Create draggable Agent/Ability icons.
- Implement logic to track their x,y coordinates relative to the map background.

### Phase 2: "Tree System" & Data Logic
#### [NEW] [data/maps.json]
- Define map metadata (name, image URL).
- **Crucial:** Define "Zones" for one map (e.g., Ascent) as a proof-of-concept.
  ```json
  {
    "map": "Ascent",
    "zones": [
      { "name": "A Main", "points": [100, 100, 200, 100, ...] }
    ]
  }
  ```

#### [NEW] [utils/tacticalAnalysis.ts]
- Function `getZoneFromCoordinates(x, y)`: Returns the zone name based on item position.
- Function `generateTacticalDescription(gameState)`: Converts the board state into a natural language prompt for the AI.

### Phase 3: Real-time & Collaboration
#### [NEW] [hooks/useRealtimeState.ts]
- Connect to Supabase Realtime/Postgres Changes.
- Broadcast cursor positions and object movements to other connected clients.

### Phase 4: Lineups & Polish
#### [NEW] [components/LineupDrawer.tsx]
- Allow users to draw paths/lines.
- Attach metadata (title, video URL) to these lines.

### Phase 5: Advanced Features (The "Big 3")
#### [NEW] [utils/economy.ts]
- Implement `calculateRoundCost(loadout)` function.
- Integrate cost display into the UI.

#### [NEW] [components/TimelineControl.tsx]
- Create a playback slider (0s - 100s).
- Update `DraggableItem` to accept keyframes (e.g., `x,y` at `t=0` and `x,y` at `t=5`).

#### [NEW] [components/VODPlayer.tsx]
- Embed YouTube/Twitch player.
- Sync player timestamp with the strategy board's "Play" button.

## Verification Plan

### Automated Tests
- **Unit Tests:** Jest/Vitest for `generateTacticalDescription` to ensure correct text generation from coordinates.
- **Component Tests:** Ensure `MapBoard` renders without crashing and handles zoom events.

### Manual Verification
- **Drag & Drop:** Verify icons move smoothly and stick to the cursor.
- **Zone Detection:** Place an agent on "A Main" and verify the UI displays "Jett @ A Main".
- **Real-time:** Open two browser windows. Move an item in one; verify it moves in the other instantly.
- **AI Chat:** Click "Analyze", verify the system sends the generated text to Gemini and displays the response.
- **History:** Check `HISTORY.md` is updated after major changes.
