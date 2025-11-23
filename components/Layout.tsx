import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Stethoscope, LogOut, Moon, Sun } from 'lucide-react';
import { User, Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, isDarkMode, toggleTheme }) => {
  const location = useLocation();

  if (!user) {
    return <>{children}</>;
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/appointments', label: 'Appointments', icon: <Calendar size={20} /> },
  ];

  // Admin/Staff items
  if (user.role === Role.ADMIN || user.role === Role.STAFF) {
    navItems.push({ path: '/patients', label: 'Patients', icon: <Users size={20} /> });
    navItems.push({ path: '/staff', label: 'Staff', icon: <Stethoscope size={20} /> });
  }
  
  // Doctor items
  if (user.role === Role.DOCTOR) {
      navItems.push({ path: '/patients', label: 'My Patients', icon: <Users size={20} /> });
  }

  const getPageTitle = () => {
    const item = navItems.find(i => i.path === location.pathname);
    return item ? item.label : 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-sombre-950 text-slate-800 dark:text-gray-100 font-sans transition-colors duration-300 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-sombre-900 border-r border-slate-200 dark:border-sombre-700 flex flex-col shadow-sm fixed h-full z-20 transition-colors duration-300">
        <div className="h-16 border-b border-slate-100 dark:border-sombre-700 flex items-center px-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-400 rounded-xl flex items-center justify-center text-white font-bold shadow-sm shadow-teal-400/30">
                P
              </div>
              <h1 className="text-xl font-bold text-slate-700 dark:text-gray-100 tracking-tight">PastelCare</h1>
            </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 shadow-sm'
                    : 'text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-sombre-800 hover:text-slate-700 dark:hover:text-gray-200'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: Profile & Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-sombre-700 bg-slate-50/50 dark:bg-sombre-800/50">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-500 dark:text-rose-300 font-bold border-2 border-white dark:border-sombre-800 shadow-sm">
                 {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-semibold text-slate-700 dark:text-gray-200 truncate">{user.name}</p>
                 <p className="text-xs text-slate-400 dark:text-gray-500 capitalize truncate">{user.role.toLowerCase()}</p>
              </div>
           </div>
           <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-sombre-900 border border-slate-200 dark:border-sombre-700 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors text-sm font-medium shadow-sm"
           >
              <LogOut size={16} />
              Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col h-screen transition-colors duration-300">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-sombre-900 border-b border-slate-200 dark:border-sombre-700 flex items-center justify-between px-8 shadow-sm z-10 sticky top-0 transition-colors duration-300">
           <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-slate-700 dark:text-white">{getPageTitle()}</h2>
           </div>

           <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-yellow-400 hover:bg-slate-50 dark:hover:bg-sombre-800 rounded-lg transition-colors"
                title="Toggle Theme"
              >
                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
           </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50 dark:bg-sombre-950 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-sombre-700">
          <div className="max-w-7xl mx-auto pb-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};