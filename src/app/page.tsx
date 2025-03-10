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
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
/* eslint-disable */

export default async function HomePage() {
  const user = await getUser();
  const playlists = await getUserPlaylists({ userId: user?.clerkId as string });

  return (
    <div className="flex h-full flex-col">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Optimix</h1>
        <ThemeSwitcher />
      </header>

      <SignedOut>
        <div className="flex flex-grow flex-col items-center justify-center gap-6 py-10 text-center">
          <h2 className="text-3xl font-bold">Welcome to Optimix</h2>
          <p className="mb-4 max-w-md text-lg">
            Create better playlists with smarter mixing options from your
            Spotify library
          </p>
          <SignInButton>
            <Button size="lg">Sign In with Spotify</Button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="mb-6 flex items-center justify-between">
          {user != null ? (
            <div className="text-lg">
              Welcome back,{" "}
              <span className="font-semibold">{user?.display_name}</span>!
            </div>
          ) : null}

          <SignOutButton>
            <Button variant="neutral" size="sm">
              Sign out
            </Button>
          </SignOutButton>
        </div>

        <div className="flex-grow">
          {playlists && (
            <Mix data={playlists?.items as Playlist[]} userId={user?.id} />
          )}
        </div>
      </SignedIn>
    </div>
  );
}
