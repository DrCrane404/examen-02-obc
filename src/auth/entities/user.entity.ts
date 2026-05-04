import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "../../customers/entities/customer.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id!:number;

  @Column({ unique: true })
  email!:string;

  @Column()
  name!:string;

  @Column()
  password!:string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user', 'developer'],
    default: 'user'
  })
  role!:string;

  @OneToOne(() => Customer, (customer) => customer.user)
  customer!: Customer;
}