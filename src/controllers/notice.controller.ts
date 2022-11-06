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
const getNotices = async (req: Request, res: Response) => {
	try {
		const noticeQB =
			AppDataSource.getRepository(Notice).createQueryBuilder("notice")
		const notices = await noticeQB
			.leftJoinAndSelect("notice.user", "user")
			.select([
				"user.email",
				"user.firstName",
				"user.lastName",
				"notice.id",
				"notice.title",
				"notice.content",
			])
			.getMany()
		return res.status(200).json({ notices })
	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: "Internal server error" })
	}
}

const getNotice = async (req: Request, res: Response) => {
	const { id } = req.params
	if (!id) {
		return res.status(400).json({ message: "Missing id" })
	}
	try {
		const noticeQB =
			AppDataSource.getRepository(Notice).createQueryBuilder("notice")
		const notice = await noticeQB
			.leftJoinAndSelect("notice.user", "user")
			.select([
				"user.email",
				"user.firstName",
				"user.lastName",
				"notice.id",
				"notice.title",
				"notice.content",
			])
			.where("notice.id = :id", { id })
			.getOne()
		return res.status(200).json({ notice })
	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: "Internal server error" })
	}
}

const deleteNotice = async (req: any, res: Response) => {
	const { id } = req.params
	if (!id) {
		return res.status(400).json({ message: "Missing id" })
	}
	try {
		const notice = await AppDataSource.getRepository(Notice).findOne({
			where: { id: parseInt(id), userId: req.user.id },
		})
		if (!notice) {
			return res.status(404).json({ message: "Notice not found" })
		}
		await AppDataSource.getRepository(Notice).delete(notice.id)
		return res.status(200).json({ message: "Notice deleted" })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Internal server error" })
	}
}

const updateNotice = async (req: any, res: Response) => {
	const { id } = req.params
	const { title, content } = req.body
	if (!id || !title || !content) {
		return res
			.status(400)
			.json({ message: "Missing id or title or content" })
	}
	try {
		const notice = await AppDataSource.getRepository(Notice).findOne({
			where: { id: parseInt(id), userId: req.user.id },
		})
		if (!notice) {
			return res.status(404).json({ message: "Notice not found" })
		}
		notice.title = title
		notice.content = content
		await AppDataSource.getRepository(Notice).save(notice)
		return res.status(200).json({ message: "Notice updated" })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Internal server error" })
	}
}

export default {
	createNotice,
	getNotices,
	getNotice,
	deleteNotice,
	updateNotice,
}
