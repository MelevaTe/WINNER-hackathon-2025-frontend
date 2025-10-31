export interface TripEvent {
	id: string;
	title: string;
	date: string;
	duration: string;
	price: number;
	ageRestriction: number;
}

export interface TripPlace {
	id: string;
	title: string;
	latitude: number;
	longitude: number;
	address: string;
	image: string | null;
	events: TripEvent[];
}

export interface TripRoute {
	id: string;
	places: TripPlace[];
}

export interface TripResultSchema {
	data?: TripRoute;
	isLoading: boolean;
	error?: string;
}

export interface BuildRouteParams {
	startPoint: [number, number];
	endPoint: [number, number];
	budget: string;
	style: string;
	categories: string[];
	routeType: string;
}
