export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 16_000_000;
export const OUTPUT_SIZES = [16, 32, 48, 180, 192, 512] as const;
export const PREVIEW_SIZE = 80;

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IcoEntry {
  size: number;
  bytes: Uint8Array;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'An unexpected error occurred.';
}

export function validateFile(file: { type: string; size: number }): void {
  if (!file.type.startsWith('image/'))
    throw new Error('Please choose an image file.');
  if (
    !['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(
      file.type,
    )
  )
    throw new Error('Please choose a PNG, JPG, WebP or SVG image.');
  if (file.size > MAX_FILE_SIZE)
    throw new Error(
      'That file is too large. Please choose an image smaller than 10 MB.',
    );
}

export function validateDimensions(width: number, height: number): void {
  if (
    !Number.isSafeInteger(width) ||
    !Number.isSafeInteger(height) ||
    width <= 0 ||
    height <= 0
  )
    throw new Error(
      'This image has no readable dimensions. Try another image.',
    );
  if (width * height > MAX_IMAGE_PIXELS)
    throw new Error(
      'This image has too many pixels. Choose an image with at most 16 million pixels.',
    );
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${String(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fileNameToSiteName(fileName: string): string {
  return (
    fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || 'My Website'
  );
}

export function fitBounds(
  size: number,
  bounds: Bounds,
  maskable = false,
): Bounds {
  if (
    !Number.isInteger(size) ||
    size < 1 ||
    (maskable && size < 16) ||
    !Number.isFinite(bounds.width) ||
    !Number.isFinite(bounds.height) ||
    bounds.width <= 0 ||
    bounds.height <= 0
  )
    throw new Error('Invalid icon dimensions.');
  // The maskable safe zone is a centered circle with radius 40% of the icon width.
  const scale = maskable
    ? (size * 0.8 - 2) / Math.hypot(bounds.width, bounds.height)
    : Math.min(size / bounds.width, size / bounds.height);
  const round = maskable ? Math.floor : Math.round;
  const width = Math.max(1, round(bounds.width * scale));
  const height = Math.max(1, round(bounds.height * scale));
  return {
    x: Math.floor((size - width) / 2),
    y: Math.floor((size - height) / 2),
    width,
    height,
  };
}

export function createIco(entries: readonly IcoEntry[]): Blob {
  if (
    entries.length === 0 ||
    entries.length > 256 ||
    entries.some(
      (entry) =>
        !Number.isInteger(entry.size) ||
        entry.size < 1 ||
        entry.size > 256 ||
        entry.bytes.length === 0,
    )
  )
    throw new Error('Invalid ICO entries.');
  const headerSize = 6;
  const directoryEntrySize = 16;
  const dataOffset = headerSize + directoryEntrySize * entries.length;
  const totalSize =
    dataOffset + entries.reduce((sum, entry) => sum + entry.bytes.length, 0);
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, entries.length, true);
  let offset = dataOffset;
  entries.forEach((entry, index) => {
    const directoryOffset = headerSize + index * directoryEntrySize;
    view.setUint8(directoryOffset, entry.size === 256 ? 0 : entry.size);
    view.setUint8(directoryOffset + 1, entry.size === 256 ? 0 : entry.size);
    view.setUint8(directoryOffset + 2, 0);
    view.setUint8(directoryOffset + 3, 0);
    view.setUint16(directoryOffset + 4, 1, true);
    view.setUint16(directoryOffset + 6, 32, true);
    view.setUint32(directoryOffset + 8, entry.bytes.length, true);
    view.setUint32(directoryOffset + 12, offset, true);
    bytes.set(entry.bytes, offset);
    offset += entry.bytes.length;
  });
  return new Blob([buffer], { type: 'image/x-icon' });
}

export function makeManifest(siteName: string): string {
  return JSON.stringify(
    {
      name: siteName,
      short_name: siteName.slice(0, 20),
      start_url: './',
      scope: './',
      display: 'standalone',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      icons: [
        {
          src: './android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: './android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: './android-chrome-512x512-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    null,
    2,
  );
}

export function makeSnippet(): string {
  return `<!-- Generated with VINASIG Favicon Forge. Copy this into your <head>. -->
<link rel="icon" href="./favicon-32x32.png" type="image/png" sizes="32x32">
<link rel="icon" href="./favicon-16x16.png" type="image/png" sizes="16x16">
<link rel="icon" href="./favicon.ico" type="image/x-icon">
<link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png">
<link rel="manifest" href="./site.webmanifest">
<meta name="theme-color" content="#ffffff">`;
}

export function makeReadme(): string {
  return `VINASIG Favicon Forge\nhttps://github.com/VINASIG/favicon-forge\n\n1. Copy the icon files and site.webmanifest into your site's public folder, or next to index.html.\n2. Copy favicon-snippet.html into your page <head>. Adjust the paths if your page and icons are in different folders.\n3. Edit the site name, theme color and start URL in site.webmanifest for your website, then build and deploy.\n\nThe maskable icon uses a white background and keeps the logo inside the maskable safe zone.\nGenerated locally in your browser. The source logo was not uploaded.\n`;
}
