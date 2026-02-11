"use client";

import React, { useState } from "react";
import { AGENTS, ROLE_COLORS } from "@/data/agents";
import { useBoardStore } from "@/store/boardStore";
import { getAbilityType, getAbilityIconURL, UTIL_TYPE_COLORS } from "@/data/abilities";
import { CDNImage } from "@/components/ui/CDNImage";
import type { AgentDef } from "@/types";

// ============================================================
// Sidebar — Creative Redesign (Phase 3.5)
// Features: glassmorphism cards, role-specific themes,
//           improved ability contrast, and tactical layout.
// ============================================================

const ROLES = ["Duelist", "Controller", "Initiator", "Sentinel"] as const;

export default function Sidebar() {
  const { pendingAgent, setPendingAgent, items, removeItem, selectItem, selectedItemId } =
    useBoardStore();
  const [activeTeam, setActiveTeam] = useState<"attack" | "defend">("attack");
  const [expandedRole, setExpandedRole] = useState<string | null>("Duelist");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const handleAgentToggle = (agent: AgentDef) => {
    setExpandedAgent(expandedAgent === agent.name ? null : agent.name);
  };

  const handlePlaceAgent = (agent: AgentDef) => {
    if (
      pendingAgent?.agentName === agent.name &&
      !pendingAgent?.utilityName &&
      pendingAgent?.team === activeTeam
    ) {
      setPendingAgent(null);
      return;
    }
    setPendingAgent({
      agentName: agent.name,
      team: activeTeam,
      color: agent.color,
    });
  };

  const handleAbilityClick = (agent: AgentDef, ability: string) => {
    if (
      pendingAgent?.agentName === agent.name &&
      pendingAgent?.utilityName === ability &&
      pendingAgent?.team === activeTeam
    ) {
      setPendingAgent(null);
      return;
    }
    setPendingAgent({
      agentName: agent.name,
      team: activeTeam,
      color: agent.color,
      utilityName: ability,
    });
  };

  const handleDragStart = (e: React.DragEvent, agent: AgentDef, utilityName?: string) => {
    const data = {
      agentName: agent.name,
      utilityName,
      team: activeTeam,
      color: agent.color,
    };
    e.dataTransfer.setData("agent-data", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "copy";
  };

  const filteredAgents = searchQuery
    ? AGENTS.filter((a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : AGENTS;

  return (
    <div className="w-80 bg-neutral-950 border-r border-neutral-800 flex flex-col h-full shrink-0 shadow-2xl">
      {/* Search Header */}
      <div className="p-4 bg-neutral-900/50 backdrop-blur-md border-b border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
            Tactical Units
          </h2>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search operative..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-800/80 text-white text-xs px-9 py-2 rounded-lg border border-neutral-700 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-neutral-600"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">🔍</span>
        </div>
      </div>

      {/* Team Selection Cards */}
      <div className="flex p-3 gap-2 bg-neutral-900/20">
        <button
          onClick={() => setActiveTeam("attack")}
          className={`flex-1 flex items-center justify-center gap-2 text-[11px] py-2 rounded-lg font-bold transition-all border ${activeTeam === "attack"
            ? "bg-red-600/20 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
            : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700"
            }`}
        >
          <span className="text-sm">⚔</span> ATTACK
        </button>
        <button
          onClick={() => setActiveTeam("defend")}
          className={`flex-1 flex items-center justify-center gap-2 text-[11px] py-2 rounded-lg font-bold transition-all border ${activeTeam === "defend"
            ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700"
            }`}
        >
          <span className="text-sm">🛡</span> DEFEND
        </button>
      </div>

      {/* Operative Registry */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2 space-y-4">
        {ROLES.map((role) => {
          const roleAgents = filteredAgents.filter((a) => a.role === role);
          if (roleAgents.length === 0) return null;
          const isExpanded = expandedRole === role;

          return (
            <div key={role} className="space-y-2">
              <button
                onClick={() => setExpandedRole(isExpanded ? null : role)}
                className="w-full flex items-center gap-2 px-1 py-1 group transition-all"
              >
                <div
                  className="w-1 h-4 rounded-full transition-all group-hover:scale-y-125"
                  style={{ backgroundColor: ROLE_COLORS[role] }}
                />
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: ROLE_COLORS[role] }}>
                  {role}s
                </span>
                <div className="h-px flex-1 bg-neutral-800 ml-2 opacity-50" />
                <span className="text-[10px] text-neutral-600 font-mono">
                  [{roleAgents.length}]
                </span>
              </button>

              {isExpanded && (
                <div className="grid gap-1.5 animate-in slide-in-from-left-2 duration-300">
                  {roleAgents.map((agent) => {
                    const isAgentExpanded = expandedAgent === agent.name;
                    const isPlaceAgentActive = pendingAgent?.agentName === agent.name && !pendingAgent?.utilityName;

                    return (
                      <div key={agent.name} className="group/agent">
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, agent)}
                          onClick={() => handleAgentToggle(agent)}
                          className={`relative flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer overflow-hidden ${isAgentExpanded
                              ? "bg-neutral-800/80 border-neutral-600 shadow-xl"
                              : "bg-neutral-900/40 border-neutral-800/50 hover:border-neutral-700 hover:bg-neutral-800/40"
                            }`}
                        >
                          {/* Decorative background role color glow */}
                          {isAgentExpanded && (
                            <div
                              className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-[40px] opacity-20"
                              style={{ backgroundColor: agent.color }}
                            />
                          )}

                          <div className="relative">
                            <CDNImage
                              src={agent.iconUrl}
                              alt={agent.name}
                              width={32}
                              height={32}
                              className={`w-9 h-9 rounded-lg object-cover border transition-all ${isAgentExpanded ? "border-white/20 scale-110" : "border-transparent opacity-80"
                                }`}
                            />
                            {isPlaceAgentActive && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-neutral-950 shadow-lg" />
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className={`text-xs font-bold transition-colors ${isAgentExpanded ? "text-white" : "text-neutral-400 group-hover/agent:text-neutral-200"}`}>
                              {agent.name}
                            </h4>
                            <div className="flex gap-1 mt-0.5">
                              {agent.abilities.slice(0, 4).map((_, idx) => (
                                <div key={idx} className="w-1.5 h-1.5 rounded-full bg-neutral-700 opacity-50" />
                              ))}
                            </div>
                          </div>

                          <span className={`text-[10px] transition-transform duration-300 ${isAgentExpanded ? "rotate-180 text-white" : "text-neutral-600 group-hover/agent:text-neutral-400"}`}>
                            ▿
                          </span>
                        </div>

                        {/* Tactical Card Content */}
                        {isAgentExpanded && (
                          <div className="mt-1.5 mx-1 p-2 bg-neutral-900 rounded-lg border border-neutral-800 space-y-2 animate-in slide-in-from-top-2 duration-300">
                            {/* Place Agent Primary Action */}
                            <button
                              onClick={() => handlePlaceAgent(agent)}
                              className={`w-full group/place flex items-center justify-between p-2 rounded-md transition-all ${isPlaceAgentActive
                                  ? "bg-blue-600' text-white shadow-lg shadow-blue-900/20"
                                  : "bg-neutral-800/50 text-neutral-400 hover:bg-blue-600/20 hover:text-white"
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">👤</span>
                                <span className="text-[11px] font-bold uppercase tracking-wider">Place {agent.name}</span>
                              </div>
                              <div className="px-1.5 py-0.5 rounded text-[9px] font-black bg-black/30">
                                {activeTeam === "attack" ? "ATK" : "DEF"}
                              </div>
                            </button>

                            <div className="h-px bg-neutral-800 mx-1" />

                            {/* Specialized Utilities */}
                            <div className="grid grid-cols-1 gap-1">
                              {agent.abilities.map((ability) => {
                                const utilType = getAbilityType(ability);
                                const iconUrl = getAbilityIconURL(agent.name, ability);
                                const isPending = pendingAgent?.agentName === agent.name && pendingAgent?.utilityName === ability;

                                return (
                                  <button
                                    key={ability}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, agent, ability)}
                                    onClick={() => handleAbilityClick(agent, ability)}
                                    className={`flex items-center gap-2.5 p-1.5 rounded-md transition-all border ${isPending
                                        ? "bg-indigo-600 border-indigo-500 text-white"
                                        : "bg-neutral-950/20 border-transparent hover:border-neutral-700 hover:bg-neutral-800/40 text-neutral-400 hover:text-neutral-200"
                                      }`}
                                  >
                                    <div className="relative w-5 h-5 flex items-center justify-center">
                                      {iconUrl ? (
                                        <CDNImage
                                          src={iconUrl}
                                          alt={ability}
                                          width={20}
                                          height={20}
                                          className={`w-full h-full object-contain brightness-110 contrast-125 ${isPending ? "" : "brightness-75 group-hover:brightness-100 opacity-70 group-hover:opacity-100"}`}
                                        />
                                      ) : (
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: UTIL_TYPE_COLORS[utilType] || '#888' }} />
                                      )}
                                    </div>
                                    <div className="flex-1 text-left">
                                      <div className="text-[10px] font-bold leading-none mb-0.5">{ability}</div>
                                      <div
                                        className="text-[8px] font-black uppercase tracking-tighter opacity-60"
                                        style={{ color: UTIL_TYPE_COLORS[utilType] }}
                                      >
                                        {utilType}
                                      </div>
                                    </div>
                                    {isPending && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Deployment Summary */}
      <div className="p-4 bg-neutral-900 border-t border-neutral-800 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
            Deployed Units [{items.length}]
          </h3>
          {items.length > 0 && (
            <button
              onClick={() => useBoardStore.getState().clearBoard()}
              className="text-[9px] text-red-500 hover:text-red-400 font-bold transition-colors"
            >
              PURGE ALL
            </button>
          )}
        </div>

        <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin">
          {items.length === 0 ? (
            <div className="bg-neutral-800/30 border border-dashed border-neutral-700/50 rounded-lg p-3 text-center">
              <p className="text-[10px] text-neutral-600 font-medium">No operatives currently on board</p>
              <p className="text-[9px] text-neutral-700 mt-1">Select an agent above to begin strategy</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => selectItem(item.id)}
                className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all border ${selectedItemId === item.id
                    ? "bg-blue-600/10 border-blue-500/50 text-white"
                    : "bg-neutral-800/40 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-[0_0_5px_currentColor]"
                  style={{ color: item.color, backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold truncate leading-tight">{item.agentName}</div>
                  {item.utilityName && (
                    <div className="text-[9px] text-neutral-600 truncate">{item.utilityName}</div>
                  )}
                </div>
                <div className={`px-1.5 py-0.5 rounded text-[8px] font-black ${item.team === "attack" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                  }`}>
                  {item.team === "attack" ? "ATK" : "DEF"}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                  className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-red-500/20 hover:text-red-500 transition-all text-neutral-600"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
