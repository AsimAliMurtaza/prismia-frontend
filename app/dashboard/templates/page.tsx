"use client"

import { Header } from "@/components/layout/header"
import { TemplatesList } from "@/components/templates/templates-list"
import { TemplateFilters } from "@/components/templates/template-filters"
import { useState } from "react"

export default function TemplatesPage() {
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <div className="flex flex-col h-full">
      <Header title="Templates" description="Pre-built pipeline templates for common use cases" />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">Pipeline Templates</h2>
          <p className="text-sm text-muted-foreground">
            Choose from our library of battle-tested templates for HR, Project Management, and Customer Support
          </p>
        </div>
        <TemplateFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <TemplatesList filter={activeFilter} />
      </div>
    </div>
  )
}
