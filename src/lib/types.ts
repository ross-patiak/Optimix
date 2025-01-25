export type Playlist = {
  id: string;
  name: string;
  tracks: Record<string, number>;
  owner: {
    id: string;
  };
};

export type Mix = {
  playlistRatios: Record<string, string>;
  queueSize: string;
};
