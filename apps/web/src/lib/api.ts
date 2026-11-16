export const API_BASE_URL: string =
  typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? ''
    : 'http://localhost:4000';

export const getApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export const getWsUrl = (): string => {
  if (typeof window === 'undefined') return 'ws://localhost:4001';
  if (window.location.hostname === 'localhost') return 'ws://localhost:4001';
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws/tactics`;
};

export async function uploadFile(file: File): Promise<{ success: boolean; url: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(async () => {
      return { message: `خطای سرور (${res.status} ${res.statusText || 'Upload Error'})` };
    });
    throw new Error(errorData.message || 'خطا در بارگذاری فایل');
  }

  const data = await res.json();
  // If the returned URL is relative (e.g. /uploads/...), prepend API_BASE_URL for absolute access if needed
  const finalUrl = data.url.startsWith('http') ? data.url : `${API_BASE_URL}${data.url}`;
  return { ...data, url: finalUrl };
}
