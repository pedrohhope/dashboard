import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true })
    name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre('findOneAndDelete', async function (next) {
    const category = this.getFilter();
    const productModel = this.model.db.model('Product');

    await productModel.updateMany(
        { categoryIds: category._id },
        { $pull: { categoryIds: category._id } }
    );

    next();
});
