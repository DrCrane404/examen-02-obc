import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../../categories/entities/category.entity";
import { Option } from "../../options/entities/option.entity";
import { OrderDetail } from "../../order_details/entities/order_detail.entity";

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    sku!:string;

    @Column({unique:true})
    name!:string;

    @Column('decimal')
    price!:number

    @Column('decimal')
    weight!:number;

    @Column()
    description!:string;

    @Column()
    thumbnail!:string;

    @Column()
    image!:string;

    @ManyToMany(()=> Category, (category) => category.products)
    @JoinTable()
    categories!:Category[];

    @Column()
    create_date!:Date;

    @Column()
    stock!:number;

    @ManyToMany(()=> Option, (option) => option.products)
    @JoinTable()
    options!: Option[];

    @OneToMany(()=> OrderDetail, (detail) => detail.product)
    orderDetails!: OrderDetail[];

}
