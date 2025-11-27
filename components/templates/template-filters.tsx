"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Users, Briefcase, HeadphonesIcon, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"

interface TemplateFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

const filters = [
  { id: "all", label: "All Templates", icon: LayoutGrid },
  { id: "hr", label: "Human Resources", icon: Users },
  { id: "pm", label: "Project Management", icon: Briefcase },
  { id: "cs", label: "Customer Support", icon: HeadphonesIcon },
]

export function TemplateFilters({ activeFilter, onFilterChange }: TemplateFiltersProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search templates..." className="pl-9 bg-secondary border-border" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant="outline"
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "gap-2",
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
                : "bg-secondary border-border hover:bg-secondary/80",
            )}
          >
            <filter.icon className="w-4 h-4" />
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
