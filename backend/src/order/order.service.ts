import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { GetOrdersDto } from './dto/get-orders.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private OrderModel: Model<Order>) { }

  async create(createOrderDto: CreateOrderDto) {
    const newOrder = new this.OrderModel(createOrderDto);
    newOrder.date = new Date();
    return newOrder.save();
  }

  async findAndCount(getOrdersDto: GetOrdersDto) {
    const filter = getOrdersDto.search
      ? { name: { $regex: getOrdersDto.search, $options: 'i' } }
      : {};

    const orders = await this.OrderModel
      .find(filter)
      .limit(getOrdersDto.limit)
      .skip(getOrdersDto.limit * (getOrdersDto.page - 1))
      .exec();

    return {
      orders,
      count: await this.OrderModel.countDocuments(filter).exec(),
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
