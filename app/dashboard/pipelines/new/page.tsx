import { Header } from "@/components/layout/header"
import { PipelineBuilder } from "@/components/pipelines/pipeline-builder"
import { PipelineConfig } from "@/components/pipelines/pipeline-config"
import { Button } from "@/components/ui/button"
import { Save, Play, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPipelinePage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Create Pipeline" description="Build a new AI workflow pipeline" />
      <div className="flex-1 p-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard/pipelines">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Pipelines
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Save className="w-4 h-4" />
              Save Draft
            </Button>
            <Button className="gap-2">
              <Play className="w-4 h-4" />
              Deploy Pipeline
            </Button>
          </div>
        </div>

        <PipelineBuilder />
        <PipelineConfig />
      </div>
    </div>
  )
}
