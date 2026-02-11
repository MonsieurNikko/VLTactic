"use client";

import React, { useState } from "react";
import { AGENTS, ROLE_COLORS } from "@/data/agents";
import { useBoardStore } from "@/store/boardStore";
import { getAbilityType, UTIL_TYPE_COLORS } from "@/data/abilities";
import type { AgentDef } from "@/types";

// ============================================================
// Sidebar — Agent & Utility selection panel
// Click agent row → expand abilities
// "Place Agent" button → placement mode
// Click ability → place specific utility
// ============================================================

const ROLES = ["Duelist", "Controller", "Initiator", "Sentinel"] as const;

export default function Sidebar() {
  const { pendingAgent, setPendingAgent, items, removeItem, selectItem, selectedItemId } =
    useBoardStore();
  const [activeTeam, setActiveTeam] = useState<"attack" | "defend">("attack");
  const [expandedRole, setExpandedRole] = useState<string | null>("Duelist");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  // Click agent row: only toggle expand
  const handleAgentToggle = (agent: AgentDef) => {
    setExpandedAgent(expandedAgent === agent.name ? null : agent.name);
  };

  // Click "Place Agent" button: set pending as agent
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

  // Click ability: set pending as utility
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

  const filteredAgents = searchQuery
    ? AGENTS.filter((a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : AGENTS;

  return (
    <div className="w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-3 border-b border-neutral-800">
        <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
          Agents & Abilities
        </h2>
        <input
          type="text"
          placeholder="Search agent..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2 w-full bg-neutral-800 text-neutral-200 text-xs px-3 py-1.5 rounded border border-neutral-700 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Team toggle */}
      <div className="flex p-2 gap-1">
        <button
          onClick={() => setActiveTeam("attack")}
          className={`flex-1 text-xs py-1.5 rounded font-medium transition-colors ${
            activeTeam === "attack"
              ? "bg-red-600 text-white"
              : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
          }`}
        >
          ⚔ Attack
        </button>
        <button
          onClick={() => setActiveTeam("defend")}
          className={`flex-1 text-xs py-1.5 rounded font-medium transition-colors ${
            activeTeam === "defend"
              ? "bg-emerald-600 text-white"
              : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
          }`}
        >
          🛡 Defend
        </button>
      </div>

      {/* Agent list by role */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {ROLES.map((role) => {
          const roleAgents = filteredAgents.filter((a) => a.role === role);
          if (roleAgents.length === 0) return null;
          const isExpanded = expandedRole === role;

          return (
            <div key={role}>
              <button
                onClick={() => setExpandedRole(isExpanded ? null : role)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                style={{ color: ROLE_COLORS[role] }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: ROLE_COLORS[role] }}
                />
                {role}
                <span className="text-neutral-600 text-[10px] font-normal ml-1">
                  ({roleAgents.length})
                </span>
                <span className="ml-auto text-neutral-500">
                  {isExpanded ? "▾" : "▸"}
                </span>
              </button>

              {isExpanded && (
                <div className="px-2 pb-2 space-y-0.5">
                  {roleAgents.map((agent) => {
                    const isAgentPending =
                      pendingAgent?.agentName === agent.name &&
                      !pendingAgent?.utilityName &&
                      pendingAgent?.team === activeTeam;
                    const isAgentExpanded = expandedAgent === agent.name;

                    return (
                      <div key={agent.name}>
                        {/* Agent row: click to expand */}
                        <button
                          onClick={() => handleAgentToggle(agent)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-all ${
                            isAgentExpanded
                              ? "bg-neutral-800 ring-1 ring-neutral-600"
                              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                          }`}
                        >
                          {/* Agent icon from CDN */}
                          {agent.iconUrl ? (
                            <img
                              src={agent.iconUrl}
                              alt={agent.name}
                              className="w-6 h-6 rounded-full shrink-0 bg-neutral-700 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span
                              className="w-6 h-6 rounded-full shrink-0 border border-white/20 flex items-center justify-center text-[9px] font-bold text-white"
                              style={{ backgroundColor: agent.color }}
                            >
                              {agent.name.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                          <span className="truncate flex-1 text-left text-neutral-200">
                            {agent.name}
                          </span>
                          <span className="text-neutral-500 text-[10px]">
                            {isAgentExpanded ? "▾" : "▸"}
                          </span>
                        </button>

                        {/* Expanded panel: Place Agent + abilities */}
                        {isAgentExpanded && (
                          <div className="ml-3 mt-0.5 mb-1 space-y-0.5">
                            {/* Place Agent button */}
                            <button
                              onClick={() => handlePlaceAgent(agent)}
                              className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-[11px] font-medium transition-all ${
                                isAgentPending
                                  ? "bg-blue-600 text-white ring-1 ring-blue-400"
                                  : "bg-neutral-700/60 text-neutral-200 hover:bg-blue-600/30 hover:text-white"
                              }`}
                            >
                              <span className="text-sm">👤</span>
                              <span>Place {agent.name}</span>
                              <span className={`ml-auto text-[9px] ${isAgentPending ? "text-blue-200" : "text-neutral-500"}`}>
                                {activeTeam === "attack" ? "ATK" : "DEF"}
                              </span>
                            </button>

                            {/* Abilities list */}
                            {agent.abilities.map((ability) => {
                              const utilType = getAbilityType(ability);
                              const isAbilityPending =
                                pendingAgent?.agentName === agent.name &&
                                pendingAgent?.utilityName === ability &&
                                pendingAgent?.team === activeTeam;

                              return (
                                <button
                                  key={ability}
                                  onClick={() =>
                                    handleAbilityClick(agent, ability)
                                  }
                                  className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-[11px] transition-all ${
                                    isAbilityPending
                                      ? "bg-indigo-600 text-white ring-1 ring-indigo-400"
                                      : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
                                  }`}
                                  title={`Place ${ability} (${utilType})`}
                                >
                                  <span
                                    className="w-2 h-2 rounded-sm shrink-0"
                                    style={{
                                      backgroundColor:
                                        UTIL_TYPE_COLORS[utilType] ??
                                        UTIL_TYPE_COLORS.default,
                                    }}
                                  />
                                  <span className="truncate">{ability}</span>
                                  <span className="ml-auto text-[9px] text-neutral-600">
                                    {utilType}
                                  </span>
                                </button>
                              );
                            })}
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

      {/* Board items list */}
      <div className="border-t border-neutral-800 p-3">
        <h3 className="text-xs font-semibold text-neutral-400 uppercase mb-2">
          On Board ({items.length})
        </h3>
        <div className="max-h-44 overflow-y-auto space-y-0.5 scrollbar-thin">
          {items.length === 0 ? (
            <p className="text-xs text-neutral-600 italic">
              Click agent → expand → place on map
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => selectItem(item.id)}
                className={`flex items-center gap-2 px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
                  selectedItemId === item.id
                    ? "bg-blue-600/30 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate flex-1">
                  {item.agentName}
                  {item.utilityName && (
                    <span className="text-neutral-500 ml-1">
                      — {item.utilityName}
                    </span>
                  )}
                </span>
                <span
                  className={`text-[10px] px-1 rounded ${
                    item.team === "attack"
                      ? "bg-red-900/50 text-red-400"
                      : "bg-emerald-900/50 text-emerald-400"
                  }`}
                >
                  {item.team === "attack" ? "ATK" : "DEF"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.id);
                  }}
                  className="text-neutral-500 hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
