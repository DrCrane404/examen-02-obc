import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "../../producto/entities/producto.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique:true})
    name!:string;
    
    @Column()
    description!:string;

    @Column()
    thumbnail!:string;

    @ManyToMany(() => Producto, (producto) => producto.categories)
    products!: Producto[];
}
