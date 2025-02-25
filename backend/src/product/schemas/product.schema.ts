import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ type: [Types.ObjectId], ref: 'Category' })
    categoryIds: Types.ObjectId[];

    @Prop({
        type: String,
        default: 'https://placehold.co/300x300',
    })
    imageUrl: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
