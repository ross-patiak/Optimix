export type Playlist = {
  id: string;
  name: string;
  tracks: Record<string, number>;
};

export type Mix = {
  playlistRatios: Record<string, string>;
};
