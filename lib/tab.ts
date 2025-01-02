


export function ShortURL(url?: string): string {
  if (!url) return '';
  let s = url;
  const u = URL.parse(url);
  if (u?.origin && u?.origin !== 'null') {
    s = u?.origin
  }
  return s
}


export interface Flag {
  id: number;
  always_keep?: boolean;
}

export const DefaultFlags: Flag[] = [];
