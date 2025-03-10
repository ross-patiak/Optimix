"use client";

import { Button } from "@/components/ui/button";
import { queueMix } from "@/server/actions";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import type { SavedMix } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface MixCardProps {
  mix: SavedMix;
}

export default function MixCard({ mix }: MixCardProps) {
  const [isQueueing, setIsQueueing] = useState(false);

  const handleQueueMix = async () => {
    try {
      setIsQueueing(true);

      await queueMix({
        playlistRatios: mix.playlistRatios,
        queueSize: mix.queueSize,
      });

      toast({
        title: "Success",
        description: "Mix queued successfully!",
      });
    } catch (error) {
      console.error("Error queueing mix:", error);
      toast({
        title: "Error",
        description: "Failed to queue mix. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsQueueing(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{mix.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">Queue Size: {mix.queueSize}</p>
      </CardContent>
      <CardFooter className="mt-auto flex gap-2">
        <Button
          className="flex-1"
          onClick={() => {
            // TODO: Implement loading this mix into the mixer
            toast({
              title: "Coming Soon",
              description: "This feature is not yet implemented.",
            });
          }}
        >
          Load Mix
        </Button>
        <Button
          variant="neutral"
          className="flex-1"
          onClick={handleQueueMix}
          disabled={isQueueing}
        >
          {isQueueing ? "Queueing..." : "Queue"}
        </Button>
      </CardFooter>
    </Card>
  );
}
