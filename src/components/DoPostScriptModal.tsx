import React, { useState } from 'react';
import { X, Copy, Check, Code2, ExternalLink, HelpCircle } from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/appsScriptSnippet';

interface DoPostScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoPostScriptModal: React.FC<DoPostScriptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">
                Script Webhook Google Apps Script (doPost & doGet)
              </h3>
              <p className="text-xs text-slate-400">
                Salin kode ini ke Google Sheets (Ekstensi &gt; Apps Script) untuk integrasi webhook otomatis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Isi Panduan Singkat */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 text-blue-900 space-y-2">
            <strong className="block text-blue-950 text-sm flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Langkah Singkat Pemasangan di Google Sheet:
            </strong>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
              <li>Buka spreadsheet Google Sheets Anda.</li>
              <li>Klik menu <strong>Ekstensi (Extensions) &gt; Apps Script</strong>.</li>
              <li>Hapus tulisan default yang ada, lalu <strong>tempel (paste)</strong> kode di bawah ini.</li>
              <li>Klik <strong>Simpan (Ctrl+S)</strong>.</li>
              <li>Klik tombol biru <strong>Terapkan (Deploy) &gt; Penerapan baru (New deployment)</strong>.</li>
              <li>Pilih jenis: <strong>Aplikasi web (Web app)</strong>.</li>
              <li>Pada bagian <em>Siapa yang memiliki akses (Who has access)</em>, pilih: <strong>Siapa saja (Anyone)</strong>.</li>
              <li>Klik <strong>Terapkan</strong>, dan selesai! Webhook siap menerima input data secara otomatis.</li>
            </ol>
          </div>

          {/* Area Kode Siap Salin */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 text-slate-100">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
              <span className="font-mono text-[11px] text-cyan-400 font-bold">
                Kode.gs (Google Apps Script)
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Kode Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Seluruh Kode</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto max-h-[300px] text-slate-300 selection:bg-blue-600">
              {GOOGLE_APPS_SCRIPT_CODE}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Dinas PUPR Kabupaten Nagekeo • Bidang Cipta Karya
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-colors cursor-pointer"
          >
            Tutup Jendela
          </button>
        </div>

      </div>
    </div>
  );
};
