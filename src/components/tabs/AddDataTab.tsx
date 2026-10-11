import React, { useState } from 'react';
import { PlusCircle, Save, MapPin, AlertCircle, Crosshair, CheckCircle2 } from 'lucide-react';
import { SaranaAirBersih, JenisSumber, KondisiStatus, SistemDistribusi } from '../../types/water';
import { KECAMATAN_NAGEKEO, JENIS_SUMBER_OPTIONS, KONDISI_OPTIONS } from '../../data/defaultNagekeoData';
import { sendDataToGoogleSheetWebhook } from '../../services/googleSheetService';
import { LeafletMap } from '../LeafletMap';

interface AddDataTabProps {
  onAddRecord: (record: SaranaAirBersih) => void;
  existingCount: number;
  onNavigateTab: (tabId: string) => void;
}

export const AddDataTab: React.FC<AddDataTabProps> = ({
  onAddRecord,
  existingCount,
  onNavigateTab,
}) => {
  const [formData, setFormData] = useState<Partial<SaranaAirBersih>>({
    id: `SPAM-NAG-${(existingCount + 1).toString().padStart(3, '0')}`,
    namaSarana: '',
    kecamatan: 'Aesesa',
    desa: '',
    dusun: '',
    jenisSumber: 'Mata Air',
    sistemDistribusi: 'Perpipaan Gravitasi',
    debitLiterPerDetik: 5.0,
    jumlahSR: 100,
    jiwaTerlayani: 500,
    kondisi: 'Berfungsi Baik',
    tahunBangun: new Date().getFullYear(),
    sumberDana: 'DAK Air Minum & APBD',
    pengelola: 'KPSPAM',
    koordinatLat: -8.675,
    koordinatLng: 121.285,
    keterangan: '',
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namaSarana?.trim()) {
      setNotification({ message: 'Mohon isi Nama Sarana Air Minum / SPAM', type: 'error' });
      return;
    }
    if (!formData.desa?.trim()) {
      setNotification({ message: 'Mohon isi Nama Desa / Kelurahan', type: 'error' });
      return;
    }

    setIsSubmitting(true);

    const newRecord: SaranaAirBersih = {
      id: formData.id || `SPAM-NAG-${Date.now()}`,
      namaSarana: formData.namaSarana.trim(),
      kecamatan: formData.kecamatan || 'Aesesa',
      desa: formData.desa.trim(),
      dusun: formData.dusun?.trim() || '',
      jenisSumber: (formData.jenisSumber as JenisSumber) || 'Mata Air',
      sistemDistribusi: (formData.sistemDistribusi as SistemDistribusi) || 'Perpipaan Gravitasi',
      debitLiterPerDetik: Number(formData.debitLiterPerDetik) || 0,
      jumlahSR: Number(formData.jumlahSR) || 0,
      jiwaTerlayani: Number(formData.jiwaTerlayani) || (Number(formData.jumlahSR) * 5),
      kondisi: (formData.kondisi as KondisiStatus) || 'Berfungsi Baik',
      tahunBangun: Number(formData.tahunBangun) || new Date().getFullYear(),
      sumberDana: formData.sumberDana?.trim() || 'APBD',
      pengelola: formData.pengelola?.trim() || 'KPSPAM',
      koordinatLat: Number(formData.koordinatLat) || -8.675,
      koordinatLng: Number(formData.koordinatLng) || 121.285,
      keterangan: formData.keterangan?.trim() || '',
    };

    // 1. Simpan ke database lokal
    onAddRecord(newRecord);

    // 2. Kirim otomatis ke Webhook Google Sheet di latar belakang
    await sendDataToGoogleSheetWebhook(newRecord);

    setIsSubmitting(false);
    setNotification({
      message: `Sarana "${newRecord.namaSarana}" berhasil diregistrasi dan terkirim otomatis ke Google Sheet via webhook!`,
      type: 'success',
    });

    setFormData((prev) => ({
      ...prev,
      id: `SPAM-NAG-${(existingCount + 2).toString().padStart(3, '0')}`,
      namaSarana: '',
      desa: '',
      dusun: '',
      keterangan: '',
    }));
  };

  const handlePickCoord = (coord: { lat: number; lng: number }) => {
    setFormData((prev) => ({
      ...prev,
      koordinatLat: coord.lat,
      koordinatLng: coord.lng,
    }));
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              REGISTRASI OTOMATIS KE GOOGLE SHEET
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            Entri Data Sarana Air Bersih Baru
          </h2>
          <p className="text-xs text-slate-500">
            Data yang disimpan akan langsung diteruskan otomatis ke Google Sheet melalui webhook tertanam
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-semibold">Webhook Otomatis Aktif</span>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{notification.message}</span>
          </div>
          {notification.type === 'success' && (
            <button
              onClick={() => onNavigateTab('table')}
              className="text-xs font-bold underline hover:no-underline cursor-pointer"
            >
              Lihat di Tabel Data →
            </button>
          )}
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
        
        {/* Seksi 1: Lokasi & Penentuan Titik GPS Leaflet Topografi */}
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              1. Lokasi & Titik Koordinat GPS (Mode Topografi - Bebas API Key)
            </h3>
            <button
              type="button"
              onClick={() => setShowMapPicker(!showMapPicker)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{showMapPicker ? 'Sembunyikan Peta Topografi' : 'Buka Peta Topografi'}</span>
            </button>
          </div>

          {showMapPicker && (
            <div className="mb-4">
              <LeafletMap
                data={[]}
                pickerMode={true}
                pickedCoord={{
                  lat: Number(formData.koordinatLat) || -8.675,
                  lng: Number(formData.koordinatLng) || 121.285,
                }}
                onPickCoord={handlePickCoord}
                heightClass="h-[320px]"
              />
              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Klik di kontur peta topografi atau geser pin untuk menetapkan koordinat Latitude dan Longitude secara instan.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Kode / ID Sarana
              </label>
              <input
                type="text"
                required
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Kecamatan <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.kecamatan}
                onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {KECAMATAN_NAGEKEO.filter((k) => k !== 'Semua Kecamatan').map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Desa / Kelurahan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Danga / Marapokot / Rigi"
                value={formData.desa}
                onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Dusun / Kampung
              </label>
              <input
                type="text"
                placeholder="Contoh: Kolo / Wae Bawa"
                value={formData.dusun}
                onChange={(e) => setFormData({ ...formData, dusun: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Nama Sarana SPAM / Intake <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: SPAM Jaringan Pipa Gravitasi Wae Mokel"
                value={formData.namaSarana}
                onChange={(e) => setFormData({ ...formData, namaSarana: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Latitude GPS
              </label>
              <input
                type="number"
                step="0.00001"
                value={formData.koordinatLat}
                onChange={(e) => setFormData({ ...formData, koordinatLat: parseFloat(e.target.value) || -8.675 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Longitude GPS
              </label>
              <input
                type="number"
                step="0.00001"
                value={formData.koordinatLng}
                onChange={(e) => setFormData({ ...formData, koordinatLng: parseFloat(e.target.value) || 121.285 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Seksi 2: Parameter Teknis */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            2. Parameter Teknis Debit & Layanan Masyarakat
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Jenis Sumber Air Baku
              </label>
              <select
                value={formData.jenisSumber}
                onChange={(e) => setFormData({ ...formData, jenisSumber: e.target.value as JenisSumber })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                {JENIS_SUMBER_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Sistem Distribusi
              </label>
              <select
                value={formData.sistemDistribusi}
                onChange={(e) => setFormData({ ...formData, sistemDistribusi: e.target.value as SistemDistribusi })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="Perpipaan Gravitasi">Perpipaan Gravitasi</option>
                <option value="Perpipaan Pompa">Perpipaan Pompa</option>
                <option value="Kombinasi Pompa & Gravitasi">Kombinasi Pompa & Gravitasi</option>
                <option value="Non-Perpipaan">Non-Perpipaan</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Debit Air (Liter / Detik)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.debitLiterPerDetik}
                onChange={(e) => setFormData({ ...formData, debitLiterPerDetik: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Sambungan Rumah (SR)
              </label>
              <input
                type="number"
                min="0"
                value={formData.jumlahSR}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setFormData({
                    ...formData,
                    jumlahSR: val,
                    jiwaTerlayani: val * 5,
                  });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Jiwa Terlayani (Jiwa)
              </label>
              <input
                type="number"
                min="0"
                value={formData.jiwaTerlayani}
                onChange={(e) => setFormData({ ...formData, jiwaTerlayani: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Status Kondisi Fisik
              </label>
              <select
                value={formData.kondisi}
                onChange={(e) => setFormData({ ...formData, kondisi: e.target.value as KondisiStatus })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                {KONDISI_OPTIONS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tahun Bangun
              </label>
              <input
                type="number"
                min="1990"
                max="2035"
                value={formData.tahunBangun}
                onChange={(e) => setFormData({ ...formData, tahunBangun: parseInt(e.target.value, 10) || 2024 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Sumber Anggaran
              </label>
              <input
                type="text"
                placeholder="DAK / APBD / PAMSIMAS"
                value={formData.sumberDana}
                onChange={(e) => setFormData({ ...formData, sumberDana: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Seksi 3: Pengelola & Keterangan */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            3. Lembaga Pengelola & Catatan Teknis Lapangan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Lembaga Pengelola
              </label>
              <input
                type="text"
                placeholder="Contoh: KPSPAM Wae Rii / UPTD PUPR"
                value={formData.pengelola}
                onChange={(e) => setFormData({ ...formData, pengelola: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Catatan Kondisi Fisik Jaringan & Masalah Teknis
              </label>
              <input
                type="text"
                placeholder="Contoh: Reservoir 30 m3 baik, pipa transmisi aman, debit terjaga..."
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Data tersimpan di sistem dan langsung terkirim otomatis ke Google Sheet via webhook.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors text-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Mengirim ke Webhook...' : 'Simpan & Kirim ke Google Sheet'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
