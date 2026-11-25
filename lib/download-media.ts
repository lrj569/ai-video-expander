export async function downloadMediaFile(url: string, filename: string, signal?: AbortSignal) {
  const response = await fetch(url, { mode: 'cors', signal });
  if (!response.ok) throw new Error(`Could not download media (${response.status}).`);

  const blob = await response.blob();
  if (signal?.aborted) throw new DOMException('Download cancelled.', 'AbortError');
  if (!blob.size) throw new Error('The download returned an empty file.');

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.append(link);
  try {
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}
