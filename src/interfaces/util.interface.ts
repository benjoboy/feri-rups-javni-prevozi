import { Request } from "express"

interface User {
	id: number
	email: string
	firstName: string
	lastName: string
}

export interface RequestWithUser extends Request {
	user: User
	params: any
}
