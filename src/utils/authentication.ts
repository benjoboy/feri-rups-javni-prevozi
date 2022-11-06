import jwt from "jsonwebtoken"
import { AppDataSource } from "../data-source"
import { User } from "../entities/User"

const verifyToken = async (
	token: string,
	secret: string,
	addSecurityChecks = {}
) =>
	new Promise((resolve) =>
		jwt.verify(token, secret, { ...addSecurityChecks }, (err, result) => {
			if (err) {
				console.log("VERIFY: JWT ERROR: ", err.message)
				resolve({
					ok: false,
					user: err,
				})
			} else {
				resolve({
					ok: true,
					user: (result as any).user,
				})
			}
		})
	)

const signToken = async (
	user: string,
	secret: string,
	expiration = 60 * 60,
	additionalClaims = {}
) =>
	new Promise((resolve) =>
		jwt.sign(
			{ user },
			secret,
			{
				expiresIn: expiration,
				...additionalClaims,
			},
			(err, result) => {
				if (err) {
					console.log("SIGN: JWT ERROR: ", err.message)
					resolve(undefined)
				} else {
					resolve(result)
				}
			}
		)
	)

export const createTokens = async (data: any, additionalClaims = {}) => {
	const { user = {}, refreshTokenSecret = process.env.SECRET_REFRESH_TOKEN } =
		data
	const createToken = await signToken(
		user,
		process.env.SECRET_TOKEN as string,
		1800,
		additionalClaims
	)
	const createRefreshToken = await signToken(
		user,
		refreshTokenSecret,
		604800,
		additionalClaims
	)

	return [createToken, createRefreshToken]
}

export const refreshTokens = async (refreshToken: string, domain: string) => {
	const addSecurityChecks = {}

	let userId = 0
	try {
		const { user: { id = null } = {} } = jwt.decode(refreshToken) as any
		userId = id
	} catch (err) {
		return {}
	}

	if (!userId) {
		return {}
	}
	const validUser = await AppDataSource.getRepository(User).findOne({
		where: { id: userId },
	})
	if (!validUser) {
		return {}
	}

	const { password: userPassword = null, delta: userDelta = 0 } = validUser

	if (!userPassword) {
		return {}
	}

	const refreshTokenSecret =
		userPassword + userDelta + process.env.SECRET_REFRESH_TOKEN
	const { ok, user } = (await verifyToken(
		refreshToken,
		refreshTokenSecret,
		addSecurityChecks
	)) as any
	if (ok) {
		const [newToken, newRefreshToken] = await createTokens(
			{ user, refreshTokenSecret },
			addSecurityChecks
		)
		return {
			token: newToken,
			refreshToken: newRefreshToken,
			user,
		}
	}
	return {}
}
