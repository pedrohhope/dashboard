import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { GetProductsDto } from './dto/get-products.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly uploadService: UploadService,
    @InjectModel(Product.name) private productModel: Model<Product>
  ) { }

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    const newProduct = new this.productModel(createProductDto);
    if (file) {
      newProduct.imageUrl = await this.uploadService.uploadFile(file, 'products');
    }

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


  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, file: Express.Multer.File) {
    const updatedProduct = new this.productModel(updateProductDto);

    if (file) updatedProduct.imageUrl = await this.uploadService.uploadFile(file, 'products');

    const product = await this.productModel
      .findByIdAndUpdate(id, updatedProduct, { new: true })
      .exec();

    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id).exec();

    return product;
  }
}
