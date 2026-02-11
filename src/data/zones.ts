import { MapZone } from "@/types";

// ============================================================
// Map Zones Registry
// Coordinates are converted from official Valorant API coordinates
// and rotated to match our board orientation (standard tactical).
// ============================================================

export const MAP_ZONES: Record<string, MapZone[]> = {
    "ascent": [
        {
            "id": "ascent-site-a",
            "name": "A Site",
            "mapId": "ascent",
            "type": "site",
            "points": [
                { "x": 606, "y": 818 },
                { "x": 726, "y": 818 },
                { "x": 726, "y": 938 },
                { "x": 606, "y": 938 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "ascent-site-b",
            "name": "B Site",
            "mapId": "ascent",
            "type": "site",
            "points": [
                { "x": 672, "y": 209 },
                { "x": 792, "y": 209 },
                { "x": 792, "y": 329 },
                { "x": 672, "y": 329 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "ascent-courtyard-mid",
            "name": "Mid",
            "mapId": "ascent",
            "type": "general",
            "points": [
                { "x": 459, "y": 465 },
                { "x": 579, "y": 465 },
                { "x": 579, "y": 585 },
                { "x": 459, "y": 585 }
            ]
        }
    ],
    "split": [
        {
            "id": "split-site-a",
            "name": "A Site",
            "mapId": "split",
            "type": "site",
            "points": [
                { "x": 642, "y": 776 },
                { "x": 762, "y": 776 },
                { "x": 762, "y": 896 },
                { "x": 642, "y": 896 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "split-site-b",
            "name": "B Site",
            "mapId": "split",
            "type": "site",
            "points": [
                { "x": 602, "y": 77 },
                { "x": 722, "y": 77 },
                { "x": 722, "y": 197 },
                { "x": 602, "y": 197 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        }
    ],
    "fracture": [
        {
            "id": "fracture-site-a",
            "name": "A Site",
            "mapId": "fracture",
            "type": "site",
            "points": [
                { "x": 475, "y": 124 },
                { "x": 595, "y": 124 },
                { "x": 595, "y": 244 },
                { "x": 475, "y": 244 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "fracture-site-b",
            "name": "B Site",
            "mapId": "fracture",
            "type": "site",
            "points": [
                { "x": 470, "y": 868 },
                { "x": 590, "y": 868 },
                { "x": 590, "y": 988 },
                { "x": 470, "y": 988 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        }
    ],
    "bind": [
        {
            "id": "bind-site-a",
            "name": "A Site",
            "mapId": "bind",
            "type": "site",
            "points": [
                { "x": 281, "y": 212 },
                { "x": 401, "y": 212 },
                { "x": 401, "y": 332 },
                { "x": 281, "y": 332 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "bind-site-b",
            "name": "B Site",
            "mapId": "bind",
            "type": "site",
            "points": [
                { "x": 260, "y": 665 },
                { "x": 380, "y": 665 },
                { "x": 380, "y": 785 },
                { "x": 260, "y": 785 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        }
    ],
    "breeze": [
        {
            "id": "breeze-site-a",
            "name": "A Site",
            "mapId": "breeze",
            "type": "site",
            "points": [
                { "x": 447, "y": 34 },
                { "x": 567, "y": 34 },
                { "x": 567, "y": 154 },
                { "x": 447, "y": 154 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "breeze-site-b",
            "name": "B Site",
            "mapId": "breeze",
            "type": "site",
            "points": [
                { "x": 331, "y": 893 },
                { "x": 451, "y": 893 },
                { "x": 451, "y": 1013 },
                { "x": 331, "y": 1013 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        }
    ],
    "abyss": [
        {
            "id": "abyss-site-a",
            "name": "A Site",
            "mapId": "abyss",
            "type": "site",
            "points": [
                { "x": 469, "y": 809 },
                { "x": 589, "y": 809 },
                { "x": 589, "y": 929 },
                { "x": 469, "y": 929 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "abyss-site-b",
            "name": "B Site",
            "mapId": "abyss",
            "type": "site",
            "points": [
                { "x": 549, "y": 85 },
                { "x": 669, "y": 85 },
                { "x": 669, "y": 205 },
                { "x": 549, "y": 205 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        }
    ],
    "lotus": [
        {
            "id": "lotus-site-a",
            "name": "A Site",
            "mapId": "lotus",
            "type": "site",
            "points": [
                { "x": 309, "y": 89 },
                { "x": 429, "y": 89 },
                { "x": 429, "y": 209 },
                { "x": 309, "y": 209 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "lotus-site-b",
            "name": "B Site",
            "mapId": "lotus",
            "type": "site",
            "points": [
                { "x": 410, "y": 449 },
                { "x": 530, "y": 449 },
                { "x": 530, "y": 569 },
                { "x": 410, "y": 569 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "lotus-site-c",
            "name": "C Site",
            "mapId": "lotus",
            "type": "site",
            "points": [
                { "x": 388, "y": 813 },
                { "x": 508, "y": 813 },
                { "x": 508, "y": 933 },
                { "x": 388, "y": 933 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        }
    ],
    "sunset": [
        {
            "id": "sunset-site-a",
            "name": "A Site",
            "mapId": "sunset",
            "type": "site",
            "points": [
                { "x": 388, "y": 196 },
                { "x": 508, "y": 196 },
                { "x": 508, "y": 316 },
                { "x": 388, "y": 316 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "sunset-site-b",
            "name": "B Site",
            "mapId": "sunset",
            "type": "site",
            "points": [
                { "x": 516, "y": 919 },
                { "x": 636, "y": 919 },
                { "x": 636, "y": 1039 },
                { "x": 516, "y": 1039 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        }
    ],
    "pearl": [
        {
            "id": "pearl-site-a",
            "name": "A Site",
            "mapId": "pearl",
            "type": "site",
            "points": [
                { "x": 350, "y": 27 },
                { "x": 470, "y": 27 },
                { "x": 470, "y": 147 },
                { "x": 350, "y": 147 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "pearl-site-b",
            "name": "B Site",
            "mapId": "pearl",
            "type": "site",
            "points": [
                { "x": 415, "y": 700 },
                { "x": 535, "y": 700 },
                { "x": 535, "y": 820 },
                { "x": 415, "y": 820 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        }
    ],
    "icebox": [
        {
            "id": "icebox-site-a",
            "name": "A Site",
            "mapId": "icebox",
            "type": "site",
            "points": [
                { "x": 257, "y": 180 },
                { "x": 377, "y": 180 },
                { "x": 377, "y": 300 },
                { "x": 257, "y": 300 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "icebox-site-b",
            "name": "B Site",
            "mapId": "icebox",
            "type": "site",
            "points": [
                { "x": 303, "y": 779 },
                { "x": 423, "y": 779 },
                { "x": 423, "y": 899 },
                { "x": 303, "y": 899 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        }
    ],
    "corrode": [
        {
            "id": "corrode-site-a",
            "name": "A Site",
            "mapId": "corrode",
            "type": "site",
            "points": [
                { "x": 556, "y": 700 },
                { "x": 676, "y": 700 },
                { "x": 676, "y": 820 },
                { "x": 556, "y": 820 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "corrode-site-b",
            "name": "B Site",
            "mapId": "corrode",
            "type": "site",
            "points": [
                { "x": 509, "y": 257 },
                { "x": 629, "y": 257 },
                { "x": 629, "y": 377 },
                { "x": 509, "y": 377 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        }
    ],
    "haven": [
        {
            "id": "haven-site-a",
            "name": "A Site",
            "mapId": "haven",
            "type": "site",
            "points": [
                { "x": 553, "y": 790 },
                { "x": 673, "y": 790 },
                { "x": 673, "y": 910 },
                { "x": 553, "y": 910 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "haven-site-b",
            "name": "B Site",
            "mapId": "haven",
            "type": "site",
            "points": [
                { "x": 553, "y": 451 },
                { "x": 673, "y": 451 },
                { "x": 673, "y": 571 },
                { "x": 553, "y": 571 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        },
        {
            "id": "haven-site-c",
            "name": "C Site",
            "mapId": "haven",
            "type": "site",
            "points": [
                { "x": 536, "y": 123 },
                { "x": 656, "y": 123 },
                { "x": 656, "y": 243 },
                { "x": 536, "y": 243 }
            ],
            "color": "rgba(0, 255, 0, 0.1)"
        }
    ]
};

export function isPointInPolygon(point: { x: number, y: number }, vs: { x: number, y: number }[]) {
    const x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i].x, yi = vs[i].y;
        const xj = vs[j].x, yj = vs[j].y;
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

export function getZoneAt(mapId: string, x: number, y: number): MapZone | null {
    const zones = MAP_ZONES[mapId.toLowerCase()];
    if (!zones) return null;
    const sortedZones = [...zones].sort((a) => (a.type === 'site' ? -1 : 1));
    for (const zone of sortedZones) {
        if (isPointInPolygon({ x, y }, zone.points)) return zone;
    }
    return null;
}
