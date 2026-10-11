import React, { useState } from 'react';
import { Building2, Droplets, Users, ShieldCheck, AlertTriangle, XCircle, ChevronRight, ArrowLeft, Database, Plus } from 'lucide-react';
import { SaranaAirBersih } from '../../types/water';
import { KECAMATAN_NAGEKEO } from '../../data/defaultNagekeoData';

interface DistrictsTabProps {
  waterData: SaranaAirBersih[];
  onSelectItem: (item: SaranaAirBersih) => void;
  onNavigateTab: (tabId: string) => void;
}

export const DistrictsTab: React.FC<DistrictsTabProps> = ({
  waterData,
  onSelectItem,
  onNavigateTab,
}) => {
  const [selectedKec, setSelectedKec] = useState<string | null>(null);

  const kecamatanList = KECAMATAN_NAGEKEO.filter((k) => k !== 'Semua Kecamatan');

  const statsPerKecamatan = kecamatanList.map((kec) => {
    const items = waterData.filter((i) => i.kecamatan === kec);
    const totalDebit = items.reduce((a, b) => a + b.debitLiterPerDetik, 0);
    const totalSR = items.reduce((a, b) => a + b.jumlahSR, 0);
    const totalJiwa = items.reduce((a, b) => a + b.jiwaTerlayani, 0);
    const baik = items.filter((i) => i.kondisi === 'Berfungsi Baik').length;
    const rusakRingan = items.filter((i) => i.kondisi === 'Rusak Ringan').length;
    const rusakBerat = items.filter((i) => i.kondisi === 'Rusak Berat').length;

    return {
      nama: kec,
      totalSarana: items.length,
      totalDebit,
      totalSR,
      totalJiwa,
      baik,
      rusakRingan,
      rusakBerat,
      items,
    };
  });

  const selectedStats = statsPerKecamatan.find((s) => s.nama === selectedKec);

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              DISTRIK & WILAYAH
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            {selectedKec ? `Profil Air Bersih: Kecamatan ${selectedKec}` : 'Profil Wilayah 7 Kecamatan di Kabupaten Nagekeo'}
          </h2>
          <p className="text-xs text-slate-500">
            {selectedKec
              ? `Daftar seluruh sarana air dan jaringan pipa di wilayah Kecamatan ${selectedKec}`
              : 'Agregasi sarana air bersih, kapasitas debit, dan sambungan rumah per kecamatan'}
          </p>
        </div>

        {selectedKec && (
          <button
            onClick={() => setSelectedKec(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Semua Kecamatan</span>
          </button>
        )}
      </div>

      {!selectedKec ? (
        <div className="space-y-4">
          {waterData.length === 0 && (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
              <span>
                💡 Belum ada data titik sarana yang diinput. Daftarkan sarana air baru untuk memuat data kecamatan otomatis.
              </span>
              <button
                onClick={() => onNavigateTab('add')}
                className="font-bold underline ml-2 cursor-pointer"
              >
                + Registrasi Sarana Baru →
              </button>
            </div>
          )}

          {/* Grid 7 Kecamatan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsPerKecamatan.map((kec) => (
              <div
                key={kec.nama}
                onClick={() => setSelectedKec(kec.nama)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      Kecamatan
                    </span>
                    <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-lg text-slate-700">
                      {kec.totalSarana} Titik
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {kec.nama}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="p-2.5 bg-blue-50/60 rounded-xl">
                      <span className="text-slate-500 text-[11px] block">Kapasitas Debit</span>
                      <span className="font-bold text-blue-900 font-mono text-sm">
                        {kec.totalDebit.toFixed(1)} <span className="text-[10px] font-normal">L/s</span>
                      </span>
                    </div>

                    <div className="p-2.5 bg-emerald-50/60 rounded-xl">
                      <span className="text-slate-500 text-[11px] block">Pelayanan SR</span>
                      <span className="font-bold text-emerald-900 font-mono text-sm">
                        {kec.totalSR.toLocaleString('id-ID')} <span className="text-[10px] font-normal">SR</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" /> {kec.baik} Baik
                    </span>
                    <span className="flex items-center gap-1 text-amber-700">
                      <AlertTriangle className="w-3.5 h-3.5" /> {kec.rusakRingan} Rusak
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Lihat Sarana {kec.nama}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {selectedStats && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-xs text-slate-500 block">Total Titik Sarana</span>
                <span className="text-2xl font-black text-slate-900">{selectedStats.totalSarana} Unit</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Total Debit</span>
                <span className="text-2xl font-black text-blue-700">{selectedStats.totalDebit.toFixed(1)} L/s</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Sambungan Rumah</span>
                <span className="text-2xl font-black text-emerald-700">{selectedStats.totalSR.toLocaleString('id-ID')} SR</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Jiwa Terlayani</span>
                <span className="text-2xl font-black text-slate-800">~{selectedStats.totalJiwa.toLocaleString('id-ID')} Jiwa</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Sarana Prasarana Air Bersih di Kec. {selectedKec}
              </h3>
              <button
                onClick={() => onNavigateTab('add')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                + Tambah di {selectedKec}
              </button>
            </div>

            {selectedStats?.items.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Belum ada sarana air yang terdaftar di Kecamatan {selectedKec}.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {selectedStats?.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="p-4 hover:bg-blue-50/50 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-500">{item.id}</span>
                        <span className="font-bold text-slate-900">{item.namaSarana}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                        <span>Desa: <strong>{item.desa}</strong></span>
                        <span>Sumber: <strong>{item.jenisSumber}</strong></span>
                        <span>Sistem: <strong>{item.sistemDistribusi}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <span className="font-mono font-bold text-blue-800">{item.debitLiterPerDetik} L/s</span>
                        <span className="block text-slate-500 font-mono">{item.jumlahSR} SR</span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                        item.kondisi === 'Berfungsi Baik'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.kondisi === 'Rusak Ringan'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.kondisi}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
