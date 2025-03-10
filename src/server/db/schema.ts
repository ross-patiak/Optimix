import {
  text,
  singlestoreTable,
  bigint,
  json,
} from "drizzle-orm/singlestore-core";

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const users = singlestoreTable("users_table", {
  id: text("id").primaryKey(), // Clerk ID as primary key
  spotifyId: text("spotify_id"), // Spotify ID stored separately
  username: text("username"), // Spotify display name
});

export const savedMixes = singlestoreTable("saved_mixes", {
  id: text("id").primaryKey(), // Unique ID for the saved mix
  userId: text("user_id").notNull(), // Reference to the user who saved the mix
  name: text("name").notNull(), // Name of the mix
  playlistRatios: json("playlist_ratios").notNull(), // JSON object with playlist IDs and their ratios
  queueSize: text("queue_size").notNull(), // Size of the queue
  createdAt: bigint("created_at", { mode: "number" }).notNull(), // Timestamp when the mix was created
});
