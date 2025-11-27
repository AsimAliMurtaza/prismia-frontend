import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, HeadphonesIcon, ArrowRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface TemplateCardProps {
  id: string
  name: string
  description: string
  category: "hr" | "pm" | "cs"
  features: string[]
  usageCount: number
  rating: number
  featured?: boolean
}

const categoryConfig: Record<string, { label: string; icon: LucideIcon; color: string }> = {
  hr: { label: "Human Resources", icon: Users, color: "text-chart-2" },
  pm: { label: "Project Management", icon: Briefcase, color: "text-chart-4" },
  cs: { label: "Customer Support", icon: HeadphonesIcon, color: "text-chart-3" },
}

export function TemplateCard({
  id,
  name,
  description,
  category,
  features,
  usageCount,
  rating,
  featured,
}: TemplateCardProps) {
  const config = categoryConfig[category]
  const Icon = config.icon

  return (
    <Card
      className={cn(
        "bg-card border-border hover:border-primary/30 transition-colors relative overflow-hidden",
        featured && "border-primary/50",
      )}
    >
      {featured && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-bl-lg font-medium">
          Featured
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={cn("w-12 h-12 rounded-lg bg-secondary flex items-center justify-center", config.color)}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-medium text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground">{config.label}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {features.slice(0, 3).map((feature) => (
            <Badge key={feature} variant="secondary" className="text-xs bg-secondary text-muted-foreground">
              {feature}
            </Badge>
          ))}
          {features.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-secondary text-muted-foreground">
              +{features.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-chart-4 text-chart-4" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <span>{usageCount.toLocaleString()} uses</span>
        </div>
        <Link href={`/dashboard/templates/${id}`}>
          <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-primary hover:text-primary">
            Use Template
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
