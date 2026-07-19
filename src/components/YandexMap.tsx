import { useEffect, useRef } from "react";
import { CHELYABINSK_CENTER } from "@/data/chelyabinsk";

declare global {
  interface Window {
    ymaps?: any;
    __ymapsReady?: Promise<any>;
  }
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  color?: string;
  order?: number;
}

interface Props {
  markers: MapMarker[];
  routeStops?: { lat: number; lng: number }[];
  travelMode?: "pedestrian" | "auto";
  onMarkerClick?: (id: string) => void;
  className?: string;
}

function loadYmaps(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.ymaps && (window.ymaps as any).Map) return Promise.resolve(window.ymaps);
  if (window.__ymapsReady) return window.__ymapsReady;

  const apikey = (import.meta.env.VITE_YANDEX_MAPS_API_KEY as string | undefined) ?? "";
  const keyParam = apikey ? `&apikey=${apikey}` : "";

  window.__ymapsReady = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU${keyParam}`;
    s.async = true;
    s.onload = () => window.ymaps.ready(() => resolve(window.ymaps));
    s.onerror = () => reject(new Error("Не удалось загрузить Яндекс.Карты"));
    document.head.appendChild(s);
  });
  return window.__ymapsReady;
}

export function YandexMap({ markers, routeStops, travelMode = "pedestrian", onMarkerClick, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const objectsRef = useRef<any[]>([]);
  const routeRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    loadYmaps()
      .then((ymaps) => {
        if (cancelled || !containerRef.current || !ymaps) return;
        if (!mapRef.current) {
          mapRef.current = new ymaps.Map(containerRef.current, {
            center: [CHELYABINSK_CENTER.lat, CHELYABINSK_CENTER.lng],
            zoom: 13,
            controls: ["zoomControl", "geolocationControl", "fullscreenControl"],
          }, { suppressMapOpenBlock: true });
        }
        renderMarkers();
        renderRoute();
      })
      .catch((e) => console.error(e));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { renderMarkers(); /* eslint-disable-next-line */ }, [markers]);
  useEffect(() => { renderRoute(); /* eslint-disable-next-line */ }, [routeStops, travelMode]);

  function renderMarkers() {
    const ymaps = window.ymaps;
    if (!mapRef.current || !ymaps) return;
    objectsRef.current.forEach((o) => mapRef.current.geoObjects.remove(o));
    objectsRef.current = [];
    if (!markers.length) return;

    markers.forEach((m) => {
      const placemark = new ymaps.Placemark(
        [m.lat, m.lng],
        { hintContent: m.title, balloonContent: m.title, iconCaption: m.order ? String(m.order) : undefined },
        {
          preset: m.order ? "islands#orangeStretchyIcon" : "islands#violetCircleDotIcon",
          iconColor: m.color ?? "#41236E",
        },
      );
      placemark.events.add("click", () => onMarkerClick?.(m.id));
      mapRef.current.geoObjects.add(placemark);
      objectsRef.current.push(placemark);
    });

    if (markers.length > 1 && !routeStops?.length) {
      mapRef.current.setBounds(mapRef.current.geoObjects.getBounds(), { checkZoomRange: true, zoomMargin: 40 });
    } else if (markers.length === 1) {
      mapRef.current.setCenter([markers[0].lat, markers[0].lng], 15);
    }
  }

  function renderRoute() {
    const ymaps = window.ymaps;
    if (!mapRef.current || !ymaps) return;
    if (routeRef.current) {
      mapRef.current.geoObjects.remove(routeRef.current);
      routeRef.current = null;
    }
    if (!routeStops || routeStops.length < 2) return;

    ymaps.route(routeStops.map((p) => [p.lat, p.lng]), {
      mapStateAutoApply: true,
      routingMode: travelMode,
    }).then((route: any) => {
      route.getPaths().options.set({
        strokeColor: "#41236EE0",
        strokeWidth: 5,
      });
      routeRef.current = route;
      mapRef.current.geoObjects.add(route);
    }).catch((e: unknown) => console.error(e));
  }

  return <div ref={containerRef} className={className ?? "w-full h-[520px] rounded-2xl overflow-hidden border"} />;
}
