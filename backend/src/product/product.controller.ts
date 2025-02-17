import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productService.create(createProductDto);

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
  async findAll(
    @Body() getProductsDto: GetProductsDto
  ) {
    try {
      const data = await this.productService.findAndCount(getProductsDto);

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
      const product = await this.productService.findOne(+id);

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
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productService.update(+id, updateProductDto);

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
      const product = await this.productService.remove(+id);

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
