import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Category } from '../../../types/categories';

interface CategoryFormValues {
    name: string;
}

interface UpdateCategoryModalProps {
    open: boolean;
    onClose: () => void;
    category: Category;
    onSubmit: (_id: string, name: string) => void;
}

const UpdateCategoryModal: React.FC<UpdateCategoryModalProps> = ({ open, onClose, category, onSubmit }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryFormValues>({
        defaultValues: {
            name: category.name
        }
    });

    const handleFormSubmit = (data: CategoryFormValues) => {
        onSubmit(category._id, data.name);
        onClose();
        reset();
    };

    const onCancel = () => {
        reset();
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
                    <TextField
                        {...register('name', { required: 'Nome é obrigatório' })}
                        label="Nome do Produto"
                        variant="outlined"
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
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

export default UpdateCategoryModal;
