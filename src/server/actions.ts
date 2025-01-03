"use server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import type { Mix } from "@/lib/types";
import { index } from "drizzle-orm/mysql-core";
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
    const controller = new AbortController();
    let data: any;

    try {
      const spotifyResponse = await Promise.race([
        fetch(`https://api.spotify.com/v1/me/playlists`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
        new Promise((_, reject) => setTimeout(reject, 4000)),
      ]);

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
      controller.abort();
    }

    return data;
  }
};

export const queueMix = async (mix: Mix) => {
  const user = await currentUser();

  if (user != null) {
    const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
      user.id,
      "oauth_spotify",
    );

    const accessToken = clerkResponse.data[0]?.token;

    const fetchPromises: Promise<any>[] = [];

    const queueSize = 10;

    for (const playlist in mix.playlistRatios) {
      const [playlistId, totalTracks] = playlist.split("%");
      const ratio = Number(mix.playlistRatios[playlist]);

      // Generate an array of length "ratio" with random indeces from 0 to totalTracks
      const randomIndeces: number[] = [...(Array(ratio) as number[])].map(
        () => ~~(Math.random() * Number(totalTracks)),
      );

      randomIndeces.map((index) => {
        fetchPromises.push(
          fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=1&offset=${index}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          ),
        );
      });
    } //end of for loop

    let data;
    data = await queueMixHelper(fetchPromises);

    if (data != undefined) {
      const trackUris = data.map((item) => item.items[0].track.uri);

      // Queue the tracks
      trackUris.forEach(async (uri) => {
        await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${uri}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          method: "POST",
        });
      });
    }
  }
};

// const shuffleArray = (array: string[]) => {
//   if (array != undefined) {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));

//       [array[i], array[j]] = [array[j], array[i]];
//     }
//   }
// };
//bulk resolve fetch promises
const queueMixHelper = async (promisesArr: Promise<any>[]) => {
  const controller = new AbortController();
  let data;

  try {
    const spotifyResponse = await Promise.race([
      Promise.all(promisesArr),
      new Promise((_, reject) => setTimeout(reject, 4000)),
    ]);

    // Check if the fetch request resolved before the timeout
    if (Array.isArray(spotifyResponse)) {
      //eslint-disable-next-line
      data = await Promise.all(
        spotifyResponse.map((response) => response.json()),
      );

      // Continue processing the data...
    } else {
      // Handle the case where the timeout expired
      console.log("Timeout expired");
    }
  } catch (err) {
    console.log("Rejected:", err);
    controller.abort();
  }

  return data;
};
