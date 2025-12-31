/**
 * Sidebar Navigation Component
 * Main navigation menu for the admin panel
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Workflow,
  FileText,
  Shield,
  BookOpen,
  PlayCircle,
  Users,
  Settings,
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    path: '/agents',
    label: 'Agents',
    icon: Bot,
  },
  {
    path: '/workflows',
    label: 'Workflows',
    icon: Workflow,
  },
  {
    path: '/audit',
    label: 'Audit Logs',
    icon: FileText,
  },
  {
    path: '/proofs',
    label: 'Proof Logs',
    icon: Shield,
  },
  {
    path: '/onboarding',
    label: 'Onboarding',
    icon: BookOpen,
  },
  {
    path: '/demos',
    label: 'Demos & Runbooks',
    icon: PlayCircle,
  },
  {
    path: '/users',
    label: 'Users',
    icon: Users,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export const Sidebar: React.FC<{ collapsed?: boolean }> = ({ collapsed = false }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside
      className={`bg-gray-900 text-white transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <Link to="/dashboard" className="flex items-center">
          {collapsed ? (
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">∞</span>
            </div>
          ) : (
            <>
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">∞</span>
              </div>
              <span className="ml-3 text-xl font-bold">InfinityX AI</span>
            </>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`${collapsed ? '' : 'mr-3'} h-5 w-5 flex-shrink-0`} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-800 p-4">
        {!collapsed && (
          <div className="text-xs text-gray-400">
            <p>v1.0.0</p>
            <p className="mt-1">© 2025 InfinityX Systems</p>
          </div>
        )}
      </div>
    </aside>
  );
};
