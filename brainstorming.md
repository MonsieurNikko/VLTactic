# Brainstorming: "Budget-Friendly" AI Valorant Strategy Board

## Vision
A high-performance, collaborative web-based tactical board for Valorant. Focus on **low cost**, **ease of use**, and **smart data structure** instead of expensive AI image processing.

## 1. Core Features (The Foundation)
- **Real-time Collaboration:** Google Docs-style live updates.
- **Interactive Map:** High-res maps with zoom/pan.
- **Agent & Utility Toolkit:** Drag-and-drop agents, abilities.
- **Budget Tech Stack:**
  - **Frontend:** Next.js (React) + Konva.js (Canvas) - Free hosting on Vercel.
  - **Backend:** Supabase (PostgreSQL + Realtime) - Generous free tier for database and auth.
  - **AI:** Google Gemini Flash (Low cost/Free tier) for text analysis only.

## 2. "Tree System" Mapping (The Smart Core)
- **Pre-defined Locations:** We map out coordinates (polygons/zones) on the map to names (e.g., "A Long", "Heaven", "Backsite").
- **Logic:** When you place an integrated object (e.g., Jett) on the map, the system automatically knows:
  - `Object: Jett`
  - `Location: A Long`
  - `Action: Updraft`
- **Benefit:** This generates a clean text description automatically ("Jett uses Updraft at A Long") *without* needing AI to "see" anything. This text is then sent to the AI for tactical advice.

## 3. Integrated Lineups
- **Lineup = Data Object:** A drawn line isn't just a drawing. It can hold metadata:
  - Video URL (YouTube/Streamable)
  - Image URL
  - Description
- **Community Sharing:** Users can choose to "Verify & Publicize" their lineup. Other users can toggle "Show Community Lineups" to see these lines overlayed on their map.

## 4. Performance & Optimization (Solving "Lag")
- **Tech Choice:** **Konva.js (HTML5 Canvas)**.
  - *Why:* It's much faster than standard HTML for moving many objects. It's actively maintained and works well with React (`react-konva`).

## 5. Next Steps
- Setup the project with Next.js and Supabase.
- Build the basic Map component with Konva.
- Create the "Zone Editor" to define our map regions (The "Tree System").
