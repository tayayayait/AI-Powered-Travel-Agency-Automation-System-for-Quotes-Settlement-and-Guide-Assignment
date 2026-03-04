import { useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, Polyline } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Location {
  lat: number;
  lng: number;
  label?: string;
  title?: string;
}

interface RouteMapProps {
  locations: Location[];
  height?: string;
  width?: string;
}

const defaultCenter = {
  lat: 13.7563, // 방콕 기본 (동남아 랜드사에 맞춰)
  lng: 100.5018
};

const defaultOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

export function RouteMap({ locations, height = "400px", width = "100%" }: RouteMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  // 지도 중앙 계산
  const center = useMemo(() => {
    if (!locations || locations.length === 0) return defaultCenter;
    
    // 단순 평균 좌표
    const latSum = locations.reduce((sum, loc) => sum + loc.lat, 0);
    const lngSum = locations.reduce((sum, loc) => sum + loc.lng, 0);
    return {
      lat: latSum / locations.length,
      lng: lngSum / locations.length
    };
  }, [locations]);

  const polylinePath = useMemo(() => {
    return locations.map(loc => ({ lat: loc.lat, lng: loc.lng }));
  }, [locations]);

  if (loadError) {
    return (
      <div 
        className="flex items-center justify-center bg-slate-100 rounded-md border text-slate-500" 
        style={{ width, height }}
      >
        지도 로드에 실패했습니다. (API 키 오류 또는 네트워크 문제)
      </div>
    );
  }

  if (!isLoaded) {
    return <Skeleton className="rounded-md" style={{ width, height }} />;
  }

  // 키가 설정되지 않은 경우 처리
  if (!apiKey || apiKey.length < 10) {
     return (
        <div 
          className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-md border border-dashed border-slate-300 p-4 text-center gap-2" 
          style={{ width, height }}
        >
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <p className="text-sm font-medium text-slate-700">Google Maps 설정 필요</p>
          <p className="text-xs text-slate-500">.env 파일에 <code className="bg-slate-200 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code>를 설정하세요.</p>
          {locations.length > 0 && (
            <div className="mt-2 text-[11px] text-slate-400 divide-y divide-slate-200 w-full">
              {locations.map((loc, i) => (
                <div key={i} className="py-1 flex items-center gap-1">
                  <span className="font-semibold text-slate-500">{loc.label || i + 1}.</span>
                  <span>{loc.title || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width, height, borderRadius: "0.5rem" }}
      center={center}
      zoom={locations.length > 0 ? 10 : 6}
      options={defaultOptions}
    >
      {/* 마커 렌더링 */}
      {locations.map((loc, index) => (
        <Marker 
          key={`marker-${index}`}
          position={{ lat: loc.lat, lng: loc.lng }}
          label={loc.label ? { text: loc.label, color: 'white', className: 'font-bold' } : undefined}
          title={loc.title}
        />
      ))}

      {/* 동선(Polyline) 렌더링 (2개 이상일 때만) */}
      {locations.length > 1 && (
        <Polyline
          path={polylinePath}
          options={{
            strokeColor: "#2563eb", /* primary blue */
            strokeOpacity: 0.8,
            strokeWeight: 4,
            icons: [{
              icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
              offset: '50%'
            }]
          }}
        />
      )}
    </GoogleMap>
  );
}
