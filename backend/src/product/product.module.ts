import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    UploadModule,
    MongooseModule.forFeature(
      [
        {
          name: Product.name,
          schema: ProductSchema
        }
      ]
    )],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
