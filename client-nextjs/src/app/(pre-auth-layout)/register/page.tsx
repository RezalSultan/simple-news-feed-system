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
import RegisterForm from "./_components/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | News Feed System",
};

const RegisterPage = () => {
  return (
    <main className="flex h-dvh w-full items-center justify-center bg-[url('/background.jpg')] bg-cover bg-center">
      <Card className="w-[90%] max-w-md sm:w-full">
        <CardHeader className="items-center justify-center text-center">
          <CardTitle>Register to Feed System</CardTitle>
          <CardDescription>
            Fill in your information to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <CardAction className="flex w-full flex-col items-center justify-center">
            <p className="text-muted-foreground text-sm">
              {"You're already an account?"}
            </p>
            <Link href={"/"}>
              <Button variant="link">Login</Button>
            </Link>
          </CardAction>
        </CardFooter>
      </Card>
    </main>
  );
};

export default RegisterPage;
