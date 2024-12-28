

export interface Stash {
  update_at: number;
  items: StashItem[];
}

export const DefaultStash: Stash = { update_at: 0, items: [] }

export interface StashItem {
  url: string;
  favicon_url: string;
  title: string;
  last_ts: number;
  count: number;
}
