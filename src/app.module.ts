import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoModule } from './producto/producto.module';
import { CategoriesModule } from './categories/categories.module';
import { OptionsModule } from './options/options.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { OrderDetailsModule } from './order_details/order_details.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
      ConfigModule.forRoot({
  isGlobal:true,
  }),
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'prueba_exa',
        autoLoadEntities: true,
        synchronize: true,
    }),ProductoModule, CategoriesModule, OptionsModule, CustomersModule, OrdersModule, OrderDetailsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
