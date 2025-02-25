import { Meta, StoryObj } from "@storybook/react";
import { DataGrid } from "./DataGrid";
import { DataGridProps, GridColDef } from "@mui/x-data-grid";

const meta: Meta<typeof DataGrid> = {
    title: "Components/DataGrid",
    component: DataGrid,
    argTypes: {
        rows: { control: "object" },
        columns: { control: "object" },
    },
};

export default meta;

const mockColumns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "age", headerName: "Age", type: "number", width: 110 },
    { field: "city", headerName: "City", width: 160 },
];

const mockRows = [
    { id: 1, name: "Alice", age: 25, city: "New York" },
    { id: 2, name: "Bob", age: 30, city: "San Francisco" },
    { id: 3, name: "Charlie", age: 35, city: "Chicago" },
];

export const Default: StoryObj<DataGridProps> = {
    args: {
        rows: mockRows,
        columns: mockColumns,
        pageSizeOptions: [5, 10],
        autoHeight: true,
    },
};

export const WithPagination: StoryObj<DataGridProps> = {
    args: {
        rows: mockRows,
        columns: mockColumns,
        pageSizeOptions: [2],
        pagination: true,
        autoHeight: true,
    },
};

export const WithoutHeader: StoryObj<DataGridProps> = {
    args: {
        rows: mockRows,
        columns: mockColumns,
        hideFooter: true,
        autoHeight: true,
        disableColumnMenu: true,
    },
};