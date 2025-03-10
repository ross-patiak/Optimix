import { text, singlestoreTable, bigint } from "drizzle-orm/singlestore-core";

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const users = singlestoreTable("users_table", {
  id: text("id").primaryKey(), // Clerk ID as primary key
  spotifyId: text("spotify_id"), // Spotify ID stored separately
  username: text("username"), // Spotify display name
});
