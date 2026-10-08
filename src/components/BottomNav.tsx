import { motion } from 'motion/react';
import { Home, Hammer, ShoppingBag, Grid } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartCount?: number;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: any;
  badge?: number;
}

export default function BottomNav({ activeTab, onTabChange, cartCount = 0 }: BottomNavProps) {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'الرئيسية', icon: Home },
    { id: 'services', label: 'الخدمات', icon: Hammer },
    { id: 'store', label: 'المتجر', icon: ShoppingBag, badge: cartCount },
    { id: 'more', label: 'المزيد', icon: Grid },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none flex justify-center pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] pt-3 px-2 sm:px-4 bg-gradient-to-t from-slate-100/90 via-slate-100/60 to-transparent">
      <nav className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 p-1 sm:p-1.5 flex items-center justify-around pointer-events-auto transition-all" dir="rtl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'services' && activeTab === 'request');

          return (
            <button
              id={`nav-tab-${item.id}`}
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center justify-center flex-1 py-1 px-0.5 sm:px-1 min-h-[44px] transition-all cursor-pointer group rounded-xl"
            >
              {/* Active Background Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavActiveIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 rounded-xl border border-amber-500/20"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Icon with animation */}
              <div className="relative z-10 flex items-center justify-center">
                <Icon
                  className={`h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-amber-600 scale-110'
                      : 'text-slate-500 group-hover:text-slate-800 group-hover:scale-105'
                  }`}
                />
                
                {/* Store cart badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[9px] font-black text-white ring-2 ring-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`relative z-10 text-[9px] sm:text-[11px] mt-1 font-bold tracking-tight leading-none transition-colors whitespace-nowrap ${
                  isActive ? 'text-amber-600 font-black' : 'text-slate-500 group-hover:text-slate-800'
                }`}
              >
                {item.label}
              </span>

              {/* Tiny bottom active dot */}
              {isActive && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

