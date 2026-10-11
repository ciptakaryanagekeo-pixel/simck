import React from 'react';
import { X, MapPin, Activity, Droplets, Calendar, Users, Award, ShieldCheck, AlertTriangle, XCircle, Copy, Check } from 'lucide-react';
import { SaranaAirBersih } from '../types/water';
import { generateSheetRowText } from '../services/googleSheetService';

interface WaterDetailModalProps {
  item: SaranaAirBersih | null;
  onClose: () => void;
}

export const WaterDetailModal: React.FC<WaterDetailModalProps> = ({ item, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!item) return null;

  const handleCopyRow = () => {
    const text = generateSheetRowText(item);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (item.kondisi) {
      case 'Berfungsi Baik':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Berfungsi Baik
          </span>
        );
      case 'Rusak Ringan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Rusak Ringan
          </span>
        );
      case 'Rusak Berat':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Rusak Berat / Non-Aktif
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
                ID: {item.id}
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {item.namaSarana}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Isi Detail */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Status & Lokasi Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-800">
                Kec. {item.kecamatan}, Desa {item.desa}
                {item.dusun ? ` (${item.dusun})` : ''}
              </span>
            </div>
            <div>{getStatusBadge()}</div>
          </div>

          {/* Grid Informasi Teknis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" /> Debit Aliran
              </span>
              <p className="text-xl font-black text-blue-900 mt-1">
                {item.debitLiterPerDetik.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-600">Liter / Detik</span>
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-gradient-to-br from-emerald-50/50 to-teal-50/30">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" /> Pelayanan Air Minum
              </span>
              <p className="text-xl font-black text-emerald-900 mt-1">
                {item.jumlahSR.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-600">SR</span>
                <span className="text-xs text-slate-500 font-medium ml-2">
                  (~{item.jiwaTerlayani.toLocaleString('id-ID')} Jiwa)
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block">Jenis Sumber Air Baku</span>
              <span className="font-semibold text-slate-800">{item.jenisSumber}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block">Sistem Distribusi</span>
              <span className="font-semibold text-slate-800">{item.sistemDistribusi}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block">Tahun Pembangunan</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> {item.tahunBangun}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block">Sumber Anggaran / Dana</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" /> {item.sumberDana}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block">Lembaga Pengelola</span>
              <span className="font-semibold text-slate-800">{item.pengelola}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block">Koordinat Geografis</span>
              <span className="font-mono text-xs font-semibold text-slate-800">
                {item.koordinatLat.toFixed(4)}, {item.koordinatLng.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Keterangan / Catatan Teknis */}
          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
            <span className="text-xs font-semibold text-blue-900 block mb-1">
              Catatan Lapangan & Kondisi Fisik Jaringan:
            </span>
            <p className="text-slate-700 leading-relaxed text-xs">
              {item.keterangan || 'Tidak ada catatan tambahan.'}
            </p>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleCopyRow}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
            title="Salin baris ini untuk ditempel di Google Sheet"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Tersalin untuk Google Sheet!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Salin Baris untuk Google Sheet</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
