import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Notice } from "../entities/Notice"

const createNotice = async (req: any, res: Response) => {
	const { title, content } = req.body
	if (!title || !content) {
		return res.status(400).json({ message: "Missing title or content" })
	}

	try {
		const notice = await AppDataSource.getRepository(Notice).save({
			title,
			content,
			userId: req.user.id,
		})
		return res.status(200).json({ notice })
	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: "Internal server error" })
	}
}
const getNotices = async (req: any, res: Response) => {
	try {
		const notices = await AppDataSource.getRepository(Notice).find({
			relations: ["user"],
		})
		return res.status(200).json({ notices })
	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: "Internal server error" })
	}
}

export default {
	createNotice,
	getNotices,
}
