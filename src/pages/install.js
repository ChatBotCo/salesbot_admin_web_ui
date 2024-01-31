import Head from 'next/head';
import {Box, Button, Container, Stack, SvgIcon, Typography} from '@mui/material';
import {Layout as DashboardLayout} from 'src/layouts/dashboard/layout';
import {useState} from 'react';
import {ClipboardIcon} from '@heroicons/react/24/solid';
import {useApi} from "../hooks/use-api";

const Page = () => {
  const {
    selectedCompanyId,
  } = useApi()


  const [showCopied, _setShowCopied] = useState(false);

  const setShowCopied = _show => {
    _setShowCopied(_show)
    if(_show) {
      window.setTimeout(()=>_setShowCopied(false), 2000)
    }
  }

  const scriptElementText = `<script id="sales_chatbot_script" src="https://kelichatbot2.blob.core.windows.net/salesbot-assets/sales_chatbot.js" data-company-id="${selectedCompanyId}"></script>`

  const copyScriptToClipboard = () =>{
    navigator.clipboard.writeText(scriptElementText).then(() => {
      setShowCopied(true)
    }).catch(err => {
      window.alert('Error in copying text: ', err);
    });
  }

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
                Install Your Chatbot
              </Typography>
            </div>
          </Stack>
          <Stack spacing={3} direction="row">
            <Typography variant="subtitle1">
              Installing your customized chatbot on your website or page(s) is easy!  Just copy and
              paste the following line of code in any HTML page on your site and the chatbot will
              show up in the lower-right corner and begin speaking with your site vistors.
            </Typography>

            <Stack spacing={1} direction="column">
              <Typography sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', backgroundColor: 'black', color: 'white', padding: '8px', borderRadius: '4px' }}>
                {scriptElementText}
              </Typography>
              <Button
                variant="contained"
                onClick={copyScriptToClipboard}
                color={showCopied ? 'success' : 'primary'}
              >
                <SvgIcon fontSize="small" sx={{color:'white'}}>
                  <ClipboardIcon/>
                </SvgIcon>
                {showCopied ? 'Copied!' : 'Copy Code'}
              </Button>
            </Stack>
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
