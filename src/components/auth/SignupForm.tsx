
"use client";

import { useActionState, useEffect } from "react"; // Changed import
import { signup } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";

const initialState = {
  message: null,
  errors: {},
};

export function SignupForm() {
  const [state, formAction] = useActionState(signup, initialState); // Changed to useActionState
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message && !state.errors) { // General error message
        toast({
            title: "Signup Failed",
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
        <CardTitle className="text-2xl">Create your CINEPARK Account</CardTitle>
        <CardDescription>Join us to find your perfect movie match.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" type="text" placeholder="Your Name" required />
            {state?.errors?.name && <p className="text-xs text-destructive">{state.errors.name[0]}</p>}
          </div>
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
            <UserPlus className="mr-2 h-4 w-4" /> Sign Up
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/login" className="text-accent">Login</Link>
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
