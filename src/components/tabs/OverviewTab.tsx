import React from 'react';
import { 
  Droplet, 
  Users, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  TrendingUp,
  Layers,
  ArrowRight,
  Database,
  MapPin,
  Plus
} from 'lucide-react';
import { SaranaAirBersih } from '../../types/water';

interface OverviewTabProps {
  waterData: SaranaAirBersih[];
  onNavigateTab: (tabId: string) => void;
  onSelectItem: (item: SaranaAirBersih) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  waterData,
  onNavigateTab,
  onSelectItem,
}) => {
  const totalSPAM = waterData.length;
  const totalSR = waterData.reduce((acc, item) => acc + item.jumlahSR, 0);
  const totalJiwa = waterData.reduce((acc, item) => acc + item.jiwaTerlayani, 0);
  const totalDebit = waterData.reduce((acc, item) => acc + item.debitLiterPerDetik, 0);

  const berfungsiBaik = waterData.filter((i) => i.kondisi === 'Berfungsi Baik').length;
  const rusakRingan = waterData.filter((i) => i.kondisi === 'Rusak Ringan').length;
  const rusakBerat = waterData.filter((i) => i.kondisi === 'Rusak Berat').length;

  const persenBaik = totalSPAM > 0 ? Math.round((berfungsiBaik / totalSPAM) * 100) : 0;
  const persenRingan = totalSPAM > 0 ? Math.round((rusakRingan / totalSPAM) * 100) : 0;
  const persenBerat = totalSPAM > 0 ? Math.round((rusakBerat / totalSPAM) * 100) : 0;

  const sumberMataAir = waterData.filter((i) => i.jenisSumber === 'Mata Air').length;
  const sumberSumurBor = waterData.filter((i) => i.jenisSumber === 'Sumur Bor').length;
  const sumberLainnya = totalSPAM - (sumberMataAir + sumberSumurBor);

  return (
    <div className="space-y-6">
      
      {/* Banner Resmi Eksekutif */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6.5 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-widest">
              SISTEM INFORMASI DATA AIR BERSIH • KABUPATEN NAGEKEO
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Portal Database Sarana Air Minum (SPAM)
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) - Bidang Cipta Karya.
            Backend server tersinkronisasi langsung dengan Google Sheet dan pemetaan spasial georeferensi Leaflet.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('map')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Buka Peta Topografi Leaflet</span>
            </button>
            <button
              onClick={() => onNavigateTab('table')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Buka Tabel Database</span>
            </button>
            <button
              onClick={() => onNavigateTab('add')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-semibold rounded-xl border border-blue-700/50 transition-colors cursor-pointer"
            >
              <span>+ Registrasi Sarana Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid 4 Kartu Metrik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Titik Sarana
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
              <Droplet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">{totalSPAM}</span>
            <span className="text-xs font-medium text-slate-500 ml-1.5">Unit Titik</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Layers className="w-3 h-3 text-blue-600" /> Terdata di 7 Kecamatan
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Sambungan Rumah (SR)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">
              {totalSR.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-medium text-slate-500 ml-1.5">SR</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Users className="w-3 h-3 text-emerald-600" /> Melayani ~{totalJiwa.toLocaleString('id-ID')} Jiwa
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Kapasitas Debit
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-100">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">
              {totalDebit.toFixed(1)}
            </span>
            <span className="text-xs font-medium text-slate-500 ml-1.5">L/detik</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Rerata {(totalDebit / (totalSPAM || 1)).toFixed(1)} L/detik per titik
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Kondisi Berfungsi
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">{persenBaik}%</span>
            <span className="text-xs font-medium text-emerald-600 ml-1.5">Kondisi Baik</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {berfungsiBaik} dari {totalSPAM} titik berjalan normal
          </p>
        </div>

      </div>

      {/* Jika Data Masih Kosong */}
      {totalSPAM === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Database className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-800">
              Database Bersih & Siap Menerima Data Riil
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Semua data dummy telah dibersihkan. Anda dapat langsung menghubungkan Google Sheet resmi dinas, mengunggah file CSV, atau mengentri data sarana air pertama.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('map')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Buka Peta Topografi</span>
            </button>
            <button
              onClick={() => onNavigateTab('add')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Registrasi Sarana Pertama</span>
            </button>
          </div>
        </div>
      ) : (
        /* Status Kelaikan & Jenis Sumber */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Status Kelaikan Fisik Sarana Air</h3>
                <p className="text-xs text-slate-500">Kondisi operasional jaringan perpipaan di lapangan</p>
              </div>
              <span className="text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                {totalSPAM} Sarana
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Berfungsi Baik
                  </span>
                  <span className="font-mono text-slate-900 font-bold">
                    {berfungsiBaik} titik ({persenBaik}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${persenBaik}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Rusak Ringan
                  </span>
                  <span className="font-mono text-slate-900 font-bold">
                    {rusakRingan} titik ({persenRingan}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${persenRingan}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rusak Berat
                  </span>
                  <span className="font-mono text-slate-900 font-bold">
                    {rusakBerat} titik ({persenBerat}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: `${persenBerat}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Klasifikasi Sumber Air Baku</h3>
                <p className="text-xs text-slate-500">Tipe sumber air baku di Kabupaten Nagekeo</p>
              </div>
              <span className="text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                Nagekeo
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-100 text-center">
                <span className="text-2xl font-black text-blue-900 block">{sumberMataAir}</span>
                <span className="text-xs font-semibold text-blue-800 block mt-1">Mata Air</span>
              </div>

              <div className="p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-100 text-center">
                <span className="text-2xl font-black text-indigo-900 block">{sumberSumurBor}</span>
                <span className="text-xs font-semibold text-indigo-800 block mt-1">Sumur Bor</span>
              </div>

              <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-100 text-center">
                <span className="text-2xl font-black text-emerald-900 block">{sumberLainnya}</span>
                <span className="text-xs font-semibold text-emerald-800 block mt-1">Embung / PAH</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span>Pemanfaatan Kapasitas:</span>
                <span className="font-semibold text-slate-800">{totalDebit.toFixed(1)} Liter / Detik</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Cakupan Rumah Tangga:</span>
                <span className="font-semibold text-slate-800">{totalSR} Sambungan Rumah (SR)</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Daftar Cuplikan Terkini jika ada */}
      {totalSPAM > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Titik Sarana Air Terkini</h3>
              <p className="text-xs text-slate-500">Klik baris untuk melihat spesifikasi teknis dan peta</p>
            </div>
            <button
              onClick={() => onNavigateTab('table')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Lihat Semua ({waterData.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold">Kode</th>
                  <th className="py-2.5 px-3 font-semibold">Nama Sarana SPAM</th>
                  <th className="py-2.5 px-3 font-semibold">Kecamatan</th>
                  <th className="py-2.5 px-3 font-semibold">Sumber</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Debit (L/s)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Sambungan (SR)</th>
                  <th className="py-2.5 px-3 font-semibold">Kondisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {waterData.slice(0, 5).map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-500">{item.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{item.namaSarana}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.kecamatan} ({item.desa})</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.jenisSumber}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-700">{item.debitLiterPerDetik}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-700">{item.jumlahSR}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.kondisi === 'Berfungsi Baik'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.kondisi === 'Rusak Ringan'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.kondisi}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
