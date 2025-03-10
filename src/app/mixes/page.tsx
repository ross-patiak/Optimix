export const dynamic = "force-dynamic";

import { SignedIn } from "@clerk/nextjs";
import { getUserMixes } from "@/server/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MixCard from "@/components/ui/custom/MixCard";
import type { SavedMix } from "@/lib/types";

export default async function MyMixesPage() {
  const mixes = (await getUserMixes().catch(() => [])) as SavedMix[];

  return (
    <div className="flex h-full flex-col">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Mixes</h1>
      </header>

      <SignedIn>
        <div className="flex-grow">
          {mixes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
              <p className="text-lg">
                You don&apos;t have any saved mixes yet.
              </p>
              <Link href="/">
                <Button>Create a Mix</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mixes.map((mix) => (
                <MixCard key={mix.id} mix={mix} />
              ))}
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  );
}
