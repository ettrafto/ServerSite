import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Monitoring() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Monitoring</h1>
        <p className="text-muted-foreground mt-2">
          This section is not integrated yet.
        </p>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="metrics" className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">System Metrics</h3>
            <p className="text-muted-foreground">Real-time system performance metrics...</p>
          </div>
        </TabsContent>
        <TabsContent value="alerts" className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Alert Management</h3>
            <p className="text-muted-foreground">Configure and manage system alerts...</p>
          </div>
        </TabsContent>
        <TabsContent value="dashboards" className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Custom Dashboards</h3>
            <p className="text-muted-foreground">Create and customize monitoring dashboards...</p>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Performance Reports</h3>
            <p className="text-muted-foreground">Generate and view performance reports...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
