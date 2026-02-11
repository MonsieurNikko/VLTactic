// ============================================================
// LocalStorage Save/Load System for VLTactic
// Auto-saves board state every 5s, with manual save/load
// ============================================================

import type { BoardItem, DrawingItem } from "@/types";

interface SavedBoardState {
  items: BoardItem[];
  drawings: DrawingItem[];
  selectedMap: string;
  timestamp: number;
  version: string;
}

const STORAGE_KEY = "vltactic-board-state";
const AUTO_SAVE_INTERVAL = 5000; // 5 seconds
const CURRENT_VERSION = "0.5.0";
const isClient = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function saveBoardState(
  items: BoardItem[],
  drawings: DrawingItem[],
  selectedMap: string
): void {
  if (!isClient) return;
  try {
    const state: SavedBoardState = {
      items,
      drawings,
      selectedMap,
      timestamp: Date.now(),
      version: CURRENT_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save board state:", error);
  }
}

export function loadBoardState(): SavedBoardState | null {
  if (!isClient) return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const state = JSON.parse(stored) as SavedBoardState;
    // Version check for future migrations
    if (!state.version || state.version !== CURRENT_VERSION) {
      console.warn("Saved state version mismatch, may have compatibility issues");
    }
    
    return state;
  } catch (error) {
    console.error("Failed to load board state:", error);
    return null;
  }
}

export function clearBoardState(): void {
  if (!isClient) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear board state:", error);
  }
}

export function hasSavedState(): boolean {
  if (!isClient) return false;
  return localStorage.getItem(STORAGE_KEY) !== null;
}

export function getLastSaveTime(): number | null {
  const state = loadBoardState();
  return state?.timestamp ?? null;
}

// Auto-save hook for React components
export function setupAutoSave(
  getState: () => { items: BoardItem[]; drawings: DrawingItem[]; selectedMap: string }
): () => void {
  if (!isClient) return () => {};
  const intervalId = setInterval(() => {
    const { items, drawings, selectedMap } = getState();
    if (items.length > 0 || drawings.length > 0) {
      saveBoardState(items, drawings, selectedMap);
    }
  }, AUTO_SAVE_INTERVAL);

  return () => clearInterval(intervalId);
}
