import React from 'react';
import { Droplets, Code2, LogOut, Mountain } from 'lucide-react';

interface HeaderProps {
  totalRecords: number;
  onOpenDoPostModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalRecords,
  onOpenDoPostModal,
  onLogout,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Identitas Pemkab Nagekeo */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 border border-white/10">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 tracking-wider uppercase border border-blue-400/30">
                  PEMKAB NAGEKEO • CIPTA KARYA
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Dinas PUPR</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  <Mountain className="w-3 h-3 text-cyan-400" />
                  3 MODE PETA
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Sistem Database Air Bersih Nagekeo
              </h1>
              <p className="text-[11px] text-slate-400">
                Penyelenggaraan Sarana Air Minum & Pemetaan Spasial Jaringan Perpipaan
              </p>
            </div>
          </div>

          {/* Bagian Status Webhook, Tombol Salin doPost, dan Logout */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Indikator Webhook */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs flex items-center gap-2 shadow-2xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <div>
                <span className="text-slate-300 text-[11px] block leading-tight font-medium">
                  Webhook Sheet: <strong className="text-emerald-400">Aktif</strong>
                </span>
              </div>
            </div>

            {/* Tombol Lihat/Salin Script doPost Google Sheet */}
            <button
              type="button"
              onClick={onOpenDoPostModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/90 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs border border-blue-400/30 transition-colors cursor-pointer"
              title="Lihat & Salin Script doPost Google Apps Script"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-200" />
              <span>Script doPost</span>
            </button>

            {/* Tombol Logout */}
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Keluar dari sesi"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
