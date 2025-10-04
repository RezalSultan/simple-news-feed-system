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
import { registerFormSchema } from "@/validation-schema/auth-form-schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RegisterRequest } from "@/type/auth-type";
import { register } from "@/service/auth-service";

const RegisterForm = () => {
  const { loading, startLoading, stopLoading } = useLoading();
  const router = useRouter();

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values: RegisterRequest) {
    startLoading();
    const result = await register(values);
    console.log(result);

    if ("errors" in result) {
      if (
        result.statusCode === 400 &&
        result.errors?.message === "Validation Error"
      ) {
        result.errors.details?.forEach((detail) => {
          form.setError(detail.path as keyof RegisterRequest, {
            type: "server",
            message: detail.message,
          });
        });
      } else {
        toast.error(result.errors?.message, { position: "top-right" });
        form.setValue("password", "");
        form.setValue("confirm_password", "");
      }
      stopLoading();
      return;
    }

    router.push("/");
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
        <FormField
          control={form.control}
          disabled={loading}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-5 w-full">
          <Button disabled={loading} type="submit" className="w-full">
            Register
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
