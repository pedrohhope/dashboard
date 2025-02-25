import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box, Fade, Snackbar, Tooltip, Typography } from '@mui/material';
import { Button } from '../../stories/Button';
import { useEffect, useState } from 'react';
import { Category } from '../../types/categories';
import { categoryService } from '../../services/CategoryService';
import { TransitionProps } from '@mui/material/transitions';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import CreateCategoryModal from './components/CreateCategoryModal';
import UpdateCategoryModal from './components/UpdateCategoryModal';
import { DataGrid } from '../../stories/DataGrid';

const Cell = ({ value }: { value: any }) => {
    return (
        <Tooltip title={value} arrow>
            <Box display={'flex'} alignItems={'center'} width={'100%'} height={'100%'}>
                <Typography noWrap>{value}</Typography>
            </Box>
        </Tooltip>
    );
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    const [loading, setLoading] = useState(false);
    const [openCreateCategoryModal, setOpenCreateCategoryModal] = useState(false);
    const [openUpdateCategoryModal, setOpenUpdateCategoryModal] = useState(false);
    const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(null);

    const [state, setState] = useState<{
        open: boolean;
        Transition: React.ComponentType<
            TransitionProps & {
                children: React.ReactElement<any, any>;
            }
        >;
        message: string;
    }>({
        open: false,
        Transition: Fade,
        message: '',
    });

    const onRemoveCategory = async (_id: string) => {
        try {
            const { data, statusCode } = await categoryService.remove(_id);

            if (data && statusCode === 200) {
                setState({
                    open: true,
                    Transition: Fade,
                    message: 'Categoria deletado com sucesso',
                });
                setCategories(categories.filter((category) => category._id !== _id));
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            setState({
                open: true,
                Transition: Fade,
                message: "Erro ao deletar categoria",
            });
        }
    };

    const handleChangeCreateCategoryModal = () => {
        setOpenCreateCategoryModal(!openCreateCategoryModal);
    };

    const handleChangeUpdateCategoryModal = () => {
        if (categoryToUpdate) {
            setCategoryToUpdate(null);
        }
        setOpenUpdateCategoryModal(!openUpdateCategoryModal);
    };

    const getCategories = async () => {
        setLoading(true);
        try {
            const { data } = await categoryService.get();

            if (data && data.categories !== undefined) {
                setCategories(data.categories);
            } else {
                console.error("Invalid data received from API:", data);
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const onCreateCategory = async (name: string) => {
        try {
            const { data, statusCode } = await categoryService.create(name);

            if (data && statusCode === 201) {
                setState({
                    open: true,
                    Transition: Fade,
                    message: 'Categoria criado com sucesso',
                });
                setOpenCreateCategoryModal(false);
                setCategories([...categories, data]);
            }
        } catch (error) {
            console.error("Error creating category:", error);
            setState({
                open: true,
                Transition: Fade,
                message: "Erro ao criar categoria",
            });
        }
    };

    const onUpdateCategory = async (_id: string, name: string) => {
        try {
            const { data, statusCode } = await categoryService.update(_id, name);

            if (data && statusCode === 200) {
                setState({
                    open: true,
                    Transition: Fade,
                    message: 'Categoria atualizado com sucesso',
                });
                setOpenCreateCategoryModal(false);
                setCategories(categories.map((category) => (category._id === _id ? data : category)));
            }
        } catch (error) {
            console.error("Error updating category:", error);
            setState({
                open: true,
                Transition: Fade,
                message: "Erro ao atualizar categoria",
            });
        }
    };

    const columns: GridColDef[] = [
        {
            field: '_id',
            headerName: 'ID',
            width: 150,
            renderCell: (params) => <Cell value={params.value} />,
        },
        {
            field: 'name',
            headerName: 'Nome',
            width: 150,
            renderCell: (params) => <Cell value={params.value} />,
        },
        {
            field: 'createdAt',
            headerName: 'Criado em',
            width: 150,
            renderCell: (params) => (
                <Cell value={format(params.value, 'dd/MM/yyyy HH:mm')} />
            ),
        },
        {
            field: 'updatedAt',
            headerName: 'Atualizado em',
            width: 150,
            renderCell: (params) => (
                <Cell value={format(params.value, 'dd/MM/yyyy HH:mm')} />
            ),
        },
        {
            field: 'actions',
            headerName: 'Ações',
            width: 200,
            renderCell: (params) => (
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    width={'100%'}
                    height={'100%'}
                >
                    <Button
                        label="Editar"
                        color="primary"
                        size="small"
                        onClick={() => {
                            const categoryId = params.row._id;
                            const category = categories.find((p) => p._id.toString() === categoryId.toString());
                            if (category) {
                                setCategoryToUpdate(category);
                                handleChangeUpdateCategoryModal();
                            }
                        }}
                        sx={{ marginRight: 1 }}
                        startIcon={<EditIcon />}
                    />

                    <Button
                        label="Remover"
                        color="error"
                        size="small"
                        onClick={() => {
                            const categoryId = params.row._id;
                            const isConfirmed = window.confirm('Você tem certeza que deseja remover essa categoria?');
                            if (isConfirmed) {
                                onRemoveCategory(categoryId);
                            }
                        }}
                        startIcon={<DeleteIcon />}
                    />
                </Box>
            ),
        }
    ];

    return (
        <div>
            <Box display={'flex'} justifyContent={'end'} mb={2}>
                <Button
                    variant="contained"
                    label="Adicionar categoria"
                    onClick={handleChangeCreateCategoryModal}
                    loading={loading}
                />
            </Box>

            <DataGrid
                rows={categories}
                getRowId={(row) => row._id}
                columns={columns}
                pagination={true}
                rowCount={categories.length}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={[5, 10]}
                loading={loading}
                checkboxSelection
                sx={{ border: 0 }}
            />

            <CreateCategoryModal
                open={openCreateCategoryModal}
                onSubmit={onCreateCategory}
                onClose={handleChangeCreateCategoryModal}
            />

            {categoryToUpdate && (
                <UpdateCategoryModal
                    open={openUpdateCategoryModal}
                    category={categoryToUpdate}
                    onSubmit={onUpdateCategory}
                    onClose={handleChangeUpdateCategoryModal}
                />
            )}

            <Snackbar
                open={state.open}
                TransitionComponent={state.Transition}
                message={state.message}
                key={state.Transition.name}
                autoHideDuration={100}
            />
        </div>
    );
}
