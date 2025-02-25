import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body('createProductDto') createProductDtoString: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      const createProductDto: CreateProductDto = JSON.parse(createProductDtoString);
      const product = await this.productService.create(createProductDto, file);

      return {
        statusCode: HttpStatus.CREATED,
        data: product,
        message: 'Product created'
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      const data = await this.productService.findAll()

      return {
        statusCode: HttpStatus.OK,
        data,
        message: 'Products found',
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productService.findOne(id);

      return {
        statusCode: HttpStatus.OK,
        data: product,
        message: 'Product found'
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body('updateProductDto') updateProductDtoString: string,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      const updateProductDto: UpdateProductDto = JSON.parse(updateProductDtoString);
      const product = await this.productService.update(id, updateProductDto, file);

      return {
        statusCode: HttpStatus.OK,
        data: product,
        message: 'Product updated'
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const product = await this.productService.remove(id);

      return {
        statusCode: HttpStatus.OK,
        data: product,
        message: 'Product deleted'
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
