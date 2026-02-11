import { BoardItem } from "@/types";
import { getZoneAt } from "@/data/zones";

export function generateTacticalDescription(
    mapId: string,
    items: BoardItem[]
): string {
    if (items.length === 0) return "Empty Board";

    const attackers = items.filter((i) => i.type === "agent" && i.team === "attack");
    const defenders = items.filter((i) => i.type === "agent" && i.team === "defend");

    const atkAnalysis = analyzeTeam(mapId, attackers, "Attackers");
    const defAnalysis = analyzeTeam(mapId, defenders, "Defenders");

    if (atkAnalysis && defAnalysis) {
        return `${atkAnalysis} vs ${defAnalysis}`;
    }
    return atkAnalysis || defAnalysis || "No clear strategy";
}

function analyzeTeam(mapId: string, agents: BoardItem[], teamName: string): string {
    if (agents.length === 0) return "";

    // Group agents by zone
    const zoneCounts: Record<string, number> = {};
    let unknownCount = 0;

    agents.forEach((agent) => {
        const zone = getZoneAt(mapId, agent.x, agent.y);
        if (zone) {
            zoneCounts[zone.name] = (zoneCounts[zone.name] || 0) + 1;
        } else {
            unknownCount++;
        }
    });

    const uniqueZones = Object.keys(zoneCounts);
    const totalAgents = agents.length;

    // 1. Check for Rush/Stack (Most agents in one site)
    for (const zoneName of uniqueZones) {
        if (zoneName.includes("Site") && zoneCounts[zoneName] >= Math.max(3, totalAgents - 1)) {
            return `${teamName} ${teamName === "Attackers" ? "Rushing" : "Stacking"} ${zoneName}`;
        }
    }

    // 2. Check for Split (Agents in Site + Main/Mid)
    const sites = uniqueZones.filter((z) => z.includes("Site"));
    if (sites.length === 1) {
        const site = sites[0];
        const mains = uniqueZones.filter((z) => z.includes("Main") || z.includes("Mid"));
        if (mains.length > 0) {
            return `${teamName} splitting ${site}`;
        }
    }

    // 3. Check for Default (Spread out)
    if (uniqueZones.length >= 3) {
        return `${teamName} playing Default / Map Control`;
    }

    // 4. Fallback descriptions
    if (uniqueZones.length > 0) {
        const topZone = uniqueZones.sort((a, b) => zoneCounts[b] - zoneCounts[a])[0];
        return `${teamName} focusing ${topZone}`;
    }

    return `${teamName} holding angles`;
}
