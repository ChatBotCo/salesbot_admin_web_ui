import { Alert, Box, Container, Snackbar, Stack, Typography } from '@mui/material';
import { ChatbotEdit } from './chatbot-edit';
import { useApi } from '../../hooks/use-api';
import { useEffect, useState } from 'react';
import { CompanyTabs } from '../../components/company-tabs';

export const ChatBotSection = () => {
  const {
    loading,
    chatbotsByCompanyId,
    showSaveResults, saveResults, handleDismissSaveResults, saveResultsSeverity,
  } = useApi()

  const [selectedCompanyId, _setSelectedCompanyId] = useState('');
  const [chatbot, setChatbot] = useState({});

  const setSelectedCompanyId = company_id => {
    _setSelectedCompanyId(company_id)
    const _chatbot = chatbotsByCompanyId[company_id]
    setChatbot(_chatbot)
  }

  useEffect(() => {
    if(selectedCompanyId) {
      const _chatbot = chatbotsByCompanyId[selectedCompanyId]
      setChatbot(_chatbot)
    }
  }, [chatbotsByCompanyId])

  return (
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
      <Snackbar open={showSaveResults} autoHideDuration={6000} onClose={handleDismissSaveResults}>
        <Alert onClose={handleDismissSaveResults} severity={saveResultsSeverity} sx={{ width: '100%' }}>
          {saveResults}
        </Alert>
      </Snackbar>
    </Box>
  )
};

