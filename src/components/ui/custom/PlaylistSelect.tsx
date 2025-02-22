"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { Playlist } from "@/lib/types";

/* eslint-disable */
type PlaylistSelectProps = {
  data: Playlist[];
  userId: string;
  pickedLists?: Playlist[];
  setPickedLists?: any;
};
const FormSchema = z.object({
  playlist: z.string(),
});

//data is needed to populate the select dropdown
const PlaylistSelect = ({
  data,
  userId,
  pickedLists,
  setPickedLists,
}: PlaylistSelectProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (selectData: z.infer<typeof FormSchema>) => {
    // .playlist comes from FormSchema. it is the value of the selected playlist
    const added: Playlist = JSON.parse(selectData.playlist);

    // pickedLists is needed here from the parent to add the selected playlist to the mix before chedcking if it already exists
    const currentPickedLists: Playlist[] = [
      ...(pickedLists as Playlist[]),
      added,
    ];
    // Check if the playlist is already in the mix
    const listSet = new Set(currentPickedLists?.map((item) => item.id));

    // If the set length is equal to the array length, then the playlist is not in the mix
    if ([...listSet].length == currentPickedLists.length) {
      setPickedLists(currentPickedLists);

      toast({
        title: "Successflly added:",
        description: added.name,
      });
    } else {
      toast({
        title: "Error:",
        description: `${added.name} already exists in this Mix`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="playlist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Playlist</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Add playlist to mix" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>By you</SelectLabel>
                    {data
                      ?.filter((item) => item.owner.id === userId)
                      .map((item) => (
                        <SelectItem
                          key={item?.id}
                          value={JSON.stringify({
                            id: item?.id,
                            name: item?.name,
                            tracks: item?.tracks,
                          })}
                        >
                          {item?.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>NOT by you</SelectLabel>
                    {data
                      ?.filter((item) => item.owner.id !== userId)
                      .map((item) => (
                        <SelectItem
                          key={item?.id}
                          value={JSON.stringify({
                            id: item?.id,
                            name: item?.name,
                            tracks: item?.tracks,
                          })}
                        >
                          {item?.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
};

export default PlaylistSelect;
