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
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useLoading } from "@/hooks/use-loading";
import { postFormSchema } from "@/validation-schema/post-form-schema";
import { PostRequest } from "@/type/post-type";
import { post } from "@/service/post-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const PostForm = ({ token }: { token?: string }) => {
  const { loading, startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const form = useForm<PostRequest>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const [lengthText, setLengthText] = useState(0);

  const contentValue = form.watch("content");

  useEffect(() => {
    setLengthText(contentValue.length);
  }, [contentValue]);

  const onSubmit = async (values: PostRequest) => {
    startLoading();
    const result = await post(values, token);

    if ("errors" in result) {
      if (
        result.statusCode === 400 &&
        result.errors?.message === "Validation Error"
      ) {
        result.errors.details?.forEach((detail) => {
          form.setError(detail.path as keyof PostRequest, {
            type: "server",
            message: detail.message,
          });
        });
      } else {
        toast.error(result.errors?.message, { position: "top-right" });
        form.reset();
      }
      stopLoading();
      return;
    }

    toast.success(result.message, { position: "top-right" });
    form.reset();
    stopLoading();
    router.push("/feed");
  };

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
              name="content"
              disabled={loading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="min-h-[150px]"
                      placeholder="What Do You Think..?"
                      {...field}
                      maxLength={200}
                    />
                  </FormControl>
                  <FormDescription className="w-full text-end">
                    {lengthText} / 200 word
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end">
              <Button disabled={loading} type="submit">
                Post
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PostForm;
