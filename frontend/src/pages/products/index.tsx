import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box, Fade, Snackbar, Tooltip, Typography } from '@mui/material';
import { Button } from '../../stories/Button';
import { useEffect, useState } from 'react';
import { CreateProductDto, Product, UpdateProductDto } from '../../types/products';
import { productService } from '../../services/ProductService';
import CreateProductModal from './components/CreateProductModal';
import { categoryService } from '../../services/CategoryService';
import { TransitionProps } from '@mui/material/transitions';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateProductModal from './components/UpdateProductModal';
import { format } from 'date-fns';
import { Category } from '../../types/categories';

const formatCentsToReais = (cents: number): string => {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const Cell = ({ value }: { value: any }) => {
  return (
    <Tooltip title={value} arrow>
      <Box display={'flex'} alignItems={'center'} width={'100%'} height={'100%'}>
        <Typography noWrap>{value}</Typography>
      </Box>
    </Tooltip>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const [openUpdateProductModal, setOpenUpdateProductModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);

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

  const onRemoveProduct = async (_id: string) => {
    try {
      const { data, statusCode } = await productService.remove(_id);

      if (data && statusCode === 200) {
        setState({
          open: true,
          Transition: Fade,
          message: 'Produto deletado com sucesso',
        });
        setProducts(products.filter((product) => product._id !== _id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setState({
        open: true,
        Transition: Fade,
        message: "Erro ao deletar produto",
      });
    }
  };

  const handleChangeCreateProductModal = () => {
    setOpenCreateProductModal(!openCreateProductModal);
  };

  const handleChangeUpdateProductModal = () => {
    if (productToUpdate) {
      setProductToUpdate(null);
    }
    setOpenUpdateProductModal(!openUpdateProductModal);
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productService.get();

      if (data && data.products !== undefined) {
        setProducts(data.products);
      } else {
        console.error("Invalid data received from API:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await categoryService.get();
      if (data && data.categories) {
        setCategories(data.categories);
      } else {
        console.error("Invalid data received from API:", data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]);

  }, []);

  const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  const onCreateProduct = async (createProductDto: CreateProductDto, file: File) => {
    try {
      const { data, statusCode } = await productService.create(createProductDto, file);

      if (data && statusCode === 201) {
        setState({
          open: true,
          Transition: Fade,
          message: 'Produto criado com sucesso',
        });
        setOpenCreateProductModal(false);
        setProducts([...products, data]);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setState({
        open: true,
        Transition: Fade,
        message: "Erro ao criar produto",
      });
    }
  };

  const onUpdateProduct = async (_id: string, updateProductDto: UpdateProductDto, file?: File) => {
    try {
      const { data, statusCode } = await productService.update(_id, updateProductDto, file);

      if (data && statusCode === 200) {
        setState({
          open: true,
          Transition: Fade,
          message: 'Produto atualizado com sucesso',
        });
        setOpenCreateProductModal(false);
        setProducts(products.map((product) => (product._id === _id ? data : product)));
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setState({
        open: true,
        Transition: Fade,
        message: "Erro ao atualizar produto",
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
      field: 'description',
      headerName: 'Descrição',
      width: 200,
      renderCell: (params) => <Cell value={params.value} />,
    },
    {
      field: 'price',
      headerName: 'Preço',
      width: 110,
      renderCell: (params) => (
        <Cell value={formatCentsToReais(params.value)} />
      ),
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
              const productId = params.row._id;
              const product = products.find((p) => p._id.toString() === productId.toString());
              if (product) {
                setProductToUpdate(product);
                handleChangeUpdateProductModal();
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
              const productId = params.row._id;
              const isConfirmed = window.confirm('Você tem certeza que deseja remover este produto?');
              if (isConfirmed) {
                onRemoveProduct(productId);
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
          label="Adicionar produto"
          onClick={handleChangeCreateProductModal}
          loading={loadingCategories}
        />
      </Box>

      <DataGrid
        rows={products}
        getRowId={(row) => row._id}
        columns={columns}
        pagination={true}
        rowCount={products.length}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[5, 10]}
        loading={loading}
        checkboxSelection
        sx={{ border: 0 }}
      />

      <CreateProductModal
        open={openCreateProductModal}
        categories={categories}
        onSubmit={onCreateProduct}
        onClose={handleChangeCreateProductModal}
      />

      {productToUpdate && (
        <UpdateProductModal
          categories={categories}
          open={openUpdateProductModal}
          product={productToUpdate}
          onSubmit={onUpdateProduct}
          onClose={handleChangeUpdateProductModal}
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
