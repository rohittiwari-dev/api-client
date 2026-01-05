"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import {
  Briefcase,
  CheckCircle,
  Loader2,
  Slash,
  XCircle,
  ArrowRight,
  Rocket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { AddOnInput, InputField } from "@/components/app-ui/inputs";
import ThemeSwitcher from "@/components/app-ui/theme-switcher";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import authClient from "@/lib/authClient";
import { CreateWorkspaceSchema } from "@/lib/form-schemas/workspace";
import { cn } from "@/lib/utils";

const WorkspaceSetup = ({
  type = "get-started-page",
}: {
  type: "get-started-page" | "workspace-setup-modal";
}) => {
  const debouncedCheckSlug = React.useRef<_.DebouncedFunc<
    () => Promise<void>
  > | null>(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = React.useState(false);

  const [checkSlugMessage, setCheckSlugMessage] = React.useState<{
    status: "error" | "success";
    message: string;
  } | null>(null);

  const form = useForm<z.infer<typeof CreateWorkspaceSchema>>({
    defaultValues: {
      name: undefined,
      slug: undefined,
    },
    resolver: zodResolver(CreateWorkspaceSchema),
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);

    try {
      if (checkSlugMessage?.status !== "success") {
        setIsCheckingSlug(true);
        const slugCheck = await authClient.organization.checkSlug({
          slug: data.slug,
        });
        setIsCheckingSlug(false);

        if (!slugCheck.data?.status) {
          toast.error("Slug is already taken. Please choose a different one.");
          setCheckSlugMessage({
            status: "error",
            message: "Slug is already taken",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const result = await authClient.organization.create({ ...data });

      if (result.error) {
        toast.error("Failed to create Workspace: " + result.error.message);
        setIsSubmitting(false);
        return;
      }

      await authClient.organization.setActive({
        organizationId: result.data.id,
      });

      toast.success("Workspace created successfully!");
      form.reset();
      window.location.href = `/workspace/${result.data.slug}`;
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  });

  const slug = form.watch("slug");

  const checkSlug = async () => {
    if (!slug || slug.length < 3) {
      setCheckSlugMessage({
        status: "error",
        message: "Slug must be at least 3 characters long",
      });
      return;
    }

    setIsCheckingSlug(true);
    try {
      const response = await authClient.organization.checkSlug({
        slug,
      });
      if (response.data?.status) {
        setCheckSlugMessage({
          status: "success",
          message: "Slug is available",
        });
      } else {
        setCheckSlugMessage({
          status: "error",
          message: "Slug is already taken",
        });
      }
    } catch {
      setCheckSlugMessage({
        status: "error",
        message: "Failed to check slug availability",
      });
    } finally {
      setIsCheckingSlug(false);
    }
  };

  const isFormValid =
    form.formState.isValid && checkSlugMessage?.status === "success";

  // Modal variant return
  if (type === "workspace-setup-modal") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">New Workspace</h1>
          <p className="text-muted-foreground text-sm">
            Set up a new workspace to organize your collections
          </p>
        </div>
        <form className={cn("flex flex-col gap-4")} onSubmit={onSubmit}>
          {/* Form fields (reused logic for consisteny) */}
          {/* ... (Modal specific simplified form if needed, or reuse the same structure below) ... */}
          {/* For brevity, I'll reuse the main structure logic but wrapped differently if needed. 
              Actually, the modal usually just needs the form part. Let's keep it DRY and use a shared render function or just conditional wrapper.
          */}
          <div className="grid gap-3">
            <InputField
              id="organization-name"
              label={<Label htmlFor="organization-name">Workspace Name</Label>}
              leftIcon={<Briefcase className="w-4 h-4" />}
              placeholder="My Workspace"
              className="rounded-xl bg-background/50"
              disabled={isSubmitting}
              error={form.formState.errors?.name?.message}
              {...form.register("name")}
            />
            <div className="space-y-1">
              <AddOnInput
                leftIcon={<Slash className="w-3 h-3 rotate-[112deg]" />}
                placeholder="my-workspace"
                disabled={isSubmitting}
                error={form.formState.errors?.slug?.message}
                id="slug"
                {...form.register("slug")}
                onChange={(e) => {
                  const value = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-");
                  form.setValue("slug", value);
                  setCheckSlugMessage(null);
                  if (debouncedCheckSlug.current)
                    debouncedCheckSlug.current.cancel();
                  debouncedCheckSlug.current = _.debounce(checkSlug, 500);
                  debouncedCheckSlug.current();
                }}
              />
              <AnimatePresence mode="wait">
                {isCheckingSlug && (
                  <motion.p
                    key="checking"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1.5 text-muted-foreground text-xs"
                  >
                    <Loader2 className="w-3 h-3 animate-spin" /> Checking
                    availability...
                  </motion.p>
                )}
                {!isCheckingSlug && checkSlugMessage && (
                  <motion.p
                    key="result"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium",
                      checkSlugMessage.status === "error"
                        ? "text-destructive"
                        : "text-emerald-500"
                    )}
                  >
                    {checkSlugMessage.status === "error" ? (
                      <XCircle className="w-3 h-3" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    {checkSlugMessage.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <Button
              type="submit"
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Workspace"
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Full Page Variant (Get Started)
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background flex flex-col items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[0%] right-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md rounded-2xl border border-border bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden p-6 sm:p-8 z-10"
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
                alt="Api Studio"
                fill
                className="object-contain"
              />
            </motion.div>
          </Link>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Create Your Workspace
            </h1>
            <p className="text-sm text-muted-foreground">
              Set up your workspace to organize your API collections and
              collaborate with your team.
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <div className="grid gap-4">
            <InputField
              id="organization-name"
              label={<Label htmlFor="organization-name">Workspace Name</Label>}
              leftIcon={<Briefcase className="w-4 h-4" />}
              placeholder="My Workspace"
              className="rounded-xl bg-background/50"
              disabled={isSubmitting}
              error={form.formState.errors?.name?.message}
              {...form.register("name")}
            />

            <div className="space-y-2">
              <AddOnInput
                leftIcon={<Slash className="w-3 h-3 rotate-[112deg]" />}
                placeholder="my-workspace"
                disabled={isSubmitting}
                error={form.formState.errors?.slug?.message}
                id="slug"
                {...form.register("slug")}
                onChange={(e) => {
                  const value = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-");
                  form.setValue("slug", value);
                  setCheckSlugMessage(null);
                  if (debouncedCheckSlug.current)
                    debouncedCheckSlug.current.cancel();
                  debouncedCheckSlug.current = _.debounce(checkSlug, 500);
                  debouncedCheckSlug.current();
                }}
              />

              {/* Slug Status */}
              <AnimatePresence mode="wait">
                {isCheckingSlug && (
                  <motion.div
                    key="checking"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-muted-foreground text-xs px-1"
                  >
                    <Loader2 className="w-3 h-3 animate-spin" /> Checking
                    availability...
                  </motion.div>
                )}
                {!isCheckingSlug && checkSlugMessage && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      "flex items-center gap-2 text-xs font-medium px-1",
                      checkSlugMessage.status === "error"
                        ? "text-destructive"
                        : "text-emerald-500"
                    )}
                  >
                    {checkSlugMessage.status === "error" ? (
                      <XCircle className="w-3 h-3" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    {checkSlugMessage.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-lg shadow-primary/20 mt-2"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create Workspace <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground/60">
            You can invite team members after creating your workspace
          </p>
        </form>
      </motion.div>

      {/* Theme Switcher absolute position */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher variant="multiple" />
      </div>
    </div>
  );
};

export default WorkspaceSetup;
