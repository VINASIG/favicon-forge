import JSZip from 'jszip';
import {
  createIco,
  errorMessage,
  fileNameToSiteName,
  formatBytes,
  makeManifest,
  makeReadme,
  makeSnippet,
  OUTPUT_SIZES,
  PREVIEW_SIZE,
  validateFile,
} from '../lib/generator.ts';
import type { Bounds, IcoEntry } from '../lib/generator.ts';
import {
  canvasToBlob,
  createIconCanvas,
  createPreviewImage,
  detectSourceBounds,
  loadImage,
  rasterizeSource,
} from '../lib/images.ts';

interface Source {
  file: File;
  canvas: HTMLCanvasElement;
  bounds: Bounds;
}

function required<T extends Element>(
  selector: string,
  constructor: new () => T,
): T {
  const element = document.querySelector(selector);
  if (!(element instanceof constructor))
    throw new Error(`Missing generator element: ${selector}`);
  return element;
}

const dropZone = required('#drop-zone', HTMLButtonElement);
const fileInput = required('#file-input', HTMLInputElement);
const dropTitle = required('#drop-title', HTMLSpanElement);
const dropSubtitle = required('#drop-subtitle', HTMLSpanElement);
const error = required('#error-message', HTMLParagraphElement);
const resultPanel = required('#result-panel', HTMLDivElement);
const sourcePreview = required('#source-preview', HTMLImageElement);
const fileMeta = required('#file-meta', HTMLDivElement);
const previewGrid = required('#preview-grid', HTMLDivElement);
const downloadButton = required('#download-button', HTMLButtonElement);
const downloadLabel = required('#download-label', HTMLSpanElement);
const downloadIcon = required('.download-icon', SVGSVGElement);
const downloadSpinner = required('.spinner', HTMLSpanElement);
let current: Source | null = null;
let selection = 0;
let reading = false;
let packaging = false;

function showError(message: string): void {
  error.textContent = message;
  error.hidden = false;
}
function clearError(): void {
  error.hidden = true;
  error.textContent = '';
}

function readingState(active: boolean): void {
  reading = active;
  downloadButton.disabled = active || current === null;
  if (active) {
    dropZone.setAttribute('aria-busy', 'true');
    dropSubtitle.textContent =
      'Reading your image. You can choose another logo.';
  } else {
    dropZone.removeAttribute('aria-busy');
    dropSubtitle.textContent = current
      ? 'PNG, JPG, WebP or SVG. Up to 10 MB. Choose a new file to replace this logo.'
      : 'PNG, JPG, WebP or SVG. Up to 10 MB. 512 × 512 or larger recommended.';
  }
}

function renderPreviews(source: Source): void {
  previewGrid.replaceChildren();
  for (const size of OUTPUT_SIZES) {
    const card = document.createElement('div');
    card.className = 'preview-card';
    const label = document.createElement('span');
    label.textContent = `${String(size)}×${String(size)}`;
    const frame = document.createElement('div');
    frame.className = `icon-frame size-${String(size)}`;
    frame.append(
      createPreviewImage(source.canvas, source.bounds, size, PREVIEW_SIZE),
    );
    card.append(frame, label);
    previewGrid.append(card);
  }
}

async function handleFile(file: File | undefined): Promise<void> {
  if (!file || packaging) return;
  const request = ++selection;
  clearError();
  try {
    validateFile(file);
    readingState(true);
    const image = await loadImage(file);
    if (request !== selection) return;
    const canvas = rasterizeSource(image);
    const source = { file, canvas, bounds: detectSourceBounds(canvas) };
    sourcePreview.src = createIconCanvas(canvas, source.bounds, 256).toDataURL(
      'image/png',
    );
    sourcePreview.alt = `Logo ${file.name}`;
    fileMeta.textContent = `${file.name} · ${String(canvas.width)}×${String(canvas.height)} · ${formatBytes(file.size)}`;
    renderPreviews(source);
    current = source;
    resultPanel.hidden = false;
    dropZone.classList.add('has-file');
    dropZone.setAttribute('aria-label', 'Choose or drop another logo');
    dropTitle.textContent = 'Drop or choose another logo';
  } catch (reason) {
    if (request === selection) showError(errorMessage(reason));
  } finally {
    if (request === selection) readingState(false);
  }
}

async function buildZip(source: Source): Promise<Blob> {
  const icons = new Map<number, Blob>();
  for (const size of OUTPUT_SIZES)
    icons.set(
      size,
      await canvasToBlob(createIconCanvas(source.canvas, source.bounds, size)),
    );
  function icon(size: number): Blob {
    const blob = icons.get(size);
    if (!blob) throw new Error(`Missing generated icon: ${String(size)}`);
    return blob;
  }
  const entries: IcoEntry[] = [];
  for (const size of [16, 32, 48])
    entries.push({
      size,
      bytes: new Uint8Array(await icon(size).arrayBuffer()),
    });
  const zip = new JSZip();
  zip.file('favicon.ico', createIco(entries));
  zip.file('favicon-16x16.png', icon(16));
  zip.file('favicon-32x32.png', icon(32));
  zip.file('apple-touch-icon.png', icon(180));
  zip.file('android-chrome-192x192.png', icon(192));
  zip.file('android-chrome-512x512.png', icon(512));
  zip.file(
    'android-chrome-512x512-maskable.png',
    await canvasToBlob(
      createIconCanvas(source.canvas, source.bounds, 512, true),
    ),
  );
  zip.file(
    'site.webmanifest',
    makeManifest(fileNameToSiteName(source.file.name)),
  );
  zip.file('favicon-snippet.html', makeSnippet());
  zip.file('README.txt', makeReadme());
  return zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

async function downloadPackage(): Promise<void> {
  const source = current;
  if (!source || reading || packaging) return;
  clearError();
  packaging = true;
  downloadButton.disabled = true;
  dropZone.disabled = true;
  downloadButton.setAttribute('aria-busy', 'true');
  downloadButton.classList.add('is-loading');
  downloadLabel.textContent = 'Creating package';
  downloadIcon.setAttribute('hidden', '');
  downloadSpinner.hidden = false;
  try {
    const url = URL.createObjectURL(await buildZip(source));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'favicon-package.zip';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    // Allow the browser to consume the download before releasing its object URL.
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (reason) {
    showError(`Could not create the ZIP file: ${errorMessage(reason)}`);
  } finally {
    packaging = false;
    downloadButton.disabled = false;
    dropZone.disabled = false;
    downloadButton.removeAttribute('aria-busy');
    downloadButton.classList.remove('is-loading');
    downloadLabel.textContent = 'Download package';
    downloadIcon.removeAttribute('hidden');
    downloadSpinner.hidden = true;
  }
}

dropZone.addEventListener('click', () => {
  fileInput.value = '';
  fileInput.click();
});
fileInput.addEventListener('change', () => {
  void handleFile(fileInput.files?.[0]);
});
downloadButton.addEventListener('click', () => {
  void downloadPackage();
});
for (const eventName of ['dragenter', 'dragover'])
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    if (!packaging) dropZone.classList.add('is-dragging');
  });
for (const eventName of ['dragleave', 'drop'])
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove('is-dragging');
  });
dropZone.addEventListener('drop', (event) => {
  if (!dropZone.disabled) void handleFile(event.dataTransfer?.files[0]);
});
