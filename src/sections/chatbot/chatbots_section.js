import {Alert, Box, Container, Snackbar, Stack, Typography} from '@mui/material';
import {ChatbotEdit} from './chatbot-edit';
import {useApi} from '../../hooks/use-api';
import {useEffect, useState} from 'react';

export const ChatBotSection = () => {
  const {
    chatbotsByCompanyId,
    showSaveResults, saveResults, handleDismissSaveResults, saveResultsSeverity,
    selectedCompanyId,
  } = useApi()

  const [chatbot, setChatbot] = useState({});

  useEffect(() => {
    if(selectedCompanyId) {
      const _chatbot = chatbotsByCompanyId[selectedCompanyId]
      setChatbot(_chatbot)
    }
  }, [selectedCompanyId, chatbotsByCompanyId])

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
              Customize Your Chatbot
            </Typography>
          </div>
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

