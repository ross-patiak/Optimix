import Link from "next/link";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function SideNavbar() {
  return (
    <div className="flex h-full w-[200px] flex-col gap-4 border-r-4 bg-main p-4">
      <div className="flex flex-col gap-2">
        <Link href="/" className="w-full">
          <Button
            className="w-full font-bold transition-all hover:translate-y-1"
            variant="default"
          >
            MangoMix
          </Button>
        </Link>

        <Link href="/mixes" className="w-full">
          <Button
            className="w-full border-2 transition-all hover:translate-y-1"
            variant="neutral"
          >
            My Mixes
          </Button>
        </Link>

        <div className="mt-4">
          <SignedOut>
            <SignInButton>
              <Button
                className="w-full transition-all hover:translate-y-1"
                variant="default"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <SignOutButton>
              <Button
                className="w-full transition-all hover:translate-y-1"
                variant="default"
              >
                Sign Out
              </Button>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
