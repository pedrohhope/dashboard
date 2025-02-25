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

  async metrics() {
    const result = await this.OrderModel.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
          averageOrderValue: { $avg: "$total" }
        }
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalRevenue: 1,
          averageOrderValue: 1
        }
      }
    ]);

    const ordersByPeriod = await this.OrderModel.aggregate([
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            week: { $dateToString: { format: "%Y-W%U", date: "$date" } },
            month: { $dateToString: { format: "%Y-%m", date: "$date" } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          daily: { $push: { k: "$_id.day", v: "$count" } },
          weekly: { $push: { k: "$_id.week", v: "$count" } },
          monthly: { $push: { k: "$_id.month", v: "$count" } }
        }
      },
      {
        $project: {
          _id: 0,
          daily: { $arrayToObject: "$daily" },
          weekly: { $arrayToObject: "$weekly" },
          monthly: { $arrayToObject: "$monthly" }
        }
      }
    ]);

    return {
      totalOrders: result[0]?.totalOrders || 0,
      totalRevenue: result[0]?.totalRevenue || 0,
      averageOrderValue: result[0]?.averageOrderValue || 0,
      ordersByPeriod: ordersByPeriod[0] || { daily: {}, weekly: {}, monthly: {} }
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
