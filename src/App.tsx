/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Droplets, 
  MapPin, 
  Building2, 
  PlusCircle, 
} from 'lucide-react';
import { SaranaAirBersih } from './types/water';
import { DEFAULT_NAGEKEO_WATER_DATA } from './data/defaultNagekeoData';
import { safeStorage } from './utils/storage';
import { 
  autoFetchFromGoogleSheet,
} from './services/googleSheetService';
import { Header } from './components/Header';
import { VerticalTabs, TabItem } from './components/VerticalTabs';
import { OverviewTab } from './components/tabs/OverviewTab';
import { WaterDataTableTab } from './components/tabs/WaterDataTableTab';
import { MapDistributionTab } from './components/tabs/MapDistributionTab';
import { DistrictsTab } from './components/tabs/DistrictsTab';
import { AddDataTab } from './components/tabs/AddDataTab';
import { WaterDetailModal } from './components/WaterDetailModal';
import { LoginScreen } from './components/LoginScreen';
import { DoPostScriptModal } from './components/DoPostScriptModal';

export default function App() {
  // State Autentikasi Pengguna
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return safeStorage.getItem('nagekeo_auth_session') === 'logged_in';
  });

  const [waterData, setWaterData] = useState<SaranaAirBersih[]>(() => {
    const saved = safeStorage.getItem('nagekeo_air_bersih_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Bersihkan data dummy lama (SPAM-AES-001, Sarana Air #1..10, dsb)
          const valid = parsed.filter(
            (p: SaranaAirBersih) =>
              p.namaSarana &&
              !p.namaSarana.includes('Mbay') &&
              !/^sarana air #/i.test(p.namaSarana) &&
              p.id !== 'SPAM-AES-001'
          );
          return valid;
        }
      } catch {
        return DEFAULT_NAGEKEO_WATER_DATA;
      }
    }
    return DEFAULT_NAGEKEO_WATER_DATA;
  });

  const [activeTab, setActiveTab] = useState<string>('map');
  const [selectedItem, setSelectedItem] = useState<SaranaAirBersih | null>(null);
  const [showDoPostModal, setShowDoPostModal] = useState<boolean>(false);

  // Simpan data lokal setiap ada update (hanya simpan data yang valid tanpa placeholder)
  useEffect(() => {
    const cleanData = waterData.filter(
      (p) => p.namaSarana && !/^sarana air #/i.test(p.namaSarana) && p.id !== 'SPAM-AES-001'
    );
    safeStorage.setItem('nagekeo_air_bersih_data', JSON.stringify(cleanData));
  }, [waterData]);

  // Sinkronisasi otomatis di latar belakang saat aplikasi dibuka
  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    autoFetchFromGoogleSheet().then((remoteData) => {
      if (isMounted && remoteData && remoteData.length > 0) {
        const cleanRemote = remoteData.filter(
          (p) => p.namaSarana && !/^sarana air #/i.test(p.namaSarana)
        );
        if (cleanRemote.length > 0) {
          setWaterData(cleanRemote);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    safeStorage.setItem('nagekeo_auth_session', 'logged_in');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    safeStorage.removeItem('nagekeo_auth_session');
  };

  const handleAddRecord = (record: SaranaAirBersih) => {
    setWaterData((prev) => [record, ...prev]);
  };

  const handleDeleteRecord = (id: string) => {
    setWaterData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllRecords = () => {
    setWaterData([]);
    safeStorage.setItem('nagekeo_air_bersih_data', JSON.stringify([]));
  };

  // Jika belum login, tampilkan layar login dengan animasi air bersih
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Konfigurasi Tab Menu Vertikal
  const tabs: TabItem[] = [
    {
      id: 'map',
      label: 'Peta GIS (3 Mode)',
      subtitle: 'Topografi • Satelit • OSM',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: 'table',
      label: 'Database Sarana Air',
      subtitle: 'Tabel master SPAM',
      icon: <Droplets className="w-4 h-4" />,
      badge: waterData.length,
    },
    {
      id: 'overview',
      label: 'Ringkasan & Analisis',
      subtitle: 'Metrik agregat & status',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'districts',
      label: 'Data 7 Kecamatan',
      subtitle: 'Profil wilayah perdesaan',
      icon: <Building2 className="w-4 h-4" />,
      badge: 7,
    },
    {
      id: 'add',
      label: 'Registrasi Sarana Baru',
      subtitle: 'Input GPS & auto webhook',
      icon: <PlusCircle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      
      {/* Header Aplikasi */}
      <Header
        totalRecords={waterData.length}
        onOpenDoPostModal={() => setShowDoPostModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Content dengan Tampilan Vertikal Tab */}
      <div className="flex-1">
        <VerticalTabs
          tabs={tabs}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        >
          {activeTab === 'map' && (
            <MapDistributionTab
              waterData={waterData}
              onSelectItem={setSelectedItem}
              selectedItem={selectedItem}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'table' && (
            <WaterDataTableTab
              waterData={waterData}
              onSelectItem={setSelectedItem}
              onNavigateTab={setActiveTab}
              onImportData={(imported) => setWaterData(imported)}
              onDeleteItem={handleDeleteRecord}
              onClearAll={handleClearAllRecords}
            />
          )}

          {activeTab === 'overview' && (
            <OverviewTab
              waterData={waterData}
              onNavigateTab={setActiveTab}
              onSelectItem={setSelectedItem}
            />
          )}

          {activeTab === 'districts' && (
            <DistrictsTab
              waterData={waterData}
              onSelectItem={setSelectedItem}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'add' && (
            <AddDataTab
              onAddRecord={handleAddRecord}
              existingCount={waterData.length}
              onNavigateTab={setActiveTab}
            />
          )}
        </VerticalTabs>
      </div>

      {/* Modal Detail Sarana Air */}
      <WaterDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Modal Script doPost Google Apps Script Siap Salin */}
      <DoPostScriptModal
        isOpen={showDoPostModal}
        onClose={() => setShowDoPostModal(false)}
      />

      {/* Footer Sederhana */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            Sistem Informasi Database Air Bersih Kabupaten Nagekeo
          </p>
          <p className="mt-1">
            Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) - Bidang Cipta Karya • Webhook Google Sheet Otomatis
          </p>
        </div>
      </footer>

    </div>
  );
}
