import Head from 'next/head';
import {Box, Container, Stack, Typography} from '@mui/material';
import {Layout as DashboardLayout} from 'src/layouts/dashboard/layout';
import {useApi} from "../hooks/use-api";
import {useEffect} from "react";

const Page = () => {
  const {
    selectedCompanyId,
  } = useApi()

  useEffect(() => {
    // // Create a container for the chatbot
    // var chatbotContainer = document.createElement('div');
    // chatbotContainer.id = 'sales_chatbot_root';
    // chatbotContainer.style.pointerEvents = 'none';
    // chatbotContainer.style.width = '1px';
    // chatbotContainer.style.height = '1px';
    // document.body.appendChild(chatbotContainer);
    //
    // // Load the chatbot's CSS
    // var chatbotCSS = document.createElement('link');
    // chatbotCSS.href = 'https://kelichatbot2.blob.core.windows.net/salesbot-assets/index-v0.11.css';
    // chatbotCSS.rel = 'stylesheet';
    // chatbotCSS.type = 'text/css';
    // document.head.appendChild(chatbotCSS);
    //
    // // Load the chatbot's JavaScript bundle
    // var chatbotScript = document.createElement('script');
    // // chatbotScript.src = 'http://localhost:5173/deleteme/index.js';
    // chatbotScript.src = 'https://kelichatbot2.blob.core.windows.net/salesbot-assets/index-v0.11.js';
    // chatbotScript.async = true;
    // chatbotScript.onload = function() {
    // };
    // document.body.appendChild(chatbotScript);
    //
    // // Cleanup function to remove script when component unmounts
    // return () => {
    //   document.body.removeChild(chatbotContainer);
    //   document.head.removeChild(chatbotCSS);
    //   document.body.removeChild(chatbotScript);
    // };
  }, []);

  return (
    <>
      <Head>
        <title>
          Keli.AI
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
                Test Your Chatbot
              </Typography>
            </div>
          </Stack>
          <Stack spacing={3} direction="row">
            <Typography variant="subtitle1">
              Your chatbot should appear in the lower right corner of this page.  Try it out!  All changes should take effect immediately.
            </Typography>
          </Stack>
          <iframe
            src={`https://kelichatbot2.blob.core.windows.net/salesbot-assets/index_testing_query.html?company_id=${selectedCompanyId}`}
            width="100%"
            style={{
              border: "none",
              position:"fixed",
              bottom: "0",
              right: "0",
              transform: "scale(0.8)",
              height: "400px",
              // "@media (max-width: 768px)": {
              //   height: "400px"
              // },
          }}
            title="Chatbot"
          ></iframe>
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
