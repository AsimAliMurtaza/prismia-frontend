"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

export function ProfileSettings() {
  const { data: session, update } = useSession();

  const user = session?.user;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const parts = (user.name || "").split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      setImage(user.image || "");
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          bio,
          image,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      await update(); // refresh session

      alert("Profile updated successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Are you sure? This cannot be undone.");
    if (!confirmDelete) return;

    await fetch("/api/profile/delete", { method: "DELETE" });

    window.location.href = "/signup";
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile photo</CardDescription>
        </CardHeader>

        <CardContent className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={image} />
            <AvatarFallback>
              {firstName?.[0] || "U"}
              {lastName?.[0] || ""}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 border px-3 py-2 rounded-md">
                <Upload className="w-4 h-4" />
                Upload New Photo
              </div>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>

            <p className="text-xs text-muted-foreground">
              JPG, GIF or PNG. Max 2MB.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/40">
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Delete Account</p>
            <p className="text-xs text-muted-foreground">
              Permanently remove all data
            </p>
          </div>

          <Button variant="destructive" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}