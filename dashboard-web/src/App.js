import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import Login from './routes/auth/Login';
import Personal from './routes/Personal';
import ServerControls from './routes/ServerControls';
import WebsiteManager from './routes/WebsiteManager';
import DataExplorer from './routes/DataExplorer';
import Monitoring from './routes/Monitoring';
import JobRunner from './routes/JobRunner';
import SecretsManager from './routes/SecretsManager';
import FileManager from './routes/FileManager';
function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsxs(Route, { path: "/", element: _jsx(AuthGuard, { children: _jsx(Layout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Personal, {}) }), _jsx(Route, { path: "personal", element: _jsx(Personal, {}) }), _jsx(Route, { path: "server-controls", element: _jsx(ServerControls, {}) }), _jsx(Route, { path: "website-manager", element: _jsx(WebsiteManager, {}) }), _jsx(Route, { path: "data-explorer", element: _jsx(DataExplorer, {}) }), _jsx(Route, { path: "monitoring", element: _jsx(Monitoring, {}) }), _jsx(Route, { path: "job-runner", element: _jsx(JobRunner, {}) }), _jsx(Route, { path: "secrets-manager", element: _jsx(SecretsManager, {}) }), _jsx(Route, { path: "file-manager", element: _jsx(FileManager, {}) })] })] }));
}
export default App;
