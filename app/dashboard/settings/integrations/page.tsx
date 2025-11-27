import { Header } from "@/components/layout/header"
import { SettingsNav } from "@/components/settings/settings-nav"
import { IntegrationsSettings } from "@/components/settings/integrations-settings"

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" description="Manage your account and preferences" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SettingsNav />
          </div>
          <div className="lg:col-span-3">
            <IntegrationsSettings />
          </div>
        </div>
      </div>
    </div>
  )
}
