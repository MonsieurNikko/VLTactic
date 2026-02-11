"use client";

import React from "react";
import { useBoardStore, DRAW_COLORS } from "@/store/boardStore";
import { MAPS } from "@/data/maps";

// ============================================================
// Toolbar — Top bar with map selector, tools, zoom, actions
// ============================================================

export default function Toolbar() {
  const {
    selectedMap,
    setSelectedMap,
    viewport,
    clearBoard,
    items,
    activeTool,
    setActiveTool,
    drawColor,
    setDrawColor,
    drawings,
    undoDrawing,
    resetView,
  } = useBoardStore();

  const zoomIn = () =>
    useBoardStore.getState().setViewport({ scale: Math.min(5, viewport.scale * 1.2) });

  const zoomOut = () =>
    useBoardStore.getState().setViewport({ scale: Math.max(0.2, viewport.scale / 1.2) });

  const zoomPercent = Math.round(viewport.scale * 100);

  return (
    <div className="h-12 bg-neutral-900 border-b border-neutral-800 flex items-center px-4 gap-2 shrink-0 overflow-x-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-1 shrink-0">
        <div className="w-7 h-7 bg-linear-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md">
          VL
        </div>
        <span className="text-sm font-semibold text-white hidden sm:block">
          VLTactic
        </span>
      </div>

      <div className="w-px h-6 bg-neutral-700 shrink-0" />

      {/* Map selector */}
      <select
        value={selectedMap}
        onChange={(e) => setSelectedMap(e.target.value)}
        className="bg-neutral-800 text-neutral-200 text-xs px-2 py-1.5 rounded border border-neutral-700 focus:border-blue-500 focus:outline-none cursor-pointer shrink-0"
      >
        {MAPS.map((map) => (
          <option key={map.name} value={map.name}>
            {map.displayName}
          </option>
        ))}
      </select>

      <div className="w-px h-6 bg-neutral-700 shrink-0" />

      {/* Tools */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setActiveTool("select")}
          className={`px-2 h-7 flex items-center justify-center rounded text-xs transition-colors ${
            activeTool === "select"
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
          }`}
          title="Select & Move (V)"
        >
          ↖ Select
        </button>
        <button
          onClick={() => setActiveTool("draw")}
          className={`px-2 h-7 flex items-center justify-center rounded text-xs transition-colors ${
            activeTool === "draw"
              ? "bg-yellow-600 text-white"
              : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
          }`}
          title="Freehand Draw (D)"
        >
          ✏ Draw
        </button>
        <button
          onClick={() => setActiveTool("arrow")}
          className={`px-2 h-7 flex items-center justify-center rounded text-xs transition-colors ${
            activeTool === "arrow"
              ? "bg-orange-600 text-white"
              : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
          }`}
          title="Arrow Tool (A)"
        >
          ➜ Arrow
        </button>
      </div>

      {/* Draw colors — show when draw/arrow tool active */}
      {(activeTool === "draw" || activeTool === "arrow") && (
        <>
          <div className="w-px h-6 bg-neutral-700 shrink-0" />
          <div className="flex items-center gap-0.5 shrink-0">
            {DRAW_COLORS.map((c) => (
              <button
                key={c.color}
                onClick={() => setDrawColor(c.color)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  drawColor === c.color
                    ? "border-white scale-110"
                    : "border-neutral-600 hover:border-neutral-400"
                }`}
                style={{ backgroundColor: c.color }}
                title={c.name}
              />
            ))}
          </div>
        </>
      )}

      <div className="w-px h-6 bg-neutral-700 shrink-0" />

      {/* Undo */}
      <button
        onClick={undoDrawing}
        disabled={drawings.length === 0}
        className="px-2 h-7 flex items-center justify-center bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 transition-colors text-xs disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        title="Undo drawing (Ctrl+Z)"
      >
        ↩
      </button>

      <div className="w-px h-6 bg-neutral-700 shrink-0" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={zoomOut}
          className="w-7 h-7 flex items-center justify-center bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 transition-colors text-sm"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={resetView}
          className="px-2 h-7 flex items-center justify-center bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 transition-colors text-xs min-w-12"
          title="Reset View"
        >
          {zoomPercent}%
        </button>
        <button
          onClick={zoomIn}
          className="w-7 h-7 flex items-center justify-center bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 transition-colors text-sm"
          title="Zoom In"
        >
          +
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Board info */}
      <span className="text-xs text-neutral-500 hidden sm:inline shrink-0">
        {items.length} item{items.length !== 1 ? "s" : ""} · {drawings.length} draw{drawings.length !== 1 ? "s" : ""}
      </span>

      {/* Clear button */}
      <button
        onClick={clearBoard}
        disabled={items.length === 0 && drawings.length === 0}
        className="px-3 py-1.5 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-red-900/50 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
      >
        Clear
      </button>

      {/* Keyboard shortcuts help */}
      <div
        className="w-6 h-6 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-500 text-xs cursor-help hover:bg-neutral-700 hover:text-neutral-300 transition-colors shrink-0"
        title={`Shortcuts:\n• V = Select · D = Draw · A = Arrow\n• Scroll = Zoom\n• Space + Drag = Pan\n• Right-click Drag = Pan\n• Delete/Backspace = Remove selected\n• Ctrl+Z = Undo drawing\n• Esc = Cancel placement`}
      >
        ?
      </div>
    </div>
  );
}
