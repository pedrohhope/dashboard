import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { GetCategoriesDto } from './dto/get-categories.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>
  ) { }


  async create(createCategoryDto: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAllCategories() {
    const categories = await this.categoryModel
      .find()
      .sort({ updatedAt: -1 })
      .exec();
    return {
      categories
    };
  }


  async findOne(id: string) {
    const category = await this.categoryModel.findById(id).exec();

    return category;
  }

  async update(id: string, updatecategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, updatecategoryDto, { new: true })
      .exec();

    return category;
  }

  async remove(id: string) {
    console.log("id", id);
    const category = await this.categoryModel.findByIdAndDelete(id).exec();

    return category;
  }
}
