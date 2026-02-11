// ============================================================
// Ability classification for tactical board utility icons
// Maps ability names → tactical category for icon styling
// ============================================================

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
