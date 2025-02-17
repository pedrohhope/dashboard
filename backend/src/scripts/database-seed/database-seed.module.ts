import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../../category/schemas/category.schema';
import { Product, ProductSchema } from '../../product/schemas/product.schema';
import { Order, OrderSchema } from '../../order/schemas/order.schema';
import { DatabaseSeedService } from './database-seed.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        MongooseModule.forRoot(process.env.MONGO_URI as string),
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
            { name: Product.name, schema: ProductSchema },
            { name: Order.name, schema: OrderSchema },
        ]),
    ],
    providers: [DatabaseSeedService],
    exports: [DatabaseSeedService],
})
export class DatabaseSeedModule { }
