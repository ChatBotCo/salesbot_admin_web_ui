import Head from 'next/head';
import { Box, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ConversationsTable } from '../sections/conversation/conversations-table';
import { useApi } from '../hooks/use-api';
import { useAuth } from '../hooks/use-auth';

const Page = () => {
  const {conversationsForBlackTie, loading} = useApi()
  const {user} = useAuth()

  return (
    <>
      <Head>
        <title>
          Conversations
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
                  Black Tie Conversations ({conversationsForBlackTie && conversationsForBlackTie.length})
                  {loading && <CircularProgress />}
                </Typography>
              </Stack>
            </Stack>
            <ConversationsTable
              items={conversationsForBlackTie.filter(c=>c.many_msgs>0)}
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
