import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import {
    fakerPT_BR as faker
} from '@faker-js/faker';
import { Category, CategoryDocument } from '../../category/schemas/category.schema';
import { Product, ProductDocument } from '../../product/schemas/product.schema';
import { Order } from '../../order/schemas/order.schema';

@Injectable()
export class DatabaseSeedService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Order.name) private orderModel: Model<Order>,
    ) { }

    async seed() {
        const categories = await this.categoryModel.insertMany(this.generateCategories(5));
        const products = await this.productModel.insertMany(this.generateProducts(categories));
        await this.orderModel.insertMany(this.generateOrders(products));
        console.log('Banco de dados populado com sucesso!');
    }

    private generateCategories(num: number) {
        const categories: Category[] = [];
        for (let i = 0; i < num; i++) {
            categories.push({
                name: faker.commerce.department()
            });
        }
        return categories;
    }

    private generateProducts(categories: CategoryDocument[]) {
        const products: Product[] = [];
        for (let i = 0; i < 20; i++) {
            const price = faker.number.int({ min: 100, max: 50000 });

            const randomCategoryIds = faker.helpers.arrayElements(categories, faker.number.int({ min: 1, max: categories.length })).map((category) => category._id);

            products.push({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price,
                categoryIds: randomCategoryIds,
                imageUrl: faker.image.urlPicsumPhotos({
                    height: 200,
                    width: 200
                }),
            });
        }
        return products;
    }

    private generateOrders(products: ProductDocument[]) {
        const orders: Order[] = [];
        for (let i = 0; i < 15; i++) {
            const productIds: Types.ObjectId[] = [];
            const numProducts: number = faker.number.int({ min: 1, max: 5 });

            for (let j = 0; j < numProducts; j++) {
                const _id = products[faker.number.int({ min: 0, max: products.length - 1 })]._id;
                productIds.push(
                    _id
                );
            }

            const total = productIds.reduce((sum, productId) => {
                const product = products.find((p) => p._id.toString() === productId.toString());
                if (!product) {
                    return sum;
                }
                return sum + product.price;
            }, 0);

            orders.push({
                date: faker.date.past(),
                productIds,
                total,
            });
        }
        return orders;
    }
}
