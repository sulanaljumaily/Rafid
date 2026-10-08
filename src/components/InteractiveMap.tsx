import React, { useState } from 'react';
import { Governorate, ServiceListing } from '../types';
import { GOVERNORATES, MACHINERY_DETAILS } from '../data';
import { MapPin, ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';

interface InteractiveMapProps {
  listings: ServiceListing[];
  selectedListingId?: string;
  onListingSelect?: (listing: ServiceListing) => void;
  selectedGovernorate?: Governorate | '';
  onGovernorateSelect?: (gov: Governorate | '') => void;
  interactiveMode?: 'view' | 'select-location';
  onLocationSelect?: (x: number, y: number) => void;
  tempSelectedLocation?: { x: number; y: number } | null;
}

// Major cities positioning for visualization
const CITY_COORDINATES: Record<Governorate, { x: number; y: number; name: string }> = {
  'بغداد': { x: 50, y: 48, name: 'بغداد' },
  'البصرة': { x: 78, y: 78, name: 'البصرة' },
  'نينوى': { x: 42, y: 24, name: 'الموصل' },
  'أربيل': { x: 52, y: 22, name: 'أربيل' },
  'الأنبار': { x: 32, y: 46, name: 'الرمادي' },
  'النجف': { x: 42, y: 60, name: 'النجف' },
  'كربلاء': { x: 44, y: 54, name: 'كربلاء' },
  'بابل': { x: 48, y: 54, name: 'الحلة' },
  'ذي قار': { x: 62, y: 72, name: 'الناصرية' },
  'ميسان': { x: 68, y: 66, name: 'العمارة' },
  'صلاح الدين': { x: 46, y: 38, name: 'تكريت' },
  'كركوك': { x: 52, y: 32, name: 'كركوك' },
  'السليمانية': { x: 62, y: 28, name: 'السليمانية' },
  'دهوك': { x: 44, y: 16, name: 'دهوك' },
  'ديالى': { x: 56, y: 44, name: 'بعقوبة' },
  'واسط': { x: 58, y: 56, name: 'الكوت' },
  'المثنى': { x: 50, y: 70, name: 'السماوة' },
  'القادسية': { x: 50, y: 60, name: 'الديوانية' }
};

export default function InteractiveMap({
  listings,
  selectedListingId,
  onListingSelect,
  selectedGovernorate,
  onGovernorateSelect,
  interactiveMode = 'view',
  onLocationSelect,
  tempSelectedLocation
}: InteractiveMapProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [mapType, setMapType] = useState<'vector' | 'satellite'>('vector');
  const [hoveredGov, setHoveredGov] = useState<Governorate | null>(null);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (interactiveMode !== 'select-location' || !onLocationSelect) return;
    
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onLocationSelect(Math.round(x), Math.round(y));
  };

  // Filter listings to show on map (only show active ones)
  const activeListings = listings.filter(l => l.status === 'active');

  return (
    <div className="relative w-full h-full min-h-[350px] bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col justify-between p-4" id="rafid-map-container">
      {/* Map Header with Controls */}
      <div className="flex items-center justify-between z-10 mb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-800 font-sans">
            {interactiveMode === 'select-location' ? 'اضغط على الخريطة لتحديد موقع الآلية' : 'خريطة الآليات التفاعلية في العراق'}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setMapType(mapType === 'vector' ? 'satellite' : 'vector')}
            className={`p-1.5 rounded-lg transition text-xs ${mapType === 'satellite' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-500 hover:bg-slate-200'}`}
            title="تغيير مظهر الخريطة"
          >
            <Layers className="h-3.5 w-3.5 inline mr-1" />
            <span className="hidden xs:inline">مظهر {mapType === 'vector' ? 'القمر الصناعي' : 'المخطط'}</span>
          </button>
          <button 
            onClick={() => setZoom(prev => Math.min(prev + 0.25, 2))} 
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-950 transition"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => setZoom(prev => Math.max(prev - 0.25, 1))} 
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-950 transition"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Map Content Body: Split into SVG Map & Distribution Statistics */}
      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden relative">
        {/* Machinery Distribution Sidebar - Only show in view mode */}
        {interactiveMode === 'view' && (
          <div className="md:col-span-4 bg-slate-50/90 border border-slate-200 rounded-2xl p-3 flex flex-col justify-start space-y-2.5 overflow-y-auto max-h-[160px] md:max-h-none h-full" dir="rtl" id="machinery-distribution-sidebar">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-1.5">
              <span className="text-[11px] font-black text-amber-600">توزيع الآليات بالمحافظات</span>
              <span className="text-[9px] text-slate-600 font-bold">نسبة التوافر</span>
            </div>
            <div className="space-y-1.5 flex-1 pr-1">
              {GOVERNORATES.map((gov) => {
                const count = activeListings.filter((l) => l.governorate === gov).length;
                const percentage = activeListings.length > 0 ? (count / activeListings.length) * 100 : 0;
                const isSelected = selectedGovernorate === gov;

                return (
                  <button
                    key={gov}
                    type="button"
                    onClick={() => {
                      if (onGovernorateSelect) {
                        onGovernorateSelect(isSelected ? '' : gov);
                      }
                    }}
                    className={`w-full text-right p-1.5 px-2.5 rounded-xl border text-[10px] flex flex-col gap-1 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 text-amber-700 border-amber-500 shadow-sm shadow-amber-500/5'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-black">{gov}</span>
                      <span className="font-mono font-black text-amber-700 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10">
                        {count} آلية
                      </span>
                    </div>
                    {/* Progress Bar of density */}
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage || 0}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SVG Map Container */}
        <div className={`relative overflow-hidden flex items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 h-full ${interactiveMode === 'view' ? 'md:col-span-8' : 'col-span-12'}`}>
          {/* Satellite Background Simulation */}
          {mapType === 'satellite' && (
            <div className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')" }} />
          )}

          {/* Abstract Gridlines */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-0 pointer-events-none opacity-[0.1]">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border-t border-l border-slate-300"></div>
            ))}
          </div>

          {/* Baghdad center glow */}
          <div className="absolute left-[50%] top-[48%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <svg
            viewBox="0 0 100 100"
            className="w-full h-full max-h-[450px] transition-transform duration-300 origin-center select-none p-1"
            style={{ transform: `scale(${zoom})` }}
            onClick={handleMapClick}
          >
            {/* Main Iraq boundaries approximation (Iraq is roughly triangle-diamond shaped) */}
            <path
              d="M 38 12 L 56 12 L 68 25 L 68 35 L 72 45 L 82 72 L 80 82 L 72 82 L 65 74 L 52 74 L 46 62 L 32 62 L 25 50 L 25 38 Z"
              fill={mapType === 'vector' ? '#f1f5f9' : '#dcfce7'}
              fillOpacity={mapType === 'vector' ? '1.0' : '0.5'}
              stroke="#cbd5e1"
              strokeWidth="0.8"
              strokeDasharray="1 1"
              className="transition-colors duration-300"
            />

            {/* Euphrates & Tigris Rivers Approximation in Blue */}
            {/* Tigris River */}
            <path
              d="M 44 14 Q 45 22 52 32 T 50 48 T 58 56 T 68 66 T 78 78"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />
            {/* Euphrates River */}
            <path
              d="M 25 38 Q 32 44 38 46 T 44 54 T 50 60 T 62 72 T 78 78"
              fill="none"
              stroke="#0284c7"
              strokeWidth="0.4"
              strokeOpacity="0.3"
            />

            {/* Interactive Governorates Clickable Overlay Area Pins */}
            {GOVERNORATES.map((gov) => {
              const coord = CITY_COORDINATES[gov];
              if (!coord) return null;
              const isSelected = selectedGovernorate === gov;
              const isHovered = hoveredGov === gov;
              const count = activeListings.filter((l) => l.governorate === gov).length;

              return (
                <g 
                  key={gov}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredGov(gov)}
                  onMouseLeave={() => setHoveredGov(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (interactiveMode === 'select-location' && onLocationSelect) {
                      onLocationSelect(coord.x, coord.y);
                    } else if (onGovernorateSelect) {
                      onGovernorateSelect(isSelected ? '' : gov);
                    }
                  }}
                >
                  {/* Governorate Glow on Selected or Hovered */}
                  {(isSelected || isHovered) && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="5"
                      fill={isSelected ? '#f59e0b' : '#38bdf8'}
                      fillOpacity="0.15"
                      className="animate-pulse"
                    />
                  )}

                  {/* City node marker */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isSelected ? '1.8' : '1.2'}
                    fill={isSelected ? '#f59e0b' : '#64748b'}
                    className="transition-all duration-300 group-hover:fill-amber-400"
                  />

                  {/* City Arabic labels */}
                  <text
                    x={coord.x}
                    y={coord.y - 2.5}
                    textAnchor="middle"
                    fill={isSelected ? '#d97706' : '#475569'}
                    fontSize="1.6"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="font-sans pointer-events-none transition-colors duration-200"
                  >
                    {coord.name}
                  </text>

                  {/* Governorate density / distribution badge on map */}
                  {interactiveMode === 'view' && count > 0 && (
                    <g transform={`translate(${coord.x + 4.5}, ${coord.y - 3})`}>
                      <rect
                        x="-2"
                        y="-1.5"
                        width="4"
                        height="3"
                        rx="0.8"
                        fill="#f59e0b"
                        className="transition-transform duration-300 group-hover:scale-125 origin-center"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#0f172a"
                        fontSize="1.6"
                        fontWeight="black"
                        className="font-sans pointer-events-none"
                        y="0.2"
                      >
                        {count}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Active listings pins */}
            {interactiveMode === 'view' && activeListings.map((listing) => {
              const isSelected = selectedListingId === listing.id;
              const mechInfo = MACHINERY_DETAILS[listing.type];
              
              // If the listing belongs to a governorate that is filtered, check that
              if (selectedGovernorate && listing.governorate !== selectedGovernorate) {
                return null;
              }

              return (
                <g
                  key={listing.id}
                  className="cursor-pointer group/pin"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onListingSelect) onListingSelect(listing);
                  }}
                >
                  {/* Active pulse */}
                  <circle
                    cx={listing.location.x}
                    cy={listing.location.y}
                    r="2.5"
                    fill="#f59e0b"
                    fillOpacity="0.4"
                    className={isSelected ? "animate-ping" : "group-hover/pin:animate-ping"}
                  />

                  {/* Pin pinpointer */}
                  <g transform={`translate(${listing.location.x}, ${listing.location.y}) scale(0.18)`}>
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                      fill={isSelected ? '#ea580c' : '#f59e0b'}
                    />
                  </g>

                  {/* Tiny type identifier icon tooltip */}
                  <text
                    x={listing.location.x}
                    y={listing.location.y + 4.5}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="1.2"
                    fontWeight="bold"
                    className="font-sans bg-slate-900 px-1 py-0.5 rounded opacity-0 group-hover/pin:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg"
                  >
                    {mechInfo?.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}

            {/* Selected coordinates marker for service publication */}
            {interactiveMode === 'select-location' && tempSelectedLocation && (
              <g>
                <circle
                  cx={tempSelectedLocation.x}
                  cy={tempSelectedLocation.y}
                  r="3"
                  fill="#ef4444"
                  fillOpacity="0.4"
                  className="animate-ping"
                />
                <g transform={`translate(${tempSelectedLocation.x}, ${tempSelectedLocation.y}) scale(0.2)`}>
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    fill="#ef4444"
                  />
                  <circle cx="12" cy="9" r="2.5" fill="#ffffff" />
                </g>
                <text
                  x={tempSelectedLocation.x}
                  y={tempSelectedLocation.y - 3.5}
                  textAnchor="middle"
                  fill="#fca5a5"
                  fontSize="2"
                  fontWeight="bold"
                  className="font-sans"
                >
                  موقع الآلية المحدد
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Map Footer Info */}
      <div className="mt-2 text-[10px] text-slate-500 font-sans flex items-center justify-between">
        <span>* الخريطة محاكاة دقيقة لمحافظات العراق لحماية الخصوصية وملاءمة الواجهة.</span>
        {interactiveMode === 'view' && (
          <span className="text-amber-500 font-semibold font-sans">
            نشط الآن: {activeListings.length} آلية ثقيلة
          </span>
        )}
      </div>
    </div>
  );
}
