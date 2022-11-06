import { Request, Response } from "express"
import { User } from "../entities/User"
import { AppDataSource } from "../data-source"
import bcrypt from "bcryptjs"
import { createTokens } from "../utils/authentication"

const register = async (req: Request, res: Response) => {
	const { email, password, firstName, lastName } = req.body
	if (!email || !password) {
		return res.status(400).json({ message: "Missing email or password" })
	}
	try {
		const hashedPass = bcrypt.hashSync(password, 12)

		await AppDataSource.getRepository(User).save({
			email,
			password: hashedPass,
			firstName,
			lastName,
			delta: Math.floor(100000 + Math.random() * 900000),
		})
		return res.status(200).json({ message: "User created successfully" })
	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: "Internal server error" })
	}
}

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body
	if (!email || !password) {
		return res.status(400).json({ message: "Missing email or password" })
	}

	const user = await AppDataSource.getRepository(User).findOne({
		where: { email },
	})
	if (!user) {
		return res.status(404).json({ message: "User not found" })
	}

	const validPass = bcrypt.compareSync(password, user.password)
	if (!validPass) {
		return res.status(401).json({ message: "Invalid password" })
	} else {
		const [token, refreshToken] = await createTokens({ user })
		res.cookie("x-connector-token", token).cookie(
			"x-connector-refresh-token",
			refreshToken
		)
		return res.status(200).json({ message: "Login successful" })
	}
}
export default {
	login,
	register,
}
