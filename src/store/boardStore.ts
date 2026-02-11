import { create } from "zustand";
import { BoardItem, ViewportState, DrawingItem } from "@/types";
import { DEFAULT_MAP, MAPS } from "@/data/maps";
import { loadBoardState, saveBoardState } from "@/utils/localStorage";
import { realtimeService } from "@/utils/realtimeService";

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
  activeTool: "select" | "draw" | "arrow" | "eraser";
  drawings: DrawingItem[];
  redoDrawings: DrawingItem[];
  drawColor: string;
  stageSize: { width: number; height: number };
  selectedDrawingId: string | null;
  showZones: boolean;

  // Pending item to be placed via click on map
  pendingAgent: {
    agentName: string;
    team: "attack" | "defend";
    color: string;
    utilityName?: string;
  } | null;

  // Real-time state
  remoteCursors: Record<string, { x: number; y: number; color: string; lastSeen: number }>;

  // ── Actions ───────────────────────────────────────────────
  addItem: (item: Omit<BoardItem, "id">, remote?: boolean) => void;
  updateItemPosition: (id: string, x: number, y: number, remote?: boolean) => void;
  removeItem: (id: string, remote?: boolean) => void;
  selectItem: (id: string | null) => void;
  clearBoard: (remote?: boolean) => void;
  setSelectedMap: (mapName: string) => void;
  setViewport: (viewport: Partial<ViewportState>) => void;
  setActiveTool: (tool: BoardStore["activeTool"]) => void;
  setPendingAgent: (agent: BoardStore["pendingAgent"]) => void;
  addDrawing: (drawing: Omit<DrawingItem, "id">, remote?: boolean) => void;
  undoDrawing: () => void;
  redoDrawing: () => void;
  removeDrawing: (id: string, remote?: boolean) => void;
  clearDrawings: () => void;
  setDrawColor: (color: string) => void;
  setStageSize: (size: { width: number; height: number }) => void;
  resetView: () => void;
  setSelectedDrawing: (id: string | null) => void;
  rotateMap: () => void; // Rotate map by 90° clockwise
  updateRemoteCursor: (userId: string, data: { x: number; y: number; color: string }) => void;
  removeRemoteCursor: (userId: string) => void;

  // Save/Load actions (NEW)
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => boolean;
  erase: (x: number, y: number) => void;
  initSession: () => void;
  toggleZones: () => void;
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
  remoteCursors: {},
  showZones: true,

  // ── Actions ───────────────────────────────────────────────
  addItem: (item, remote) => {
    const id = genId();
    set((s) => ({
      items: [...s.items, { ...item, id }],
    }));
    if (!remote) {
      realtimeService.send("ITEM_ADDED", { ...item, id });
    }
  },

  updateItemPosition: (id, x, y, remote) => {
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, x, y } : i)),
    }));
    if (!remote) {
      realtimeService.send("ITEM_MOVED", { id, x, y });
    }
  },

  removeItem: (id, remote) => {
    set((s) => ({
      items: s.items.filter((i) => i.id !== id),
      selectedItemId: s.selectedItemId === id ? null : s.selectedItemId,
    }));
    if (!remote) {
      realtimeService.send("ITEM_REMOVED", { id });
    }
  },

  selectItem: (id) => set({ selectedItemId: id, selectedDrawingId: null }),

  clearBoard: (remote) => {
    set({
      items: [],
      selectedItemId: null,
      drawings: [],
      redoDrawings: [],
      selectedDrawingId: null,
    });
    if (!remote) {
      realtimeService.send("BOARD_CLEARED", {});
    }
  },

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

  addDrawing: (drawing, remote) => {
    const id = genDrawingId();
    set((s) => ({
      drawings: [...s.drawings, { ...drawing, id }],
      redoDrawings: [],
    }));
    if (!remote) {
      realtimeService.send("DRAWING_ADDED", { ...drawing, id });
    }
  },

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

  removeDrawing: (id, remote) => {
    set((s) => ({
      drawings: s.drawings.filter((d) => d.id !== id),
      selectedDrawingId: s.selectedDrawingId === id ? null : s.selectedDrawingId,
    }));
    if (!remote) {
      realtimeService.send("DRAWING_REMOVED", { id });
    }
  },

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
    set({
      mapRotationOffset: (s.mapRotationOffset + 90) % 360,
    });
    // Auto-save after rotation
    get().saveToLocalStorage();
  },

  // ── Save/Load (NEW) ───────────────────────────────────────
  saveToLocalStorage: () => {
    const { items, drawings, selectedMap, mapRotationOffset } = get();
    saveBoardState(items, drawings, selectedMap, mapRotationOffset);
  },

  loadFromLocalStorage: () => {
    const saved = loadBoardState();
    if (!saved) return false;

    set({
      items: saved.items,
      drawings: saved.drawings,
      selectedMap: saved.selectedMap,
      mapRotationOffset: saved.mapRotationOffset ?? 0,
      redoDrawings: [],
      selectedItemId: null,
      selectedDrawingId: null,
    });
    return true;
  },

  erase: (x, y) => {
    const { items, drawings, removeItem, removeDrawing } = get();
    const ERASE_RADIUS = 20;

    // Erase items
    items.forEach((item) => {
      const dx = item.x - x;
      const dy = item.y - y;
      if (Math.hypot(dx, dy) < ERASE_RADIUS) {
        removeItem(item.id);
      }
    });

    // Erase drawings
    drawings.forEach((d) => {
      for (let i = 0; i < d.points.length; i += 2) {
        const dx = d.points[i] - x;
        const dy = d.points[i + 1] - y;
        if (Math.hypot(dx, dy) < ERASE_RADIUS) {
          removeDrawing(d.id);
          break;
        }
      }
    });
  },

  initSession: () => {
    if (typeof window === "undefined") return;
    const SESSION_ACTIVE = "vltactic-session-active";
    if (!sessionStorage.getItem(SESSION_ACTIVE)) {
      console.log("New session: Clearing board state");
      get().clearBoard();
      // Also clear localStorage to be sure
      localStorage.removeItem("vltactic-board-state");
      sessionStorage.setItem(SESSION_ACTIVE, "true");
    }
  },

  updateRemoteCursor: (userId, data) =>
    set((s) => ({
      remoteCursors: {
        ...s.remoteCursors,
        [userId]: { ...data, lastSeen: Date.now() },
      },
    })),

  removeRemoteCursor: (userId) =>
    set((s) => {
      const { [userId]: _, ...rest } = s.remoteCursors;
      return { remoteCursors: rest };
    }),

  toggleZones: () => set((s) => ({ showZones: !s.showZones })),
}));
