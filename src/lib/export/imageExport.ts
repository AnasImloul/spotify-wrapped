import html2canvas from 'html2canvas';

/**
 * Convert a DOM element to a canvas
 */
export async function elementToCanvas(
  element: HTMLElement,
  options?: Partial<{
    scale: number;
    backgroundColor: string;
    width: number;
    height: number;
  }>
): Promise<HTMLCanvasElement> {
  // Clone the element to avoid capturing unwanted parts
  const clone = element.cloneNode(true) as HTMLElement;

  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = `${element.offsetWidth}px`;
  container.style.height = `${element.offsetHeight}px`;
  container.style.overflow = 'hidden';
  container.style.zIndex = '-9999';
  container.style.pointerEvents = 'none';

  // Apply the same computed styles to the clone
  const computedStyle = window.getComputedStyle(element);
  clone.style.width = `${element.offsetWidth}px`;
  clone.style.height = `${element.offsetHeight}px`;
  clone.style.margin = '0';
  clone.style.padding = computedStyle.padding;

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(clone, {
      scale: options?.scale || 2,
      backgroundColor: options?.backgroundColor || '#000000',
      width: options?.width || element.offsetWidth,
      height: options?.height || element.offsetHeight,
      useCORS: true,
      allowTaint: true,
      logging: false,
      foreignObjectRendering: true,
      imageTimeout: 0,
    });

    return canvas;
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}

/**
 * Convert canvas to blob
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = 'image/png',
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      type,
      quality
    );
  });
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export a DOM element as an image file
 */
export async function exportElementAsImage(
  element: HTMLElement,
  filename: string,
  options?: {
    scale?: number;
    format?: 'png' | 'jpeg';
    quality?: number;
  }
): Promise<void> {
  const canvas = await elementToCanvas(element, { scale: options?.scale || 2 });
  const format = options?.format || 'png';
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const blob = await canvasToBlob(canvas, mimeType, options?.quality || 0.95);

  const fullFilename = filename.endsWith(`.${format}`) ? filename : `${filename}.${format}`;

  downloadBlob(blob, fullFilename);
}

/**
 * Get data URL from element
 */
export async function elementToDataURL(
  element: HTMLElement,
  options?: {
    scale?: number;
    format?: 'png' | 'jpeg';
    quality?: number;
  }
): Promise<string> {
  const canvas = await elementToCanvas(element, { scale: options?.scale || 2 });
  const format = options?.format || 'png';
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  return canvas.toDataURL(mimeType, options?.quality || 0.95);
}
