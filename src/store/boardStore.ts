import { create } from "zustand";
import { BoardItem, ViewportState, DrawingItem } from "@/types";
import { DEFAULT_MAP, MAPS } from "@/data/maps";
import { loadBoardState, saveBoardState } from "@/utils/localStorage";

// ============================================================
// Zustand Store — Single source of truth for the board state
// Now with save/load persistence support
// ============================================================

interface BoardStore {
  // ── State ─────────────────────────────────────────────────
  items: BoardItem[];
  selectedMap: string;
  mapRotationOffset: number; // Additional rotation offset (0, 90, 180, 270)
  viewport: ViewportState;
  selectedItemId: string | null;
  activeTool: "select" | "draw" | "arrow";
  drawings: DrawingItem[];
  redoDrawings: DrawingItem[];
  drawColor: string;
  stageSize: { width: number; height: number };
  selectedDrawingId: string | null;

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
  addDrawing: (drawing: Omit<DrawingItem, "id">) => void;
  undoDrawing: () => void;
  redoDrawing: () => void;
  removeDrawing: (id: string) => void;
  clearDrawings: () => void;
  setDrawColor: (color: string) => void;
  setStageSize: (size: { width: number; height: number }) => void;
  resetView: () => void;
  setSelectedDrawing: (id: string | null) => void;
  rotateMap: () => void; // Rotate map by 90° clockwise
  
  // Save/Load actions (NEW)
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => boolean;
}

let _nextId = 1;
const genId = () => `item-${_nextId++}`;
let _nextDrawingId = 1;
const genDrawingId = () => `draw-${_nextDrawingId++}`;

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
  mapRotationOffset: 0,
  viewport: { scale: 1, x: 0, y: 0 },
  selectedItemId: null,
  activeTool: "select",
  pendingAgent: null,
  drawings: [],
  redoDrawings: [],
  drawColor: "#FFD700",
  stageSize: { width: 800, height: 600 },
  selectedDrawingId: null,

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

  selectItem: (id) => set({ selectedItemId: id, selectedDrawingId: null }),

  clearBoard: () =>
    set({
      items: [],
      selectedItemId: null,
      drawings: [],
      redoDrawings: [],
      selectedDrawingId: null,
    }),

  setSelectedMap: (mapName) =>
    set({
      selectedMap: mapName,
      mapRotationOffset: 0, // Reset rotation on map change
      items: [],
      selectedItemId: null,
      drawings: [],
      redoDrawings: [],
      selectedDrawingId: null,
    }),

  setViewport: (partial) =>
    set((s) => ({ viewport: { ...s.viewport, ...partial } })),

  setActiveTool: (tool) =>
    set((s) => ({
      activeTool: tool,
      pendingAgent: tool === "select" ? s.pendingAgent : null,
    })),

  setPendingAgent: (agent) =>
    set((s) => ({
      pendingAgent: agent,
      activeTool: agent ? "select" : s.activeTool,
    })),

  addDrawing: (drawing) =>
    set((s) => ({
      drawings: [...s.drawings, { ...drawing, id: genDrawingId() }],
      redoDrawings: [],
    })),

  undoDrawing: () =>
    set((s) => {
      if (s.drawings.length === 0) return s;
      const last = s.drawings[s.drawings.length - 1];
      return {
        drawings: s.drawings.slice(0, -1),
        redoDrawings: [...s.redoDrawings, last],
        selectedDrawingId: s.selectedDrawingId === last.id ? null : s.selectedDrawingId,
      };
    }),

  redoDrawing: () =>
    set((s) => {
      if (s.redoDrawings.length === 0) return s;
      const next = s.redoDrawings[s.redoDrawings.length - 1];
      return {
        drawings: [...s.drawings, next],
        redoDrawings: s.redoDrawings.slice(0, -1),
      };
    }),

  removeDrawing: (id) =>
    set((s) => ({
      drawings: s.drawings.filter((d) => d.id !== id),
      selectedDrawingId: s.selectedDrawingId === id ? null : s.selectedDrawingId,
    })),

  clearDrawings: () => set({ drawings: [], redoDrawings: [], selectedDrawingId: null }),

  setDrawColor: (color) => set({ drawColor: color }),

  setStageSize: (size) => set({ stageSize: size }),

  setSelectedDrawing: (id) => set({ selectedDrawingId: id }),

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

  rotateMap: () => {
    const s = get();
    const mapDef = MAPS.find((m) => m.name === s.selectedMap) ?? MAPS[0];
    const cx = mapDef.width / 2;
    const cy = mapDef.height / 2;

    // Rotate point 90° clockwise around center
    const rotate90CW = (x: number, y: number) => ({
      x: cx + (y - cy),
      y: cy - (x - cx),
    });

    // Rotate all items
    const rotatedItems = s.items.map((item) => {
      const { x, y } = rotate90CW(item.x, item.y);
      return { ...item, x, y };
    });

    // Rotate all drawings (points array: [x1,y1,x2,y2,...])
    const rotatedDrawings = s.drawings.map((drawing) => {
      const newPoints: number[] = [];
      for (let i = 0; i < drawing.points.length; i += 2) {
        const { x, y } = rotate90CW(drawing.points[i], drawing.points[i + 1]);
        newPoints.push(x, y);
      }
      return { ...drawing, points: newPoints };
    });

    // Also rotate redo stack
    const rotatedRedoDrawings = s.redoDrawings.map((drawing) => {
      const newPoints: number[] = [];
      for (let i = 0; i < drawing.points.length; i += 2) {
        const { x, y } = rotate90CW(drawing.points[i], drawing.points[i + 1]);
        newPoints.push(x, y);
      }
      return { ...drawing, points: newPoints };
    });

    set({
      mapRotationOffset: (s.mapRotationOffset + 90) % 360,
      items: rotatedItems,
      drawings: rotatedDrawings,
      redoDrawings: rotatedRedoDrawings,
    });
  },

  // ── Save/Load (NEW) ───────────────────────────────────────
  saveToLocalStorage: () => {
    const { items, drawings, selectedMap } = get();
    saveBoardState(items, drawings, selectedMap);
  },

  loadFromLocalStorage: () => {
    const saved = loadBoardState();
    if (!saved) return false;
    
    set({
      items: saved.items,
      drawings: saved.drawings,
      selectedMap: saved.selectedMap,
      redoDrawings: [],
      selectedItemId: null,
      selectedDrawingId: null,
    });
    return true;
  },
}));
