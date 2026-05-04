import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../orders/entities/order.entity";
import { User } from "../../auth/entities/user.entity";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    full_name!:string;

    @Column()
    billing_address!:string;

    @Column()
    default_shipping_address!:string;

    @Column()
    country!:string;

    @Column()
    phone!:string;

    @OneToMany(() => Order, (order) => order.customer)
    orders!: Order[];
    
    @OneToOne(() => User)
    @JoinColumn()
    user!: User;
}
