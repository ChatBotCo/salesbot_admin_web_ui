import Head from 'next/head';
import {
  Box,
  CircularProgress,
  Container,
  Stack, Tab, Tabs,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfile } from 'src/sections/account/account-profile';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import { ChatbotEdit } from '../sections/chatbot/chatbot-edit';
import { useApi } from '../hooks/use-api';
import { useEffect, useState } from 'react';

const Page = () => {
  const {
    loading,
    companiesByCompanyId,
    chatbotsByCompanyId,
  } = useApi()

  const [tabs, setTabs] = useState([]);
  const [selectedCompanyId, _setSelectedCompanyId] = useState('');
  const [chatbot, setChatbot] = useState({});

  const setSelectedCompanyId = company_id => {
    _setSelectedCompanyId(company_id)
    const _chatbot = chatbotsByCompanyId[company_id]
    setChatbot(_chatbot)
  }

  useEffect(() => {
    const companies = Object.values(companiesByCompanyId) || []
    const firstCompany = (companies.length>0 && companies[0]) || {}
    const firstCompanyId = firstCompany.company_id
    setSelectedCompanyId(firstCompanyId)

    const _tabs = companies.map((company, i) => {
      return <Tab
        key={company.company_id}
        label={company.name}
        value={company.company_id}
      />
    })
    setTabs(_tabs)
  },[companiesByCompanyId, chatbotsByCompanyId]);

  const handleSelectCompany = (e,company_id) => {
    setSelectedCompanyId(company_id);
  }

  return (
    <>
      <Head>
        <title>
          Customize Your Chat Bot
          {loading && <CircularProgress />}
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">
                Customize Your Chat Bot
              </Typography>
            </div>
            <Tabs
              onChange={handleSelectCompany}
              sx={{ mb: 3 }}
              value={selectedCompanyId}
            >
              {tabs}
            </Tabs>
            <ChatbotEdit chatbot={chatbot} />
          </Stack>
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
