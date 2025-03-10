import { SignedIn } from "@clerk/nextjs";

export default function MyMixesPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Mixes</h1>
      </header>

      <SignedIn>
        <div className="flex-grow">
          <p className="text-lg">Your mixes will appear here soon.</p>
        </div>
      </SignedIn>
    </div>
  );
}
