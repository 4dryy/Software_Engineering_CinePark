
"use client";

import { useActionState, useEffect } from "react"; // Changed import
import { login } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";

const initialState = {
  message: null,
  errors: {},
};

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState); // Changed to useActionState
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message && !state.errors) { // General error message not related to field validation
        toast({
            title: "Login Failed",
            description: state.message,
            variant: "destructive",
        });
    }
  }, [state, toast]);


  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>
        <CardTitle className="text-2xl">Login to CINEPARK</CardTitle>
        <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            {state?.errors?.email && <p className="text-xs text-destructive">{state.errors.email[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
            {state?.errors?.password && <p className="text-xs text-destructive">{state.errors.password[0]}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full">
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/signup" className="text-accent">Sign up</Link>
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
