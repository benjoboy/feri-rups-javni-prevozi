import jwt from "jsonwebtoken"
import { refreshTokens } from "../utils/authentication"

const getCookie = (src: string, name: string) => {
	const value = `; ${src}`
	const parts = value.split(`; ${name}=`)
	if (!!parts && parts.length === 2)
		return (parts as any).pop().split(";").shift()
	return null
}

export const handleAuthentication = async (req: any, res: any, next: any) => {
	req.user = undefined

	let token
	let refreshToken
	token = getCookie(req.headers.cookie, "x-connector-token")
	refreshToken = getCookie(req.headers.cookie, "x-connector-refresh-token")

	if (token) {
		try {
			const { user } = jwt.verify(
				token,
				(process.env.SECRET_TOKEN as string) || "secret"
			) as any
			if (user) {
				req.user = user
				return next()
			}
		} catch (err) {
			const {
				token: newToken,
				refreshToken: newRefreshToken,
				user,
			} = await refreshTokens(refreshToken, (req as any).headers.customer)
			if (user) {
				if (newToken && newRefreshToken) {
					res.cookie("x-connector-token", newToken).cookie(
						"x-connector-refresh-token",
						newRefreshToken
					)
				}
				req.user = user
				return next()
			}
		}
	}
	return res.status(401).json({ message: "Unauthorized" })
}
