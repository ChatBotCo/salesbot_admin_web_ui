import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { MetricsGrid } from '../sections/metrics/metrics-grid';
import { useAuth } from '../hooks/use-auth';
import { NewUser } from '../sections/new_user/new-user';
import { Box, Container } from '@mui/material';

const now = new Date();

const Page = () => {
  const {user} = useAuth();

  return (
    <>
      <Head>
        <title>
          Sales Chatbot
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          {(user && user.company_id) ? <MetricsGrid /> : <NewUser />}
        </Container>
      </Box>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
