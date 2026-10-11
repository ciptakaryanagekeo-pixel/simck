import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Crosshair, ZoomIn, ZoomOut, Maximize2, Droplets, Mountain, Compass, Globe } from 'lucide-react';
import { SaranaAirBersih } from '../types/water';

interface LeafletMapProps {
  data: SaranaAirBersih[];
  onSelectItem?: (item: SaranaAirBersih) => void;
  selectedItem?: SaranaAirBersih | null;
  pickerMode?: boolean;
  pickedCoord?: { lat: number; lng: number } | null;
  onPickCoord?: (coord: { lat: number; lng: number }) => void;
  heightClass?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  data,
  onSelectItem,
  selectedItem,
  pickerMode = false,
  pickedCoord,
  onPickCoord,
  heightClass = 'h-[560px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // 3 Mode Peta Sesuai Permintaan: Topografi, Citra Satelit, dan Peta Jalan
  const [mapStyle, setMapStyle] = useState<'topography' | 'satellite' | 'osm'>('topography');
  const [mouseCoord, setMouseCoord] = useState<{ lat: number; lng: number } | null>(null);

  // Koordinat pusat Kabupaten Nagekeo, Flores, NTT
  const NAGEKEO_CENTER: [number, number] = [-8.675, 121.285];

  // Inisialisasi peta
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: NAGEKEO_CENTER,
      zoom: 11,
      zoomControl: false,
    });

    // Default mode: Topografi OpenTopoMap (Bebas API Key)
    const topoTile = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Peta Topografi & Kontur &copy; OpenTopoMap (Tanpa API Key)',
    });

    topoTile.addTo(map);
    tileLayerRef.current = topoTile;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    map.on('mousemove', (e) => {
      setMouseCoord({
        lat: Number(e.latlng.lat.toFixed(5)),
        lng: Number(e.latlng.lng.toFixed(5)),
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update lapisan antara 3 MODE: Topografi, Citra Satelit, dan Peta Jalan OSM
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (mapStyle === 'topography') {
      // Mode 1: Topografi & Garis Kontur Elevasi
      const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Peta Topografi & Kontur &copy; OpenTopoMap (Bebas API Key)',
      });
      topoLayer.addTo(map);
      tileLayerRef.current = topoLayer;
    } else if (mapStyle === 'satellite') {
      // Mode 2: Citra Satelit Udara Beresolusi Tinggi
      const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Citra Satelit &copy; Esri & Maxar',
      });
      satLayer.addTo(map);
      tileLayerRef.current = satLayer;
    } else {
      // Mode 3: Peta Jalan & Permukiman OpenStreetMap
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap Kontributor',
      });
      osmLayer.addTo(map);
      tileLayerRef.current = osmLayer;
    }
  }, [mapStyle]);

  // Click handler untuk mode picker koordinat
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (pickerMode && onPickCoord) {
        onPickCoord({
          lat: Number(e.latlng.lat.toFixed(5)),
          lng: Number(e.latlng.lng.toFixed(5)),
        });
      }
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [pickerMode, onPickCoord]);

  // Render marker picker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (pickerMarkerRef.current) {
      map.removeLayer(pickerMarkerRef.current);
      pickerMarkerRef.current = null;
    }

    if (pickerMode && pickedCoord) {
      const pickerIcon = L.divIcon({
        className: 'custom-picker-pin',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: #2563eb;
            color: white;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="transform: rotate(45deg); font-weight: bold; font-size: 13px;">📍</div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([pickedCoord.lat, pickedCoord.lng], {
        icon: pickerIcon,
        draggable: true,
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        if (onPickCoord) {
          onPickCoord({
            lat: Number(pos.lat.toFixed(5)),
            lng: Number(pos.lng.toFixed(5)),
          });
        }
      });

      pickerMarkerRef.current = marker;
      map.setView([pickedCoord.lat, pickedCoord.lng], Math.max(map.getZoom(), 13));
    }
  }, [pickerMode, pickedCoord, onPickCoord]);

  // Render markers untuk data sarana air
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (data.length === 0) return;

    const bounds = L.latLngBounds([]);

    data.forEach((item) => {
      if (!item.koordinatLat || !item.koordinatLng) return;

      const lat = item.koordinatLat;
      const lng = item.koordinatLng;
      bounds.extend([lat, lng]);

      const isSelected = selectedItem?.id === item.id;
      
      const bgColor =
        item.kondisi === 'Berfungsi Baik'
          ? '#10b981'
          : item.kondisi === 'Rusak Ringan'
          ? '#f59e0b'
          : '#ef4444';

      const icon = L.divIcon({
        className: 'water-facility-marker',
        html: `
          <div style="
            width: ${isSelected ? '32px' : '26px'};
            height: ${isSelected ? '32px' : '26px'};
            background-color: ${bgColor};
            border: ${isSelected ? '3px solid #0f172a' : '2px solid #ffffff'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            color: white;
            font-size: ${isSelected ? '14px' : '11px'};
            cursor: pointer;
            transition: transform 0.2s;
          ">
            💧
          </div>
        `,
        iconSize: [isSelected ? 32 : 26, isSelected ? 32 : 26],
        iconAnchor: [isSelected ? 16 : 13, isSelected ? 16 : 13],
      });

      const marker = L.marker([lat, lng], { icon });

      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 200px; color: #0f172a;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
            <span style="font-family: monospace; font-size: 10px; font-weight: 700; color: #64748b;">${item.id}</span>
            <span style="background: ${bgColor}20; color: ${bgColor}; font-weight: 700; font-size: 10px; padding: 1px 6px; border-radius: 4px;">
              ${item.kondisi}
            </span>
          </div>
          <strong style="font-size: 13px; color: #0f172a; display: block; margin-bottom: 2px;">
            ${item.namaSarana}
          </strong>
          <div style="color: #475569; font-size: 11px; margin-bottom: 6px;">
            📍 Kec. ${item.kecamatan}, Desa ${item.desa}
          </div>
          <div style="background: #f8fafc; padding: 6px; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 11px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <div>Debit: <strong style="color: #2563eb;">${item.debitLiterPerDetik} L/s</strong></div>
            <div>Pelayanan: <strong style="color: #0f172a;">${item.jumlahSR} SR</strong></div>
            <div>Sumber: <span>${item.jenisSumber}</span></div>
            <div>Sistem: <span>${item.sistemDistribusi}</span></div>
          </div>
          <div style="margin-top: 6px; font-size: 10px; color: #64748b; font-family: monospace;">
            Koordinat: ${lat.toFixed(4)}, ${lng.toFixed(4)}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280 });

      marker.on('click', () => {
        if (onSelectItem) {
          onSelectItem(item);
        }
      });

      layer.addLayer(marker);
    });

    if (bounds.isValid() && !pickerMode) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [data, selectedItem, onSelectItem, pickerMode]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    mapInstanceRef.current?.setView(NAGEKEO_CENTER, 11);
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100`}>
      
      {/* Container Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Kontrol Kiri Atas: Switcher 3 MODE PETA (Topografi, Satelit, Jalan) */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200 text-xs gap-0.5">
        
        {/* Mode 1: Topografi */}
        <button
          type="button"
          onClick={() => setMapStyle('topography')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            mapStyle === 'topography'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Peta Topografi & Garis Kontur Elevasi (OpenTopoMap - Bebas API Key)"
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>Topografi</span>
        </button>

        {/* Mode 2: Citra Satelit */}
        <button
          type="button"
          onClick={() => setMapStyle('satellite')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            mapStyle === 'satellite'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Citra Satelit Udara Resolusi Tinggi (Esri World Imagery)"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Citra Satelit</span>
        </button>

        {/* Mode 3: Peta Jalan */}
        <button
          type="button"
          onClick={() => setMapStyle('osm')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            mapStyle === 'osm'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Peta Jalan & Permukiman Terbuka (OpenStreetMap)"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Peta Jalan</span>
        </button>

      </div>

      {/* Kontrol Kanan Atas: Zoom & Reset */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-md border border-slate-200">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Perbesar Peta"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Perkecil Peta"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleResetView}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Pusatkan ke Nagekeo"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Info Mode Picker (jika aktif) */}
      {pickerMode && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-blue-400 flex items-center gap-2">
          <Crosshair className="w-4 h-4" />
          <span>Klik titik lokasi pada peta (Topografi/Satelit/Jalan) untuk menetapkan GPS</span>
        </div>
      )}

      {/* Legend Titik Kiri Bawah */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-xs px-3.5 py-2.5 rounded-xl shadow-md border border-slate-200 text-xs">
        <div className="font-bold text-slate-800 text-[11px] mb-1.5 flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-blue-600" />
          <span>Legenda Titik Sarana Air</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Baik ({data.filter((d) => d.kondisi === 'Berfungsi Baik').length})
          </span>
          <span className="inline-flex items-center gap-1 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Rusak Ringan ({data.filter((d) => d.kondisi === 'Rusak Ringan').length})
          </span>
          <span className="inline-flex items-center gap-1 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Rusak Berat ({data.filter((d) => d.kondisi === 'Rusak Berat').length})
          </span>
        </div>
      </div>

      {/* Koordinat Cursor Realtime Kanan Bawah */}
      {mouseCoord && (
        <div className="absolute bottom-3 right-3 z-10 bg-slate-900/85 text-white font-mono text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-xs shadow-md border border-slate-700 pointer-events-none">
          Lat: {mouseCoord.lat} | Lng: {mouseCoord.lng}
        </div>
      )}

    </div>
  );
};
