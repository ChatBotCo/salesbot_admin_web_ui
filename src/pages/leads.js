import Head from 'next/head';
import { Box, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ConversationsTable } from '../sections/conversation/conversations-table';
import { useApi } from '../hooks/use-api';
import { LeadsTable } from '../sections/conversation/leads-table';

const Page = () => {
  const {conversationsWithUserData, loading} = useApi()

  return (
    <>
      <Head>
        <title>
          Leads
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Leads Generated ({conversationsWithUserData && conversationsWithUserData.length})
                  {loading && <CircularProgress />}
                </Typography>
              </Stack>
            </Stack>
            <LeadsTable
              items={conversationsWithUserData}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
