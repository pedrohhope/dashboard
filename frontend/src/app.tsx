import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import { type Navigation } from '@toolpad/core/AppProvider';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import CategoryIcon from '@mui/icons-material/Category';
import ApprovalIcon from '@mui/icons-material/Approval';

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Estatísticas',
    },
    {
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        kind: 'header',
        title: 'Gestão',
    },
    {
        segment: 'orders',
        title: 'Pedidos',
        icon: <ApprovalIcon />

    },
    {
        segment: 'products',
        title: 'Produtos',
        icon: <InventoryIcon />,
    },
    {
        segment: 'categories',
        title: 'Categorias',
        icon: <CategoryIcon />
    },
];


export default function App() {
    return (
        <ReactRouterAppProvider
            navigation={NAVIGATION}
        >
            <Outlet />
        </ReactRouterAppProvider>
    );
}