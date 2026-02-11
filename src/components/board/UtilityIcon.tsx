"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { Group, Circle, Ring, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import { BoardItem } from "@/types";
import { useBoardStore } from "@/store/boardStore";
import { getAbilityType, UTILITY_STYLES, getAbilityIconURL } from "@/data/abilities";

// ============================================================
// UtilityIcon — A utility/ability placed on the board
// Uses real Valorant API ability icons from CDN
// ============================================================

interface Props {
  item: BoardItem;
  isSelected: boolean;
}

const UTIL_RADIUS = 14;

export function UtilityIcon({ item, isSelected }: Props) {
  const { updateItemPosition, selectItem, mapRotationOffset } = useBoardStore();
  const groupRef = useRef<Konva.Group>(null);
  const [abilityImage, setAbilityImage] = useState<HTMLImageElement | null>(null);

  // Load real ability icon from Valorant API CDN
  useEffect(() => {
    let mounted = true;

    if (!item.agentName || !item.utilityName) {
      setAbilityImage(null);
      return;
    }

    const iconUrl = getAbilityIconURL(item.agentName, item.utilityName);
    if (!iconUrl) {
      setAbilityImage(null);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (mounted) setAbilityImage(img);
    };
    img.onerror = () => {
      if (mounted) setAbilityImage(null);
    };
    img.src = iconUrl;

    return () => {
      mounted = false;
    };
  }, [item.agentName, item.utilityName]);

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

  // Look up ability type from centralized mapping
  const utilType = getAbilityType(item.utilityName ?? "");
  const style = UTILITY_STYLES[utilType] ?? UTILITY_STYLES.default;
  const teamColor = item.team === "attack" ? "#FF4655" : "#17E6A1";

  return (
    <Group
      ref={groupRef}
      x={item.x}
      y={item.y}
      rotation={-mapRotationOffset} // Counter-rotate
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
      {/* Selection ring */}
      {isSelected && (
        <Ring
          innerRadius={UTIL_RADIUS + 2}
          outerRadius={UTIL_RADIUS + 5}
          fill="#FFD700"
          opacity={0.8}
        />
      )}

      {/* Team color border */}
      <Circle
        radius={UTIL_RADIUS + 1}
        fill={teamColor}
        opacity={0.7}
      />

      {/* Main circle backdrop with white stroke for contrast */}
      <Circle
        radius={UTIL_RADIUS}
        fill={style.fillColor}
        stroke="#ffffff"
        strokeWidth={1.5}
        shadowColor="black"
        shadowBlur={4}
        shadowOpacity={0.5}
        opacity={0.9}
      />

      {/* Real ability icon từ API hoặc fallback emoji */}
      {abilityImage ? (
        <KonvaImage
          image={abilityImage}
          width={UTIL_RADIUS * 1.4}
          height={UTIL_RADIUS * 1.4}
          offsetX={UTIL_RADIUS * 0.7}
          offsetY={UTIL_RADIUS * 0.7}
          opacity={0.95}
        />
      ) : (
        <Circle
          radius={UTIL_RADIUS * 0.5}
          fill={style.fillColor}
          opacity={0.3}
        />
      )}

      {/* Label below */}
      <Circle
        radius={2}
        fill="#fff"
        opacity={0.5}
        y={UTIL_RADIUS + 2}
      />
    </Group>
  );
}
