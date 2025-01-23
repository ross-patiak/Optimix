"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import type { Playlist, Mix } from "@/lib/types";
import { queueMix } from "@/server/actions";
import PlaylistSelect from "./PlaylistSelect";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
/* eslint-disable */

type MixProps = {
  data: Playlist[];
};

const FormSchema = z.object({
  playlistRatios: z.record(
    z.string(),
    z.string().regex(/^\d+(\.\d+)?$/, { message: "Must be a number" }),
  ),
  queueSize: z.string().regex(/^\d{1,2}$/, { message: "Must be a number" }),
});

const Mix = ({ data }: MixProps) => {
  const [pickedLists, setPickedLists] = useState<Playlist[]>([]);

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
        await queueMix(mixData);

        toast({
          title: "Success:",
          description: JSON.stringify(mixData.playlistRatios, null, 2),
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PlaylistSelect
        data={data}
        pickedLists={pickedLists as Playlist[]}
        setPickedLists={setPickedLists}
      />
      {pickedLists.length != 0 ? (
        <div className="flex flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="queueSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Queue Size (keep it between 1-20 for now; default: 10)
                    </FormLabel>
                    <FormControl>
                      <Input {...field} inputMode="numeric" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-lg font-bold">
                Playlist Weights (ensure %'s sum up to 100) 👇
              </div>
              {pickedLists?.map((item: Playlist) => (
                <div className="flex" key={item.id}>
                  <Card className="grow basis-3/4">
                    <CardHeader>
                      <CardTitle>{item.id}</CardTitle>
                      <CardDescription>{item.name}</CardDescription>
                    </CardHeader>
                  </Card>

                  <div className="basis-1/5">
                    <FormField
                      control={form.control}
                      name={`playlistRatios.${item.id}%${item.tracks["total"]}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>%</FormLabel>
                          <FormControl>
                            <Input
                              inputMode="numeric"
                              {...field}
                              defaultValue={`${form.getValues(`playlistRatios.${item.id}%${item.tracks["total"]}`)}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="basis-[5%] content-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setPickedLists(
                          pickedLists.filter(
                            (playlist) => playlist?.id !== item.id,
                          ),
                        )
                      }
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}

              <Button type="submit">Queue</Button>
            </form>
          </Form>
        </div>
      ) : null}
    </div>
  );
};

export default Mix;
