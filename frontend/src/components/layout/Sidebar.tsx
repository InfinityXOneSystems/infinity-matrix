
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Database,
  Settings,
  MessageSquare,
  Github,
  Activity,
  Users,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'AI Chat', href: '/chat', icon: MessageSquare },
  { name: 'Data Sources', href: '/data-sources', icon: Database },
  { name: 'System Monitor', href: '/monitor', icon: Activity },
  { name: 'GitHub', href: '/github', icon: Github },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          Infinity Matrix
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Status indicator */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">System Status</span>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
            <span className="text-sm text-gray-400">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
