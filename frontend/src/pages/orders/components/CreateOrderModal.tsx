import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, InputLabel, FormControl, Select, Chip, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { CreateOrderDto } from '../../../types/orders';
import { Product } from '../../../types/products';
import { DatePicker } from '@mui/x-date-pickers';
import { formatCentsToReais } from '../../../utils/price';

interface OrderFormValues {
    productIds: string[];
    date: Date;
}

interface CreateOrderModalProps {
    open: boolean;
    onClose: () => void;
    products: Product[];
    onSubmit: (data: CreateOrderDto) => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ open, onClose, products, onSubmit }) => {
    const { handleSubmit, formState: { errors }, control, reset, watch } = useForm<OrderFormValues>({
        defaultValues: {
            productIds: [],
            date: new Date(),
        }
    });

    const selectedProductIds = watch("productIds");

    const calculateTotal = () => {
        return selectedProductIds.reduce((total, productId) => {
            const product = products.find(p => p._id === productId);
            if (product) {
                return total + product.price;
            }
            return total;
        }, 0) / 100;
    };

    const handleFormSubmit = (data: OrderFormValues) => {
        onSubmit({
            ...data,
            total: calculateTotal() * 100
        });
        onClose();
        reset();
    };

    const onCancel = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 'bold' }}>Criar Pedido</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <Controller name="date" control={control} render={({ field }) => (
                        <DatePicker {...field} label="Data do Pedido" format="dd/MM/yyyy" />
                    )} />

                    <FormControl fullWidth error={!!errors.productIds}>
                        <InputLabel>Produtos</InputLabel>
                        <Controller name="productIds" control={control} rules={{ required: 'Selecione pelo menos um produto' }} render={({ field }) => (
                            <Select {...field} multiple onChange={(event) => field.onChange(event.target.value)} renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).map((value) => {
                                        const product = products.find((p) => p._id === value);
                                        return product ? <Chip key={value} label={product.name} /> : null;
                                    })}
                                </Box>
                            )}>
                                {products.map((product) => (
                                    <MenuItem key={product._id} value={product._id}>{product.name}</MenuItem>
                                ))}
                            </Select>
                        )} />
                        {errors.productIds && <Box sx={{ color: 'error.main', fontSize: '0.875rem', mt: 0.5 }}>{errors.productIds.message}</Box>}
                    </FormControl>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <p>Total: {formatCentsToReais(calculateTotal())}</p>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onCancel} color="inherit" variant="outlined">Cancelar</Button>
                <Button onClick={handleSubmit(handleFormSubmit)} color="primary" variant="contained">Criar Pedido</Button>
            </DialogActions>
        </Dialog>
    );
};


export default CreateOrderModal;