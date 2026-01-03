"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Key,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Implement password change API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Security</h2>
        <p className="text-muted-foreground mt-1">
          Manage your password and security settings
        </p>
      </div>

      <Separator />

      {/* Change Password */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Key className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Change Password</h3>
            <p className="text-xs text-muted-foreground">
              Update your password regularly to keep your account secure
            </p>
          </div>
        </div>

        <div className="grid gap-4 pl-11">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm">
              Current Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="current-password"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10"
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={isSaving}
            className="w-fit gap-2"
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {isSaving ? "Saving..." : "Change Password"}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Two-Factor Authentication */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Smartphone className="size-5 text-emerald-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
            <p className="text-xs text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={setTwoFactorEnabled}
          />
        </div>

        {twoFactorEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pl-11 space-y-3"
          >
            <p className="text-sm text-muted-foreground">
              Scan the QR code with your authenticator app or enter the secret
              key manually.
            </p>
            <div className="p-4 rounded-lg border border-border/40 bg-muted/20 text-center">
              <p className="text-xs text-muted-foreground mb-2">
                QR Code would appear here
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                XXXX-XXXX-XXXX-XXXX
              </code>
            </div>
          </motion.div>
        )}
      </div>

      <Separator />

      {/* Active Sessions */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Shield className="size-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Active Sessions</h3>
            <p className="text-xs text-muted-foreground">
              Manage devices where you&apos;re currently logged in
            </p>
          </div>
        </div>

        <div className="pl-11 space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/40">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-emerald-500" />
              <div>
                <p className="text-sm font-medium">Current Session</p>
                <p className="text-xs text-muted-foreground">
                  Windows • Chrome • Active now
                </p>
              </div>
            </div>
            <span className="text-xs text-emerald-500 font-medium">
              This device
            </span>
          </div>
        </div>

        <div className="pl-11">
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
          >
            Sign out all other sessions
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
