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
import { useApi } from '../hooks/use-api';
import { useState } from 'react';
import { CompanyTabs } from '../components/company-tabs';
import { LinksTable } from '../sections/links/links-table';

const Page = () => {
  const {
    loading,
    linksById,
    showSaveResults, saveResults, handleDismissSaveResults, saveResultsSeverity,
  } = useApi()

  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const linksForSelectedCompany = Object.values(linksById).filter(link=>link.company_id === selectedCompanyId)

  return (
    <>
      <Head>
        <title>
          Training
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
                Train Your Chat Bot
                {loading && <CircularProgress />}
              </Typography>
            </div>
            <CompanyTabs setSelectedCompanyId={setSelectedCompanyId} selectedCompanyId={selectedCompanyId}/>
            <LinksTable items={linksForSelectedCompany} />
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
