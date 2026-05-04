import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../orders/entities/order.entity";
import { Producto } from "../../producto/entities/producto.entity";

@Entity()
export class OrderDetail {
    @PrimaryGeneratedColumn()
    id!:number;

    @ManyToOne(()=> Order, (order)=> order.details)
    order!:Order;

    @ManyToOne(()=> Producto, (producto)=> producto.orderDetails)
    product!:Producto;

    @Column()
    quanty!:number;

    @Column()
    price!:number;
}
