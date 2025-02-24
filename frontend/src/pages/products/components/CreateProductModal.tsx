import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, InputLabel, FormControl, Select, Chip, Box, Stack } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { GetAllCategoriesResponse } from '../../../types/categories';
import { CreateProductDto } from '../../../types/products';
import { useDropzone } from 'react-dropzone'; // Importando o hook da react-dropzone

interface ProductFormValues {
    name: string;
    description: string;
    price: string;
    categoryIds: string[];
    image: File | null;
}

interface CreateProductModalProps {
    open: boolean;
    onClose: () => void;
    categories: GetAllCategoriesResponse['categories'];
    onSubmit: (data: CreateProductDto, file: File) => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ open, onClose, categories, onSubmit }) => {
    const { register, handleSubmit, formState: { errors }, control, reset, setValue } = useForm({
        defaultValues: {
            categoryIds: [],
            name: '',
            description: '',
            price: '',
            image: null
        }
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
        if (!data.image) return;

        const formattedPrice = Number(data.price.replace('R$', '').replace(',', '.').trim());
        const priceInCents = Math.round(formattedPrice * 100);

        const formattedData = {
            ...data,
            price: priceInCents,
        };


        onSubmit(formattedData, data.image);
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
            <DialogTitle sx={{ fontWeight: 'bold' }}>Criar Produto</DialogTitle>
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
                    Enviar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateProductModal;
