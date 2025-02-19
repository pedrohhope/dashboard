import { PageContainer } from '@toolpad/core';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <DashboardLayout>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}