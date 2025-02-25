import { Card, CardContent, Typography, Grid } from "@mui/material";
import { GetOrdersMetricsResponse } from "../../types/orders";
import { useEffect, useState, useMemo } from "react";
import { orderService } from "../../services/OrderService";
import { BarChart } from "@mui/x-charts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCentsToReais } from "../../utils/price";

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<GetOrdersMetricsResponse>({
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        ordersByPeriod: { daily: {}, weekly: {}, monthly: {} }
    });

    const [loading, setLoading] = useState(true);

    const getOrdersMetrics = async () => {
        try {
            const { data } = await orderService.getMetrics();
            if (data) {
                setMetrics(data);
            } else {
                console.error("Invalid data received from API:", data);
            }
        } catch (error) {
            console.error("Error fetching metrics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrdersMetrics();
    }, []);

    const xAxis = useMemo(() => {
        const dailyKeys = Object.keys(metrics.ordersByPeriod.daily);
        const weeklyKeys = Object.keys(metrics.ordersByPeriod.weekly);
        const monthlyKeys = Object.keys(metrics.ordersByPeriod.monthly);

        const largestSet = [dailyKeys, weeklyKeys, monthlyKeys]
            .sort((a, b) => b.length - a.length)[0];

        return [{
            scaleType: "band" as const,
            data: largestSet.map(date => {
                if (date.includes("W")) return date.replace("-", " ");
                if (date.length === 7) return format(parseISO(date + "-01"), "MM/yyyy", { locale: ptBR });
                return format(parseISO(date), "dd/MM/yyyy", { locale: ptBR });
            }),
        }];
    }, [metrics]);

    const series = useMemo(() => [
        {
            id: "daily",
            label: "Diário",
            data: Object.values(metrics.ordersByPeriod.daily) || [],
        },
        {
            id: "weekly",
            label: "Semanal",
            data: Object.values(metrics.ordersByPeriod.weekly) || [],
        },
        {
            id: "monthly",
            label: "Mensal",
            data: Object.values(metrics.ordersByPeriod.monthly) || [],
        }
    ], [metrics]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total de Pedidos</Typography>
                        <Typography variant="h4">{metrics.totalOrders}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total de Receita</Typography>
                        <Typography variant="h4">{formatCentsToReais(metrics.totalRevenue)}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Valor Médio dos Pedidos</Typography>
                        <Typography variant="h4">{formatCentsToReais(metrics.averageOrderValue)}</Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Pedidos por Período</Typography>
                        <BarChart
                            xAxis={xAxis}
                            loading={loading}
                            series={series}
                            height={400}
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
