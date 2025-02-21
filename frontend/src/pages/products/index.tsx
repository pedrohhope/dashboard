import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box, Input, Tooltip, Typography } from '@mui/material';
import { Button } from '../../stories/Button';
import { useEffect, useState } from 'react';
import { Product } from '../../types/products';
import { productService } from '../../services/ProductService';

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
    type: 'number',
    renderCell: (params) => (
      <Cell value={formatCentsToReais(params.value)} />
    ),
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  console.log("total", total)

  const getProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productService.get({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search,
      });

      if (data && data.products && data.count !== undefined) {
        console.log(data);
        setProducts(data.products);
        setTotal(data.count);

      } else {
        console.error("Invalid data received from API:", data);
        setProducts([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getProducts();
  }, [paginationModel, search]);

  const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
    console.log(newPaginationModel);
    setPaginationModel(newPaginationModel);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPaginationModel({ ...paginationModel, page: 0 })
  }

  return (
    <div>
      <Box display={'flex'} justifyContent={'space-between'} mb={2}>
        <Input type="text" placeholder="Buscar" value={search} onChange={handleSearchChange} />
        <Button variant="contained" label="Adicionar produto" />

      </Box>

      <DataGrid
        rows={products}
        getRowId={(row) => row._id}
        columns={columns}
        pagination={true}
        rowCount={total}
        localeText={{
          MuiTablePagination: {
            labelRowsPerPage: "Linhas por página:",
          },
        }} paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        onRowCountChange={(count) => console.log("OnChangeCount", count)}
        pageSizeOptions={[10, 20]}
        loading={loading}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </div>
  );
}