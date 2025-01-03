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
import type { Playlist, Mix } from "@/lib/types";
import { queueMix } from "@/server/actions";
import PlaylistSelect from "./PlaylistSelect";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
/* eslint-disable */

type MixProps = {
  data: Playlist[];
};

const FormSchema = z.object({
  playlistRatios: z.record(z.string(), z.string()),
});

const Mix = ({ data }: MixProps) => {
  const [pickedLists, setPickedLists] = useState([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (mixData: z.infer<typeof FormSchema>) => {
    await queueMix(mixData);

    toast({
      title: "Success:",
      description: JSON.stringify(mixData.playlistRatios, null, 2),
    });
  };

  return (
    <div className="flex flex-col gap-1">
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
              {pickedLists?.map((item: Playlist) => (
                <div className="flex" key={item.id}>
                  <Card className="grow basis-3/4">
                    <CardHeader>
                      <CardTitle>{item.id}</CardTitle>
                      <CardDescription>{item.name}</CardDescription>
                    </CardHeader>
                  </Card>

                  <div className="basis-1/4">
                    <FormField
                      control={form.control}
                      name={`playlistRatios.${item.id}%${item.tracks["total"]}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>%</FormLabel>
                          <FormControl>
                            <Input
                              defaultValue={"0"}
                              inputMode="numeric"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
