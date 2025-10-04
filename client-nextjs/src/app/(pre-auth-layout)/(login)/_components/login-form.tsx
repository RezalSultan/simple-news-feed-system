"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";
import { loginFormSchema } from "@/validation-schema/auth-form-schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/type/auth-type";
import { login } from "@/service/auth-service";

const LoginForm = () => {
  const { loading, startLoading, stopLoading } = useLoading();
  const router = useRouter();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginRequest) {
    startLoading();
    const result = await login(values);

    if ("errors" in result) {
      if (
        result.statusCode === 400 &&
        result.errors?.message === "Validation Error"
      ) {
        result.errors.details?.forEach((detail) => {
          form.setError(detail.path as keyof LoginRequest, {
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

    router.push("/feed");
    form.reset();
    stopLoading();
    toast.success(result.message, { position: "top-right" });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          disabled={loading}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          disabled={loading}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-5 w-full">
          <Button disabled={loading} type="submit" className="w-full">
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
