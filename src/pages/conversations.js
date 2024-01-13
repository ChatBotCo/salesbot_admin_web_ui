import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, CircularProgress, Container, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ConversationsTable } from '../sections/conversation/conversations-table';
import { useApi } from '../hooks/use-api';

const Page = () => {
  const {
    loading,
    conversationsByCompanyId,
    companiesByCompanyId,
    messageCountsPerConvo,
  } = useApi()

  const [tabs, setTabs] = useState([]);
  const [titleElement, setTitleElement] = useState('Conversations');
  const [selectedCompanyId, _setSelectedCompanyId] = useState('');
  const [conversations, setConversations] = useState([]);

  const setSelectedCompanyId = company_id => {
    _setSelectedCompanyId(company_id)

    const company = companiesByCompanyId[company_id]
    if(company) {
      const convos = conversationsByCompanyId[company_id] || []
      setConversations(convos)
      setTitleElement(`${convos.length} Conversations`)
    } else {
      setTitleElement('Conversations')
    }
  }

  useEffect(() => {
    const companies = Object.values(companiesByCompanyId) || []
    const firstCompany = (companies.length>0 && companies[0]) || {}
    const firstCompanyId = firstCompany.company_id
    setSelectedCompanyId(firstCompanyId)

    // console.log(companies)
    const _tabs = companies.map((company, i) => {
      return <Tab
        key={company.company_id}
        label={company.name}
        value={company.company_id}
      />
    })
    setTabs(_tabs)
  },[companiesByCompanyId, conversationsByCompanyId]);

  const handleSelectCompany = (e,company_id) => {
    setSelectedCompanyId(company_id);
  }

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
            <Tabs
              onChange={handleSelectCompany}
              sx={{ mb: 3 }}
              value={selectedCompanyId}
            >
              {tabs}
            </Tabs>
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
