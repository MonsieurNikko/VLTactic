"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/ui/Sidebar";
import Toolbar from "@/components/ui/Toolbar";
import type Konva from "konva";

// Konva.js requires browser APIs → dynamic import with ssr: false
const MapBoard = dynamic(() => import("@/components/board/MapBoard"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-neutral-950 flex items-center justify-center">
      <div className="text-neutral-500 text-sm animate-pulse">Loading board...</div>
    </div>
  ),
});

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const stageRef = useRef<Konva.Stage>(null);

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-950 text-white overflow-hidden">
      <Toolbar stageRef={stageRef} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop: always visible. Mobile: toggleable overlay */}
        <div
          className={`${
            sidebarOpen ? "flex absolute inset-y-0 left-0 z-30" : "hidden"
          } md:flex md:relative md:z-auto`}
        >
          <Sidebar />
        </div>
        <MapBoard stageRefFromParent={stageRef} />
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute top-2 left-2 z-20 w-9 h-9 bg-neutral-800/90 backdrop-blur border border-neutral-700 rounded-lg flex items-center justify-center text-neutral-300 hover:bg-neutral-700 transition-colors shadow-lg"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>
    </div>
  );
}
