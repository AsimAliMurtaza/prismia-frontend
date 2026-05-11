"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Copy, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
interface APIKey {
  _id: string
  provider: string
  api_key_masked: string
  created_at: string
  status: "active" | "expired"
}

export function APIKeysSettings() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [showKey, setShowKey] = useState<string | null>(null)

  const [provider, setProvider] = useState("groq")
  const [apiKey, setApiKey] = useState("")

  const [loading, setLoading] = useState(false)


  // =========================================================
  // FETCH API KEYS
  // =========================================================

  const fetchAPIKeys = async () => {
    try {
      const res = await fetch("/api/user/api-keys")

      const data = await res.json()

      setApiKeys(data.keys || [])
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch API keys")
    }
  }

  useEffect(() => {
    fetchAPIKeys()
  }, [])

  // =========================================================
  // CREATE API KEY
  // =========================================================

  const handleCreateKey = async () => {
    if (!apiKey) {
      toast.error("Please enter API key")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("/api/user/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider,
          api_key: apiKey,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      toast.success("API key saved successfully")

      setApiKey("")

      fetchAPIKeys()
    } catch (err: any) {
      toast.error(err.message || "Failed to save API key")
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // DELETE API KEY
  // =========================================================

  const handleDelete = async (provider: string) => {
    try {
      const res = await fetch(`/api/user/api-keys?provider=${provider}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete key")
      }

      toast.success("API key deleted")

      fetchAPIKeys()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  // =========================================================
  // COPY KEY
  // =========================================================

  const handleCopy = async (key: string) => {
    await navigator.clipboard.writeText(key)

    toast.success("Copied")
  }

  return (
    <div className="space-y-6">

      {/* ========================================================= */}
      {/* CREATE API KEY */}
      {/* ========================================================= */}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Connect LLM Provider
          </CardTitle>

          <CardDescription>
            Store your provider API keys securely
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Provider
            </label>

            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-secondary px-3 text-sm"
            >
              <option value="groq">Groq</option>
              <option value="openai">OpenAI</option>
              <option value="gemini">Gemini</option>
              <option value="anthropic">Anthropic</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              API Key
            </label>

            <Input
              type="password"
              placeholder="Enter API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>

          <Button
            onClick={handleCreateKey}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}

            Save API Key
          </Button>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* STORED KEYS */}
      {/* ========================================================= */}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Stored API Keys
          </CardTitle>

          <CardDescription>
            Your encrypted provider credentials
          </CardDescription>
        </CardHeader>

        <CardContent>

          <div className="space-y-4">

            {apiKeys.map((apiKey) => (

              <div
                key={apiKey._id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
              >
                <div className="space-y-1">

                  <div className="flex items-center gap-2">

                    <p className="text-sm font-medium capitalize">
                      {apiKey.provider}
                    </p>

                    <Badge
                      variant="outline"
                      className={
                        apiKey.status === "active"
                          ? "bg-primary/20 text-primary border-primary/30"
                          : "bg-destructive/20 text-destructive border-destructive/30"
                      }
                    >
                      {apiKey.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">

                    <code className="text-xs text-muted-foreground font-mono">
                      {showKey === apiKey._id
                        ? apiKey.api_key_masked
                        : "••••••••••••••••••••"}
                    </code>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        setShowKey(
                          showKey === apiKey._id
                            ? null
                            : apiKey._id
                        )
                      }
                    >
                      {showKey === apiKey._id ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Added {new Date(apiKey.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      handleCopy(apiKey.api_key_masked)
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() =>
                      handleDelete(apiKey.provider)
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {!apiKeys.length && (
              <div className="text-sm text-muted-foreground">
                No API keys added yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
