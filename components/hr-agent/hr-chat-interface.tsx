"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles, FileText, Users, Calendar, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestedQueries = [
  { icon: FileText, label: "Screen top candidates for Senior Engineer role" },
  { icon: Users, label: "Show me candidates ready for final interview" },
  { icon: Calendar, label: "Schedule interviews for this week" },
  { icon: HelpCircle, label: "What's our current time-to-hire?" },
]

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm your HR Agent assistant. I can help you with resume screening, candidate management, interview scheduling, onboarding, and HR analytics. What would you like to do today?",
    timestamp: new Date(),
  },
]

export function HRChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestedQuery = (query: string) => {
    setInput(query)
  }

  return (
    <div className="h-[calc(100vh-220px)] flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground">Chat with HR Agent</h2>
        <p className="text-sm text-muted-foreground">Ask questions or give commands to your HR assistant</p>
      </div>

      <Card className="flex-1 flex flex-col bg-card border-border overflow-hidden">
        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                  className={cn(
                    message.role === "assistant" ? "bg-primary/20 text-primary" : "bg-secondary text-foreground",
                  )}
                >
                  {message.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-3",
                  message.role === "assistant" ? "bg-secondary/50" : "bg-primary text-primary-foreground",
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    message.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/70",
                  )}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Suggested Queries */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Suggested queries:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuery(query.label)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <query.icon className="w-3 h-3" />
                  {query.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask the HR Agent..."
              className="bg-secondary border-border"
            />
            <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">
              Powered by AI - Can help with screening, scheduling, analytics, and more
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}

function getAIResponse(input: string): string {
  const lowercaseInput = input.toLowerCase()

  if (lowercaseInput.includes("screen") || lowercaseInput.includes("candidate")) {
    return "I've analyzed the candidate pool for the Senior Engineer role. We have 23 qualified candidates with a match score above 80%. The top 3 candidates are: John Smith (92%), Sarah Chen (89%), and Mike Johnson (87%). Would you like me to schedule interviews with any of them?"
  }

  if (lowercaseInput.includes("interview") || lowercaseInput.includes("schedule")) {
    return "I found 5 candidates ready for interviews this week. I can schedule them across Monday-Friday based on interviewer availability. The interviewers Alice Brown and Bob Wilson have open slots on Tuesday and Thursday afternoon. Should I proceed with scheduling?"
  }

  if (lowercaseInput.includes("time-to-hire") || lowercaseInput.includes("metrics")) {
    return "Our current average time-to-hire is 18 days, which is a 4-day improvement from last month. The hiring funnel shows: 1,247 applications → 423 screened → 156 interviewed → 34 offers → 28 hired. Our offer acceptance rate is 82%, up 5% from Q3."
  }

  if (lowercaseInput.includes("onboarding") || lowercaseInput.includes("new hire")) {
    return "We have 3 new hires in the onboarding pipeline: Mike Chen (75% complete, starting Dec 1), Lisa Wang (40% complete, starting Dec 4), and James Wilson (20% complete, starting Dec 8). Would you like me to send reminder emails or update any onboarding tasks?"
  }

  return "I can help you with that! Based on your request, I can assist with resume screening, candidate tracking, interview scheduling, onboarding workflows, or HR analytics. Could you provide more details about what specific action you'd like me to take?"
}
