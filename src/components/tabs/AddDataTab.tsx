import React, { useState } from 'react';
import { PlusCircle, Save, MapPin, AlertCircle, Crosshair, CheckCircle2 } from 'lucide-react';
import { SaranaAirBersih, JenisSumber, KondisiStatus, SistemDistribusi } from '../../types/water';
import { KECAMATAN_NAGEKEO, JENIS_SUMBER_OPTIONS, KONDISI_OPTIONS } from '../../data/defaultNagekeoData';
import { sendDataToGoogleSheetWebhook, parseCoordinateValue } from '../../services/googleSheetService';
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
    namaSumberAir: '',
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

  // State khusus string untuk input koordinat agar format desimal presisi tinggi (-8.675 & 121.2343434) tidak terpotong
  const [latInput, setLatInput] = useState<string>('-8.675');
  const [lngInput, setLngInput] = useState<string>('121.285');

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(true);

  const handleLatChange = (val: string) => {
    let clean = val.replace(',', '.');
    // Jika tidak sengaja terketik -8675 tanpa titik desimal, otomatis bantu beri titik desimal
    if (clean.startsWith('-8') && !clean.includes('.') && clean.length >= 4) {
      clean = '-8.' + clean.slice(2);
    }
    setLatInput(clean);
    const parsed = parseCoordinateValue(clean, -8.675, true);
    setFormData((prev) => ({ ...prev, koordinatLat: parsed }));
  };

  const handleLngChange = (val: string) => {
    let clean = val.replace(',', '.');
    // Jika tidak sengaja terketik 121285 atau 1212343434 tanpa titik desimal, otomatis bantu beri titik desimal
    if (clean.startsWith('121') && !clean.includes('.') && clean.length >= 5) {
      clean = '121.' + clean.slice(3);
    }
    setLngInput(clean);
    const parsed = parseCoordinateValue(clean, 121.285, false);
    setFormData((prev) => ({ ...prev, koordinatLng: parsed }));
  };

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

    const latParsed = parseCoordinateValue(latInput, -8.675, true);
    const lngParsed = parseCoordinateValue(lngInput, 121.285, false);

    const newRecord: SaranaAirBersih = {
      id: formData.id || `SPAM-NAG-${Date.now()}`,
      namaSarana: formData.namaSarana.trim(),
      kecamatan: formData.kecamatan || 'Aesesa',
      desa: formData.desa.trim(),
      dusun: formData.dusun?.trim() || '',
      jenisSumber: (formData.jenisSumber as JenisSumber) || 'Mata Air',
      namaSumberAir: formData.namaSumberAir?.trim() || '',
      sistemDistribusi: (formData.sistemDistribusi as SistemDistribusi) || 'Perpipaan Gravitasi',
      debitLiterPerDetik: Number(formData.debitLiterPerDetik) || 0,
      jumlahSR: Number(formData.jumlahSR) || 0,
      jiwaTerlayani: Number(formData.jiwaTerlayani) || (Number(formData.jumlahSR) * 5),
      kondisi: (formData.kondisi as KondisiStatus) || 'Berfungsi Baik',
      tahunBangun: Number(formData.tahunBangun) || new Date().getFullYear(),
      sumberDana: formData.sumberDana?.trim() || 'APBD',
      pengelola: formData.pengelola?.trim() || 'KPSPAM',
      koordinatLat: latParsed,
      koordinatLng: lngParsed,
      keterangan: formData.keterangan?.trim() || '',
    };

    // 1. Simpan ke database lokal
    onAddRecord(newRecord);

    // 2. Kirim otomatis ke Webhook Google Sheet di latar belakang
    await sendDataToGoogleSheetWebhook(newRecord);

    setIsSubmitting(false);
    setNotification({
      message: `Sarana "${newRecord.namaSarana}" berhasil diregistrasi (GPS: ${latParsed}, ${lngParsed}) dan terkirim ke Google Sheet!`,
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
    const latStr = String(coord.lat);
    const lngStr = String(coord.lng);
    setLatInput(latStr);
    setLngInput(lngStr);
    setFormData((prev) => ({
      ...prev,
      koordinatLat: coord.lat,
      koordinatLng: coord.lng,
    }));
  };

  const getSourceDetails = (source: JenisSumber | undefined) => {
    switch (source) {
      case 'Mata Air':
        return {
          label: 'Nama Mata Air',
          placeholder: 'Contoh: Mata Air Wae Mokel / Mata Air Wae Kolo / Wae Seser',
          helper: 'Nama mata air baku alami di lapangan',
        };
      case 'Sumur Bor':
        return {
          label: 'Nama / Kode Sumur Bor',
          placeholder: 'Contoh: Sumur Bor Danga SB-01 / SB Marapokot',
          helper: 'Nama atau nomor register sumur bor',
        };
      case 'Sungai / Air Permukaan':
        return {
          label: 'Nama Sungai / Aliran Air',
          placeholder: 'Contoh: Sungai Aesesa / Kali Wae Bawa',
          helper: 'Nama sungai atau aliran air permukaan',
        };
      case 'Embung':
        return {
          label: 'Nama Embung',
          placeholder: 'Contoh: Embung Rigi / Embung Wolowae',
          helper: 'Nama embung penampungan air baku',
        };
      case 'Penampungan Air Hujan (PAH)':
        return {
          label: 'Nama Titik / Lokasi PAH',
          placeholder: 'Contoh: PAH Komunal Dusun 2 / PAH Desa',
          helper: 'Nama fasilitas atau lokasi penampungan air hujan',
        };
      default:
        return {
          label: 'Nama Sumber Air',
          placeholder: 'Contoh: Nama sumber air baku',
          helper: 'Nama sumber air baku',
        };
    }
  };

  const activeSource = getSourceDetails(formData.jenisSumber as JenisSumber);

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
                type="text"
                inputMode="decimal"
                placeholder="Contoh: -8.675"
                value={latInput}
                onChange={(e) => handleLatChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-xs font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Format Nagekeo: <strong>-8.675</strong> (gunakan titik desimal)
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Longitude GPS
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Contoh: 121.2343434"
                value={lngInput}
                onChange={(e) => handleLngChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-xs font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Format Nagekeo: <strong>121.2343434</strong> (presisi desimal)
              </span>
            </div>
          </div>
        </div>

        {/* Seksi 2: Parameter Teknis */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            2. Parameter Teknis Debit & Layanan Masyarakat
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Jenis Sumber Air Baku
              </label>
              <select
                value={formData.jenisSumber}
                onChange={(e) => setFormData({ ...formData, jenisSumber: e.target.value as JenisSumber })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {JENIS_SUMBER_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="text-blue-600 font-bold">{activeSource.label}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.2 rounded-full font-bold">
                    Khusus {formData.jenisSumber}
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {activeSource.helper}
                </span>
              </label>
              <input
                type="text"
                placeholder={activeSource.placeholder}
                value={formData.namaSumberAir || ''}
                onChange={(e) => setFormData({ ...formData, namaSumberAir: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 bg-blue-50/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-4">
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
