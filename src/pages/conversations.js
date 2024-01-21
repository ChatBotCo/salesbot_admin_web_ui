import {useEffect, useState} from 'react';
import Head from 'next/head';
import {Box, CircularProgress, Container, Stack, Typography} from '@mui/material';
import {Layout as DashboardLayout} from 'src/layouts/dashboard/layout';
import {ConversationsTable} from '../sections/conversation/conversations-table';
import {useApi} from '../hooks/use-api';

const Page = () => {
  const {
    loading,
    conversationsByCompanyId,
    companiesByCompanyId,
    messageCountsPerConvo,
    selectedCompanyId,
  } = useApi()

  const [titleElement, setTitleElement] = useState('Conversations');
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const company = companiesByCompanyId[selectedCompanyId]
    if(company) {
      const convos = conversationsByCompanyId[selectedCompanyId] || []
      setConversations(convos)
      setTitleElement(`${convos.length} Conversations`)
    } else {
      setTitleElement('Conversations')
    }
  },[selectedCompanyId]);

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
            <ConversationsTable
              items={conversations}
              messageCountsPerConvo={messageCountsPerConvo}
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
