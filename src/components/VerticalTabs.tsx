import React from 'react';
import { 
  BarChart3, 
  Droplets, 
  MapPin, 
  Building2, 
  PlusCircle, 
  FileSpreadsheet,
  Layers
} from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface VerticalTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  children: React.ReactNode;
}

export const VerticalTabs: React.FC<VerticalTabsProps> = ({
  tabs,
  activeTab,
  onSelectTab,
  children,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Wrapper Kontainer Vertikal Tab (Inspirasi layout user: .tab di kiri, .tabcontent di kanan) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* TAB MENU KIRI (Vertical Tabs - setara dengan class .tab) */}
        <aside className="w-full lg:w-72 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden sticky lg:top-24">
          
          {/* Header Tab Menu */}
          <div className="px-4 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Navigasi Menu
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Vertical Tab
            </span>
          </div>

          {/* Tombol-tombol Tab Vertikal (setara dengan button.tablinks) */}
          <nav className="p-2 space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  type="button"
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/20 translate-x-1'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50'
                      }`}
                    >
                      {tab.icon}
                    </span>
                    <div className="truncate">
                      <div className="text-xs leading-tight">{tab.label}</div>
                      {tab.subtitle && (
                        <div
                          className={`text-[10px] mt-0.5 truncate ${
                            isActive ? 'text-blue-100 font-normal' : 'text-slate-400'
                          }`}
                        >
                          {tab.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {tab.badge !== undefined && (
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Info Tab Kiri */}
          <div className="p-3 bg-slate-50/60 border-t border-slate-200 text-[11px] text-slate-500 text-center">
            <span className="font-semibold text-slate-700">Dinas PUPR Nagekeo</span>
            <div className="text-[10px] text-slate-400">Bidang Cipta Karya © 2026</div>
          </div>
        </aside>

        {/* TAB CONTENT KANAN (Isi Konten Aktif - setara dengan class .tabcontent) */}
        <main className="flex-1 w-full min-w-0">
          <div className="animate-in fade-in-50 duration-200">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};
