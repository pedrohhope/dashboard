import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';

interface CategoryFormValues {
    name: string;
}

interface CreateCategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ open, onClose, onSubmit }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: '',
        }
    });

    const handleFormSubmit = (data: CategoryFormValues) => {
        onSubmit(data.name);
        onClose();
        reset();
    };

    const onCancel = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 'bold' }}>Criar nova categoria</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit(handleFormSubmit)}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
                >
                    <TextField
                        {...register('name', { required: 'Nome é obrigatório' })}
                        label="Nome da categoria"
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
                    Enviar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateCategoryModal;
