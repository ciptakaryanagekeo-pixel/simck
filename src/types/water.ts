export type KondisiStatus = 'Berfungsi Baik' | 'Rusak Ringan' | 'Rusak Berat';
export type JenisSumber = 'Mata Air' | 'Sumur Bor' | 'Sungai / Air Permukaan' | 'Embung' | 'Penampungan Air Hujan (PAH)';
export type SistemDistribusi = 'Perpipaan Gravitasi' | 'Perpipaan Pompa' | 'Kombinasi Pompa & Gravitasi' | 'Non-Perpipaan';

export interface SaranaAirBersih {
  id: string;
  namaSarana: string;
  kecamatan: string;
  desa: string;
  dusun?: string;
  jenisSumber: JenisSumber;
  namaSumberAir?: string; // Nama Mata Air / Nama Sumur Bor / Nama Sungai / Nama Embung / Nama PAH
  sistemDistribusi: SistemDistribusi;
  debitLiterPerDetik: number;
  jumlahSR: number; // Sambungan Rumah
  jiwaTerlayani: number;
  kondisi: KondisiStatus;
  tahunBangun: number;
  sumberDana: string; // DAK, APBD, PAMSIMAS, dll.
  pengelola: string; // KPSPAM, PDAM/Perumda, Desa, Pokmas
  koordinatLat: number;
  koordinatLng: number;
  keterangan: string;
}

export interface GoogleSheetConfig {
  sheetUrl: string;
  sheetId: string;
  sheetTabName: string;
  lastSyncedAt: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}
