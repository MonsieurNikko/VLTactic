// ============================================================
// Type Definitions for the Valorant Strategy Board
// ============================================================

/** A single item placed on the tactical board */
export interface BoardItem {
  id: string;
  type: "agent" | "utility" | "marker";
  agentName: string;
  utilityName?: string; // e.g., "Smoke", "Flash", "Wall"
  x: number; // position on the map canvas
  y: number;
  team: "attack" | "defend";
  color: string;
  label?: string;
}

/** A drawing annotation on the board */
export interface DrawingItem {
  type: "freehand" | "arrow";
  points: number[];
  color: string;
}

/** Definition of a Valorant Agent */
export interface AgentDef {
  name: string;
  role: "Duelist" | "Controller" | "Initiator" | "Sentinel";
  color: string; // brand color for the agent
  iconUrl?: string; // CDN display icon URL
  abilities: string[];
}

/** Definition of a Valorant Map */
export interface MapDef {
  name: string;
  displayName: string;
  /** Path to the map image in /public/maps/ */
  imagePath: string;
  /** Canvas dimensions for the map coordinate system */
  width: number;
  height: number;
}

/** Board camera / viewport state */
export interface ViewportState {
  scale: number;
  x: number;
  y: number;
}
