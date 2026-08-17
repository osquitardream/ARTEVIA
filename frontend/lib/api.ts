const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('artevia_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Error en la petición al servidor');
  }

  return data;
}

/**
 * Converts a local file (from <input type="file">) to a Base64 data URL string.
 * The resulting string is stored directly in the `image` field of the database record.
 * No external upload service is required.
 *
 * @param file - The File object from an <input type="file"> element
 * @param maxSizeMB - Optional max allowed file size in MB (default 8MB)
 * @returns Promise<string> - A base64 data URL (e.g. "data:image/jpeg;base64,...")
 */
export function convertImageToBase64(file: File, maxSizeMB = 8): Promise<string> {
  return new Promise((resolve, reject) => {
    // Size validation
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      reject(new Error(`La imagen es demasiado grande. El máximo permitido es ${maxSizeMB}MB.`));
      return;
    }

    // Type validation
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo debe ser una imagen (JPG, PNG, WEBP, etc).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result); // "data:image/jpeg;base64,/9j/4AAQ..."
      } else {
        reject(new Error('No se pudo convertir la imagen.'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Converts multiple local files to an array of Base64 data URL strings.
 */
export async function convertMultipleImagesToBase64(files: FileList | File[], maxSizeMB = 8): Promise<string[]> {
  const fileArray = Array.from(files);
  const results = await Promise.all(fileArray.map((file) => convertImageToBase64(file, maxSizeMB)));
  return results;
}
