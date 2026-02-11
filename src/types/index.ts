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
  id: string;
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
  uuid?: string; // Valorant API UUID for ability icon fetching
  abilities: string[];
}

/** Ability icon slot type from Valorant API */
export type AbilitySlot = "ability1" | "ability2" | "grenade" | "ultimate" | "passive";

/** Definition of a Valorant Map */
export interface MapDef {
  name: string;
  displayName: string;
  /** Path to the map image in /public/maps/ */
  imagePath: string;
  /** Canvas dimensions for the map coordinate system */
  width: number;
  height: number;
  /** Rotation in degrees (CW) to orient map vertically (ATK bottom → DEF top).
   *  Applied to the KonvaImage background only. 0 or undefined = no rotation. */
  rotation?: number;
}

/** Board camera / viewport state */
export interface ViewportState {
  scale: number;
  x: number;
  y: number;
}
