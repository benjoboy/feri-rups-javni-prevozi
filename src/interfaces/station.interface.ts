export interface Stations {
	type: string
	features: Feature[]
}

export interface Feature {
	type: string
	id: string
	properties: Properties
	geometry: Geometry
}

export interface Geometry {
	type: string
	coordinates: string[]
}

export interface Properties {
	"marker-color": string
	"marker-size": string
	"marker-symbol": string
	"marker-title": string
	number: string
	name: string
	address: string
	busroute: string
	URL: string
}
