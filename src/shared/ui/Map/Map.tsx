import { load } from "@2gis/mapgl";
import { useEffect, useRef } from "react";
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
	markers?: MarkerData[];
	onMapClick?: (coords: { lat: number; lon: number }) => void;
	onResetRoute?: () => void;
	theme: Theme;
}

export const Map = ({ className, markers = [], onMapClick, onResetRoute, theme }: MapProps) => {
	const mapRef = useRef<mapgl.Map | null>(null);
	const mapglRef = useRef<any>(null);
	const markersRef = useRef<mapgl.Marker[]>([]);
	const directionsRef = useRef<Directions | null>(null);
	const circleRef = useRef<mapgl.CircleMarker | null>(null);
	const onMapClickRef = useRef(onMapClick);
	const onResetRouteRef = useRef(onResetRoute);
	const themeRef = useRef(theme);

	useEffect(() => {
		onMapClickRef.current = onMapClick;
		onResetRouteRef.current = onResetRoute;
		themeRef.current = theme;
	}, [onMapClick, onResetRoute, theme]);

	useEffect(() => {
		let map: mapgl.Map | null = null;
		let control: mapgl.Control | null = null;
		let button: HTMLElement | null = null;
		let resetControl: mapgl.Control | null = null;
		let resetButton: HTMLElement | null = null;

		const mapClickHandler = (e: any) => {
			if (onMapClickRef.current) {
				const lat = e.lngLat[0];
				const lon = e.lngLat[1];
				onMapClickRef.current({ lat, lon });
			}
		};

		const success = (pos: GeolocationPosition) => {
			const mapglAPI = mapglRef.current;
			const currentMap = mapRef.current;

			if (!mapglAPI || !currentMap) return;

			const center: [number, number] = [pos.coords.longitude, pos.coords.latitude];

			if (circleRef.current) {
				circleRef.current.destroy();
			}

			const newCircle = new mapglAPI.CircleMarker(currentMap, {
				coordinates: center,
				radius: 14,
				color: "#4fb848",
				strokeWidth: 4,
				strokeColor: "#ffffff",
			});

			circleRef.current = newCircle;

			currentMap.setCenter(center);
			currentMap.setZoom(16);
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

		const initMap = async () => {
			const mapglAPI = await load();
			mapglRef.current = mapglAPI;

			map = new mapglAPI.Map("map-container", {
				center: [39.712619, 47.23683],
				zoom: 17,
				key: import.meta.env.VITE_2GIS_API_KEY,
				zoomControl: "centerRight",
				trafficControl: "centerRight",
			});

			mapRef.current = map;

			if (themeRef.current && THEME_TO_STYLE_ID[themeRef.current]) {
				map.setStyleById(THEME_TO_STYLE_ID[themeRef.current]);
			}

			map.on("click", mapClickHandler);

			const controlContent = `
        <div class="mapgl-geolocate-control">
          <button class="mapgl-geolocate-button" title="Моё местоположение">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <path fill="currentColor" d="M17.89 26.27l-2.7-9.46-9.46-2.7 18.92-6.76zm-5.62-12.38l4.54 1.3 1.3 4.54 3.24-9.08z"/>
            </svg>
          </button>
        </div>
      `;

			control = new mapglAPI.Control(map, controlContent, {
				position: "centerRight",
			});

			button = control.getContainer().querySelector(".mapgl-geolocate-button");

			if (button) {
				button.addEventListener("click", geoFindMe);
			}

			if (onResetRouteRef.current) {
				resetControl = new mapglAPI.Control(
					map,
					`<button class="mapgl-reset-button">Сбросить маршрут</button>`,
					{
						position: "centerRight",
					}
				);

				resetButton = resetControl.getContainer().querySelector("button");
				if (resetButton) {
					const handleResetClick = (e: Event) => {
						e.stopPropagation();
						if (onResetRouteRef.current) {
							onResetRouteRef.current();
						}
					};
					resetButton.addEventListener("click", handleResetClick);
				}
			}
		};

		initMap();

		return () => {
			if (mapRef.current) {
				mapRef.current.off("click", mapClickHandler);
			}

			markersRef.current.forEach((m) => m.destroy());
			markersRef.current = [];

			if (directionsRef.current) {
				directionsRef.current.clear();
				directionsRef.current = null;
			}

			if (circleRef.current) {
				circleRef.current.destroy();
				circleRef.current = null;
			}

			if (button) {
				button.removeEventListener("click", geoFindMe);
			}

			if (control) control.destroy();

			if (resetControl) resetControl.destroy();

			if (mapRef.current) {
				mapRef.current.destroy();
				mapRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		const map = mapRef.current;
		const mapglAPI = mapglRef.current;
		if (!map || !mapglAPI) return;

		markersRef.current.forEach((m) => m.destroy());
		markersRef.current = [];

		markers.forEach((markerData) => {
			const marker = new mapglAPI.Marker(map, {
				coordinates: markerData.coordinates,
			});
			markersRef.current.push(marker);
		});

		if (markers.length > 0) {
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

		if (directionsRef.current) {
			directionsRef.current.clear();
		}

		if (markers.length >= 2) {
			if (!directionsRef.current) {
				directionsRef.current = new Directions(map, {
					directionsApiKey: import.meta.env.VITE_2GIS_API_KEY,
				});
			}

			directionsRef.current.carRoute({
				points: markers.map((m) => m.coordinates),
			});
		}
	}, [markers]);

	useEffect(() => {
		const map = mapRef.current;
		if (map && theme && THEME_TO_STYLE_ID[theme]) {
			map.setStyleById(THEME_TO_STYLE_ID[theme]);
		}
	}, [theme]);

	return (
		<div
			className={className}
			style={{ width: "100%", height: "100%" }}
		>
			<MapWrapper />
		</div>
	);
};
