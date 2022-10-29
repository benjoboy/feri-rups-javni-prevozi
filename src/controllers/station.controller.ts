import { Request, Response } from "express"
import https from "https"
import { Stations } from "../interfaces/station.interface"
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
export default {
	nearestStation,
}
