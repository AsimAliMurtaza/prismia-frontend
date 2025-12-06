"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MoreHorizontal, Mail, MapPin, Calendar, ChevronRight, Star, MessageSquare } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const candidates = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    role: "Senior Software Engineer",
    stage: "Technical Interview",
    rating: 4.5,
    appliedAt: "Nov 15, 2025",
    avatar: null,
    tags: ["Referred", "Priority"],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    role: "Product Manager",
    stage: "HR Interview",
    rating: 4.2,
    appliedAt: "Nov 14, 2025",
    avatar: null,
    tags: ["Internal"],
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "+1 (555) 345-6789",
    location: "Seattle, WA",
    role: "Data Scientist",
    stage: "Offer Stage",
    rating: 4.8,
    appliedAt: "Nov 12, 2025",
    avatar: null,
    tags: ["Top Candidate"],
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@email.com",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    role: "UX Designer",
    stage: "Screening",
    rating: 3.9,
    appliedAt: "Nov 16, 2025",
    avatar: null,
    tags: [],
  },
  {
    id: 5,
    name: "Alex Rivera",
    email: "alex.r@email.com",
    phone: "+1 (555) 567-8901",
    location: "Los Angeles, CA",
    role: "DevOps Engineer",
    stage: "Technical Interview",
    rating: 4.1,
    appliedAt: "Nov 13, 2025",
    avatar: null,
    tags: ["Referred"],
  },
]

const stageColors: Record<string, string> = {
  Screening: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  "HR Interview": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Technical Interview": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Offer Stage": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Hired: "bg-primary/20 text-primary border-primary/30",
}

export function CandidateManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState("all")

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStage = stageFilter === "all" || c.stage === stageFilter
    return matchesSearch && matchesStage
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            className="pl-9 bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-48 bg-card border-border">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="Screening">Screening</SelectItem>
            <SelectItem value="HR Interview">HR Interview</SelectItem>
            <SelectItem value="Technical Interview">Technical Interview</SelectItem>
            <SelectItem value="Offer Stage">Offer Stage</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-4 gap-4">
        {["Screening", "HR Interview", "Technical Interview", "Offer Stage"].map((stage) => {
          const count = candidates.filter((c) => c.stage === stage).length
          return (
            <Card key={stage} className="bg-card border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stage}</p>
                <p className="text-2xl font-bold text-foreground">{count}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Candidates Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">All Candidates</CardTitle>
          <CardDescription>{filteredCandidates.length} candidates in pipeline</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidate.avatar || undefined} />
                    <AvatarFallback className="bg-secondary text-foreground">
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{candidate.name}</h4>
                      {candidate.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs bg-primary/10 text-primary border-primary/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{candidate.role}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {candidate.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {candidate.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {candidate.appliedAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{candidate.rating}</span>
                    </div>
                    <Badge variant="outline" className={stageColors[candidate.stage]}>
                      {candidate.stage}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Calendar className="w-4 h-4" />
                          Schedule Interview
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <ChevronRight className="w-4 h-4" />
                          Move to Next Stage
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Reject Candidate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
