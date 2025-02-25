import { DataGrid as MuiDataGrid, DataGridProps } from '@mui/x-data-grid';


export const DataGrid = ({
    ...props
}: DataGridProps) => {
    return (
        <MuiDataGrid
            {...props}
        />
    );
};


