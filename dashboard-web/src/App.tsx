import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AuthGuard from './components/AuthGuard'
import Login from './routes/auth/Login'
import Personal from './routes/Personal'
import ServerControls from './routes/ServerControls'
import WebsiteManager from './routes/WebsiteManager'
import DataExplorer from './routes/DataExplorer'
import Monitoring from './routes/Monitoring'
import JobRunner from './routes/JobRunner'
import SecretsManager from './routes/SecretsManager'
import FileManager from './routes/FileManager'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <AuthGuard>
          <Layout />
        </AuthGuard>
      }>
        <Route index element={<Personal />} />
        <Route path="personal" element={<Personal />} />
        <Route path="server-controls" element={<ServerControls />} />
        <Route path="website-manager" element={<WebsiteManager />} />
        <Route path="data-explorer" element={<DataExplorer />} />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="job-runner" element={<JobRunner />} />
        <Route path="secrets-manager" element={<SecretsManager />} />
        <Route path="file-manager" element={<FileManager />} />
      </Route>
    </Routes>
  )
}

export default App
