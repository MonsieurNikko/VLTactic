import React, { useMemo } from "react";
import { Group, Circle, Text, Path, Rect } from "react-konva";
import { useBoardStore } from "@/store/boardStore";

// SVG path for a standard cursor icon
const CURSOR_PATH = "M0,0 L0,15 L4,11 L7,17 L9,16 L6,10 L11,10 Z";

export function RemoteCursors() {
    const remoteCursors = useBoardStore((s) => s.remoteCursors);

    // Filter cursors that are active (seen in the last 5 seconds)
    const activeCursors = useMemo(() => {
        const now = Date.now();
        return Object.entries(remoteCursors).filter(([_, data]) => now - data.lastSeen < 2000);
    }, [remoteCursors]);

    return (
        <Group listening={false}>
            {activeCursors.map(([userId, data]) => (
                <Group key={userId} x={data.x} y={data.y}>
                    {/* Cursor Shadow */}
                    <Path
                        data={CURSOR_PATH}
                        fill="black"
                        opacity={0.3}
                        x={1}
                        y={1}
                    />
                    {/* Main Cursor */}
                    <Path
                        data={CURSOR_PATH}
                        fill={data.color}
                        stroke="white"
                        strokeWidth={1}
                    />
                    {/* User Label */}
                    <Group y={18}>
                        <Rect
                            fill="rgba(0,0,0,0.6)"
                            cornerRadius={3}
                            height={14}
                            width={54}
                            offsetX={27}
                        />
                        <Text
                            text={`User ${userId.slice(0, 4)}`}
                            fill="white"
                            fontSize={9}
                            align="center"
                            width={54}
                            offsetX={27}
                            y={2}
                        />
                    </Group>
                </Group>
            ))}
        </Group>
    );
}
