import { Header } from "@/components/layout/header"
import { SettingsNav } from "@/components/settings/settings-nav"
import { APIKeysSettings } from "@/components/settings/api-keys-settings"

export default function APIKeysPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" description="Manage your account and preferences" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SettingsNav />
          </div>
          <div className="lg:col-span-3">
            <APIKeysSettings />
          </div>
        </div>
      </div>
    </div>
  )
}
