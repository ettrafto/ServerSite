import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function WebsiteManager() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Website Manager</h1>
        <p className="text-muted-foreground mt-2">
          This section is not integrated yet.
        </p>
      </div>

      <Tabs defaultValue="sites" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="ssl">SSL</TabsTrigger>
        </TabsList>
        <TabsContent value="sites" className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Website Management</h3>
            <p className="text-muted-foreground">Manage your websites and deployments...</p>
          </div>
        </TabsContent>
        <TabsContent value="domains" className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Domain Management</h3>
            <p className="text-muted-foreground">Configure domains and DNS settings...</p>
          </div>
        </TabsContent>
        <TabsContent value="ssl" className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">SSL Certificates</h3>
            <p className="text-muted-foreground">Manage SSL certificates and security...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
