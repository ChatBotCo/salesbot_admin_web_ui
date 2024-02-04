import Head from 'next/head';
import {Alert, Box, Button, Container, Snackbar, Stack, SvgIcon, Typography} from '@mui/material';
import {Layout as DashboardLayout} from 'src/layouts/dashboard/layout';
import {useApi} from '../hooks/use-api';
import {useEffect, useState} from 'react';
import {ArrowsRightLeftIcon} from "@heroicons/react/24/solid";
import {useHubspot} from "../hooks/use-hubspot";

const Page = () => {
  const {
    loading,
    companiesByCompanyId,
    showSaveResults, saveResults, handleDismissSaveResults, saveResultsSeverity,
    selectedCompanyId,
  } = useApi()

  const {

  } = useHubspot()

  const [selectedCompany, setSelectedCompany] = useState({});

  useEffect(() => {
    setSelectedCompany(companiesByCompanyId[selectedCompanyId])
  }, [companiesByCompanyId, selectedCompanyId])

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
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Connect Your HubSpot Account
                </Typography>
              </Stack>
            </Stack>

            <Button
              variant={'contained'}
              onClick={console.log}
              startIcon={(
                <SvgIcon fontSize="small">
                  <ArrowsRightLeftIcon />
                </SvgIcon>
              )}
              sx={{maxWidth:'250px'}}
            >
              Connect to HubSpot
            </Button>
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
