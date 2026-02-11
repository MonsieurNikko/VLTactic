// ============================================================
// Ability classification for tactical board utility icons
// Maps ability names → tactical category + CDN icon URLs
// ============================================================

import { AGENT_MAP } from "./agents";

// Ability → API slot mapping (from Valorant API structure)
const ABILITY_SLOT_MAP: Record<string, string> = {
  // Slots từ abilities[] array trong valorant-api.com response:
  // ability1, ability2, grenade, ultimate, passive
  
  // Map ability names → slots (lowercase for URL construction)
  // NOTE: Some abilities không có icon (như passive hoặc signature traits)
  
  // Jett
  "Cloudburst": "grenade", "Updraft": "ability1", "Tailwind": "ability2", "Blade Storm": "ultimate",
  
  // Reyna
  "Leer": "grenade", "Devour": "ability1", "Dismiss": "ability2", "Empress": "ultimate",
  
  // Phoenix
  "Blaze": "grenade", "Curveball": "ability2", "Hot Hands": "ability1", "Run It Back": "ultimate",
  
  // Raze
  "Boom Bot": "grenade", "Blast Pack": "ability1", "Paint Shells": "ability2", "Showstopper": "ultimate",
  
  // Yoru  
  "Fakeout": "grenade", "Blindside": "ability1", "Gatecrash": "ability2", "Dimensional Drift": "ultimate",
  
  // Neon
  "Fast Lane": "grenade", "Relay Bolt": "ability1", "High Gear": "ability2", "Overdrive": "ultimate",
  
  // Iso
  "Undercut": "ability1", "Double Tap": "ability2", "Contingency": "grenade", "Kill Contract": "ultimate",
  
  // Waylay
  "Saturate": "grenade", "Lightspeed": "ability1", "Refract": "ability2", "Convergent Paths": "ultimate",
  
  // Brimstone
  "Stim Beacon": "grenade", "Incendiary": "ability1", "Sky Smoke": "ability2", "Orbital Strike": "ultimate",
  
  // Omen
  "Shrouded Step": "grenade", "Paranoia": "ability1", "Dark Cover": "ability2", "From the Shadows": "ultimate",
  
  // Viper
  "Snake Bite": "grenade", "Poison Cloud": "ability1", "Toxic Screen": "ability2", "Viper's Pit": "ultimate",
  
  // Astra
  "Gravity Well": "grenade", "Nova Pulse": "ability1", "Nebula": "ability2", "Cosmic Divide": "ultimate",
  
  // Harbor
  "Storm Surge": "grenade", "Cove": "ability2", "High Tide": "ability1", "Reckoning": "ultimate",
  
  // Clove
  "Pick-Me-Up": "grenade", "Meddle": "ability1", "Ruse": "ability2", "Not Dead Yet": "ultimate",
  
  // Sova
  "Owl Drone": "grenade", "Shock Bolt": "ability1", "Recon Bolt": "ability2", "Hunter's Fury": "ultimate",
  
  // Breach
  "Aftershock": "grenade", "Flashpoint": "ability1", "Fault Line": "ability2", "Rolling Thunder": "ultimate",
  
  // Skye
  "Trailblazer": "ability1", "Guiding Light": "ability2", "Regrowth": "grenade", "Seekers": "ultimate",
  
  // KAY/O
  "FRAG/ment": "grenade", "FLASH/drive": "ability1", "ZERO/point": "ability2", "NULL/cmd": "ultimate",
  
  // Fade
  "Prowler": "grenade", "Seize": "ability1", "Haunt": "ability2", "Nightfall": "ultimate",
  
  // Gekko
  "Mosh Pit": "grenade", "Wingman": "ability1", "Dizzy": "ability2", "Thrash": "ultimate",
  
  // Tejo
  "Special Delivery": "ability1", "Guided Salvo": "ability2", "Stealth Drone": "grenade", "Armageddon": "ultimate",
  
  // Sage
  "Barrier Orb": "grenade", "Slow Orb": "ability1", "Healing Orb": "ability2", "Resurrection": "ultimate",
  
  // Cypher
  "Trapwire": "grenade", "Cyber Cage": "ability1", "Spycam": "ability2", "Neural Theft": "ultimate",
  
  // Killjoy
  "Nanoswarm": "grenade", "Alarmbot": "ability1", "Turret": "ability2", "Lockdown": "ultimate",
  
  // Chamber
  "Trademark": "grenade", "Headhunter": "ability1", "Rendezvous": "ability2", "Tour De Force": "ultimate",
  
  // Deadlock
  "GravNet": "ability2", "Sonic Sensor": "ability1", "Barrier Mesh": "grenade", "Annihilation": "ultimate",
  
  // Vyse
  "Shear": "ability1", "Arc Rose": "ability2", "Razorvine": "grenade", "Steel Garden": "ultimate",
  
  // Veto
  "Chokehold": "ability1", "Interceptor": "ability2", "Crosscut": "grenade", "Evolution": "ultimate",
};

