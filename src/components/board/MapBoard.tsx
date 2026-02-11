"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Text, Line, Arrow } from "react-konva";
import Konva from "konva";
import { useBoardStore } from "@/store/boardStore";
import { MAPS } from "@/data/maps";
import { DraggableAgent } from "./DraggableAgent";
import { UtilityIcon } from "./UtilityIcon";

// ============================================================
// MapBoard — Main Konva Canvas component
// Features: zoom/pan, map background, draggable agents,
//           space+drag pan, center-on-load, drawing + arrow tools
// ============================================================

const MIN_SCALE = 0.2;
const MAX_SCALE = 5;
const SCALE_BY = 1.08;

export default function MapBoard() {
  const stageRef = useRef<Konva.Stage>(null);
  const {
    items,
    selectedMap,
    viewport,
    selectedItemId,
    pendingAgent,
    activeTool,
    drawings,
    drawColor,
    selectedDrawingId,
    setViewport,
    selectItem,
    addItem,
    removeItem,
    setPendingAgent,
    addDrawing,
    undoDrawing,
    redoDrawing,
    removeDrawing,
    setStageSize,
    setActiveTool,
    setSelectedDrawing,
  } = useBoardStore();

  const [stageSize, setStageSizeLocal] = useState({ width: 800, height: 600 });
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
  const [mapLoadError, setMapLoadError] = useState(false);
  const [cursorStyle, setCursorStyle] = useState<string>("default");
  const containerRef = useRef<HTMLDivElement>(null);
  const spaceHeld = useRef(false);
  const hasInitialCentered = useRef(false);

  // Freehand drawing state (local for in-progress stroke only)
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<number[]>([]);

  // Arrow tool state (refs to avoid stale closures, state for rendering)
  const arrowStartRef = useRef<{ x: number; y: number } | null>(null);
  const arrowEndRef = useRef<{ x: number; y: number } | null>(null);
  const [arrowPreview, setArrowPreview] = useState<number[] | null>(null);

  // Derive loading: no image yet and no error
  const mapLoading = !mapImage && !mapLoadError;

  const mapDef = MAPS.find((m) => m.name === selectedMap) ?? MAPS[0];

  // ── Center & fit map to stage ─────────────────────────────
  const centerMap = useCallback(
    (width: number, height: number) => {
      const padding = 40;
      const scaleX = (width - padding * 2) / mapDef.width;
      const scaleY = (height - padding * 2) / mapDef.height;
      const scale = Math.min(scaleX, scaleY, 1);
      const x = (width - mapDef.width * scale) / 2;
      const y = (height - mapDef.height * scale) / 2;
      setViewport({ scale, x, y });
    },
    [mapDef.width, mapDef.height, setViewport]
  );

  // ── Responsive stage size ─────────────────────────────────
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const h = containerRef.current.offsetHeight;
        setStageSizeLocal({ width: w, height: h });
        setStageSize({ width: w, height: h });
        // Center on first render
        if (!hasInitialCentered.current && w > 0 && h > 0) {
          hasInitialCentered.current = true;
          centerMap(w, h);
        }
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [centerMap, setStageSize]);

  // Re-center when map changes
  useEffect(() => {
    hasInitialCentered.current = false;
    if (stageSize.width > 0 && stageSize.height > 0) {
      hasInitialCentered.current = true;
      centerMap(stageSize.width, stageSize.height);
    }
  }, [selectedMap, centerMap, stageSize.width, stageSize.height]);

  // ── Load map image (with crossOrigin for CDN) ─────────────
  const [mapImageKey, setMapImageKey] = useState(mapDef.imagePath);
  if (mapImageKey !== mapDef.imagePath) {
    setMapImageKey(mapDef.imagePath);
    setMapImage(null);
    setMapLoadError(false);
  }

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = mapDef.imagePath;
    img.onload = () => {
      setMapImage(img);
      setMapLoadError(false);
    };
    img.onerror = () => {
      setMapLoadError(true);
      setMapImage(null);
    };
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [mapDef.imagePath]);

  // ── Key handlers ──────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture shortcuts when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        spaceHeld.current = true;
        setCursorStyle("grab");
      }
      // Delete selected item with Delete/Backspace
      if ((e.code === "Delete" || e.code === "Backspace") && selectedItemId) {
        e.preventDefault();
        removeItem(selectedItemId);
      }
      if ((e.code === "Delete" || e.code === "Backspace") && selectedDrawingId) {
        e.preventDefault();
        removeDrawing(selectedDrawingId);
      }
      // Escape to cancel pending agent or deselect
      if (e.code === "Escape") {
        if (pendingAgent) setPendingAgent(null);
        else selectItem(null);
      }
      // Ctrl+Z → undo drawing
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyZ") {
        e.preventDefault();
        if (e.shiftKey) redoDrawing();
        else undoDrawing();
      }
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyY") {
        e.preventDefault();
        redoDrawing();
      }
      // Tool shortcuts: V = select, D = draw, A = arrow
      if (e.code === "KeyV" && !e.ctrlKey && !e.metaKey) setActiveTool("select");
      if (e.code === "KeyD" && !e.ctrlKey && !e.metaKey) setActiveTool("draw");
      if (e.code === "KeyA" && !e.ctrlKey && !e.metaKey) setActiveTool("arrow");
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spaceHeld.current = false;
        setCursorStyle(pendingAgent ? "crosshair" : "default");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedItemId, selectedDrawingId, pendingAgent, removeItem, removeDrawing, setPendingAgent, selectItem, undoDrawing, redoDrawing, setActiveTool]);

  // ── Zoom with mouse wheel ─────────────────────────────────
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;

      const oldScale = viewport.scale;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - viewport.x) / oldScale,
        y: (pointer.y - viewport.y) / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY)
      );

      setViewport({
        scale: newScale,
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      });
    },
    [viewport, setViewport]
  );

  // ── Click on map to place pending agent / utility ─────────
  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (spaceHeld.current) return;

      const clickedOnEmpty =
        e.target === e.target.getStage() ||
        e.target.name() === "map-bg" ||
        e.target.name() === "map-image";

      if (clickedOnEmpty) {
        selectItem(null);
        setSelectedDrawing(null);
      }

      if (pendingAgent && clickedOnEmpty) {
        const stage = stageRef.current;
        if (!stage) return;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const mapX = (pointer.x - viewport.x) / viewport.scale;
        const mapY = (pointer.y - viewport.y) / viewport.scale;

        addItem({
          type: pendingAgent.utilityName ? "utility" : "agent",
          agentName: pendingAgent.agentName,
          utilityName: pendingAgent.utilityName,
          x: mapX,
          y: mapY,
          team: pendingAgent.team,
          color: pendingAgent.color,
        });
      }
    },
    [pendingAgent, viewport, addItem, selectItem, setSelectedDrawing]
  );

  // ── Pan with middle mouse / right-click / Space+left-click ─
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Pan: Space+left, middle, right
      if (
        (e.evt.button === 0 && spaceHeld.current) ||
        e.evt.button === 1 ||
        e.evt.button === 2
      ) {
        e.evt.preventDefault();
        isPanning.current = true;
        setCursorStyle("grabbing");
        panStart.current = {
          x: e.evt.clientX - viewport.x,
          y: e.evt.clientY - viewport.y,
        };
        return;
      }

      const stage = stageRef.current;
      if (!stage) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const mapX = (pointer.x - viewport.x) / viewport.scale;
      const mapY = (pointer.y - viewport.y) / viewport.scale;

      // Freehand draw tool
      if (activeTool === "draw" && e.evt.button === 0 && !spaceHeld.current) {
        setIsDrawing(true);
        setDrawingPoints([mapX, mapY]);
        return;
      }

      // Arrow tool
      if (activeTool === "arrow" && e.evt.button === 0 && !spaceHeld.current) {
        arrowStartRef.current = { x: mapX, y: mapY };
        arrowEndRef.current = { x: mapX, y: mapY };
        setArrowPreview([mapX, mapY, mapX, mapY]);
        return;
      }
    },
    [viewport, activeTool]
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (isPanning.current) {
        setViewport({
          x: e.evt.clientX - panStart.current.x,
          y: e.evt.clientY - panStart.current.y,
        });
        return;
      }

      const stage = stageRef.current;
      if (!stage) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const mapX = (pointer.x - viewport.x) / viewport.scale;
      const mapY = (pointer.y - viewport.y) / viewport.scale;

      if (isDrawing && activeTool === "draw") {
        setDrawingPoints((prev) => [...prev, mapX, mapY]);
      }

      if (arrowStartRef.current && activeTool === "arrow") {
        arrowEndRef.current = { x: mapX, y: mapY };
        setArrowPreview([
          arrowStartRef.current.x,
          arrowStartRef.current.y,
          mapX,
          mapY,
        ]);
      }
    },
    [setViewport, isDrawing, activeTool, viewport]
  );

  const handleMouseUp = useCallback(() => {
    if (isPanning.current) {
      isPanning.current = false;
      setCursorStyle(
        spaceHeld.current ? "grab" : pendingAgent ? "crosshair" : "default"
      );
      return;
    }

    // Save freehand drawing
    if (isDrawing && drawingPoints.length >= 4) {
      addDrawing({ type: "freehand", points: drawingPoints, color: drawColor });
    }
    setIsDrawing(false);
    setDrawingPoints([]);

    // Save arrow drawing
    if (arrowStartRef.current && arrowEndRef.current) {
      const s = arrowStartRef.current;
      const en = arrowEndRef.current;
      const dx = en.x - s.x;
      const dy = en.y - s.y;
      if (Math.sqrt(dx * dx + dy * dy) > 5) {
        addDrawing({
          type: "arrow",
          points: [s.x, s.y, en.x, en.y],
          color: drawColor,
        });
      }
    }
    arrowStartRef.current = null;
    arrowEndRef.current = null;
    setArrowPreview(null);
  }, [pendingAgent, isDrawing, drawingPoints, addDrawing, drawColor]);

  const handleContextMenu = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      e.evt.preventDefault();
    },
    []
  );

  // ── Determine cursor ──────────────────────────────────────
  const effectiveCursor =
    cursorStyle === "grab" || cursorStyle === "grabbing"
      ? cursorStyle
      : pendingAgent
      ? "crosshair"
      : activeTool === "draw" || activeTool === "arrow"
      ? "crosshair"
      : "default";

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-neutral-950 overflow-hidden relative"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Loading indicator */}
      {mapLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-neutral-600 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-neutral-400 text-sm">
              Loading {mapDef.displayName}...
            </span>
          </div>
        </div>
      )}

      {/* Onboarding overlay */}
      {!pendingAgent && items.length === 0 && !mapLoading && drawings.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-700 rounded-xl px-8 py-6 max-w-sm text-center">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="text-white font-semibold text-sm mb-2">
              Ready to strategize!
            </h3>
            <div className="text-neutral-400 text-xs space-y-1.5">
              <p>
                <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-300 text-[10px]">
                  Click agent
                </kbd>{" "}
                in sidebar → expand → click to place
              </p>
              <p>
                <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-300 text-[10px]">
                  Scroll
                </kbd>{" "}
                to zoom ·{" "}
                <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-300 text-[10px]">
                  Space + drag
                </kbd>{" "}
                to pan
              </p>
              <p>
                <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-300 text-[10px]">
                  D
                </kbd>{" "}
                Draw ·{" "}
                <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-300 text-[10px]">
                  A
                </kbd>{" "}
                Arrow ·{" "}
                <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-300 text-[10px]">
                  Ctrl+Z
                </kbd>{" "}
                Undo ·{" "}
                <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-300 text-[10px]">
                  Ctrl+Y
                </kbd>{" "}
                Redo
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pending agent indicator */}
      {pendingAgent && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-neutral-800/90 backdrop-blur text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg border border-neutral-700">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: pendingAgent.color }}
          />
          Click to place{" "}
          <strong>
            {pendingAgent.agentName}
            {pendingAgent.utilityName ? ` — ${pendingAgent.utilityName}` : ""}
          </strong>
          <span className="text-neutral-400 text-xs ml-1">
            ({pendingAgent.team === "attack" ? "ATK" : "DEF"})
          </span>
          <button
            onClick={() => setPendingAgent(null)}
            className="ml-2 text-neutral-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={viewport.scale}
        scaleY={viewport.scale}
        x={viewport.x}
        y={viewport.y}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        style={{ cursor: effectiveCursor }}
      >
        <Layer>
          {/* Map background */}
          {mapImage && !mapLoadError ? (
            <KonvaImage
              image={mapImage}
              x={0}
              y={0}
              width={mapDef.width}
              height={mapDef.height}
              name="map-image"
            />
          ) : (
            <>
              <Rect
                x={0}
                y={0}
                width={mapDef.width}
                height={mapDef.height}
                fill="#1a1a2e"
                stroke="#333"
                strokeWidth={2}
                name="map-bg"
              />
              {Array.from({ length: 11 }).map((_, i) => (
                <React.Fragment key={`grid-${i}`}>
                  <Rect
                    x={i * (mapDef.width / 10)}
                    y={0}
                    width={1}
                    height={mapDef.height}
                    fill="#333"
                  />
                  <Rect
                    x={0}
                    y={i * (mapDef.height / 10)}
                    width={mapDef.width}
                    height={1}
                    fill="#333"
                  />
                </React.Fragment>
              ))}
              <Text
                text={`${mapDef.displayName}\n(Loading map image...)`}
                x={mapDef.width / 2 - 150}
                y={mapDef.height / 2 - 20}
                fontSize={18}
                fill="#666"
                align="center"
                width={300}
              />
            </>
          )}

          {/* Saved drawings (freehand + arrows) */}
          {drawings.map((d) =>
            d.type === "arrow" ? (
              <Arrow
                key={d.id}
                points={d.points}
                stroke={d.color}
                fill={d.color}
                strokeWidth={d.id === selectedDrawingId ? 5 : 3}
                pointerLength={12}
                pointerWidth={10}
                opacity={d.id === selectedDrawingId ? 1 : 0.85}
                onClick={(e) => {
                  e.cancelBubble = true;
                  selectItem(null);
                  setSelectedDrawing(d.id);
                }}
              />
            ) : (
              <Line
                key={d.id}
                points={d.points}
                stroke={d.color}
                strokeWidth={d.id === selectedDrawingId ? 5 : 3}
                tension={0.3}
                lineCap="round"
                lineJoin="round"
                opacity={d.id === selectedDrawingId ? 1 : 0.8}
                onClick={(e) => {
                  e.cancelBubble = true;
                  selectItem(null);
                  setSelectedDrawing(d.id);
                }}
              />
            )
          )}

          {/* In-progress freehand drawing */}
          {isDrawing && drawingPoints.length >= 2 && (
            <Line
              points={drawingPoints}
              stroke={drawColor}
              strokeWidth={3}
              tension={0.3}
              lineCap="round"
              lineJoin="round"
              opacity={0.6}
            />
          )}

          {/* In-progress arrow */}
          {arrowPreview && (
            <Arrow
              points={arrowPreview}
              stroke={drawColor}
              fill={drawColor}
              strokeWidth={3}
              pointerLength={12}
              pointerWidth={10}
              opacity={0.6}
            />
          )}

          {/* Draggable items on the board */}
          {items.map((item) =>
            item.type === "utility" ? (
              <UtilityIcon
                key={item.id}
                item={item}
                isSelected={selectedItemId === item.id}
              />
            ) : (
              <DraggableAgent
                key={item.id}
                item={item}
                isSelected={selectedItemId === item.id}
              />
            )
          )}
        </Layer>
      </Stage>
    </div>
  );
}
