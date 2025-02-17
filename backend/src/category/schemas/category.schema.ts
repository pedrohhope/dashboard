import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
    @Prop({ required: true })
    name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre('findOneAndDelete', async function (next) {
    const category = this.getFilter();
    const productModel = new this.model('Product') as Model<Product>;

    await productModel.updateMany(
        { categoryIds: category._id },
        { $pull: { categoryIds: category._id } }
    );

    next();
});
