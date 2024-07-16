/**
 * v0 by Vercel.
 * @see https://v0.dev/t/H49nNXLK3Hi
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HexagonIcon } from "@/components/icons/icons";
import { useRouter } from "next/navigation";
import PocketBase from "pocketbase";
import LoginForm from "@/components/domains/forms/login.form";
import SignupForm from "@/components/domains/forms/signup.form";

export default function Page() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pb = new PocketBase("http://127.0.0.1:8090");

  const switchView = () => {
    setLoading(false);
    setAuthError("");
    setIsSignUp(!isSignUp);
  };

  const login = async (values: any) => {
    setLoading(true);
    setAuthError("");
    pb.collection("users")
      .authWithPassword(values.username, values.password)
      .then(async () => {
        const res = await pb.collection("projects").getList(1, 1);
        router.replace(`/projects/${res.items[0].id}`);
      })
      .catch((_) => {
        setLoading(false);
        setAuthError("Incorrect username or password.");
      });
  };

  const signup = async (values: any) => {
    setLoading(true);
    pb.collection("users")
      .create({
        username: values.username,
        email: values.email,
        password: values.password,
        passwordConfirm: values.passwordConfirm,
      })
      .then((_) => router.replace("/projects/1"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex min-h-[100dvh]">
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:bg-muted lg:px-8 lg:py-12">
        <div className="flex items-center justify-center">
          <HexagonIcon className="h-12 w-12 text-primary" />
          <h1 className="ml-2 text-3xl font-bold tracking-tight text-foreground">
            Hive
          </h1>
        </div>
        <p className="mt-4 max-w-[300px] text-center text-muted-foreground">
          A lightweight, simple markdown editor with lightning fast
          collaboration support.
        </p>
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[400px] space-y-6">
          <Card>
            <CardHeader className="text-center justify-center">
              <CardTitle className="text-2xl">
                {isSignUp ? "Create an account" : "Welcome back"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isSignUp ? (
                <SignupForm
                  onSubmit={signup}
                  error={authError}
                  loading={loading}
                />
              ) : (
                <LoginForm
                  onSubmit={login}
                  error={authError}
                  loading={loading}
                />
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="text-center text-sm text-muted-foreground">
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button
                  type="button"
                  className="font-medium hover:underline"
                  onClick={switchView}
                >
                  {isSignUp ? "Log in" : "Sign up"}
                </button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
