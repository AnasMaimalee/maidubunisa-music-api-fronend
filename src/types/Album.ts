export interface Album {
  id: string;
  title: string;
  artist?: string;
  release_date?: string;
  cover_url?: string | null;
}
