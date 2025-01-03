import { SignInButton, SignOutButton } from "@clerk/nextjs";
import type { Playlist } from "@/lib/types";
import { getUser, getUserPlaylists } from "@/server/actions";
import Mix from "@/components/ui/custom/Mix";
/* eslint-disable */

export default async function HomePage() {
  const user = await getUser();
  const playlists = await getUserPlaylists({ userId: user?.id as string });

  return (
    <main className="container">
      {user != null ? <div>Hi {user?.firstName}</div> : null}
      <SignInButton>Login</SignInButton>
      <SignOutButton>Sign out</SignOutButton>
      {playlists && <Mix data={playlists?.items as Playlist[]} />}
    </main>
  );
}
