import Head from 'next/head';
import { Box, CircularProgress, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useApi } from '../hooks/use-api';
import { OverviewConversationsByDate } from '../sections/overview/overview-conversations-by-date';
import { MetricsGrid } from '../sections/metrics/metrics-grid';

const now = new Date();

const Page = () => {
  return (
    <>
      <Head>
        <title>
          Sales Chatbot
        </title>
      </Head>
      <MetricsGrid />
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
