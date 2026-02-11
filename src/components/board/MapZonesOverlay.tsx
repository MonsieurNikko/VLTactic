"use client";

import React from "react";
import { Group, Text, Rect } from "react-konva";
import { MAP_ZONES } from "@/data/zones";
import { useBoardStore } from "@/store/boardStore";

export function MapZonesOverlay() {
    const { selectedMap, showZones } = useBoardStore();

    if (!showZones) return null;

    const currentZones = MAP_ZONES[selectedMap.toLowerCase()] || [];

    return (
        <Group name="zones-layer">
            {currentZones.map((zone) => {
                // Calculate center for the label
                const xs = zone.points.map(p => p.x);
                const ys = zone.points.map(p => p.y);
                const minX = Math.min(...xs);
                const maxX = Math.max(...xs);
                const minY = Math.min(...ys);
                const maxY = Math.max(...ys);
                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;
                const width = maxX - minX;
                const height = maxY - minY;

                const isSite = zone.type === 'site';

                return (
                    <Group key={zone.id} x={centerX} y={centerY}>
                        {/* Visual background for the site area (very subtle) */}
                        <Rect
                            x={-width / 2}
                            y={-height / 2}
                            width={width}
                            height={height}
                            fill={zone.color || (isSite ? "rgba(255, 255, 255, 0.05)" : "transparent")}
                            listening={false}
                        />

                        {/* Label Container */}
                        <Group>
                            <Rect
                                x={-40}
                                y={-12}
                                width={80}
                                height={24}
                                fill="rgba(0,0,0,0.6)"
                                cornerRadius={4}
                                stroke={isSite ? "rgba(255,255,255,0.3)" : "transparent"}
                                strokeWidth={1}
                            />
                            <Text
                                text={zone.name}
                                fontSize={12}
                                fontStyle="bold"
                                fill={isSite ? "#fff" : "#888"}
                                align="center"
                                width={80}
                                x={-40}
                                y={-6}
                                listening={false}
                            />
                        </Group>
                    </Group>
                );
            })}
        </Group>
    );
}
