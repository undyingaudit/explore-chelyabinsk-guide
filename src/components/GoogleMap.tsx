import { useEffect, useRef } from "react";
import { CHELYABINSK_CENTER } from "@/data/chelyabinsk";

declare global {
  interface Window {
    google?: typeof google;
    __initGoogleMap?: () => void;
    __gmapReady?: Promise<void>;
  }
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  color?: string;
  order?: number; // 1..N stop number
}

interface Props {
  markers: MapMarker[];
  routeStops?: { lat: number; lng: number }[]; // for directions
  travelMode?: "WALKING" | "DRIVING";
  onMarkerClick?: (id: string) => void;
  className?: string;
}

function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (window.__gmapReady) return window.__gmapReady;

  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
  const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;
  if (!key) return Promise.reject(new Error("Google Maps browser key missing"));

  window.__gmapReady = new Promise<void>((resolve, reject) => {
    window.__initGoogleMap = () => resolve();
    const s = document.createElement("script");
    const channelParam = channel ? `&channel=${channel}` : "";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&loading=async&callback=__initGoogleMap${channelParam}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return window.__gmapReady;
}

export function GoogleMap({ markers, routeStops, travelMode = "WALKING", onMarkerClick, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerObjsRef = useRef<google.maps.Marker[]>([]);
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then(() => {
      if (cancelled || !containerRef.current || !window.google) return;
      if (!mapRef.current) {
        mapRef.current = new window.google.maps.Map(containerRef.current, {
          center: CHELYABINSK_CENTER,
          zoom: 13,
          disableDefaultUI: false,
          streetViewControl: false,
          mapTypeControl: false,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#f5f2ec" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#4a4a4a" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8d4dd" }] },
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
          ],
        });
      }
      renderMarkers();
      renderRoute();
    }).catch((e) => console.error(e));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { renderMarkers(); /* eslint-disable-next-line */ }, [markers]);
  useEffect(() => { renderRoute(); /* eslint-disable-next-line */ }, [routeStops, travelMode]);

  function renderMarkers() {
    if (!mapRef.current || !window.google) return;
    markerObjsRef.current.forEach((m) => m.setMap(null));
    markerObjsRef.current = [];
    const bounds = new window.google.maps.LatLngBounds();

    markers.forEach((m) => {
      const color = m.color ?? "#d97742";
      const label = m.order ? String(m.order) : undefined;
      const marker = new window.google!.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map: mapRef.current!,
        title: m.title,
        label: label ? { text: label, color: "#fff", fontWeight: "600", fontSize: "13px" } : undefined,
        icon: {
          path: window.google!.maps.SymbolPath.CIRCLE,
          scale: label ? 14 : 9,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });
      marker.addListener("click", () => onMarkerClick?.(m.id));
      markerObjsRef.current.push(marker);
      bounds.extend({ lat: m.lat, lng: m.lng });
    });

    if (markers.length > 1 && !routeStops?.length) {
      mapRef.current.fitBounds(bounds, 60);
    } else if (markers.length === 1) {
      mapRef.current.setCenter({ lat: markers[0].lat, lng: markers[0].lng });
      mapRef.current.setZoom(15);
    }
  }

  function renderRoute() {
    if (!mapRef.current || !window.google) return;
    if (rendererRef.current) {
      rendererRef.current.setMap(null);
      rendererRef.current = null;
    }
    if (!routeStops || routeStops.length < 2) return;

    const service = new window.google.maps.DirectionsService();
    const renderer = new window.google.maps.DirectionsRenderer({
      map: mapRef.current,
      suppressMarkers: true,
      polylineOptions: { strokeColor: "#d97742", strokeWeight: 5, strokeOpacity: 0.9 },
    });
    rendererRef.current = renderer;

    const origin = routeStops[0];
    const destination = routeStops[routeStops.length - 1];
    const waypoints = routeStops.slice(1, -1).map((p) => ({ location: p, stopover: true }));

    service.route(
      {
        origin, destination, waypoints,
        travelMode: window.google.maps.TravelMode[travelMode],
      },
      (res: google.maps.DirectionsResult | null, status: string) => {
        if (status === "OK" && res) renderer.setDirections(res);
      },
    );
  }

  return <div ref={containerRef} className={className ?? "w-full h-[520px] rounded-2xl overflow-hidden border"} />;
}
