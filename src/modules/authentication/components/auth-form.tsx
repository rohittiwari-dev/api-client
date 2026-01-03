"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LockIcon,
  Mail,
  User2,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { IconGoogle } from "@/assets/app-icons";
import authClient from "@/lib/authClient";
import {
  signInFormSchema,
  signUpFormSchema,
} from "@/lib/form-schemas/auth-forms";
import { cn } from "@/lib/utils";
import { InputField } from "../../../components/app-ui/inputs";
import ThemeSwitcher from "../../../components/app-ui/theme-switcher";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";

type Props = {
  type?: "sign-in" | "sign-up";
  className?: string;
  content_flow?: "right" | "left";
  image_src?: string;
  image_alt?: string;
  error_description?: string;
  error?: string;
};

const AuthForm = ({
  type = "sign-in",
  error,
  error_description,
  className,
}: Props) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState({
    googleAuthLoading: false,
    emailSigninLoading: false,
  });

  useEffect(() => {
    if (
      error === "signup_disabled" ||
      error_description === "signup_disabled"
    ) {
      toast.error("You don't have an account, please sign up");
      redirect("/sign-up");
    }
  }, [error, error_description]);

  const form = useForm<
    z.infer<typeof signUpFormSchema> | z.infer<typeof signInFormSchema>
  >({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    resolver: zodResolver(
      type === "sign-up" ? signUpFormSchema : signInFormSchema
    ),
    mode: "onChange",
  });

  const handleSubmit = async (
    data: z.infer<typeof signUpFormSchema> | z.infer<typeof signInFormSchema>
  ) => {
    if (type === "sign-up") {
      return await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: (data as z.infer<typeof signUpFormSchema>).name,
          callbackURL: "/workspace/get-started",
        },
        {
          onRequest: () => {
            setLoading((prev) => ({
              ...prev,
              emailSigninLoading: true,
            }));
          },
          onSuccess: () => {
            toast.success("Successfully Signed Up");
          },
          onError: (ctx) => {
            console.log(ctx);
            toast.error(ctx.error.message);
          },
          onResponse: () => {
            setLoading((prev) => ({
              ...prev,
              emailSigninLoading: false,
            }));
          },
        }
      );
    } else {
      return await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          rememberMe: rememberMe,
          callbackURL: "/workspace/get-started",
        },
        {
          onRequest: () => {
            setLoading((prev) => ({
              ...prev,
              emailSigninLoading: true,
            }));
          },
          onSuccess: () => {
            toast.success("Successfully logged in");
          },
          onError: (ctx) => {
            console.log(ctx);
            toast.error(ctx.error.message);
          },
          onResponse: () => {
            setLoading((prev) => ({
              ...prev,
              emailSigninLoading: false,
            }));
          },
        }
      );
    }
  };

  const handleGoogleLoginAndSignup = async () => {
    await authClient.signIn.social({
      provider: "google",
      requestSignUp: type === "sign-up",
      callbackURL: "/workspace/get-started",
      errorCallbackURL: type === "sign-up" ? `/sign-up` : `/sign-in`,
      fetchOptions: {
        onRequest(context) {
          setLoading((prev) => ({
            ...prev,
            googleAuthLoading: true,
          }));
        },
        onSuccess(context) {
          toast.success("Successfully logged in");
        },
        onError(context) {
          console.log(context);
          toast.error(context.error.message);
        },
        onResponse(context) {
          setLoading((prev) => ({
            ...prev,
            googleAuthLoading: false,
          }));
        },
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative w-full rounded-2xl border border-border bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden p-6 sm:p-8",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-6 mb-8">
        <Link href="/" className="group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="relative w-12 h-12"
          >
            <Image
              src="/logo.png"
              alt="ApiClient"
              fill
              className="object-contain"
            />
          </motion.div>
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {type === "sign-in" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {type === "sign-in"
              ? "Enter your credentials to access your workspace"
              : "Enter your details to get started for free"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {/* Google Button */}
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl bg-background/50 border-input hover:bg-accent hover:text-accent-foreground transition-all"
          type="button"
          onClick={handleGoogleLoginAndSignup}
          disabled={loading.googleAuthLoading || loading.emailSigninLoading}
        >
          {loading.googleAuthLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <IconGoogle className="mr-2 h-4 w-4" />
          )}
          Continue with Google
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          <AnimatePresence mode="wait">
            {type === "sign-up" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <InputField
                  id="name"
                  label={<Label htmlFor="name">Full Name</Label>}
                  type="text"
                  leftIcon={<User2 className="w-4 h-4" />}
                  placeholder="John Doe"
                  className="rounded-xl bg-background/50"
                  error={(form.formState.errors as any).name?.message}
                  {...form.register("name")}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <InputField
            id="email"
            label={<Label htmlFor="email">Email</Label>}
            type="email"
            leftIcon={<Mail className="w-4 h-4" />}
            placeholder="details@example.com"
            className="rounded-xl bg-background/50"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />

          <div className="space-y-1">
            <InputField
              id="password"
              label={
                <div className="flex items-center justify-between w-full">
                  <Label htmlFor="password">Password</Label>
                  {type === "sign-in" && (
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
              }
              type="password"
              leftIcon={<LockIcon className="w-4 h-4" />}
              placeholder="••••••••"
              className="rounded-xl bg-background/50"
              error={form.formState.errors.password?.message}
              {...form.register("password")}
            />
          </div>

          {type === "sign-in" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me for 30 days
              </Label>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-lg shadow-primary/20 mt-2"
            disabled={loading.googleAuthLoading || loading.emailSigninLoading}
          >
            {loading.emailSigninLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                {type === "sign-in" ? "Sign In" : "Create Account"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">
          {type === "sign-in"
            ? "Don't have an account? "
            : "Already have an account? "}
        </span>
        <Link
          href={type === "sign-in" ? "/sign-up" : "/sign-in"}
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          {type === "sign-in" ? "Sign up" : "Sign in"}
        </Link>
      </div>
    </motion.div>
  );
};

export default AuthForm;
