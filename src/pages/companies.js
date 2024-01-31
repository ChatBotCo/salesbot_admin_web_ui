import Head from 'next/head';
import {Alert, Box, CircularProgress, Container, Snackbar, Stack, Typography} from '@mui/material';
import {Layout as DashboardLayout} from 'src/layouts/dashboard/layout';
import {useApi} from '../hooks/use-api';
import {useEffect, useState} from 'react';
import {CompanyEdit} from '../sections/company/company-edit';

const Page = () => {
  const {
    loading,
    companiesByCompanyId,
    showSaveResults, saveResults, handleDismissSaveResults, saveResultsSeverity,
    selectedCompanyId,
  } = useApi()

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
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">
                Edit Your Company
              </Typography>
            </div>
            <CompanyEdit company={selectedCompany} />
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
