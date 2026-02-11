"use client";

import React from "react";
import Image from "next/image";

// ============================================================
// CDNImage — Optimized Image component for external CDN URLs
// Wraps next/image with custom loader for valorant-api.com
// ============================================================

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

// Custom loader for cdn URLs (bypasses Next.js default optimization)
const cdnLoader = ({ src }: { src: string }) => src;

export function CDNImage({ src, alt, width, height, priority, className, ...props }: Props) {
  return (
    <Image
      loader={cdnLoader}
      src={src}
      alt={alt}
      width={width || 24}
      height={height || 24}
      priority={priority}
      className={className}
      unoptimized // For external CDN compatibility
      {...props}
    />
  );
}
