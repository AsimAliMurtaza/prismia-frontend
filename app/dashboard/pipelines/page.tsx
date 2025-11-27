import { Header } from "@/components/layout/header"
import { PipelineList } from "@/components/pipelines/pipeline-list"
import { PipelineFilters } from "@/components/pipelines/pipeline-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function PipelinesPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Pipelines" description="Manage your AI workflow pipelines" />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">All Pipelines</h2>
            <p className="text-sm text-muted-foreground">6 pipelines total</p>
          </div>
          <Link href="/dashboard/pipelines/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Pipeline
            </Button>
          </Link>
        </div>
        <PipelineFilters />
        <PipelineList />
      </div>
    </div>
  )
}
