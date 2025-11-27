"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, Key, Bell, Plug, CreditCard, Shield } from "lucide-react"

const settingsNav = [
  { name: "Profile", href: "/dashboard/settings", icon: User },
  { name: "API Keys", href: "/dashboard/settings/api-keys", icon: Key },
  { name: "Notifications", href: "/dashboard/settings/notifications", icon: Bell },
  { name: "Integrations", href: "/dashboard/settings/integrations", icon: Plug },
  { name: "Billing", href: "/dashboard/settings/billing", icon: CreditCard },
  { name: "Security", href: "/dashboard/settings/security", icon: Shield },
]

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {settingsNav.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              isActive
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
            )}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
