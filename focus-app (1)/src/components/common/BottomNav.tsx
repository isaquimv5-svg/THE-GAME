import React from 'react';
import { Home, Calendar, CheckSquare, BarChart2, CalendarDays, User } from 'lucide-react';
import { TabType, useApp } from '../../context/AppContext';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
  activeColor: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'today', label: 'Hoje', icon: Home, activeColor: '#299BFF' },
  { id: 'plan', label: 'Plano', icon: Calendar, activeColor: '#24E4B4' },
  { id: 'tasks', label: 'Tarefas', icon: CheckSquare, activeColor: '#24E4B4' },
  { id: 'habits', label: 'Hábitos', icon: BarChart2, activeColor: '#24E4B4' },
  { id: 'monthly', label: 'Mensal', icon: CalendarDays, activeColor: '#24E4B4' },
  { id: 'profile', label: 'Perfil', icon: User, activeColor: '#24E4B4' },
];

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#091117]/95 backdrop-blur-lg border-t border-[rgba(120,160,190,0.14)] pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around h-[68px] px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const activeStyle = isActive ? item.activeColor : '#56687C';

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 min-h-[44px] touch-manipulation group active:scale-95"
            >
              <div
                className="transition-colors duration-200"
                style={{ color: activeStyle }}
              >
                <Icon
                  className="w-[22px] h-[22px]"
                  strokeWidth={isActive ? 2.3 : 1.9}
                />
              </div>
              <span
                className="text-[10.5px] font-medium tracking-tight mt-1 transition-colors duration-200"
                style={{ color: activeStyle }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
