import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle,
  FileSpreadsheet,
  Upload,
  Database,
  Trash2
} from 'lucide-react';
import { SaranaAirBersih, KondisiStatus } from '../../types/water';
import { KECAMATAN_NAGEKEO, JENIS_SUMBER_OPTIONS } from '../../data/defaultNagekeoData';
import { downloadDatasetAsCSV, generateSheetRowText, parseCSVToWaterData } from '../../services/googleSheetService';

interface WaterDataTableTabProps {
  waterData: SaranaAirBersih[];
  onSelectItem: (item: SaranaAirBersih) => void;
  onNavigateTab: (tabId: string) => void;
  onImportData?: (imported: SaranaAirBersih[]) => void;
  onDeleteItem?: (id: string) => void;
  onClearAll?: () => void;
}

export const WaterDataTableTab: React.FC<WaterDataTableTabProps> = ({
  waterData,
  onSelectItem,
  onNavigateTab,
  onImportData,
  onDeleteItem,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('Semua Kecamatan');
  const [selectedKondisi, setSelectedKondisi] = useState<string>('Semua');
  const [selectedSumber, setSelectedSumber] = useState<string>('Semua');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredData = useMemo(() => {
    return waterData.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.namaSarana.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pengelola.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keterangan.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesKecamatan =
        selectedKecamatan === 'Semua Kecamatan' || item.kecamatan === selectedKecamatan;

      const matchesKondisi =
        selectedKondisi === 'Semua' || item.kondisi === selectedKondisi;

      const matchesSumber =
        selectedSumber === 'Semua' || item.jenisSumber === selectedSumber;

      return matchesSearch && matchesKecamatan && matchesKondisi && matchesSumber;
    });
  }, [waterData, searchTerm, selectedKecamatan, selectedKondisi, selectedSumber]);

  const handleCopySingleRow = (e: React.MouseEvent, item: SaranaAirBersih) => {
    e.stopPropagation();
    const row = generateSheetRowText(item);
    navigator.clipboard.writeText(row);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    downloadDatasetAsCSV(filteredData, `database_air_bersih_nagekeo_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text && onImportData) {
        const parsed = parseCSVToWaterData(text);
        if (parsed.length > 0) {
          onImportData(parsed);
        }
      }
    };
    reader.readAsText(file);
  };

  const getStatusBadge = (kondisi: KondisiStatus) => {
    switch (kondisi) {
      case 'Berfungsi Baik':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-3 h-3" /> Baik
          </span>
        );
      case 'Rusak Ringan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3 h-3" /> Ringan
          </span>
        );
      case 'Rusak Berat':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" /> Rusak Berat
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header Tab */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              REPOSITORI MASTER
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            Tabel Master Database Air Bersih Nagekeo
          </h2>
          <p className="text-xs text-slate-500">
            Arsip data sarana fisik, kapasitas debit, dan sambungan rumah terhubung Google Sheet
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* File Input hidden untuk CSV */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Import data dari file CSV Google Sheet"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Impor CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Download CSV untuk Google Sheet"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Ekspor CSV</span>
          </button>

          {waterData.length > 0 && onClearAll && (
            <button
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin menghapus seluruh data sarana air ini?')) {
                  onClearAll();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition-colors cursor-pointer"
              title="Hapus semua baris data"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Hapus Semua</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('add')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Registrasi Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama sarana / desa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="relative">
            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
            >
              {KECAMATAN_NAGEKEO.map((kec) => (
                <option key={kec} value={kec}>
                  {kec}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedKondisi}
              onChange={(e) => setSelectedKondisi(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
            >
              <option value="Semua">Semua Kondisi Fisik</option>
              <option value="Berfungsi Baik">Berfungsi Baik</option>
              <option value="Rusak Ringan">Rusak Ringan</option>
              <option value="Rusak Berat">Rusak Berat</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedSumber}
              onChange={(e) => setSelectedSumber(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
            >
              <option value="Semua">Semua Jenis Sumber</option>
              {JENIS_SUMBER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Menampilkan <strong>{filteredData.length}</strong> dari {waterData.length} sarana air</span>
          </div>

          {(searchTerm || selectedKecamatan !== 'Semua Kecamatan' || selectedKondisi !== 'Semua' || selectedSumber !== 'Semua') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedKecamatan('Semua Kecamatan');
                setSelectedKondisi('Semua');
                setSelectedSumber('Semua');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Tabel Data Interaktif */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {waterData.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <Database className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-800">
                Belum Ada Data Sarana Air (Bebas Data Dummy)
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Tabel siap menerima data riil dari Google Sheet resmi Cipta Karya PUPR Nagekeo atau melalui registrasi sarana baru.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('add')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Registrasi Sarana Pertama</span>
              </button>
              <button
                onClick={() => onNavigateTab('map')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <span>Buka Peta Topografi</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">ID Kode</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Nama Sarana SPAM</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Wilayah</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Sumber Air</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Sistem</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px] text-right">Debit (L/s)</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px] text-right">SR (Unit)</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Kondisi</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      Tidak ada data yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className="hover:bg-blue-50/60 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                        {item.id}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.namaSarana}
                        {item.dusun && (
                          <span className="block text-[11px] font-normal text-slate-500">
                            {item.dusun}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        <span className="font-semibold block">{item.kecamatan}</span>
                        <span className="text-[11px] text-slate-500">Desa {item.desa}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        <span className="font-semibold block">{item.jenisSumber}</span>
                        {item.namaSumberAir && (
                          <span className="text-[11px] font-medium text-blue-700 block">
                            💧 {item.namaSumberAir}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                        {item.sistemDistribusi}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-blue-900 whitespace-nowrap">
                        {item.debitLiterPerDetik.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                        {item.jumlahSR}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(item.kondisi)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectItem(item)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Lihat Detail Lengkap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={(e) => handleCopySingleRow(e, item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                            title="Copy baris untuk Google Sheet"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {onDeleteItem && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteItem(item.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Sarana Ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Info */}
        {waterData.length > 0 && (
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <span>
              💡 Klik baris sarana untuk membuka kartu spesifikasi teknis dan catatan fisik.
            </span>
            <span className="font-semibold text-slate-700">
              Total Kapasitas: {filteredData.reduce((a, b) => a + b.debitLiterPerDetik, 0).toFixed(1)} L/s | {filteredData.reduce((a, b) => a + b.jumlahSR, 0)} SR
            </span>
          </div>
        )}
      </div>

    </div>
  );
};
