import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("Stations", { orderBy: { id: "DESC" } })
export class Station {
	@PrimaryGeneratedColumn({ name: "id" })
	id: number

	@Column("text", { name: "Name", nullable: true })
	name: string | null

	@Column("text", { name: "Address", nullable: true })
	address: string | null

	@Column("text", { name: "Url", nullable: true })
	url: string | null

	@Column("float", { name: "Latitude", nullable: true })
	latitude: number | null

	@Column("float", { name: "Longitude", nullable: true })
	longitude: number | null
}
