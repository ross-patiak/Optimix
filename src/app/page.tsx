import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import type { Playlist } from "@/lib/types";
import { getUser, getUserPlaylists } from "@/server/actions";
import Mix from "@/components/ui/custom/Mix";
/* eslint-disable */

export default async function HomePage() {
  const user = await getUser();
  const playlists = await getUserPlaylists({ userId: user?.clerkId as string });

  return (
    <main className="container">
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        {user != null ? <div>Hi {user?.display_name} </div> : null}

        <SignOutButton>
          <Button variant="neutral">Sign out</Button>
        </SignOutButton>

        {playlists && (
          <Mix data={playlists?.items as Playlist[]} userId={user?.id} />
        )}
      </SignedIn>
    </main>
  );
}
