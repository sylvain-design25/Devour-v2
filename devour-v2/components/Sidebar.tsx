'use client';

import { LayoutDashboard, FileText, CheckSquare, Calendar, List, Upload, Headphones, BookOpen, Trash2, Settings } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  storiesCount: number;
}

export default function Sidebar({ activeView, storiesCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'publishing', label: 'PUBLISHING', icon: FileText },
    { id: 'todo', label: 'TO DO', icon: CheckSquare },
    { id: 'calendar', label: 'CALENDAR', icon: Calendar },
    { id: 'all', label: 'ALL SUBMISSIONS', icon: List },
    { id: 'bulk', label: 'BULK UPLOAD', icon: Upload, badge: '26' },
    { id: 'audio', label: 'AUDIOFILES', icon: Headphones },
    { id: 'reading', label: 'READING ROOM', icon: BookOpen },
    { id: 'trash', label: 'TRASH', icon: Trash2 },
  ];

  return (
    <div className="w-64 bg-devour-sidebar border-r border-devour-border flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-devour-border">
        <h1 className="text-2xl font-serif tracking-wider">DEVOUR</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = item.id === activeView;
          
          return (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                isActive 
                  ? 'bg-white text-devour-accent' 
                  : 'text-gray-700 hover:bg-devour-hover'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm tracking-wide">{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <button className="flex items-center gap-3 px-6 py-4 border-t border-devour-border text-gray-700 hover:bg-devour-hover">
        <Settings className="w-5 h-5" />
        <span className="text-sm tracking-wide">SETTINGS</span>
      </button>
    </div>
  );
}
