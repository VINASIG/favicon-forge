import { fitBounds, validateDimensions } from './generator.ts';
import type { Bounds } from './generator.ts';

function context(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const result = canvas.getContext('2d', { willReadFrequently: true });
  if (!result) throw new Error('Canvas is unavailable in this browser.');
  return result;
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          'This image could not be read. Try another PNG, JPG, WebP or SVG file.',
        ),
      );
    };
    image.src = url;
  });
}

export function rasterizeSource(image: HTMLImageElement): HTMLCanvasElement {
  validateDimensions(image.naturalWidth, image.naturalHeight);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  context(canvas).drawImage(image, 0, 0);
  return canvas;
}

export function detectSourceBounds(canvas: HTMLCanvasElement): Bounds {
  const { width, height } = canvas;
  const pixels = context(canvas).getImageData(0, 0, width, height).data;
  let left = width,
    top = height,
    right = -1,
    bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if ((pixels[(y * width + x) * 4 + 3] ?? 0) > 8) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
  }
  if (right < left || bottom < top) return { x: 0, y: 0, width, height };
  const margin = Math.max(
    2,
    Math.round(Math.max(right - left + 1, bottom - top + 1) * 0.08),
  );
  const x = Math.max(0, left - margin),
    y = Math.max(0, top - margin);
  return {
    x,
    y,
    width: Math.min(width, right + margin + 1) - x,
    height: Math.min(height, bottom + margin + 1) - y,
  };
}

export function createIconCanvas(
  source: HTMLCanvasElement,
  bounds: Bounds,
  size: number,
  maskable = false,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = context(canvas);
  if (maskable) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
  }
  ctx.imageSmoothingEnabled = false;
  const target = fitBounds(size, bounds, maskable);
  ctx.drawImage(
    source,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    target.x,
    target.y,
    target.width,
    target.height,
  );
  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Could not create a PNG.'));
    }, 'image/png');
  });
}

export function createPreviewImage(
  source: HTMLCanvasElement,
  bounds: Bounds,
  size: number,
  displaySize: number,
): HTMLImageElement {
  const output = createIconCanvas(source, bounds, size);
  const preview = document.createElement('canvas');
  preview.width = displaySize;
  preview.height = displaySize;
  const ctx = context(preview);
  ctx.imageSmoothingEnabled = false;
  const scale = displaySize / size;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.drawImage(output, 0, 0);
  const image = document.createElement('img');
  image.src = preview.toDataURL('image/png');
  image.width = displaySize;
  image.height = displaySize;
  image.alt = `Preview favicon ${String(size)}x${String(size)}`;
  return image;
}
