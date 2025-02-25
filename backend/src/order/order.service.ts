import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private OrderModel: Model<Order>) { }

  async create(createOrderDto: CreateOrderDto) {
    const newOrder = new this.OrderModel(createOrderDto);
    return newOrder.save();
  }

  async findAll() {
    const orders = await this.OrderModel.find().sort({ createdAt: -1 })
      .lean()
      .exec();

    return {
      orders
    };
  }



  async findOne(id: string) {
    const order = await this.OrderModel.findById(id).exec();

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.OrderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();

    return order;
  }

  async remove(id: string) {
    const order = await this.OrderModel.findByIdAndDelete(id).exec();

    return order;
  }
}
