import { MapDef } from "@/types";

// ============================================================
// Valorant Map Definitions
// Using official minimaps from valorant-api.com CDN
// rotation: -90 = rotate CCW 90° to orient horizontal maps vertically
//           (ATK left → ATK bottom, DEF right → DEF top) for tactical board standard
// Determined by comparing ATK/DEF spawn coordinates from API
// ============================================================

export const MAPS: MapDef[] = [
  {
    name: "ascent",
    displayName: "Ascent",
    imagePath: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/displayicon.png",
    width: 1024,
    height: 1024,
    // vertical: ATK(60,50) → DEF(1995,-9744) — already vertical
  },
  {
    name: "bind",
    displayName: "Bind",
    imagePath: "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: -90, // horizontal: ATK left → DEF right
  },
  {
    name: "haven",
    displayName: "Haven",
    imagePath: "https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/displayicon.png",
    width: 1024,
    height: 1024,
    // vertical: ATK(1741,-2642) → DEF(2946,-12714)
  },
  {
    name: "split",
    displayName: "Split",
    imagePath: "https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/displayicon.png",
    width: 1024,
    height: 1024,
    // vertical: ATK(1901,59) → DEF(2142,-8964)
  },
  {
    name: "icebox",
    displayName: "Icebox",
    imagePath: "https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/displayicon.png",
    width: 1024,
    height: 1024,
    // vertical: ATK(-3925,-4450) → DEF(-3750,7075)
  },
  {
    name: "breeze",
    displayName: "Breeze",
    imagePath: "https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: -90, // horizontal: ATK(-575,-450) → DEF(8900,3525)
  },
  {
    name: "fracture",
    displayName: "Fracture",
    imagePath: "https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: -90, // horizontal H-shape: ATK(4345,-948) → DEF(9156,-677)
  },
  {
    name: "pearl",
    displayName: "Pearl",
    imagePath: "https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: -90, // horizontal: ATK(-550,-600) → DEF(11092,378)
  },
  {
    name: "lotus",
    displayName: "Lotus",
    imagePath: "https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: -90, // horizontal: ATK(1401,777) → DEF(9686,1697)
  },
  {
    name: "sunset",
    displayName: "Sunset",
    imagePath: "https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/displayicon.png",
    width: 1024,
    height: 1024,
    rotation: -90, // horizontal: ATK(-6025,-400) → DEF(3805,-1989)
  },
  {
    name: "abyss",
    displayName: "Abyss",
    imagePath: "https://media.valorant-api.com/maps/224b0a95-48b9-f703-1bd8-67aca101a61f/displayicon.png",
    width: 1024,
    height: 1024,
    // vertical: ATK(950,4950) → DEF(950,-5275)
  },
  {
    name: "corrode",
    displayName: "Corrode",
    imagePath: "https://media.valorant-api.com/maps/1c18ab1f-420d-0d8b-71d0-77ad3c439115/displayicon.png",
    width: 1024,
    height: 1024,
    // vertical: ATK(-25,5675) → DEF(8,-5549) — determined from API callouts
  },
];

export const DEFAULT_MAP = MAPS[0]; // Ascent
