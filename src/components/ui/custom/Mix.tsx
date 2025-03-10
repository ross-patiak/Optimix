"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "@/hooks/use-toast";
import { Trash2, Percent } from "lucide-react";
import type { Playlist, Mix } from "@/lib/types";
import { queueMix, saveMix } from "@/server/actions";
import PlaylistSelect from "./PlaylistSelect";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
/* eslint-disable */

type MixProps = {
  data: Playlist[];
  userId: string;
};

const FormSchema = z.object({
  playlistRatios: z.record(
    z.string(),
    z.string().regex(/^\d+(\.\d+)?$/, { message: "Must be a number" }),
  ),
  queueSize: z.string(),
  name: z.string().optional(),
});

const Mix = ({ data, userId }: MixProps) => {
  const [pickedLists, setPickedLists] = useState<Playlist[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [mixName, setMixName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      queueSize: "10", // Default value for queueSize
    },
  });

  useEffect(() => {
    //dynamically set the default values for playlistRatios
    if (pickedLists) {
      pickedLists.forEach((item: Playlist) => {
        const ratio = Number.isInteger(100 / pickedLists.length)
          ? (100 / pickedLists.length).toString()
          : (100 / pickedLists.length).toFixed(2);
        form.setValue(
          `playlistRatios.${item.id}%${item.tracks["total"]}`,
          ratio,
        );
      });
    }
  }, [pickedLists, form.setValue]);

  const onSubmit = async (mixData: z.infer<typeof FormSchema>) => {
    if (mixData.playlistRatios) {
      const ratios = Object.values(mixData.playlistRatios).map(Number);
      const sum = ratios.reduce((a, b) => a + b);
      if (Math.round(sum) !== 100) {
        toast({
          title: "Error:",
          description: "Playlist ratios must sum up to 100",
        });
        return;
      } else {
        const queueResponse = await queueMix(mixData);

        if (queueResponse === 404) {
          toast({
            title: "Error:",
            description:
              "No active device found. Please open Spotify and temporarily play a song.",
          });
        } else {
          toast({
            title: "Success:",
            description: `${mixData.queueSize} songs queued.`,
          });
        }
      }
    }
  };

  const handleSaveMix = async () => {
    try {
      setIsSaving(true);

      const formValues = form.getValues();

      if (!mixName.trim()) {
        toast({
          title: "Error",
          description: "Please enter a name for your mix",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      const mixToSave = {
        ...formValues,
        name: mixName,
      };

      await saveMix(mixToSave);

      toast({
        title: "Success",
        description: "Mix saved successfully!",
      });

      setShowSaveDialog(false);
    } catch (error) {
      console.error("Error saving mix:", error);
      toast({
        title: "Error",
        description: "Failed to save mix. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Create a Mix</h2>
        <p className="text-muted-foreground">
          Select playlists and customize their mix ratios to create your perfect
          blend.
        </p>
        <PlaylistSelect
          data={data}
          userId={userId}
          pickedLists={pickedLists as Playlist[]}
          setPickedLists={setPickedLists}
        />
      </div>

      {pickedLists.length > 0 && (
        <div className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="queueSize"
                render={({ field }) => (
                  <FormItem className="w-full max-w-[240px]">
                    <FormLabel className="text-base font-semibold">
                      Queue Size
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of songs" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Card className="border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <Percent className="mr-2 h-5 w-5" />
                    <CardTitle className="text-lg">Playlist Weights</CardTitle>
                    <span className="text-muted-foreground ml-2 text-sm">
                      (ensure percentages sum to 100)
                    </span>
                  </div>
                </CardHeader>
                <div className="px-6 pb-6">
                  <div className="space-y-3">
                    {pickedLists?.map((item: Playlist) => (
                      <div className="flex items-center gap-4" key={item.id}>
                        <div className="flex-grow">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-muted-foreground text-xs">
                            ID: {item.id}
                          </p>
                        </div>

                        <div className="w-32">
                          <FormField
                            control={form.control}
                            name={`playlistRatios.${item.id}%${item.tracks["total"]}`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormControl>
                                    <Input
                                      inputMode="numeric"
                                      {...field}
                                      className="text-center"
                                      defaultValue={`${form.getValues(`playlistRatios.${item.id}%${item.tracks["total"]}`)}`}
                                    />
                                  </FormControl>
                                  <span className="ml-2 text-lg">%</span>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          variant="neutral"
                          size="icon"
                          className="shrink-0"
                          onClick={() => {
                            setPickedLists(
                              pickedLists.filter(
                                (playlist) => playlist?.id !== item.id,
                              ),
                            );
                            form.unregister(
                              `playlistRatios.${item.id}%${item.tracks["total"]}`,
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" className="min-w-[120px]">
                  Queue Mix
                </Button>

                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="neutral"
                      className="min-w-[120px]"
                    >
                      Save Mix
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-2 border-border">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Save Mix</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Label
                        htmlFor="mix-name"
                        className="text-base font-medium"
                      >
                        Mix Name
                      </Label>
                      <Input
                        id="mix-name"
                        value={mixName}
                        onChange={(e) => setMixName(e.target.value)}
                        placeholder="My Awesome Mix"
                        className="mt-2"
                      />
                    </div>
                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button variant="neutral">Cancel</Button>
                      </DialogClose>
                      <Button
                        onClick={handleSaveMix}
                        disabled={isSaving || !mixName.trim()}
                        className="min-w-24"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Mix;
