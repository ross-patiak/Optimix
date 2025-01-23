"use server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import type { Mix } from "@/lib/types";
/*eslint-disable*/
export const getUser = async () => {
  const user = await currentUser();
  return user;
};

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
