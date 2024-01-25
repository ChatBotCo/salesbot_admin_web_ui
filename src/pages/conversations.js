import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ConversationsTable } from '../sections/conversation/conversations-table';
import { useApi } from '../hooks/use-api';

const Page = () => {
  const {
    loading,
  } = useApi()

  const [conversations, setConversations] = useState([]);
  const [titleElement, setTitleElement] = useState('Conversations');

  useEffect(() => {
    if(conversations) {
      setTitleElement(`${conversations.length} Conversations`)
    } else {
      setTitleElement('Conversations')
    }
  },[conversations]);

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
                  {titleElement}
                  {loading && <CircularProgress />}
                </Typography>
              </Stack>
            </Stack>
            <ConversationsTable conversations={conversations} setConversations={setConversations} />
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
