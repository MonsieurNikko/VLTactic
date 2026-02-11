"use client";

import React, { useCallback, useRef } from "react";
import { Group, Circle, Text, Ring } from "react-konva";
import Konva from "konva";
import { BoardItem } from "@/types";
import { useBoardStore } from "@/store/boardStore";
import { getAbilityType, UTILITY_STYLES } from "@/data/abilities";

// ============================================================
// UtilityIcon — A utility/ability placed on the board
// Uses centralized ability classification for styling
// ============================================================

interface Props {
  item: BoardItem;
  isSelected: boolean;
}

const UTIL_RADIUS = 14;

export function UtilityIcon({ item, isSelected }: Props) {
  const { updateItemPosition, selectItem } = useBoardStore();
  const groupRef = useRef<Konva.Group>(null);

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

      {/* Main circle */}
      <Circle
        radius={UTIL_RADIUS}
        fill={style.fillColor}
        shadowColor="black"
        shadowBlur={4}
        shadowOpacity={0.5}
        opacity={0.9}
      />

      {/* Symbol */}
      <Text
        text={style.symbol}
        fontSize={14}
        fill="#fff"
        align="center"
        verticalAlign="middle"
        width={UTIL_RADIUS * 2}
        height={UTIL_RADIUS * 2}
        offsetX={UTIL_RADIUS}
        offsetY={UTIL_RADIUS}
      />

      {/* Label below */}
      <Text
        text={`${item.agentName}\n${item.utilityName ?? utilType}`}
        fontSize={8}
        fill="#ccc"
        align="center"
        y={UTIL_RADIUS + 4}
        width={60}
        offsetX={30}
        lineHeight={1.2}
      />
    </Group>
  );
}
