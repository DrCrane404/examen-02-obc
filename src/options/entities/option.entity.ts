import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "../../producto/entities/producto.entity";

@Entity()
export class Option {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    option_name!:string;

    @ManyToMany(() => Producto, (producto) => producto.options)
    products!: Producto[];

}
