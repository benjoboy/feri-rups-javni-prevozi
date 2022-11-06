import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Notice } from "./Notice"

@Entity("Users", { orderBy: { id: "DESC" } })
export class User {
	@PrimaryGeneratedColumn({ name: "id" })
	id: number

	@Column("text", { name: "FirstName", nullable: true })
	firstName: string | null

	@Column("text", { name: "LastName", nullable: true })
	lastName: string | null

	@Column("text", { name: "Email" })
	email: string

	@Column("text", { name: "Password" })
	password: string

	@Column("integer", { name: "Delta", nullable: true })
	delta: number | null

	@OneToMany(() => Notice, (notice) => notice.user)
	notices: Notice[]
}
