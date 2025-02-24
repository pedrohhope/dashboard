import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, InputLabel, FormControl, Select, Chip, Box, Stack } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { Product, UpdateProductDto } from '../../../types/products';
import { useDropzone } from 'react-dropzone';
import { Category, GetAllCategoriesResponse } from '../../../types/categories';

interface ProductFormValues {
    name: string;
    description: string;
    price: string;
    categoryIds: string[];
    image: File | null;
}

interface UpdateProductModalProps {
    open: boolean;
    onClose: () => void;
    product: Product;
    categories: GetAllCategoriesResponse['categories'];
    onSubmit: (_id: string, data: UpdateProductDto, file?: File) => void;
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({ open, onClose, product, onSubmit, categories }) => {
    const { register, handleSubmit, formState: { errors }, control, reset, setValue } = useForm<ProductFormValues>({
        defaultValues: {
            categoryIds: product.categories.map((category) => category._id),
            name: product.name || '',
            description: product.description || '',
            price: product.price ? (product.price / 100).toString() : '',
            image: null
        }
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (product.imageUrl) {
            setImagePreview(product.imageUrl);
        }
    }, [product]);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setValue('image', file as any);
        setImagePreview(URL.createObjectURL(file));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        multiple: false,
    });

    const handleFormSubmit = (data: ProductFormValues) => {

        const formattedPrice = Number(data.price.replace('R$', '').replace(',', '.').trim());
        const priceInCents = Math.round(formattedPrice * 100);

        const formattedData: UpdateProductDto = {
            categoryIds: data.categoryIds,
            name: data.name,
            description: data.description,
            price: priceInCents,
        };

        onSubmit(product._id, formattedData, data.image ? data.image : undefined);
        onClose();
        reset();
        setImagePreview(null);
    };

    const onCancel = () => {
        reset();
        setImagePreview(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 'bold' }}>Atualizar Produto</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit(handleFormSubmit)}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
                >
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: '2px dashed #ccc',
                            padding: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            borderRadius: 1,
                            backgroundColor: '#f5f5f5',
                        }}
                    >
                        <input {...getInputProps()} />
                        {imagePreview ? (
                            <img src={imagePreview} alt="preview" style={{ width: '100%', height: 'auto' }} />
                        ) : (
                            <p>Arraste e solte a imagem do produto, ou clique para selecionar uma</p>
                        )}
                    </Box>
                    <TextField
                        {...register('name', { required: 'Nome é obrigatório' })}
                        label="Nome do Produto"
                        variant="outlined"
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <TextField
                        {...register('description', { required: 'Descrição é obrigatória' })}
                        label="Descrição"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />

                    <Controller
                        name="price"
                        control={control}
                        rules={{ required: 'Preço é obrigatório' }}
                        render={({ field }) => (
                            <NumericFormat
                                {...field}
                                customInput={TextField}
                                label="Preço"
                                variant="outlined"
                                fullWidth
                                decimalSeparator=","
                                thousandSeparator="."
                                prefix="R$ "
                                allowNegative={false}
                                error={!!errors.price}
                                helperText={errors.price?.message}
                                onValueChange={(values) => {
                                    field.onChange(values.value);
                                }}
                            />
                        )}
                    />

                    <FormControl fullWidth error={!!errors.categoryIds}>
                        <InputLabel>Categorias</InputLabel>
                        <Controller
                            name="categoryIds"
                            control={control}
                            rules={{ required: 'Selecione pelo menos uma categoria' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    multiple
                                    onChange={(event) => field.onChange(event.target.value)}
                                    renderValue={(selected) => (
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            {(selected as string[]).map((value) => {
                                                const category = categories.find((c) => c._id === value);
                                                return category ? <Chip key={value} label={category.name} /> : null;
                                            })}
                                        </Stack>
                                    )}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category._id} value={category._id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.categoryIds && (
                            <Box sx={{ color: 'error.main', fontSize: '0.875rem', mt: 0.5 }}>
                                {errors.categoryIds.message}
                            </Box>
                        )}
                    </FormControl>


                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onCancel} color="inherit" variant="outlined">
                    Cancelar
                </Button>
                <Button onClick={handleSubmit(handleFormSubmit)} color="primary" variant="contained">
                    Atualizar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateProductModal;
