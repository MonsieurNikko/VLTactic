# AI Agent Guidelines & Coding Standards

This document serves as the **Standard Operating Procedure (SOP)** for any AI Agent working on this codebase. Follow these rules strictly to ensure consistency, performance, and token efficiency.

## 1. Token Optimization & Efficiency
- **Do not read unnecessary files:** Only `view_file` what is relevant to the immediate task.
- **Read `project_context.md` first:** Before proposing major architectural changes.
- **Concise Summaries:** When updating `task.md` or writing commit messages, be brief.
- **Sequential Tool Use:** If a tool fails, stop and analyze. Do not blindly retry in a loop.

## 2. Coding Standards (Strict)
- **Framework:** Next.js (App Router).
- **Language:** TypeScript.
- **Canvas Logic:** All Konva components must be client-side (`"use client"`).
- **State Management:** Use `Zustand` or React Context for local state; `Supabase Realtime` for shared state.
- **Styling:** Tailwind CSS (utility-first). Avoid custom CSS files unless for complex animations.

## 3. "The Tree System" Protocol
When implementing new map features or logic:
1.  **Check `project_context.md`:** Ensure you understand the zone mapping concept.
2.  **No Magic Strings:** Use constants for Zone Names (e.g., `ZONE_A_MAIN`).
3.  **Geometry First:** Always calculate position logic based on the underlying polygon data, not visual pixels.

## 4. Documentation Strategy
- **Update `task.md`:** Keep it current. It is the single source of truth for progress.
- **Comments:** Comment complex geometry math (e.g., "Point-in-polygon algorithm").
- **Artifacts:** Use artifacts for large plans or research. Do not clutter the chat history.

## 5. Workflow for New Features
1.  **Plan:** Check `task.md` and `implementation_plan.md`.
2.  **Context:** Read relevant files.
3.  **Implement:** Write code in small, testable chunks.
4.  **Verify:** If possible, create a small test or script to verify logic (especially for the geometry math).
