import { Request, Response } from "express"
import { DataSource } from "typeorm"
import { AppDataSource } from "../data-source"
import { Station } from "../entities/Station"
import { Feature, Stations } from "../interfaces/station.interface"
import { getDistanceFromLatLonInKm, getRequest } from "../utils/helpers"

const nearestStation = async (req: Request, res: Response) => {
	const { lat, lon } = req.query

	if (!lat || !lon) {
		return res.status(400).json({ message: "Missing lat or lon" })
	}
	const latParsed = parseFloat(lat.toString())
	const lonParsed = parseFloat(lon.toString())

	try {
		const { features }: any = await getRequest(
			"https://www.marprom.si/webmap/lineData/stops.geojson",
			(data) => JSON.parse(data) as Stations
		)
		const nearestStation = features.reduce((prev: any, curr: any) => {
			const prevDist = getDistanceFromLatLonInKm(
				latParsed,
				lonParsed,
				parseFloat(prev.geometry.coordinates[1]),
				parseFloat(prev.geometry.coordinates[0])
			)
			const currDist = getDistanceFromLatLonInKm(
				latParsed,
				lonParsed,
				parseFloat(curr.geometry.coordinates[1]),
				parseFloat(curr.geometry.coordinates[0])
			)
			return prevDist < currDist ? prev : curr
		})
		return res.status(200).json(nearestStation)
	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: "Internal server error" })
	}
}

const getLines = async (req: Request, res: Response) => {
	return res
		.status(200)
		.json([
			"1",
			"2",
			"3",
			"4",
			"6",
			"7",
			"8",
			"9",
			"10",
			"12",
			"13",
			"16",
			"17",
			"19",
			"20",
			"21",
			"151",
			"k1",
			"k2",
		])
}

const importStations = async (req: Request, res: Response) => {
	const { features }: any = await getRequest(
		"https://www.marprom.si/webmap/lineData/stops.geojson",
		(data) => JSON.parse(data) as Stations
	)
	AppDataSource.getRepository(Station).save(
		features.map((station: Feature) => ({
			name: station.properties.name,
			address: station.properties.address,
			latitude: station.geometry.coordinates[1],
			longitude: station.geometry.coordinates[0],
			url: station.properties.URL,
		}))
	)
	return res.status(200).json({ message: "Stations imported" })
}

const getAll = async (req: Request, res: Response) => {
	console.log("here")
	const { name } = req.params
	const stationsQB =
		AppDataSource.getRepository(Station).createQueryBuilder("o")

	if (name) stationsQB.where("o.name ILIKE :name", { name: `%${name}%` })
	const stations = await stationsQB.limit(20).getMany()

	return res.status(200).json(stations)
}

export default {
	nearestStation,
	getLines,
	importStations,
	getAll,
}
