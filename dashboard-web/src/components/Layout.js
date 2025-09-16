import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
export default function Layout() {
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(Topbar, {}), _jsx("main", { className: "flex-1 p-6", children: _jsx(Outlet, {}) })] })] }) }));
}
