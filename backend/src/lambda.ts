import { APIGatewayProxyHandler } from 'aws-lambda';
import mongoose from 'mongoose';
import { Order, OrderSchema } from './order/schemas/order.schema';

require('dotenv').config();
const OrderModel = mongoose.model('Order', OrderSchema);

export const processSalesReport: APIGatewayProxyHandler = async (event) => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        const orders = await OrderModel.find({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        });

        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

        await mongoose.disconnect();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Relatório gerado', totalSales }),
        };
    } catch (error) {
        console.error('Erro ao gerar relatório', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao processar o relatório' }),
        };
    }
};
