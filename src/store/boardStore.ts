import { create } from "zustand";
import { BoardItem, ViewportState, DrawingItem } from "@/types";
import { DEFAULT_MAP, MAPS } from "@/data/maps";

// ============================================================
// Zustand Store — Single source of truth for the board state
// ============================================================

interface BoardStore {
  // ── State ─────────────────────────────────────────────────
  items: BoardItem[];
  selectedMap: string;
  viewport: ViewportState;
  selectedItemId: string | null;
  activeTool: "select" | "draw" | "arrow";
  drawings: DrawingItem[];
  drawColor: string;
  stageSize: { width: number; height: number };

  // Pending item to be placed via click on map
  pendingAgent: {
    agentName: string;
    team: "attack" | "defend";
    color: string;
    utilityName?: string;
  } | null;

  // ── Actions ───────────────────────────────────────────────
  addItem: (item: Omit<BoardItem, "id">) => void;
  updateItemPosition: (id: string, x: number, y: number) => void;
  removeItem: (id: string) => void;
  selectItem: (id: string | null) => void;
  clearBoard: () => void;
  setSelectedMap: (mapName: string) => void;
  setViewport: (viewport: Partial<ViewportState>) => void;
  setActiveTool: (tool: BoardStore["activeTool"]) => void;
  setPendingAgent: (agent: BoardStore["pendingAgent"]) => void;
  addDrawing: (drawing: DrawingItem) => void;
  undoDrawing: () => void;
  clearDrawings: () => void;
  setDrawColor: (color: string) => void;
  setStageSize: (size: { width: number; height: number }) => void;
  resetView: () => void;
}

let _nextId = 1;
const genId = () => `item-${_nextId++}`;

export const DRAW_COLORS = [
  { color: "#FFD700", name: "Yellow" },
  { color: "#FF4655", name: "Red" },
  { color: "#17E6A1", name: "Green" },
  { color: "#3B82F6", name: "Blue" },
  { color: "#FFFFFF", name: "White" },
  { color: "#F97316", name: "Orange" },
];

export const useBoardStore = create<BoardStore>((set, get) => ({
  // ── Initial State ─────────────────────────────────────────
  items: [],
  selectedMap: DEFAULT_MAP.name,
  viewport: { scale: 1, x: 0, y: 0 },
  selectedItemId: null,
  activeTool: "select",
  pendingAgent: null,
  drawings: [],
  drawColor: "#FFD700",
  stageSize: { width: 800, height: 600 },

  // ── Actions ───────────────────────────────────────────────
  addItem: (item) =>
    set((s) => ({
      items: [...s.items, { ...item, id: genId() }],
    })),

  updateItemPosition: (id, x, y) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, x, y } : i)),
    })),

  removeItem: (id) =>
    set((s) => ({
      items: s.items.filter((i) => i.id !== id),
      selectedItemId: s.selectedItemId === id ? null : s.selectedItemId,
    })),

  selectItem: (id) => set({ selectedItemId: id }),

  clearBoard: () => set({ items: [], selectedItemId: null, drawings: [] }),

  setSelectedMap: (mapName) =>
    set({ selectedMap: mapName, items: [], selectedItemId: null, drawings: [] }),

  setViewport: (partial) =>
    set((s) => ({ viewport: { ...s.viewport, ...partial } })),

  setActiveTool: (tool) => set({ activeTool: tool }),

  setPendingAgent: (agent) => set({ pendingAgent: agent }),

  addDrawing: (drawing) =>
    set((s) => ({ drawings: [...s.drawings, drawing] })),

  undoDrawing: () =>
    set((s) => ({ drawings: s.drawings.slice(0, -1) })),

  clearDrawings: () => set({ drawings: [] }),

  setDrawColor: (color) => set({ drawColor: color }),

  setStageSize: (size) => set({ stageSize: size }),

  resetView: () => {
    const { stageSize, selectedMap } = get();
    const mapDef = MAPS.find((m) => m.name === selectedMap) ?? MAPS[0];
    const padding = 40;
    const scaleX = (stageSize.width - padding * 2) / mapDef.width;
    const scaleY = (stageSize.height - padding * 2) / mapDef.height;
    const scale = Math.min(scaleX, scaleY, 1);
    const x = (stageSize.width - mapDef.width * scale) / 2;
    const y = (stageSize.height - mapDef.height * scale) / 2;
    set({ viewport: { scale, x, y } });
  },
}));
