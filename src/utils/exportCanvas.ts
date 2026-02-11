// ============================================================
// Canvas Export Utilities
// Export board to PNG with high quality
// ============================================================

import Konva from "konva";

export interface ExportOptions {
  filename?: string;
  scale?: number; // Multiplier for higher resolution (1 = native, 2 = 2x, etc.)
  quality?: number; // JPEG quality 0-1 (PNG ignores this)
  format?: "png" | "jpeg";
}

export function exportCanvasToPNG(
  stage: Konva.Stage,
  options: ExportOptions = {}
): void {
  const {
    filename = `VLTactic-strategy-${new Date().toISOString().slice(0, 10)}.png`,
    scale = 2, // 2x resolution for sharper export
    quality = 0.95,
    format = "png",
  } = options;

  try {
    // Get current viewport
    const currentScale = stage.scaleX();
    const currentX = stage.x();
    const currentY = stage.y();

    // Reset viewport to show full map
    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });

    // Export with higher pixel ratio for quality
    const dataURL = stage.toDataURL({
      pixelRatio: scale,
      mimeType: format === "jpeg" ? "image/jpeg" : "image/png",
      quality: format === "jpeg" ? quality : undefined,
    });

    // Restore original viewport
    stage.scale({ x: currentScale, y: currentScale });
    stage.position({ x: currentX, y: currentY });

    // Trigger download
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Failed to export canvas:", error);
    throw new Error("Export failed. Please try again.");
  }
}

export function copyCanvasToClipboard(stage: Konva.Stage): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Reset viewport
      const currentScale = stage.scaleX();
      const currentX = stage.x();
      const currentY = stage.y();
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: 0, y: 0 });

      // Convert to blob
      stage.toBlob({
        callback: (blob) => {
          if (!blob) {
            reject(new Error("Failed to create blob"));
            return;
          }

          // Copy to clipboard
          navigator.clipboard
            .write([
              new ClipboardItem({
                "image/png": blob,
              }),
            ])
            .then(() => {
              // Restore viewport
              stage.scale({ x: currentScale, y: currentScale });
              stage.position({ x: currentX, y: currentY });
              resolve();
            })
            .catch((err) => {
              // Restore viewport even on error
              stage.scale({ x: currentScale, y: currentScale });
              stage.position({ x: currentX, y: currentY });
              reject(err);
            });
        },
        pixelRatio: 2,
      });
    } catch (error) {
      reject(error);
    }
  });
}
