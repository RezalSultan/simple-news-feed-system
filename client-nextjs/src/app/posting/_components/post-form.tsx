"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const PostForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Card>
      <CardHeader>
        <div className="!flex items-center gap-3">
          <Link href={"/feed"}>
            <Button
              variant={"ghost"}
              className="!h-10 rounded-full"
              aria-label="back feeds"
            >
              <ArrowLeft />
            </Button>
          </Link>
          <div>
            <CardTitle>Add New Feed</CardTitle>
            <CardDescription className="mt-1">Post to anyone</CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="min-h-[150px]"
                      placeholder="What Do You Think..?"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="w-full text-end">
                    0 / 200 word
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end">
              <Button type="submit">Post</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PostForm;
