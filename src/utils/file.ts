export function formatFileSize(size: number): string {
  if (size >= 1048576) {
    return (size / 1048576).toFixed(2) + ' MB';
  } else if (size >= 1024) {
    return (size / 1024).toFixed(2) + ' kB';
  }
  return size + ' bytes';
}

export function blobToJson<T>(blob: Blob): Promise<T> {
  const reader = new FileReader();

  const promise = new Promise((resolve: (data: T) => void) => {
    reader.onload = () => {
      const data: T = JSON.parse(reader.result as string);
      resolve(data);
    };
  });

  reader.readAsText(blob);

  return promise;
}