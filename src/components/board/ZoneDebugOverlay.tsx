import React from "react";
import { Line, Text, Group } from "react-konva";
import { MAP_ZONES } from "@/data/zones";
import { MapZone } from "@/types";

interface ZoneDebugOverlayProps {
    mapId: string;
}

export function ZoneDebugOverlay({ mapId }: ZoneDebugOverlayProps) {
    const zones = MAP_ZONES[mapId];

    if (!zones) return null;

    return (
        <Group>
            {zones.map((zone) => (
                <React.Fragment key={zone.id}>
                    {/* Zone Outline */}
                    <Line
                        points={zone.points.flatMap((p) => [p.x, p.y])}
                        closed
                        stroke={zone.color || "rgba(255, 255, 0, 0.5)"}
                        strokeWidth={2}
                        fill={zone.color || "rgba(255, 255, 0, 0.1)"}
                        listening={false} // Pass events through to map
                    />
                    {/* Zone Label */}
                    <Text
                        x={zone.points[0].x}
                        y={zone.points[0].y}
                        text={zone.name}
                        fontSize={14}
                        fill="white"
                        stroke="black"
                        strokeWidth={0.5}
                        listening={false}
                    />
                </React.Fragment>
            ))}
        </Group>
    );
}
