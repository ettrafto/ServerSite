import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function FileManager() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">File Manager</h1>
        <p className="text-muted-foreground mt-2">
          This section is not integrated yet.
        </p>
      </div>

      <Tabs defaultValue="files" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="sync">Sync</TabsTrigger>
        </TabsList>
        <TabsContent value="files" className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">File Browser</h3>
            <p className="text-muted-foreground">Browse, upload, and manage server files...</p>
          </div>
        </TabsContent>
        <TabsContent value="backups" className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Backup Management</h3>
            <p className="text-muted-foreground">Create and manage file backups...</p>
          </div>
        </TabsContent>
        <TabsContent value="sync" className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">File Synchronization</h3>
            <p className="text-muted-foreground">Sync files across different locations...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
