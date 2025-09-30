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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <main className="flex h-dvh w-full items-center justify-center">
      <Card className="w-[90%] max-w-md sm:w-full">
        <CardHeader className="items-center justify-center text-center">
          <CardTitle>Register to Feed System</CardTitle>
          <CardDescription>
            Fill in your information to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="text">Username</Label>
                <Input id="email" type="text" placeholder="username" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  placeholder="password"
                  type="password"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                </div>
                <Input
                  id="confirm_password"
                  placeholder="confirm password"
                  type="password"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="mt-5 w-full">
              Register
            </Button>
          </form>
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
