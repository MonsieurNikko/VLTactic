import { MapDef } from "@/types";

// ============================================================
// Valorant Map Definitions
// Using official minimaps from valorant-api.com CDN
// Standard tactical board orientation: ATK spawn at BOTTOM, DEF spawn at TOP
//
// rotation determines how to transform the API minimap:
// - "vertical" maps (ATK top→bottom in API): need 180° flip
// - "horizontal" maps (ATK left→right in API): need -90° CCW rotation
// ============================================================

export const MAPS: MapDef[] = [
  {
    name: "ascent",
    displayName: "Ascent",
    imagePath: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: 180, // API has ATK at top, need flip → ATK at bottom
  },
  {
    name: "bind",
    displayName: "Bind",
    imagePath: "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: -90, // horizontal: ATK left → rotate CCW → ATK at bottom
  },
  {
    name: "haven",
    displayName: "Haven",
    imagePath: "https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: 180, // API has ATK at top, need flip → ATK at bottom
  },
  {
    name: "split",
    displayName: "Split",
    imagePath: "https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: 180, // API has ATK at top, need flip → ATK at bottom
  },
  {
    name: "icebox",
    displayName: "Icebox",
    imagePath: "https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: 180, // flip to match standard tactical orientation
  },
  {
    name: "breeze",
    displayName: "Breeze",
    imagePath: "https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: -90, // horizontal: ATK left → rotate CCW → ATK at bottom
  },
  {
    name: "fracture",
    displayName: "Fracture",
    imagePath: "https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: -90, // horizontal H-shape: ATK left → rotate CCW → ATK at bottom
  },
  {
    name: "pearl",
    displayName: "Pearl",
    imagePath: "https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: -90, // horizontal: ATK left → rotate CCW → ATK at bottom
  },
  {
    name: "lotus",
    displayName: "Lotus",
    imagePath: "https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: -90, // horizontal: ATK left → rotate CCW → ATK at bottom
  },
  {
    name: "sunset",
    displayName: "Sunset",
    imagePath: "https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: -90, // horizontal: ATK left → rotate CCW → ATK at bottom
  },
  {
    name: "abyss",
    displayName: "Abyss",
    imagePath: "https://media.valorant-api.com/maps/224b0a95-48b9-f703-1bd8-67aca101a61f/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: 180, // flip to match standard tactical orientation
  },
  {
    name: "corrode",
    displayName: "Corrode",
    imagePath: "https://media.valorant-api.com/maps/1c18ab1f-420d-0d8b-71d0-77ad3c439115/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: 180, // flip to match standard tactical orientation
  },
];

export const DEFAULT_MAP = MAPS[0]; // Ascent
