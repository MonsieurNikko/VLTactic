import { AgentDef } from "@/types";

// ============================================================
// All Valorant Agents — with CDN icons + UUIDs from valorant-api.com
// ============================================================

const icon = (uuid: string) =>
  `https://media.valorant-api.com/agents/${uuid}/displayicon.png`;

export const AGENTS: AgentDef[] = [
  // ── Duelists ──────────────────────────────────────────────
  { name: "Jett",    role: "Duelist",     color: "#89CFF0", uuid: "add6443a-41bd-e414-f6ad-e58d267f4e95", iconUrl: icon("add6443a-41bd-e414-f6ad-e58d267f4e95"), abilities: ["Cloudburst", "Updraft", "Tailwind", "Blade Storm"] },
  { name: "Reyna",   role: "Duelist",     color: "#9B59B6", uuid: "a3bfb853-43b2-7238-a4f1-ad90e9e46bcc", iconUrl: icon("a3bfb853-43b2-7238-a4f1-ad90e9e46bcc"), abilities: ["Leer", "Devour", "Dismiss", "Empress"] },
  { name: "Phoenix", role: "Duelist",     color: "#E67E22", uuid: "eb93336a-449b-9c1b-0a54-a891f7921d69", iconUrl: icon("eb93336a-449b-9c1b-0a54-a891f7921d69"), abilities: ["Blaze", "Curveball", "Hot Hands", "Run It Back"] },
  { name: "Raze",    role: "Duelist",     color: "#E74C3C", uuid: "f94c3b30-42be-e959-889c-5aa313dba261", iconUrl: icon("f94c3b30-42be-e959-889c-5aa313dba261"), abilities: ["Boom Bot", "Blast Pack", "Paint Shells", "Showstopper"] },
  { name: "Yoru",    role: "Duelist",     color: "#3498DB", uuid: "7f94d92c-4234-0a36-9646-3a87eb8b5c89", iconUrl: icon("7f94d92c-4234-0a36-9646-3a87eb8b5c89"), abilities: ["Fakeout", "Blindside", "Gatecrash", "Dimensional Drift"] },
  { name: "Neon",    role: "Duelist",     color: "#00D4FF", uuid: "bb2a4828-46eb-8cd1-e765-15848195d751", iconUrl: icon("bb2a4828-46eb-8cd1-e765-15848195d751"), abilities: ["Fast Lane", "Relay Bolt", "High Gear", "Overdrive"] },
  { name: "Iso",     role: "Duelist",     color: "#7D3C98", uuid: "0e38b510-41a8-5780-5e8f-568b2a4f2d6c", iconUrl: icon("0e38b510-41a8-5780-5e8f-568b2a4f2d6c"), abilities: ["Undercut", "Double Tap", "Contingency", "Kill Contract"] },
  { name: "Waylay",  role: "Duelist",     color: "#FF6B6B", uuid: "df1cb487-4902-002e-5c17-d28e83e78588", iconUrl: icon("df1cb487-4902-002e-5c17-d28e83e78588"), abilities: ["Saturate", "Lightspeed", "Refract", "Convergent Paths"] },

  // ── Controllers ───────────────────────────────────────────
  { name: "Brimstone", role: "Controller", color: "#D35400", uuid: "9f0d8ba9-4140-b941-57d3-a7ad57c6b417", iconUrl: icon("9f0d8ba9-4140-b941-57d3-a7ad57c6b417"), abilities: ["Stim Beacon", "Incendiary", "Sky Smoke", "Orbital Strike"] },
  { name: "Omen",      role: "Controller", color: "#2C3E50", uuid: "8e253930-4c05-31dd-1b6c-968525494517", iconUrl: icon("8e253930-4c05-31dd-1b6c-968525494517"), abilities: ["Shrouded Step", "Paranoia", "Dark Cover", "From the Shadows"] },
  { name: "Viper",     role: "Controller", color: "#27AE60", uuid: "707eab51-4836-f488-046a-cda6bf494859", iconUrl: icon("707eab51-4836-f488-046a-cda6bf494859"), abilities: ["Snake Bite", "Poison Cloud", "Toxic Screen", "Viper's Pit"] },
  { name: "Astra",     role: "Controller", color: "#8E44AD", uuid: "41fb69c1-4189-7b37-f117-bcaf1e96f1bf", iconUrl: icon("41fb69c1-4189-7b37-f117-bcaf1e96f1bf"), abilities: ["Gravity Well", "Nova Pulse", "Nebula", "Cosmic Divide"] },
  { name: "Harbor",    role: "Controller", color: "#1ABC9C", uuid: "95b78ed7-4637-86d9-7e41-71ba8c293152", iconUrl: icon("95b78ed7-4637-86d9-7e41-71ba8c293152"), abilities: ["Storm Surge", "Cove", "High Tide", "Reckoning"] },
  { name: "Clove",     role: "Controller", color: "#FF69B4", uuid: "1dbf2edd-4729-0984-3115-daa5eed44993", iconUrl: icon("1dbf2edd-4729-0984-3115-daa5eed44993"), abilities: ["Pick-Me-Up", "Meddle", "Ruse", "Not Dead Yet"] },

  // ── Initiators ────────────────────────────────────────────
  { name: "Sova",    role: "Initiator",   color: "#2980B9", uuid: "320b2a48-4d9b-a075-30f1-1f93a9b638fa", iconUrl: icon("320b2a48-4d9b-a075-30f1-1f93a9b638fa"), abilities: ["Owl Drone", "Shock Bolt", "Recon Bolt", "Hunter's Fury"] },
  { name: "Breach",  role: "Initiator",   color: "#C0392B", uuid: "5f8d3a7f-467b-97f3-062c-13acf203c006", iconUrl: icon("5f8d3a7f-467b-97f3-062c-13acf203c006"), abilities: ["Aftershock", "Flashpoint", "Fault Line", "Rolling Thunder"] },
  { name: "Skye",    role: "Initiator",   color: "#2ECC71", uuid: "6f2a04ca-43e0-be17-7f36-b3908627744d", iconUrl: icon("6f2a04ca-43e0-be17-7f36-b3908627744d"), abilities: ["Trailblazer", "Guiding Light", "Regrowth", "Seekers"] },
  { name: "KAY/O",   role: "Initiator",   color: "#7F8C8D", uuid: "601dbbe7-43ce-be57-2a40-4abd24953621", iconUrl: icon("601dbbe7-43ce-be57-2a40-4abd24953621"), abilities: ["FRAG/ment", "FLASH/drive", "ZERO/point", "NULL/cmd"] },
  { name: "Fade",    role: "Initiator",   color: "#1C1C1C", uuid: "dade69b4-4f5a-8528-247b-219e5a1facd6", iconUrl: icon("dade69b4-4f5a-8528-247b-219e5a1facd6"), abilities: ["Prowler", "Seize", "Haunt", "Nightfall"] },
  { name: "Gekko",   role: "Initiator",   color: "#F1C40F", uuid: "e370fa57-4757-3604-3648-499e1f642d3f", iconUrl: icon("e370fa57-4757-3604-3648-499e1f642d3f"), abilities: ["Mosh Pit", "Wingman", "Dizzy", "Thrash"] },
  { name: "Tejo",    role: "Initiator",   color: "#DAA520", uuid: "b444168c-4e35-8076-db47-ef9bf368f384", iconUrl: icon("b444168c-4e35-8076-db47-ef9bf368f384"), abilities: ["Special Delivery", "Guided Salvo", "Stealth Drone", "Armageddon"] },

  // ── Sentinels ─────────────────────────────────────────────
  { name: "Sage",      role: "Sentinel",  color: "#48C9B0", uuid: "569fdd95-4d10-43ab-ca70-79becc718b46", iconUrl: icon("569fdd95-4d10-43ab-ca70-79becc718b46"), abilities: ["Barrier Orb", "Slow Orb", "Healing Orb", "Resurrection"] },
  { name: "Cypher",    role: "Sentinel",  color: "#F0E68C", uuid: "117ed9e3-49f3-6512-3ccf-0cada7e3823b", iconUrl: icon("117ed9e3-49f3-6512-3ccf-0cada7e3823b"), abilities: ["Trapwire", "Cyber Cage", "Spycam", "Neural Theft"] },
  { name: "Killjoy",   role: "Sentinel",  color: "#F4D03F", uuid: "1e58de9c-4950-5125-93e9-a0aee9f98746", iconUrl: icon("1e58de9c-4950-5125-93e9-a0aee9f98746"), abilities: ["Nanoswarm", "Alarmbot", "Turret", "Lockdown"] },
  { name: "Chamber",   role: "Sentinel",  color: "#D4AC0D", uuid: "22697a3d-45bf-8dd7-4fec-84a9e28c69d7", iconUrl: icon("22697a3d-45bf-8dd7-4fec-84a9e28c69d7"), abilities: ["Trademark", "Headhunter", "Rendezvous", "Tour De Force"] },
  { name: "Deadlock",  role: "Sentinel",  color: "#AAB7B8", uuid: "cc8b64c8-4b25-4ff9-6e7f-37b4da43d235", iconUrl: icon("cc8b64c8-4b25-4ff9-6e7f-37b4da43d235"), abilities: ["GravNet", "Sonic Sensor", "Barrier Mesh", "Annihilation"] },
  { name: "Vyse",      role: "Sentinel",  color: "#C39BD3", uuid: "efba5359-4016-a1e5-7626-b1ae76895940", iconUrl: icon("efba5359-4016-a1e5-7626-b1ae76895940"), abilities: ["Shear", "Arc Rose", "Razorvine", "Steel Garden"] },
  { name: "Veto",      role: "Sentinel",  color: "#1A8A7D", uuid: "92eeef5d-43b5-1d4a-8d03-b3927a09034b", iconUrl: icon("92eeef5d-43b5-1d4a-8d03-b3927a09034b"), abilities: ["Chokehold", "Interceptor", "Crosscut", "Evolution"] },
];

/** Quick lookup by name */
export const AGENT_MAP = new Map(AGENTS.map((a) => [a.name, a]));

/** Role colors for UI grouping */
export const ROLE_COLORS: Record<string, string> = {
  Duelist:    "#FF4655",
  Controller: "#8B5CF6",
  Initiator:  "#22D3EE",
  Sentinel:   "#4ADE80",
};
