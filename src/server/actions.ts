"use server";
import { currentUser, clerkClient, auth } from "@clerk/nextjs/server";
import type { Mix } from "@/lib/types";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
/*eslint-disable*/
export const getUser = async () => {
  const { userId } = auth();

  if (userId != null) {
    const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
      userId,
      "oauth_spotify",
    );

    const accessToken = clerkResponse.data[0]?.token;
    let data: any;

    try {
      const spotifyUser = await fetch(`https://api.spotify.com/v1/me/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: AbortSignal.timeout(4000),
      });

      // Check if the fetch request resolved before the timeout
      if (spotifyUser instanceof Response) {
        //eslint-disable-next-line
        data = await spotifyUser.json(); // or response.text(), response.blob(), etc.

        // Save user to database if they don't exist
        if (data && data.id) {
          // Check if user exists by Clerk ID
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.id, userId));

          if (!existingUser.length) {
            // User doesn't exist, create new user
            await db.insert(users).values({
              id: userId, // Use Clerk ID as primary key
              spotifyId: data.id, // Store Spotify ID in spotifyId field
              username: data.display_name || "",
            });
            console.log(
              "New user created in database, ClerkID:",
              userId,
              "SpotifyID:",
              data.id,
            );
          } else {
            // User exists, update Spotify info if needed
            await db
              .update(users)
              .set({
                spotifyId: data.id,
                username: data.display_name || "",
              })
              .where(eq(users.id, userId));
          }
        }
      } else {
        // Handle the case where the timeout expired
        console.log("Timeout expired");
      }
    } catch (err) {
      console.log("Spotify user Rejected:", err);
    }

    return { ...data, clerkId: userId };
  }
};

//what if the user has more than 50 playlists? what if user adds on spotify side (does not refresh page)?
export const getUserPlaylists = async ({ userId }: { userId: string }) => {
  if (userId != null) {
    const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
      userId,
      "oauth_spotify",
    );

    const accessToken = clerkResponse.data[0]?.token;
    let data: any;

    try {
      const spotifyResponse = await fetch(
        `https://api.spotify.com/v1/me/playlists`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: AbortSignal.timeout(4000),
        },
      );

      // Check if the fetch request resolved before the timeout
      if (spotifyResponse instanceof Response) {
        //eslint-disable-next-line
        data = await spotifyResponse.json(); // or response.text(), response.blob(), etc.
        // Continue processing the data...
      } else {
        // Handle the case where the timeout expired
        console.log("Timeout expired");
      }
    } catch (err) {
      console.log("Rejected:", err);
    }

    return data;
  }
};

const queueMixHelper = async (
  playlists: Record<string, string>,
  accessToken: string,
): Promise<number> => {
  const random = Math.random();
  let cumulativeWeights = 0;

  for (const playlist in playlists) {
    const [playlistId, totalTracks] = playlist.split("%");
    const weight = Number(playlists[playlist]) / 100;

    cumulativeWeights += weight;

    if (random < cumulativeWeights) {
      //fetch random song from playlist
      const randomIndex = ~~(Math.random() * Number(totalTracks));

      let data: any;

      try {
        const spotifyResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=1&offset=${randomIndex}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: AbortSignal.timeout(4000),
          },
        );

        // Check if the fetch request resolved before the timeout
        if (spotifyResponse instanceof Response) {
          //eslint-disable-next-line
          data = await spotifyResponse.json();

          if (data != undefined) {
            const uri = data.items[0].track.uri;

            const response = await fetch(
              `https://api.spotify.com/v1/me/player/queue?uri=${uri}`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
                method: "POST",
                signal: AbortSignal.timeout(4000),
              },
            );

            if (!response.ok) {
              return response.status;
            }
          }
          // Continue processing the data...
        } else {
          // Handle the case where the timeout expired
          console.log("Timeout expired or spotify response is undefined");
        }
      } catch (err) {
        console.log("Rejected:", err);
      }

      break;
    }
  } //end of for loop

  return 200;
};

//see and refresh queue func?
export const queueMix = async (mix: Mix): Promise<number> => {
  const user = await currentUser();

  if (user != null) {
    const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
      user.id,
      "oauth_spotify",
    );

    const accessToken = clerkResponse.data[0]?.token;

    const queueSize = Number(mix.queueSize); //ideally this would be a user input

    //queue a single song weighted randomly queueSize times
    for (let i = 0; i < queueSize; i++) {
      const queueMixResponse = await queueMixHelper(
        mix.playlistRatios,
        accessToken as string,
      );

      if (queueMixResponse !== 200) {
        return queueMixResponse;
      }
    }

    return 200;
  }

  return 404;
};
