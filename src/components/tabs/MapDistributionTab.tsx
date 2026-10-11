import React, { useState } from 'react';
import { Navigation, Filter, Info, MapPin, Database, RefreshCw, Layers } from 'lucide-react';
import { SaranaAirBersih } from '../../types/water';
import { KECAMATAN_NAGEKEO } from '../../data/defaultNagekeoData';
import { LeafletMap } from '../LeafletMap';

interface MapDistributionTabProps {
  waterData: SaranaAirBersih[];
  onSelectItem: (item: SaranaAirBersih) => void;
  selectedItem?: SaranaAirBersih | null;
  onNavigateTab: (tabId: string) => void;
}

export const MapDistributionTab: React.FC<MapDistributionTabProps> = ({
  waterData,
  onSelectItem,
  selectedItem,
  onNavigateTab,
}) => {
  const [selectedKec, setSelectedKec] = useState<string>('Semua Kecamatan');
  const [selectedKondisi, setSelectedKondisi] = useState<string>('Semua');

  const filteredItems = waterData.filter((item) => {
    const matchKec = selectedKec === 'Semua Kecamatan' || item.kecamatan === selectedKec;
    const matchKondisi = selectedKondisi === 'Semua' || item.kondisi === selectedKondisi;
    return matchKec && matchKondisi;
  });

  return (
    <div className="space-y-4">
      
      {/* Header Peta GIS */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              LEAFLET GIS ENGINE • WGS84
            </span>
            <span className="text-xs text-slate-400">Kabupaten Nagekeo</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            Peta Geospasial Sarana Air Bersih Nagekeo
          </h2>
          <p className="text-xs text-slate-500">
            Pemetaan sebaran titik intake, mata air, sumur bor, dan jaringan perpipaan se-Kabupaten Nagekeo
          </p>
        </div>

        {/* Filter Bar Peta */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedKec}
              onChange={(e) => setSelectedKec(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              {KECAMATAN_NAGEKEO.map((kec) => (
                <option key={kec} value={kec}>
                  {kec}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedKondisi}
              onChange={(e) => setSelectedKondisi(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Kondisi</option>
              <option value="Berfungsi Baik">Berfungsi Baik</option>
              <option value="Rusak Ringan">Rusak Ringan</option>
              <option value="Rusak Berat">Rusak Berat</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jika Data Masih Kosong */}
      {waterData.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
            <MapPin className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">
              Peta Siap Memetakan Data Riil Sarana Air
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Seluruh data dummy telah dihapus. Hubungkan dengan Google Sheet dinas atau masukkan titik sarana pertama untuk menampilkan pin geospasial di peta Leaflet.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('add')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>+ Input Titik Pertama</span>
            </button>
            <button
              onClick={() => onNavigateTab('table')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <span>Buka Tabel Database</span>
            </button>
          </div>
        </div>
      ) : (
        /* Peta Leaflet */
        <div className="space-y-3">
          <LeafletMap
            data={filteredItems}
            onSelectItem={onSelectItem}
            selectedItem={selectedItem}
            heightClass="h-[580px]"
          />

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>
                Menampilkan <strong>{filteredItems.length}</strong> titik sarana air terpetakan di wilayah Nagekeo.
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-600">
              Proyeksi: EPSG:3857 (WGS 84 / Pseudo-Mercator)
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