export function getAbilityIconURL(agentName: string, abilityName: string): string | null {
  const agent = AGENT_MAP.get(agentName);
  if (!agent || !agent.uuid) return null;
  
  const slot = ABILITY_SLOT_MAP[abilityName];
  if (!slot) return null;
  
  return `https://media.valorant-api.com/agents/${agent.uuid}/abilities/${slot}/displayicon.png`;
}

export const ABILITY_TYPE_MAP: Record<string, string> = {
  // ── Smoke (vision blocking) ───────────────────────────────
  "Cloudburst": "Smoke", "Dark Cover": "Smoke", "Sky Smoke": "Smoke",
  "Poison Cloud": "Smoke", "Nebula": "Smoke", "Cove": "Smoke",
  "Ruse": "Smoke", "Viper's Pit": "Smoke",

  // ── Flash (blind / nearsight) ─────────────────────────────
  "Curveball": "Flash", "Leer": "Flash", "Blindside": "Flash",
  "BLINDSIDE": "Flash", "Guiding Light": "Flash",
  "FLASH/DRIVE": "Flash", "FLASH/drive": "Flash",
  "Flashpoint": "Flash", "Dizzy": "Flash", "Paranoia": "Flash",
  "Meddle": "Flash", "Arc Rose": "Flash", "Nightfall": "Flash",

  // ── Wall (barriers / screens) ─────────────────────────────
  "Blaze": "Wall", "Fast Lane": "Wall", "Toxic Screen": "Wall",
  "Barrier Orb": "Wall", "Contingency": "Wall", "High Tide": "Wall",
  "Cosmic Divide": "Wall", "Barrier Mesh": "Wall",

  // ── Molly (area damage / zone damage) ─────────────────────
  "Snake Bite": "Molly", "Incendiary": "Molly", "Hot Hands": "Molly",
  "Paint Shells": "Molly", "Mosh Pit": "Molly",
  "FRAG/MENT": "Molly", "FRAG/ment": "Molly",
  "Aftershock": "Molly", "Nanoswarm": "Molly",
  "Storm Surge": "Molly", "Razorvine": "Molly",
  "Orbital Strike": "Molly", "Shock Bolt": "Molly",
  "Boom Bot": "Molly", "Blast Pack": "Molly",
  "Showstopper": "Molly", "Guided Salvo": "Molly",
  "Armageddon": "Molly", "Hunter's Fury": "Molly",

  // ── Recon (information gathering) ─────────────────────────
  "Recon Bolt": "Recon", "Owl Drone": "Recon", "Spycam": "Recon",
  "Haunt": "Recon", "Trailblazer": "Recon", "Wingman": "Recon",
  "Stealth Drone": "Recon", "FAKEOUT": "Recon", "Fakeout": "Recon",
  "Prowler": "Recon", "Neural Theft": "Recon", "Seekers": "Recon",
  "TURRET": "Recon", "Turret": "Recon",

  // ── Trap (area control / CC / stun / slow) ────────────────
  "Trapwire": "Trap", "Cyber Cage": "Trap",
  "Alarmbot": "Trap", "ALARMBOT": "Trap",
  "Trademark": "Trap", "GravNet": "Trap",
  "Seize": "Trap", "Gravity Well": "Trap",
  "Slow Orb": "Trap", "Shear": "Trap", "Chokehold": "Trap",
  "Fault Line": "Trap", "Rolling Thunder": "Trap",
  "Relay Bolt": "Trap", "Nova Pulse": "Trap",
  "Special Delivery": "Trap", "Saturate": "Trap",
  "Sonic Sensor": "Trap", "Interceptor": "Trap",
  "Lockdown": "Trap", "Annihilation": "Trap",

  // ── Heal (restoration / sustain) ───────────────────────────
  "Healing Orb": "Heal", "Regrowth": "Heal",
  "Devour": "Heal", "Pick-Me-Up": "Heal",
  "Resurrection": "Heal",
};

export function getAbilityType(abilityName: string): string {
  return ABILITY_TYPE_MAP[abilityName] ?? "default";
}

export const UTIL_TYPE_COLORS: Record<string, string> = {
  Smoke: "#6366f1",
  Flash: "#fbbf24",
  Wall: "#22d3ee",
  Molly: "#ef4444",
  Recon: "#a78bfa",
  Trap: "#f97316",
  Heal: "#34d399",
  default: "#94a3b8",
};

export const UTILITY_STYLES: Record<string, { symbol: string; fillColor: string }> = {
  Smoke: { symbol: "☁", fillColor: "#6366f1" },
  Flash: { symbol: "⚡", fillColor: "#fbbf24" },
  Wall:  { symbol: "▬", fillColor: "#22d3ee" },
  Molly: { symbol: "🔥", fillColor: "#ef4444" },
  Recon: { symbol: "◎", fillColor: "#a78bfa" },
  Trap:  { symbol: "⚠", fillColor: "#f97316" },
  Heal:  { symbol: "+", fillColor: "#34d399" },
  default: { symbol: "✦", fillColor: "#94a3b8" },
};
