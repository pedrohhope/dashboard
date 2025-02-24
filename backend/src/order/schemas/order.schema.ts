import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true })
    date: Date;

    @Prop({ type: [Types.ObjectId], ref: 'Product' })
    productIds: Types.ObjectId[];

    @Prop({ required: true })
    total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
