"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function SecuritySettingsPage() {
  const [loading, setLoading] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const fetchSecurity = async () => {
      const res = await fetch("/api/profile/me");
      const data = await res.json();

      if (data?.user) {
        setTwoFA(data.user.is2FAEnabled);
        setLocked(data.user.isAccountLocked);
      }
    };

    fetchSecurity();
  }, []);

  const toggle2FA = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/settings/2fa", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is2FAEnabled: !twoFA }),
      });

      const data = await res.json();
      if (res.ok) setTwoFA(data.is2FAEnabled);
    } finally {
      setLoading(false);
    }
  };

  const unlockAccount = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/account/unblock", {
        method: "POST",
      });

      if (res.ok) setLocked(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground ">
          Security Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage authentication, access control, and account security.
        </p>
      </div>

      {/* 2FA CARD */}
      <Card className="border-border bg-card hover:shadow-md transition">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of protection during login
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <div className="space-y-2">
            <Badge variant={twoFA ? "default" : "secondary"}>
              {twoFA ? "Enabled" : "Disabled"}
            </Badge>

            <p className="text-sm text-muted-foreground">
              OTP verification is {twoFA ? "active" : "inactive"} for your account.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {loading && (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}

            <Switch checked={twoFA} onCheckedChange={toggle2FA} />
          </div>
        </CardContent>
      </Card>

      {/* ACCOUNT STATUS */}
      <Card className="border-border bg-card hover:shadow-md transition">
        <CardHeader>
          <CardTitle>Account Protection</CardTitle>
          <CardDescription>
            Monitor and recover account access
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <div className="space-y-2">
            <Badge variant={locked ? "destructive" : "secondary"}>
              {locked ? "Locked" : "Active"}
            </Badge>

            <p className="text-sm text-muted-foreground">
              {locked
                ? "Your account is temporarily locked."
                : "Your account is operating normally."}
            </p>
          </div>

          {locked ? (
            <Button onClick={unlockAccount} disabled={loading}>
              {loading ? "Processing..." : "Unlock Account"}
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Secure
            </Button>
          )}
        </CardContent>
      </Card>

      {/* PASSWORD SECTION */}
      <Card className="border-border bg-card hover:shadow-md transition">
        <CardHeader>
          <CardTitle>Password Management</CardTitle>
          <CardDescription>
            Update your password regularly for better security
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            onClick={() => (window.location.href = "/dashboard/settings/security/reset-password")}
          >
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}