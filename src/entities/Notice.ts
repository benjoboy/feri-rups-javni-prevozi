import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm"
import { User } from "./User"

@Entity("Notices", { orderBy: { id: "DESC" } })
export class Notice {
	@PrimaryGeneratedColumn({ name: "id" })
	id: number

	@Column("text", { name: "Title", nullable: true })
	title: string | null

	@Column("text", { name: "Content", nullable: true })
	content: string | null

	@Column("integer", { name: "UserId", nullable: true })
	userId: number | null
	@ManyToOne(() => User, (user) => user.notices, { onDelete: "CASCADE" })
	@JoinColumn([{ name: "UserId", referencedColumnName: "id" }])
	user: User
}
