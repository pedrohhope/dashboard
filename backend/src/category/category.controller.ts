import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryService.create(createCategoryDto);

      return {
        statusCode: HttpStatus.CREATED,
        data: category,
        message: 'category created'
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(
    @Body() getCategoriesDto: GetCategoriesDto
  ) {
    try {
      const data = await this.categoryService.findAndCount(getCategoriesDto);

      return {
        statusCode: HttpStatus.OK,
        data,
        message: 'categories found',
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const category = await this.categoryService.findOne(id);

      return {
        statusCode: HttpStatus.OK,
        data: category,
        message: 'category found'
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryService.update(id, updateCategoryDto);

      return {
        statusCode: HttpStatus.OK,
        data: category,
        message: 'category updated'
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const category = await this.categoryService.remove(id);

      return {
        statusCode: HttpStatus.OK,
        data: category,
        message: 'category deleted'
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
