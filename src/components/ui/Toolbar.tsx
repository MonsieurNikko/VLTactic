"use client";

import React, { useState } from "react";
import { useBoardStore, DRAW_COLORS } from "@/store/boardStore";
import { MAPS } from "@/data/maps";
import { hasSavedState, getLastSaveTime, clearBoardState } from "@/utils/localStorage";

// ============================================================
// Toolbar — Top bar with map selector, tools, zoom, actions
// Now with Save/Load/Export capabilities
// ============================================================

export default function Toolbar({ stageRef }: { stageRef?: React.RefObject<any> }) {
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
    redoDrawings,
    redoDrawing,
    resetView,
    saveToLocalStorage,
    loadFromLocalStorage,
  } = useBoardStore();

  const [showSuccess, setShowSuccess] = useState(false);
  const canLoad = hasSavedState();
  const lastSave = getLastSaveTime();

  const zoomIn = () =>
    useBoardStore.getState().setViewport({ scale: Math.min(5, viewport.scale * 1.2) });

  const zoomOut = () =>
    useBoardStore.getState().setViewport({ scale: Math.max(0.2, viewport.scale / 1.2) });

  const zoomPercent = Math.round(viewport.scale * 100);

  const handleSaveNow = () => {
    saveToLocalStorage();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleLoad = () => {
    if (!canLoad) return;
    const success = loadFromLocalStorage();
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleExport = async () => {
    if (!stageRef?.current) {
      alert("Canvas not ready for export");
      return;
    }

    const { exportCanvasToPNG } = await import("@/utils/exportCanvas");
    exportCanvasToPNG(stageRef.current);
  };

  const handleNewStrategy = () => {
    if (items.length === 0 && drawings.length === 0) {
      return;
    }
    
    const confirmed = confirm("Clear current board and start new strategy?");
    if (confirmed) {
      clearBoard();
      clearBoardState();
    }
  };

  const getTimeSince = (timestamp: number | null): string => {
    if (!timestamp) return "";
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="h-12 bg-neutral-900 border-b border-neutral-800 flex items-center px-4 gap-2 shrink-0 overflow-x-auto relative">
      {/* Success toast */}
      {showSuccess && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1.5 rounded shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          ✓ Saved successfully
        </div>
      )}

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
      <button
        onClick={redoDrawing}
        disabled={redoDrawings.length === 0}
        className="px-2 h-7 flex items-center justify-center bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 transition-colors text-xs disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        title="Redo drawing (Ctrl+Y)"
      >
        ↪
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
        {lastSave && <span className="ml-1.5 text-neutral-600">· {getTimeSince(lastSave)}</span>}
      </span>

      <div className="w-px h-6 bg-neutral-700 shrink-0" />

      {/* Save/Load/Export actions (NEW) */}
      <button
        onClick={handleSaveNow}
        disabled={items.length === 0 && drawings.length === 0}
        className="px-3 py-1.5 bg-blue-800 text-blue-100 text-xs rounded hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
        title="Save strategy to browser (auto-saves every 5s)"
      >
        💾 Save
      </button>

      <button
        onClick={handleLoad}
        disabled={!canLoad}
        className="px-3 py-1.5 bg-green-800 text-green-100 text-xs rounded hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
        title="Load saved strategy from browser"
      >
        📂 Load
      </button>

      <button
        onClick={handleExport}
        disabled={items.length === 0 && drawings.length === 0}
        className="px-3 py-1.5 bg-purple-800 text-purple-100 text-xs rounded hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
        title="Export strategy as PNG image"
      >
        📸 Export
      </button>

      <div className="w-px h-6 bg-neutral-700 shrink-0" />

      {/* Clear button */}
      <button
        onClick={handleNewStrategy}
        disabled={items.length === 0 && drawings.length === 0}
        className="px-3 py-1.5 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-red-900/50 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
      >
        🗑 New
      </button>

      {/* Keyboard shortcuts help */}
      <div
        className="w-6 h-6 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-500 text-xs cursor-help hover:bg-neutral-700 hover:text-neutral-300 transition-colors shrink-0"
        title={`Shortcuts:\n• V = Select · D = Draw · A = Arrow\n• Scroll = Zoom\n• Space + Drag = Pan\n• Right-click Drag = Pan\n• Delete/Backspace = Remove selected\n• Ctrl+Z = Undo · Ctrl+Y = Redo\n• Esc = Cancel placement\n• Auto-saves every 5 seconds`}
      >
        ?
      </div>
    </div>
  );
}
