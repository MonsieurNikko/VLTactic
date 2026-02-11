"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Group, Circle, Text, Ring, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import { BoardItem } from "@/types";
import { useBoardStore } from "@/store/boardStore";
import { AGENT_MAP } from "@/data/agents";

// ============================================================
// DraggableAgent — A single movable agent on the board
// Improved visuals: larger, shadow, team ring, role indicator
// ============================================================

interface Props {
  item: BoardItem;
  isSelected: boolean;
}

const AGENT_RADIUS = 22;

export function DraggableAgent({ item, isSelected }: Props) {
  const { updateItemPosition, selectItem } = useBoardStore();
  const groupRef = useRef<Konva.Group>(null);
  const [iconImage, setIconImage] = useState<HTMLImageElement | null>(null);

  const iconUrl = AGENT_MAP.get(item.agentName)?.iconUrl;

  useEffect(() => {
    if (!iconUrl) return;
    
    let mounted = true;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = iconUrl;
    img.onload = () => {
      if (mounted) setIconImage(img);
    };
    img.onerror = () => {
      if (mounted) setIconImage(null);
    };
    return () => {
      mounted = false;
    };
  }, [item.agentName]);

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      updateItemPosition(item.id, e.target.x(), e.target.y());
    },
    [item.id, updateItemPosition]
  );

  const handleClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;
      selectItem(item.id);
    },
    [item.id, selectItem]
  );

  // Get initials (first 2-3 chars) for fallback
  const initials = item.agentName
    .replace(/[^A-Za-z/]/g, "")
    .slice(0, 3)
    .toUpperCase();

  const teamColor = item.team === "attack" ? "#FF4655" : "#17E6A1";

  return (
    <Group
      ref={groupRef}
      x={item.x}
      y={item.y}
      draggable
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onMouseEnter={(e) => {
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "grab";
      }}
      onMouseLeave={(e) => {
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "default";
      }}
    >
      {/* Selection glow ring */}
      {isSelected && (
        <>
          <Circle
            radius={AGENT_RADIUS + 7}
            fill="transparent"
            stroke="#FFD700"
            strokeWidth={2}
            opacity={0.6}
            dash={[4, 3]}
          />
          <Ring
            innerRadius={AGENT_RADIUS + 2}
            outerRadius={AGENT_RADIUS + 5}
            fill="#FFD700"
            opacity={0.4}
          />
        </>
      )}

      {/* Team color outer ring */}
      <Circle
        radius={AGENT_RADIUS + 1}
        fill={teamColor}
        shadowColor={teamColor}
        shadowBlur={isSelected ? 12 : 6}
        shadowOpacity={0.5}
      />

      {/* Dark inner circle (creates border effect) */}
      <Circle
        radius={AGENT_RADIUS - 1}
        fill="#1a1a2e"
      />

      {/* Agent color fill */}
      <Circle
        radius={AGENT_RADIUS - 2}
        fill={item.color}
        opacity={0.85}
        shadowColor="black"
        shadowBlur={6}
        shadowOpacity={0.4}
      />

      {/* Agent icon (clipped to circle) */}
      {iconImage ? (
        <Group
          clipFunc={(ctx) => {
            ctx.beginPath();
            ctx.arc(0, 0, AGENT_RADIUS - 2, 0, Math.PI * 2);
            ctx.closePath();
          }}
        >
          <KonvaImage
            image={iconImage}
            x={-(AGENT_RADIUS - 2)}
            y={-(AGENT_RADIUS - 2)}
            width={(AGENT_RADIUS - 2) * 2}
            height={(AGENT_RADIUS - 2) * 2}
            opacity={0.95}
          />
        </Group>
      ) : (
        <Text
          text={initials}
          fontSize={12}
          fontFamily="'Inter', 'Segoe UI', sans-serif"
          fontStyle="bold"
          fill="#fff"
          align="center"
          verticalAlign="middle"
          width={AGENT_RADIUS * 2}
          height={AGENT_RADIUS * 2}
          offsetX={AGENT_RADIUS}
          offsetY={AGENT_RADIUS}
          shadowColor="black"
          shadowBlur={2}
          shadowOpacity={0.5}
        />
      )}

      {/* Inner highlight (pseudo-gradient) */}
      <Circle
        radius={AGENT_RADIUS * 0.55}
        fill="white"
        opacity={0.08}
        offsetY={-3}
      />

      {/* Team indicator dot */}
      <Circle
        x={AGENT_RADIUS * 0.7}
        y={-AGENT_RADIUS * 0.7}
        radius={4}
        fill={teamColor}
        stroke="#1a1a2e"
        strokeWidth={1.5}
      />

      {/* Agent name label below */}
      <Text
        text={item.agentName}
        fontSize={9}
        fill="#ccc"
        align="center"
        y={AGENT_RADIUS + 5}
        width={70}
        offsetX={35}
        shadowColor="black"
        shadowBlur={3}
        shadowOpacity={0.8}
      />
    </Group>
  );
}
