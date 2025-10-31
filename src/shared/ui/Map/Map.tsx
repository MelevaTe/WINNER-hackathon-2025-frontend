import { load } from "@2gis/mapgl";
import { type CSSProperties, useEffect, useRef } from "react";
import { MapWrapper } from "./MapWrapper";
import "./Map.scss";
import { Directions } from "@2gis/mapgl-directions";
import { Theme } from "@/app/providers/ThemeProvider";

export interface MarkerData {
	coordinates: [number, number];
}

const THEME_TO_STYLE_ID: Record<Theme, string> = {
	[Theme.LIGHT]: "d013506c-74b4-421f-939d-58c7f475b6b4",
	[Theme.DARK]: "bead9c80-2217-47fe-982e-4d385cc4e151",
};

interface MapProps {
	className?: string;
	style?: CSSProperties;
	markers?: MarkerData[];
	onMapClick?: (coords: { lat: number; lon: number }) => void;
	onResetRoute?: () => void;
	theme: Theme;
}

export const Map = ({ className, style, markers = [], onMapClick, onResetRoute, theme }: MapProps) => {
	const mapRef = useRef<any>(null);
	const markersRef = useRef<any[]>([]);
	const directionsRef = useRef<Directions | null>(null);

	useEffect(() => {
		let map: any = null;
		let circle: any = null;
		let control: any = null;
		let button: HTMLElement | null = null;
		let clickHandler: ((e: any) => void) | null = null;

		load().then((mapgl) => {
			map = new mapgl.Map("map-container", {
				center: [39.712619, 47.23683],
				zoom: 17,
				key: import.meta.env.VITE_2GIS_API_KEY,
				zoomControl: "centerRight",
				trafficControl: "centerRight",
			});

			mapRef.current = map;

			if (THEME_TO_STYLE_ID[theme]) {
				map.setStyleById(THEME_TO_STYLE_ID[theme]);
			}

			if (onMapClick) {
				clickHandler = (e: any) => {
					const lat = e.lngLat[0];
					const lon = e.lngLat[1];
					onMapClick({ lat, lon });
				};
				map.on("click", clickHandler);
			}

			const controlContent = `
        <div class="mapgl-geolocate-control">
          <button class="mapgl-geolocate-button" title="Моё местоположение">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <path fill="currentColor" d="M17.89 26.27l-2.7-9.46-9.46-2.7 18.92-6.76zm-5.62-12.38l4.54 1.3 1.3 4.54 3.24-9.08z"/>
            </svg>
          </button>
        </div>
      `;

			control = new mapgl.Control(map, controlContent, {
				position: "centerRight",
			});

			button = control.getContainer().querySelector(".mapgl-geolocate-button");

			const success = (pos: GeolocationPosition) => {
				const center: [number, number] = [pos.coords.longitude, pos.coords.latitude];
				if (circle) circle.destroy();
				circle = new mapgl.CircleMarker(map, {
					coordinates: center,
					radius: 14,
					color: "#4fb848",
					strokeWidth: 4,
					strokeColor: "#ffffff",
				});
				map.setCenter(center);
				map.setZoom(16);
			};

			const geoFindMe = () => {
				if (!navigator.geolocation) {
					alert("Геолокация не поддерживается в этом браузере.");
					return;
				}
				navigator.geolocation.getCurrentPosition(success, (error) => {
					switch (error.code) {
						case error.PERMISSION_DENIED:
							alert("Доступ к местоположению запрещён.");
							break;
						case error.POSITION_UNAVAILABLE:
							alert("Невозможно определить местоположение.");
							break;
						case error.TIMEOUT:
							alert("Превышено время ожидания.");
							break;
						default:
							alert("Неизвестная ошибка геолокации.");
					}
				});
			};

			if (button) {
				button.addEventListener("click", geoFindMe);
			}

			if (onResetRoute) {
				const resetControl = new mapgl.Control(
					map,
					`<button class="mapgl-reset-button">Сбросить маршрут</button>`,
					{
						position: "centerRight",
					}
				);

				const resetButton = resetControl.getContainer().querySelector("button");
				if (resetButton) {
					resetButton.addEventListener("click", (e) => {
						e.stopPropagation();
						onResetRoute();
					});
				}
			}

			const updateMarkers = () => {
				markersRef.current.forEach((m) => m.destroy());
				markersRef.current = [];

				markers.forEach((markerData) => {
					const marker = new mapgl.Marker(map, {
						coordinates: markerData.coordinates,
					});
					markersRef.current.push(marker);
				});

				if (markers.length > 0 && markers.every((marker) => marker != null)) {
					const lats = markers.map((m) => m.coordinates[0]);
					const lons = markers.map((m) => m.coordinates[1]);

					const validLats = lats.filter((lat) => typeof lat === "number" && !isNaN(lat));
					const validLons = lons.filter((lon) => typeof lon === "number" && !isNaN(lon));

					if (validLats.length > 0 && validLons.length > 0) {
						const centerLat = validLats.reduce((a, b) => a + b, 0) / validLats.length;
						const centerLon = validLons.reduce((a, b) => a + b, 0) / validLons.length;
						map.setCenter([centerLat, centerLon]);
						map.setZoom(markers.length === 1 ? 16 : 14);
					}
				}
			};

			const updateRoute = () => {
				if (directionsRef.current) {
					directionsRef.current.clear();
				}

				if (markers.length < 2) {
					return;
				}

				const points = markers.map((m) => m.coordinates);

				if (!directionsRef.current) {
					directionsRef.current = new Directions(map, {
						directionsApiKey: import.meta.env.VITE_2GIS_API_KEY,
					});

					// @ts-ignore
					directionsRef.current.on("error", (err: any) => {
						console.error("Ошибка построения маршрута:", err);
					});
				}

				directionsRef.current.carRoute({
					points,
				});
			};

			updateMarkers();
			updateRoute();

			return () => {
				if (clickHandler && map) {
					map.off("click", clickHandler);
				}
				if (button) {
					button.removeEventListener("click", geoFindMe);
				}
				markersRef.current.forEach((m) => m.destroy());
				if (directionsRef.current) {
					directionsRef.current.clear();
					directionsRef.current = null;
				}
				if (circle) circle.destroy();
				if (control) control.destroy();
				if (map) map.destroy();
			};
		});

		return () => {
			markersRef.current.forEach((m) => m.destroy());
			if (directionsRef.current) {
				directionsRef.current.clear();
				directionsRef.current = null;
			}
			if (mapRef.current) {
				mapRef.current.destroy();
			}
		};
	}, [markers, onMapClick, onResetRoute, theme]);

	useEffect(() => {
		const map = mapRef.current;
		if (map && THEME_TO_STYLE_ID[theme]) {
			map.setStyleById(THEME_TO_STYLE_ID[theme]);
		}
	}, [theme]);

	return (
		<div
			className={className}
			style={{ width: "100%", height: "100%", ...style }}
		>
			<MapWrapper />
		</div>
	);
};
