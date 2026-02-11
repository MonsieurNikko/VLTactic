"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Text, Line, Arrow, Group } from "react-konva";
import Konva from "konva";
import { useBoardStore } from "@/store/boardStore";
import { MAPS } from "@/data/maps";
import { DraggableAgent } from "./DraggableAgent";
import { UtilityIcon } from "./UtilityIcon";
import { RemoteCursors } from "./RemoteCursors";
import { MapZonesOverlay } from "./MapZonesOverlay";
import { setupAutoSave } from "@/utils/localStorage";
import { realtimeService } from "@/utils/realtimeService";

// ============================================================
// MapBoard — Main Konva Canvas component
// Features: zoom/pan, map background, draggable agents,
//           space+drag pan, center-on-load, drawing + arrow tools
//           auto-save to localStorage every 5s
//           Touch support (pinch-zoom, pan)
//           Map Rotation support (visual rotation)
//           Real-time collaboration (BroadcastChannel)
// ============================================================

const MIN_SCALE = 0.2;
const MAX_SCALE = 5;
const SCALE_BY = 1.08;

interface MapBoardProps {
  stageRefFromParent?: React.RefObject<Konva.Stage | null>;
}

// Distance helper for pinch zoom
function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

// Center helper for pinch zoom
function getCenter(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

export default function MapBoard({ stageRefFromParent }: MapBoardProps) {
  const localStageRef = useRef<Konva.Stage>(null);
  const stageRef = (stageRefFromParent || localStageRef) as React.RefObject<Konva.Stage>;

  const {
    items,
    selectedMap,
    mapRotationOffset,
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
    loadFromLocalStorage,
    updateRemoteCursor,
    initSession,
    erase,
  } = useBoardStore();

  const [stageSize, setStageSizeLocal] = useState({ width: 800, height: 600 });
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
  const [mapLoadError, setMapLoadError] = useState(false);
  const [cursorStyle, setCursorStyle] = useState<string>("default");
  const containerRef = useRef<HTMLDivElement>(null);
  const spaceHeld = useRef(false);
  const hasInitialCentered = useRef(false);
  const hasLoadedFromStorage = useRef(false);

  // Interaction Refs
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const mouseDownStart = useRef<{ x: number; y: number } | null>(null); // For click distance check

  // Freehand drawing state (local for in-progress stroke only)
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<number[]>([]);

  // Arrow tool state (refs to avoid stale closures, state for rendering)
  const arrowStartRef = useRef<{ x: number; y: number } | null>(null);
  const arrowEndRef = useRef<{ x: number; y: number } | null>(null);
  const [arrowPreview, setArrowPreview] = useState<number[] | null>(null);

  // Touch Zoom Refs
  const lastCenter = useRef<{ x: number; y: number } | null>(null);
  const lastDist = useRef<number>(0);

  // Derive loading: no image yet and no error
  const mapLoading = !mapImage && !mapLoadError;

  const mapDef = MAPS.find((m) => m.name === selectedMap) ?? MAPS[0];

  // Helper: Unrotate point to get Data Coordinate (for saving items/drawings)
  const toDataCoords = useCallback((visualX: number, visualY: number) => {
    if (mapRotationOffset === 0) return { x: visualX, y: visualY };

    const cx = mapDef.width / 2;
    const cy = mapDef.height / 2;
    const rad = (-mapRotationOffset * Math.PI) / 180; // Inverse rotation

    // Rotate around center
    const dx = visualX - cx;
    const dy = visualY - cy;

    return {
      x: cx + (dx * Math.cos(rad) - dy * Math.sin(rad)),
      y: cy + (dx * Math.sin(rad) + dy * Math.cos(rad)),
    };
  }, [mapRotationOffset, mapDef.width, mapDef.height]);

  // ── Load from localStorage on mount ───────────────────────
  useEffect(() => {
    if (!hasLoadedFromStorage.current) {
      hasLoadedFromStorage.current = true;
      initSession(); // Fresh session check
      loadFromLocalStorage();
    }
  }, [loadFromLocalStorage, initSession]);

  // ── Auto-save setup  ───────────────────────────────────────
  useEffect(() => {
    const getState = () => ({
      items: useBoardStore.getState().items,
      drawings: useBoardStore.getState().drawings,
      selectedMap: useBoardStore.getState().selectedMap,
      mapRotationOffset: useBoardStore.getState().mapRotationOffset,
    });

    const cleanup = setupAutoSave(getState);
    return cleanup;
  }, []);

  // ── Real-time Event Subscription ──────────────────────────
  useEffect(() => {
    const unsub = realtimeService.subscribe((msg) => {
      const s = useBoardStore.getState();

      switch (msg.type) {
        case "CURSOR_MOVE":
          updateRemoteCursor(msg.senderId, msg.payload);
          break;
        case "ITEM_ADDED":
          s.addItem(msg.payload, true);
          break;
        case "ITEM_MOVED":
          s.updateItemPosition(msg.payload.id, msg.payload.x, msg.payload.y, true);
          break;
        case "ITEM_REMOVED":
          s.removeItem(msg.payload.id, true);
          break;
        case "DRAWING_ADDED":
          s.addDrawing(msg.payload, true);
          break;
        case "DRAWING_REMOVED":
          s.removeDrawing(msg.payload.id, true);
          break;
        case "BOARD_CLEARED":
          s.clearBoard(true);
          break;
      }
    });
    return unsub;
  }, [updateRemoteCursor]);

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
    let mounted = true;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = mapDef.imagePath;
    img.onload = () => {
      if (!mounted) return;
      // Combine base rotation from map definition with user's rotation offset
      const totalRotation = ((mapDef.rotation ?? 0) + mapRotationOffset) % 360;
      if (totalRotation !== 0) {
        // Pre-rotate maps via offscreen canvas
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((totalRotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        const rotatedImg = new window.Image();
        rotatedImg.src = canvas.toDataURL();
        rotatedImg.onload = () => {
          if (mounted) {
            setMapImage(rotatedImg);
            setMapLoadError(false);
          }
        };
      } else {
        setMapImage(img);
        setMapLoadError(false);
      }
    };
    img.onerror = () => {
      if (mounted) {
        setMapLoadError(true);
        setMapImage(null);
      }
    };
    return () => {
      mounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [mapDef.imagePath, mapDef.rotation, mapRotationOffset]);

  // ── Key handlers ──────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        spaceHeld.current = true;
        setCursorStyle("grab");
      }
      if ((e.code === "Delete" || e.code === "Backspace") && selectedItemId) {
        e.preventDefault();
        removeItem(selectedItemId);
      }
      if ((e.code === "Delete" || e.code === "Backspace") && selectedDrawingId) {
        e.preventDefault();
        removeDrawing(selectedDrawingId);
      }
      if (e.code === "Escape") {
        if (pendingAgent) setPendingAgent(null);
        else selectItem(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyZ") {
        e.preventDefault();
        if (e.shiftKey) redoDrawing();
        else undoDrawing();
      }
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyY") {
        e.preventDefault();
        redoDrawing();
      }
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

  // ── Touch Events (Pinch Zoom + Pan) ───────────────────────
  const handleTouchStart = (e: Konva.KonvaEventObject<TouchEvent>) => {
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (touch1 && touch2) {
      isPanning.current = true;
      lastDist.current = getDistance(
        { x: touch1.clientX, y: touch1.clientY },
        { x: touch2.clientX, y: touch2.clientY }
      );
      lastCenter.current = getCenter(
        { x: touch1.clientX, y: touch1.clientY },
        { x: touch2.clientX, y: touch2.clientY }
      );
    } else if (touch1) {
      if (activeTool === "select" && !pendingAgent) {
        isPanning.current = true;
        panStart.current = {
          x: touch1.clientX - viewport.x,
          y: touch1.clientY - viewport.y,
        };
      }
    }
  };

  const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => {
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (touch1 && touch2) {
      e.evt.preventDefault();
      const newDist = getDistance(
        { x: touch1.clientX, y: touch1.clientY },
        { x: touch2.clientX, y: touch2.clientY }
      );
      const newCenter = getCenter(
        { x: touch1.clientX, y: touch1.clientY },
        { x: touch2.clientX, y: touch2.clientY }
      );

      if (lastCenter.current && lastDist.current > 0) {
        const pointTo = {
          x: (lastCenter.current.x - viewport.x) / viewport.scale,
          y: (lastCenter.current.y - viewport.y) / viewport.scale,
        };

        const scale = viewport.scale * (newDist / lastDist.current);
        const constrainedScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

        const dx = newCenter.x - lastCenter.current.x;
        const dy = newCenter.y - lastCenter.current.y;

        const newPos = {
          x: newCenter.x - pointTo.x * constrainedScale + dx,
          y: newCenter.y - pointTo.y * constrainedScale + dy,
        };

        setViewport({ scale: constrainedScale, ...newPos });
      }

      lastDist.current = newDist;
      lastCenter.current = newCenter;
    } else if (touch1 && isPanning.current) {
      setViewport({
        x: touch1.clientX - panStart.current.x,
        y: touch1.clientY - panStart.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    isPanning.current = false;
    lastDist.current = 0;
    lastCenter.current = null;
  };

  // ── Click to Place ────────────────────────────────────────
  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (spaceHeld.current) return;

      if (mouseDownStart.current) {
        const dx = e.evt.clientX - mouseDownStart.current.x;
        const dy = e.evt.clientY - mouseDownStart.current.y;
        if (Math.hypot(dx, dy) > 5) return;
      }

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

        const visualX = (pointer.x - viewport.x) / viewport.scale;
        const visualY = (pointer.y - viewport.y) / viewport.scale;
        const { x: mapX, y: mapY } = toDataCoords(visualX, visualY);

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
    [pendingAgent, viewport, addItem, selectItem, setSelectedDrawing, toDataCoords]
  );

  // ── Mouse Handlers (Pan, Draw, Arrow) ─────────────────────
  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      mouseDownStart.current = { x: e.evt.clientX, y: e.evt.clientY };

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
      const visualX = (pointer.x - viewport.x) / viewport.scale;
      const visualY = (pointer.y - viewport.y) / viewport.scale;
      const { x: mapX, y: mapY } = toDataCoords(visualX, visualY);

      if (activeTool === "draw" && e.evt.button === 0 && !spaceHeld.current) {
        setIsDrawing(true);
        setDrawingPoints([mapX, mapY]);
        return;
      }

      if (activeTool === "arrow" && e.evt.button === 0 && !spaceHeld.current) {
        arrowStartRef.current = { x: mapX, y: mapY };
        arrowEndRef.current = { x: mapX, y: mapY };
        setArrowPreview([mapX, mapY, mapX, mapY]);
        return;
      }
    },
    [viewport, activeTool, toDataCoords]
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
      const visualX = (pointer.x - viewport.x) / viewport.scale;
      const visualY = (pointer.y - viewport.y) / viewport.scale;
      const { x: mapX, y: mapY } = toDataCoords(visualX, visualY);

      if (isDrawing && activeTool === "draw") {
        setDrawingPoints((prev) => [...prev, mapX, mapY]);
      }

      if (activeTool === "eraser" && (e.evt.buttons === 1 || e.evt.buttons === 2)) {
        erase(mapX, mapY);
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

      // Broadcast cursor move
      realtimeService.send("CURSOR_MOVE", { x: mapX, y: mapY, color: "#17E6A1" });
    },
    [setViewport, isDrawing, activeTool, viewport, toDataCoords]
  );

  const handleMouseUp = useCallback(() => {
    mouseDownStart.current = null;
    if (isPanning.current) {
      isPanning.current = false;
      setCursorStyle(
        spaceHeld.current ? "grab" : pendingAgent ? "crosshair" : "default"
      );
      return;
    }

    if (isDrawing && drawingPoints.length >= 4) {
      addDrawing({ type: "freehand", points: drawingPoints, color: drawColor });
    }
    setIsDrawing(false);
    setDrawingPoints([]);

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

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData("agent-data");
    if (!dataStr) return;

    try {
      const data = JSON.parse(dataStr);
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const visualX = (e.clientX - rect.left - viewport.x) / viewport.scale;
      const visualY = (e.clientY - rect.top - viewport.y) / viewport.scale;
      const { x: mapX, y: mapY } = toDataCoords(visualX, visualY);

      addItem({
        type: data.utilityName ? "utility" : "agent",
        agentName: data.agentName,
        utilityName: data.utilityName,
        x: mapX,
        y: mapY,
        team: data.team,
        color: data.color,
      });
    } catch (err) {
      console.error("Failed to drop item", err);
    }
  };

  const effectiveCursor =
    cursorStyle === "grab" || cursorStyle === "grabbing"
      ? cursorStyle
      : pendingAgent || activeTool === "draw" || activeTool === "arrow"
        ? "crosshair"
        : "default";

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-neutral-950 overflow-hidden relative touch-none"
      onContextMenu={(e) => e.preventDefault()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {mapLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-neutral-600 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-neutral-400 text-sm">Loading {mapDef.displayName}...</span>
          </div>
        </div>
      )}

      {pendingAgent && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-neutral-800/90 backdrop-blur text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg border border-neutral-700 select-none">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pendingAgent.color }} />
          Click to place <strong>{pendingAgent.agentName}{pendingAgent.utilityName ? ` — ${pendingAgent.utilityName}` : ""}</strong>
          <span className="text-neutral-400 text-xs ml-1">({pendingAgent.team === "attack" ? "ATK" : "DEF"})</span>
          <button onClick={() => setPendingAgent(null)} className="ml-2 text-neutral-400 hover:text-white">✕</button>
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onContextMenu={handleContextMenu}
        style={{ cursor: effectiveCursor }}
      >
        <Layer>
          {mapImage && !mapLoadError ? (
            <KonvaImage image={mapImage} x={0} y={0} width={mapDef.width} height={mapDef.height} name="map-image" />
          ) : (
            <>
              <Rect x={0} y={0} width={mapDef.width} height={mapDef.height} fill="#1a1a2e" stroke="#333" strokeWidth={2} name="map-bg" />
              <Text text={`${mapDef.displayName}\n(Loading map image...)`} x={mapDef.width / 2 - 150} y={mapDef.height / 2 - 20} fontSize={18} fill="#666" align="center" width={300} />
            </>
          )}

          <Group
            rotation={mapRotationOffset}
            offsetX={mapDef.width / 2}
            offsetY={mapDef.height / 2}
            x={mapDef.width / 2}
            y={mapDef.height / 2}
          >
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
                  onClick={(e) => { e.cancelBubble = true; selectItem(null); setSelectedDrawing(d.id); }}
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
                  onClick={(e) => { e.cancelBubble = true; selectItem(null); setSelectedDrawing(d.id); }}
                />
              )
            )}

            {isDrawing && drawingPoints.length >= 2 && (
              <Line points={drawingPoints} stroke={drawColor} strokeWidth={3} tension={0.3} lineCap="round" lineJoin="round" opacity={0.6} />
            )}

            {arrowPreview && (
              <Arrow points={arrowPreview} stroke={drawColor} fill={drawColor} strokeWidth={3} pointerLength={12} pointerWidth={10} opacity={0.6} />
            )}

            {items.map((item) =>
              item.type === "utility" ? (
                <UtilityIcon key={item.id} item={item} isSelected={selectedItemId === item.id} />
              ) : (
                <DraggableAgent key={item.id} item={item} isSelected={selectedItemId === item.id} />
              )
            )}

            <MapZonesOverlay />
            <RemoteCursors />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}
