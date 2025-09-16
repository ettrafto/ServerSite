import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Personal() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Personal</h1>
        <p className="text-muted-foreground mt-2">
          This section is not integrated yet.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <p className="text-muted-foreground">Profile management features coming soon...</p>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <p className="text-muted-foreground">Account settings will be available here...</p>
          </div>
        </TabsContent>
        <TabsContent value="preferences" className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">User Preferences</h3>
            <p className="text-muted-foreground">Customize your dashboard experience...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
