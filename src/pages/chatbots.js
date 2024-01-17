import Head from 'next/head';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Snackbar,
  Stack,
  Typography
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ChatbotEdit } from '../sections/chatbot/chatbot-edit';
import { useApi } from '../hooks/use-api';
import { useState } from 'react';
import { CompanyTabs } from '../components/company-tabs';

const Page = () => {
  const {
    loading,
    companiesByCompanyId,
    chatbotsByCompanyId,
    showSaveResults, saveResults, handleDismissSaveResults, saveResultsSeverity,
  } = useApi()

  const [tabs, setTabs] = useState([]);
  const [selectedCompanyId, _setSelectedCompanyId] = useState('');
  const [chatbot, setChatbot] = useState({});

  const setSelectedCompanyId = company_id => {
    _setSelectedCompanyId(company_id)
    const _chatbot = chatbotsByCompanyId[company_id]
    setChatbot(_chatbot)
  }

  return (
    <>
      <Head>
        <title>
          Customization
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
            <CompanyTabs setSelectedCompanyId={setSelectedCompanyId} selectedCompanyId={selectedCompanyId}/>
            <ChatbotEdit chatbot={chatbot} />
          </Stack>
        </Container>
      </Box>
      <Snackbar open={showSaveResults} autoHideDuration={6000} onClose={handleDismissSaveResults}>
        <Alert onClose={handleDismissSaveResults} severity={saveResultsSeverity} sx={{ width: '100%' }}>
          {saveResults}
        </Alert>
      </Snackbar>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
