import React, { useState } from 'react';
import { Droplets, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      // Validasi kredensial sesuai instruksi pengguna:
      // user: airbersih, password: dbs@ar2026
      if (username.trim() === 'airbersih' && password === 'dbs@ar2026') {
        onLoginSuccess();
      } else {
        setErrorMsg('Username atau Password salah. Silakan periksa kembali kredensial Anda.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden select-none bg-gradient-to-b from-sky-900 via-blue-950 to-slate-950">
      
      {/* =========================================================================
          ANIMASI LATAR BELAKANG AIR BERSIH (WATER WAVES, BUBBLES & WATER RIPPLES)
          ========================================================================= */}
      
      {/* Pencahayaan bawah air / Underwater light rays */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-blue-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
      </div>

      {/* Gelembung-gelembung air melayang (Floating aquatic bubbles) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { size: 18, left: '12%', duration: '6s', delay: '0s' },
          { size: 28, left: '22%', duration: '8s', delay: '1.5s' },
          { size: 14, left: '35%', duration: '7s', delay: '3s' },
          { size: 36, left: '48%', duration: '9s', delay: '0.8s' },
          { size: 22, left: '62%', duration: '6.5s', delay: '2s' },
          { size: 32, left: '78%', duration: '8.5s', delay: '1s' },
          { size: 16, left: '88%', duration: '5.5s', delay: '2.5s' },
          { size: 24, left: '94%', duration: '7.5s', delay: '0.2s' },
        ].map((bubble, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-cyan-300/40 bg-gradient-to-tr from-cyan-400/20 to-white/30 backdrop-blur-xs animate-bounce"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: bubble.left,
              bottom: '-40px',
              animation: `floatUp ${bubble.duration} infinite ease-in-out ${bubble.delay}`,
            }}
          />
        ))}
      </div>

      {/* Lapisan Ombak Air Bergelombang Bergerak (Layered animated SVG waves) */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none h-64 opacity-70">
        {/* Wave Layer 1 */}
        <svg
          className="absolute bottom-0 w-[200%] h-44 animate-wave text-cyan-500/20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ animation: 'waveFlow 10s linear infinite' }}
        >
          <path
            d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>

        {/* Wave Layer 2 */}
        <svg
          className="absolute bottom-0 w-[200%] h-36 text-blue-600/30"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ animation: 'waveFlowReverse 7s linear infinite' }}
        >
          <path
            d="M0,40 C200,10 400,90 600,30 C800,-30 1000,70 1200,20 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>

        {/* Wave Layer 3 (Foreground Wave) */}
        <svg
          className="absolute bottom-0 w-[200%] h-24 text-teal-600/25"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ animation: 'waveFlow 5s linear infinite' }}
        >
          <path
            d="M0,20 C300,70 600,0 900,50 C1050,75 1150,20 1200,30 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Keyframe styles untuk animasi ombak & gelembung air */}
      <style>{`
        @keyframes waveFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes waveFlowReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-110vh) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>

      {/* =========================================================================
          KARTU LOGIN RESMI CIPTA KARYA NAGEKEO (FROSTED GLASSMORPHISM)
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-8 border border-white/40 shadow-2xl shadow-cyan-950/50">
        
        {/* Header Identitas Dinas */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/30 border-2 border-white">
            <Droplets className="w-8 h-8 animate-pulse" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-[11px] font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>PEMKAB NAGEKEO • CIPTA KARYA</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Database Air Bersih
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Sistem Informasi Pengelolaan SPAM & Pemetaan Topografi Jaringan Perpipaan
          </p>
        </div>

        {/* Pesan Kesalahan */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Formulir Login */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Input Username */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Username Petugas
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all font-medium"
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi...</span>
              </span>
            ) : (
              <>
                <span>Masuk ke Sistem Database</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Kerahasiaan & Keamanan */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center gap-1.5 text-center">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Akses Terbatas Khusus Petugas & Operator Berwenang</span>
          </div>
          <span className="text-[10px] text-slate-400">
            Dinas Pekerjaan Umum dan Penataan Ruang • Kabupaten Nagekeo © 2026
          </span>
        </div>

      </div>

    </div>
  );
};
