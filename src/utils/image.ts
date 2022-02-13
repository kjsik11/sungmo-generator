import Pica from 'pica';

export function downloadImage(src: string, filename: string): void {
  if (typeof window === 'undefined') {
    return console.error('Ensure you are trying to download within a browser.');
  }

  const downloadButton = document.createElement('a');
  downloadButton.href = src;
  downloadButton.download = filename;
  downloadButton.click();

  downloadButton.remove();
}

export async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const pica = Pica();

  const blob = await pica.toBlob(canvas, 'image/png');

  return blob;
}
