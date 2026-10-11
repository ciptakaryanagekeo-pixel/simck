/**
 * Google Apps Script (doPost & doGet) siap salin untuk Google Sheet Dinas PUPR Nagekeo.
 * Buka Google Sheets -> Ekstensi (Extensions) -> Apps Script -> Tempel kode ini -> Deploy sebagai Web App.
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =====================================================================
 * SISTEM INFORMASI DATABASE AIR BERSIH KABUPATEN NAGEKEO (CIPTA KARYA)
 * Google Apps Script Web App Endpoint (doPost & doGet - Dua Arah / Insert & Delete)
 * =====================================================================
 * PANDUAN PEMASANGAN:
 * 1. Buka spreadsheet Google Sheets data air bersih Anda
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script"
 * 3. Hapus kode yang ada, lalu tempel SELURUH KODE di bawah ini
 * 4. Klik ikon "Simpan" (Ctrl+S)
 * 5. Klik "Terapkan" (Deploy) > "Penerapan baru" (New deployment)
 * 6. Pilih jenis: "Aplikasi web" (Web app)
 * 7. Pada 'Akses siapa saja' (Who has access), pilih: "Siapa saja" (Anyone)
 * 8. Klik "Terapkan", salin URL Web App yang dihasilkan.
 */

// 1. Fungsi penanganan POST (Menerima input baru atau perintah hapus dua arah dari Web Applet)
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Kunci selama 10 detik

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    // Tangani aksi HAPUS (DELETE) dua arah
    if (payload.action === 'delete' && payload.id) {
      var targetId = String(payload.id).trim();
      var rows = sheet.getDataRange().getValues();
      var deletedCount = 0;

      // Telusuri dari baris terbawah ke baris ke-2 (1-indexed)
      for (var i = rows.length - 1; i >= 1; i--) {
        var rowId = String(rows[i][0] || "").trim();
        if (rowId === targetId) {
          sheet.deleteRow(i + 1);
          deletedCount++;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Data dengan ID " + targetId + " berhasil dihapus dari Google Sheet!",
        deletedRows: deletedCount
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Pastikan header kolom sudah ada jika lembar masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID Sarana",
        "Nama Sarana",
        "Kecamatan",
        "Desa",
        "Dusun",
        "Jenis Sumber",
        "Nama Sumber Air",
        "Sistem Distribusi",
        "Debit (L/s)",
        "Jumlah SR",
        "Jiwa Terlayani",
        "Kondisi",
        "Tahun Bangun",
        "Sumber Dana",
        "Pengelola",
        "Latitude",
        "Longitude",
        "Keterangan",
        "Waktu Input"
      ]);
      sheet.getRange(1, 1, 1, 19).setFontWeight("bold").setBackground("#dbeafe");
    }

    var d = payload.data || payload;

    // Masukkan baris baru ke Google Sheet
    sheet.appendRow([
      d.id || ("SPAM-" + Utilities.formatDate(new Date(), "GMT+8", "yyyyMMdd-HHmmss")),
      d.namaSarana || "-",
      d.kecamatan || "Aesesa",
      d.desa || "-",
      d.dusun || "",
      d.jenisSumber || "Mata Air",
      d.namaSumberAir || "",
      d.sistemDistribusi || "Perpipaan Gravitasi",
      Number(d.debitLiterPerDetik) || 0,
      Number(d.jumlahSR) || 0,
      Number(d.jiwaTerlayani) || (Number(d.jumlahSR) * 5),
      d.kondisi || "Berfungsi Baik",
      Number(d.tahunBangun) || new Date().getFullYear(),
      d.sumberDana || "APBD",
      d.pengelola || "KPSPAM",
      Number(d.koordinatLat) || -8.675,
      Number(d.koordinatLng) || 121.285,
      d.keterangan || "",
      Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss") + " WITA"
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data sarana air bersih berhasil dicatat ke Google Sheet Nagekeo!",
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// 2. Fungsi penanganan GET (Membaca seluruh data sheet untuk aplikasi)
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();

    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        total: 0,
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = [];

    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      data.push({
        id: String(row[0] || ""),
        namaSarana: String(row[1] || ""),
        kecamatan: String(row[2] || ""),
        desa: String(row[3] || ""),
        dusun: String(row[4] || ""),
        jenisSumber: String(row[5] || "Mata Air"),
        namaSumberAir: String(row[6] || ""),
        sistemDistribusi: String(row[7] || "Perpipaan Gravitasi"),
        debitLiterPerDetik: Number(row[8]) || 0,
        jumlahSR: Number(row[9]) || 0,
        jiwaTerlayani: Number(row[10]) || 0,
        kondisi: String(row[11] || "Berfungsi Baik"),
        tahunBangun: Number(row[12]) || 2024,
        sumberDana: String(row[13] || ""),
        pengelola: String(row[14] || ""),
        koordinatLat: Number(row[15]) || -8.675,
        koordinatLng: Number(row[16]) || 121.285,
        keterangan: String(row[17] || "")
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      total: data.length,
      data: data
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
