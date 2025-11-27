"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"

export function ProfileSettings() {
  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Profile Picture</CardTitle>
          <CardDescription>Update your profile photo</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg?key=fdfb1" alt="Profile" />
            <AvatarFallback className="bg-secondary text-foreground text-xl">JD</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Upload className="w-4 h-4" />
              Upload New Photo
            </Button>
            <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max 2MB.</p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Basic Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" className="bg-secondary border-border" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="john@example.com" className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              className="bg-secondary border-border min-h-[100px]"
            />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Delete Account</p>
            <p className="text-xs text-muted-foreground">Permanently delete your account and all associated data</p>
          </div>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  )
}
