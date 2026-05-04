import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "../../customers/entities/customer.entity";
import { OrderDetail } from "../../order_details/entities/order_detail.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id!:number;

    @ManyToOne(() => Customer, (customer) => customer.orders)
    customer!:Customer;

    @Column()
    amount!:number;

    @Column()
    shipping_address!:string;

    @Column()
    order_address!:string;

    @Column()
    order_email!:string;

    @Column()
    order_date!:Date;

    @Column()
    order_status!:string;

    @OneToMany(()=> OrderDetail, (detail) => detail.order, { cascade: true, onDelete: 'CASCADE' })
    details!: OrderDetail[];
}
