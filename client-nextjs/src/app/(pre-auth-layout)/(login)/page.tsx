import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import LoginForm from "./_components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | News Feed System",
};

const LoginPage = () => {
  return (
    <main className="flex h-dvh w-full items-center justify-center bg-[url('/background.jpg')] bg-cover bg-center">
      <Card className="w-[90%] max-w-md sm:w-full">
        <CardHeader className="items-center justify-center text-center">
          <CardTitle>Login to Feed System</CardTitle>
          <CardDescription>Enter your username below to login</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <CardAction className="flex w-full flex-col items-center justify-center">
            <p className="text-muted-foreground text-sm">
              {"don't have an account yet?"}
            </p>
            <Link href={"/register"}>
              <Button type="button" variant="link">
                Register
              </Button>
            </Link>
          </CardAction>
        </CardFooter>
      </Card>
    </main>
  );
};

export default LoginPage;
