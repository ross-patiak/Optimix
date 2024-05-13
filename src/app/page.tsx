import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

export default async function HomePage() {
  const user = await currentUser();
  const controller = new AbortController();
  const { firstName, id } = user;
  const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
    id as string,
    "oauth_spotify",
  );

  const accessToken = clerkResponse.data[0]?.token;
  const spotifyUrl = `https://api.spotify.com/v1/me/playlists`;

  const spotifyResponse = await fetch(spotifyUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await spotifyResponse.json();

  console.log(data);

  return (
    <main className="container">
      {user != null ? <div>Hi {firstName}</div> : null}
      <SignInButton>Login</SignInButton>
      <SignOutButton>Sign out</SignOutButton>
    </main>
  );
}
