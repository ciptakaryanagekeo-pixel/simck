import { SaranaAirBersih } from '../types/water';

// Data dikosongkan sesuai permintaan (tanpa data dummy).
// Seluruh data bersumber murni dari Google Sheet pengguna atau input riil.
export const DEFAULT_NAGEKEO_WATER_DATA: SaranaAirBersih[] = [];

export const KECAMATAN_NAGEKEO = [
  'Semua Kecamatan',
  'Aesesa',
  'Aesesa Selatan',
  'Boawae',
  'Mauponggo',
  'Keo Tengah',
  'Nangaroro',
  'Wolowae',
] as const;

export const JENIS_SUMBER_OPTIONS = [
  'Mata Air',
  'Sumur Bor',
  'Sungai / Air Permukaan',
  'Embung',
  'Penampungan Air Hujan (PAH)',
] as const;

export const KONDISI_OPTIONS = [
  'Berfungsi Baik',
  'Rusak Ringan',
  'Rusak Berat',
] as const;
