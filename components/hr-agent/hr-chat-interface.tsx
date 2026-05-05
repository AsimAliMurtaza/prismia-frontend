"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Bot,
  User,
  Sparkles,
  FileText,
  Users,
  Calendar,
  HelpCircle,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQueries = [
  { icon: FileText, label: "Run resume screening for Software Engineer role once" },
  { icon: Users, label: "List all inactive candidates" },
  { icon: Calendar, label: "Schedule interviews for this week" },
  { icon: HelpCircle, label: "What's our current time-to-hire?" },
];

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm your HR Assistant. I can help you with resume screening, candidate management, interview scheduling, onboarding, and HR analytics. What would you like to do today?",
    timestamp: new Date(),
  },
];

export function HRChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fake streaming: reveal backend step messages one by one
  function streamMessages(streamItems: Message[], finalMessage: Message) {
    let index = 0;

    const showNext = () => {
      if (index === streamItems.length) {
        // final summary output
        setMessages((prev) => [...prev, finalMessage]);
        setIsTyping(false);
        return;
      }

      setMessages((prev) => [...prev, streamItems[index]]);
      index++;

      setTimeout(showNext, 500);
    };

    showNext();
  }

  const fileInputRef = useRef<HTMLInputElement>(null);
  const AnyfileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsTyping(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/hr/upload-candidates", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: `Uploaded ${data.count} candidates successfully.`,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: "Failed to upload candidates.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAnyFilesUpload = async (file: File) => {
    setIsTyping(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/hr/upload-files", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: `Uploaded ${data.count} files successfully.`,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: "Failed to upload candidates.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      // Convert backend steps into streamable frontend messages
      const stepMessages: Message[] = (data.full_state?.messages || [])
        .filter((m: any) => m && m.role && m.content) // prevent undefined crashes
        .map((m: any) => ({
          id: Date.now() + Math.random(),
          role: m.role === "tool" ? "assistant" : m.role,
          content:
            typeof m.content === "string"
              ? m.content
              : JSON.stringify(m.content),
          timestamp: new Date(),
        }));

      // Final assistant reply
      const finalAiMessage: Message = {
        id: Date.now() + 9999,
        role: "assistant",
        content: data.response || "something went wrong. Please check your input and try again",
        timestamp: new Date(),
      };

      // Stream them naturally
      streamMessages(stepMessages, finalAiMessage);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: "Something went wrong.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSuggestedQuery = (query: string) => setInput(query);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Chat with HR Agent
        </h2>
        <p className="text-sm text-muted-foreground">
          Ask questions or give tasks to your HR assistant
        </p>
      </div>

      <Card className="flex-1 flex flex-col bg-card border-border overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse",
              )}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                  className={cn(
                    message.role === "assistant"
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-foreground",
                  )}
                >
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-3",
                  message.role === "assistant"
                    ? "bg-secondary/50"
                    : "bg-primary text-primary-foreground",
                )}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className="text-xs mt-1 text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
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

        {/* Suggested queries */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">
              Suggested queries:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedQuery(q.label)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <q.icon className="w-3 h-3" />
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-border">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <input
            ref={AnyfileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAnyFilesUpload(file);
            }}
          />
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

            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
            </Button>
            {/* <Button
              variant="default"
              size="lg"
              onClick={() => AnyfileInputRef.current?.click()}
            >
              Attach Files
              <Upload className="w-4 h-4" />
            </Button> */}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">
              Powered by AI – Can help with screening, scheduling, analytics,
              and more
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
