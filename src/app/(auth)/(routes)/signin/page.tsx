"use client";

import React, { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { auth } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import Link from "next/link";

const signInSchema = z.object({
  email: z.string().email("Email must be valid."),
  password: z.string().min(6, "Password should have at least 6 characters."),
});

const SignInPage = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null); // State to handle errors
  const router = useRouter(); // Initialize router to redirect after successful sign-in

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push("/dashboard"); // Redirect to dashboard after successful sign-in
    } catch (error: any) {
      setError("Failed to sign in. Please check your credentials.");
      console.error(error.message);
    }
  };

  return (
    <div className="signUpWrapper">
      <div className="formWrapper">
        <div className="left">
          <h3 className="title">Hello again!</h3>
          <p>Enter your personal details and start your journey with us.</p>
          <Link href={"/signup"}>
            <Button className="border-zinc-500 text-zinc-300 hover:border-zinc-200 hover:text-zinc-100 transition-colors border rounded-full px-8">
              Sign Up
            </Button>
          </Link>
        </div>
        <div className="right">
          <h3 className="text-center text-2xl font-semibold">Sign In Here</h3>

          {/* Display error if there is one */}
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-0 mb-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-0 mb-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="********" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
