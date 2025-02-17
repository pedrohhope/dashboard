import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { GetProductsDto } from './dto/get-products.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

  async create(createProductDto: CreateProductDto) {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async findAndCount(getProductsDto: GetProductsDto) {
    const filter = getProductsDto.search
      ? { name: { $regex: getProductsDto.search, $options: 'i' } }
      : {};

    const products = await this.productModel
      .find(filter)
      .limit(getProductsDto.limit)
      .skip(getProductsDto.limit * (getProductsDto.page - 1))
      .exec();

    return {
      products,
      count: await this.productModel.countDocuments(filter).exec(),
    };
  }


  async findOne(id: number) {
    const product = await this.productModel.findById(id).exec();

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    return product;
  }

  async remove(id: number) {
    const product = await this.productModel.findByIdAndDelete(id).exec();

    return product;
  }
}
